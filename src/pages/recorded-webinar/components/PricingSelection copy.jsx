import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import { ToastContext } from 'contexts/ToastContext';
import { useAuth } from "contexts/AuthContext";

function PricingSelection({
  webinar,
  pricing,
  selectedOptions,
  setSelectedOptions,
  handleDirectCheckout,
  addToCart,
  cartItems = [],
  navigate,
  isValidSelection,
}) {
  const { user, isAuthenticated } = useAuth();
  const isPrivilegeUser = webinar?.isOwner || webinar?.isAdmin;
  
  const showToast = useContext(ToastContext).showToast;
  const [accessing, setAccessing] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const getTotal = () => {
    if (selectedOptions.liveOne) return pricing?.live?.oneParticipant || 0;
    if (selectedOptions.liveGroup) return pricing?.live?.groupAttendees || 0;
    if (selectedOptions.recordedOne) return pricing?.recorded?.oneParticipant || 0;
    if (selectedOptions.recordedGroup) return pricing?.recorded?.groupAttendees || 0;
    if (selectedOptions.comboOne) return pricing?.combo?.oneParticipant?.price || 0;
    if (selectedOptions.comboGroup) return pricing?.combo?.groupAttendees?.price || 0;
    return 0;
  };
  const total = getTotal();

  const handleOptionChange = (option) => {
    setSelectedOptions(prev => {
      const liveOptions = ['liveOne', 'liveGroup'];
      const recordedOptions = ['recordedOne', 'recordedGroup'];
      const comboOptions = ['comboOne', 'comboGroup'];

      let group = liveOptions.includes(option) ? 'live' :
                  recordedOptions.includes(option) ? 'recorded' :
                  comboOptions.includes(option) ? 'combo' : null;

      const newState = { ...prev };
      const toggled = !prev[option];
      newState[option] = toggled;

      if (group === 'live' && toggled) {
        liveOptions.forEach(opt => { if (opt !== option) newState[opt] = false; });
        comboOptions.forEach(opt => { newState[opt] = false; });
      } else if (group === 'recorded' && toggled) {
        recordedOptions.forEach(opt => { if (opt !== option) newState[opt] = false; });
        comboOptions.forEach(opt => { newState[opt] = false; });
      } else if (group === 'combo' && toggled) {
        comboOptions.forEach(opt => { if (opt !== option) newState[opt] = false; });
        liveOptions.forEach(opt => { newState[opt] = false; });
        recordedOptions.forEach(opt => { newState[opt] = false; });
      }

      return newState;
    });
  };

  const selectedOptionKey = [
    "liveOne", "liveGroup", "recordedOne", "recordedGroup", "comboOne", "comboGroup",
  ].find(opt => selectedOptions[opt]);

  const selectedCartExists = cartItems && selectedOptionKey &&
    cartItems.some(item => item.webinarId === webinar?.webinarId && item.itemType === selectedOptionKey);

  const hasItemsInCart = () => {
    return selectedCartExists;
  };

  // Add to cart handler
  const handlePurchase = async () => {
    if (!isValidSelection()) {
      showToast('Please select an access option before proceeding', 'warning');
      return;
    }

    if (webinar?.hasFullAccess) {
      showToast('You already have access to this webinar!', 'info');
      return;
    }

    setAddingToCart(true);

    try {
      const cartItem = {
        cartId: `${webinar.webinarId}_${selectedOptionKey}_${Date.now()}`,
        webinarId: webinar.webinarId,
        title: webinar.title,
        instructor: webinar.instructor?.name,
        image: webinar.videoThumbnail || webinar.preview,
        price: total,
        webinarType: selectedOptionKey.includes('live') ? 'live' : selectedOptionKey.includes('recorded') ? 'recorded' : 'combo',
        accessType: selectedOptionKey === 'liveOne' ? 'Live - Single Attendee' :
                    selectedOptionKey === 'liveGroup' ? 'Live - Multi Attendees' :
                    selectedOptionKey === 'recordedOne' ? 'Recorded - Single Attendee' :
                    selectedOptionKey === 'recordedGroup' ? 'Recorded - Multi Attendees' :
                    selectedOptionKey === 'comboOne' ? 'Combo - Single Attendee' :
                    selectedOptionKey === 'comboGroup' ? 'Combo - Multi Attendees' : 'Unknown',
        description: selectedOptionKey.includes('recorded') ? '6 months access to recorded webinar' : 
                     selectedOptionKey.includes('combo') ? 'Live + Recorded access' : 'Live webinar access',
        duration: webinar.duration,
        itemType: selectedOptionKey,
        requiresAuth: !isAuthenticated,
        userAuthenticated: isAuthenticated,
        userId: user?.id || null,
        addedAt: new Date().toISOString()
      };

      await addToCart(cartItem);
      showToast(`Added to cart: ${webinar.title}`, 'success');

      if (!isAuthenticated) {
        setTimeout(() => {
          showToast('Sign in to complete your secure checkout', 'info', 4000);
        }, 2000);
      }

    } catch (error) {
      console.error('❌ Add to cart error:', error);
      showToast('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAccessWebinar = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to access this webinar', 'warning');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const isPrivilegedUser = webinar?.isOwner || webinar?.isAdmin;

    if (!webinar?.hasFullAccess && !isPrivilegedUser) {
      showToast('You need to purchase access to this webinar first', 'warning');
      return;
    }

    setAccessing(true);

    try {
      if (webinar.hasRecordingLinks && webinar.recording_links?.[0]?.url) {
        window.open(webinar.recording_links[0].url, '_blank');
        showToast('Opening recorded webinar...', 'success');
      } else if (webinar.zoom_url) {
        window.open(webinar.zoom_url, '_blank');
        showToast('Accessing webinar content...', 'success');
      } else if (webinar.primaryRecordingUrl) {
        window.open(webinar.primaryRecordingUrl, '_blank');
        showToast('Opening webinar...', 'success');
      } else {
        navigate(`/webinar-player/${webinar.webinarId}`, {
          state: { webinar, hasAccess: true }
        });
      }
    } catch (error) {
      console.error('Error accessing webinar:', error);
      showToast('Failed to access webinar. Please try again.', 'error');
    } finally {
      setAccessing(false);
    }
  };

  const handleAccess = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to access this webinar', 'warning');
      navigate('/login');
      return;
    }

    const isPrivileged = webinar?.isAdmin || webinar?.isOwner || isPrivilegeUser;

    if (!webinar?.hasFullAccess && !isPrivileged) {
      showToast('Please purchase access to this webinar', 'warning');
      return;
    }

    setAccessing(true);
    try {
      if (webinar.status === "live" && isPrivileged && webinar.zoom_access?.start_url) {
        window.open(webinar.zoom_access.start_url, '_blank');
        showToast('Starting the live webinar...', 'success');
      } else if (webinar.status === "live" && webinar.zoom_access?.join_url) {
        window.open(webinar.zoom_access.join_url, '_blank');
        showToast('Joining the live webinar...', 'success');
      } else if (webinar.recording_links && webinar.recording_links.length > 0 && webinar.recording_links[0].url) {
        window.open(webinar.recording_links[0].url, '_blank');
        showToast('Opening recorded webinar...', 'success');
      } else {
        navigate(`/webinar-player/${webinar.webinarId}`, { state: { webinar, hasAccess: true } });
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to access webinar. Please try again.', 'error');
    } finally {
      setAccessing(false);
    }
  };

  const handleMyWebiner = () => {
    switch (user?.role) {
      case 'admin':
        navigate('/admin/webinars');
        break;
      case 'attendee':
        navigate('/instructor/dashboard');
        break;
      default:
        navigate('/webinars/live');
        break;
    }
  };

  const hasLivePricing = pricing?.live?.oneParticipant > 0 || pricing?.live?.groupAttendees > 0;
  const hasRecordedPricing = pricing?.recorded?.oneParticipant > 0 || pricing?.recorded?.groupAttendees > 0;
  const hasComboPricing = pricing?.combo?.oneParticipant?.price > 0 || pricing?.combo?.groupAttendees?.price > 0;

  const renderActionButtons = () => {
    if (!webinar) return null;

    // If user has full access (owner/admin/purchased)
    if (webinar.hasFullAccess || webinar.isOwner || webinar.isAdmin) {
      return (
        <div className="space-y-4">
          <Button
            className={`w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-xl hover:scale-105 transition duration-300 ${
              webinar.status === "live" && isPrivilegeUser
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                : "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
            }`}
            onClick={handleAccess}
            disabled={accessing}
          >
            {accessing ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                Opening...
              </>
            ) : (
              <>
                <Icon name="Play" size={18} className="mr-2" />
                {webinar.status === "live" && (webinar.isAdmin || webinar.isOwner) ? "Start Webinar" : "Watch Webinar"}
              </>
            )}
          </Button>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <Icon name="CheckCircle" size={20} className="text-green-600" />
            <div>
              <h4 className="text-green-800 font-semibold">
                ✅ {webinar.isOwner ? 'Owner Access' : webinar.isAdmin ? 'Admin Access' : 'Full Access'}
              </h4>
              <p className="text-green-700 text-sm">
                {webinar.isOwner && 'You own this webinar'}
                {webinar.isAdmin && !webinar.isOwner && 'Administrator access'}
                {!webinar.isOwner && !webinar.isAdmin && 'Purchased access to this webinar'}
                {webinar.user_enrollment_status && <span> • Status: {webinar.user_enrollment_status}</span>}
                {webinar.access_expires_at && <span> • Expires: {new Date(webinar.access_expires_at).toLocaleDateString()}</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50" onClick={handleMyWebiner}>
              <Icon name="BookOpen" size={16} className="mr-2" />
              My Webinars
            </Button>
            <Button variant="outline" className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast('Link copied!', 'success');
            }}>
              <Icon name="Share" size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </div>
      );
    }

    // If webinar is free
    if (webinar.is_free) {
      return (
        <div className="space-y-4 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-green-600 mb-4">Free Access!</h3>
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 rounded-lg shadow-lg"
            onClick={handleAccessWebinar}
          >
            <Icon name="Play" size={18} className="mr-2" />
            WATCH NOW - FREE
          </Button>
        </div>
      );
    }

    // Show Add to Cart and Buy Now buttons for all users (logged in or not)
    return (
      <div className="space-y-3">
        {/* Add to Cart Button */}
        {!hasItemsInCart() && (
          <Button 
            className={`w-full font-bold py-3 sm:py-4 px-4 sm:px-6 text-base sm:text-lg rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg transform ${
              isValidSelection() && !addingToCart
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:scale-105 shadow-xl' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handlePurchase}
            disabled={!isValidSelection() || addingToCart}
          >  
            {addingToCart ? (
              <>
                <Icon name="Loader2" size={18} className="sm:w-5 sm:h-5 mr-2 animate-spin" />
                ADDING TO CART...
              </>
            ) : isValidSelection() ? (
              <>
                <Icon name="ShoppingCart" size={18} className="sm:w-5 sm:h-5 mr-2" />
                ADD TO CART - ${total.toFixed(2)}
              </>
            ) : (
              <>
                <Icon name="ShoppingCart" size={18} className="sm:w-5 sm:h-5 mr-2" />
                SELECT AN OPTION
              </>
            )}
          </Button>
        )}

        {/* Direct Checkout Button */}
        <Button 
          className={`w-full font-bold py-3 sm:py-4 px-4 sm:px-6 text-base sm:text-lg rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg transform ${
            isValidSelection() 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105 shadow-xl' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleDirectCheckout}
          disabled={!isValidSelection()}
        >
          {isValidSelection() ? (
            <>
              <Icon name="CreditCard" size={18} className="sm:w-5 sm:h-5 mr-2" />
              BUY NOW - ${total.toFixed(2)}
            </>
          ) : (
            <>
              <Icon name="CreditCard" size={18} className="sm:w-5 sm:h-5 mr-2" />
              SELECT TO BUY NOW
            </>
          )}
        </Button>

        {/* View Cart Button (if items in cart) */}
        {cartItems.length > 0 && (
          <Button 
            variant="outline"
            onClick={() => navigate('/cart')}
            className="w-full border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-medium py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300"
          >
            <Icon name="ShoppingBag" size={16} className="mr-2" />
            View Cart ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
          </Button>
        )}

        {/* Sign in prompt for non-authenticated users */}
        {!isAuthenticated && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
            <p className="text-sm text-indigo-700 mb-2">
              <Icon name="Info" size={14} className="inline mr-1" />
              Sign in for faster checkout
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="text-indigo-600 font-semibold underline hover:text-indigo-800"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="lg:col-span-1 w-4/5 lg:w-full mx-auto">
      <div className="hidden lg:block top-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{ border: "1px solid rgba(209, 213, 219, 0.3)" }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden p-6 space-y-4">
            <div className="space-y-4">
              {/* Live Pricing Options */}
              {hasLivePricing && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-1 text-lg flex items-center">
                    <Icon name="Video" size={18} className="mr-2 text-red-500" />
                    Live Version
                  </h3>
                  <div className="space-y-3">
                    {/* Pricing options remain the same as your original code */}
                    {/* ... (all your existing pricing UI code) ... */}
                  </div>
                </div>
              )}

              {/* Recorded Pricing Options */}
              {/* ... (all your existing recorded pricing UI) ... */}

              {/* Combo Pricing Options */}
              {/* ... (all your existing combo pricing UI) ... */}

              {/* Total Price Display */}
              {total > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-800">Total Amount:</span>
                      <div className="text-xs text-gray-600">Secure payment</div>
                    </div>
                    <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
                  </div>
                </motion.div>
              )}

              {/* Cart Message if exists */}
              {selectedCartExists && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2 my-2">
                  <Icon name="AlertTriangle" size={16} className="text-yellow-600 flex-shrink-0" />
                  <div className="text-sm text-yellow-700">
                    <span className="font-medium">This item is already in your cart.</span>
                    <button
                      onClick={() => navigate("/cart")}
                      className="ml-2 underline hover:text-yellow-800 font-medium"
                    >
                      View Cart
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6">
                {renderActionButtons()}
              </div>

              {/* Info Section */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-4 mt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                      <Icon name="Users" size={10} className="text-blue-600" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-800">Multi Attendees:</span>
                      <span className="text-gray-600 ml-1">Unlimited team members</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                      <Icon name="Download" size={10} className="text-purple-600" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-800">Recording Access:</span>
                      <span className="text-gray-600 ml-1">6 months unlimited viewing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PricingSelection;
