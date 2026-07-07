import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import { ToastContext } from 'contexts/ToastContext';
import { useAuth } from "contexts/AuthContext";
import { useCart } from "contexts/CartContext";
import { Checkbox } from "components/ui/Checkbox";


function PricingSelection({
  webinar,
  pricing,
  selectedOptions,
  setSelectedOptions,
  navigate,
  isValidSelection,
}) {
  
  const { user, isAuthenticated, token, getAuthHeaders } = useAuth();
  const isPrivilegeUser = webinar?.isOwner || webinar?.isAdmin;
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, items: cartItems } = useCart();
  const showToast = useContext(ToastContext).showToast;
  const [accessing, setAccessing] = useState(false);


  const getTotal = () => {
    let total = 0;

    if (selectedOptions.liveOne) total += pricing.live.oneParticipant || 0;
    if (selectedOptions.liveGroup) total += pricing.live.groupAttendees || 0;

    if (selectedOptions.recordedOne) total += pricing.recorded.oneParticipant || 0;
    if (selectedOptions.recordedGroup) total += pricing.recorded.groupAttendees || 0;

    if (selectedOptions.comboOne) total += pricing.combo.oneParticipant?.price || 0;
    if (selectedOptions.comboGroup) total += pricing.combo.groupAttendees?.price || 0;

    return total;
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

  const handleDirectCheckout = () => {
    if (!isValidSelection()) {
      showToast('Please select at least one access option before proceeding', 'warning');
      return;
    }
    if (webinar?.hasFullAccess) {
      showToast('You already have access to this webinar!', 'info');
      return;
    }

    const selectedKeys = [
      selectedOptions.liveOne && "liveOne",
      selectedOptions.liveGroup && "liveGroup",
      selectedOptions.recordedOne && "recordedOne",
      selectedOptions.recordedGroup && "recordedGroup",
      selectedOptions.comboOne && "comboOne",
      selectedOptions.comboGroup && "comboGroup",
    ].filter(Boolean);

    const cartItemsArr = [];
    let total = 0;
    for (const optionKey of selectedKeys) {
      let price, webinarType, accessType, description;
      if (optionKey === "liveOne") {
        price = pricing.live.oneParticipant;
        webinarType = 'live';
        accessType = 'Live - Single Attendee';
        description = 'Live webinar access';
      } else if (optionKey === "liveGroup") {
        price = pricing.live.groupAttendees;
        webinarType = 'live';
        accessType = 'Live - Multi Attendees';
        description = 'Live webinar access';
      } else if (optionKey === "recordedOne") {
        price = pricing.recorded.oneParticipant;
        webinarType = 'recorded';
        accessType = 'Recorded - Single Attendee';
        description = '6 months access to recorded webinar';
      } else if (optionKey === "recordedGroup") {
        price = pricing.recorded.groupAttendees;
        webinarType = 'recorded';
        accessType = 'Recorded - Multi Attendees';
        description = '6 months access to recorded webinar';
      } else if (optionKey === "comboOne") {
        price = pricing.combo.oneParticipant?.price;
        webinarType = 'combo';
        accessType = 'Combo - Single Attendee';
        description = 'Live + Recorded access';
      } else if (optionKey === "comboGroup") {
        price = pricing.combo.groupAttendees?.price;
        webinarType = 'combo';
        accessType = 'Combo - Multi Attendees';
        description = 'Live + Recorded access';
      }
      total += price || 0;
      cartItemsArr.push({
        cartId: `${webinar.webinarId}_${optionKey}_${Date.now()}`,
        id: webinar.id,
        webinarId: webinar.webinarId,
        title: webinar.title,
        instructor: webinar.instructor?.name,
        image: webinar.videoThumbnail || webinar.preview,
        price: price || 0,
        webinarType,
        accessType,
        description,
        duration: webinar.duration,
        itemType: optionKey,
        requiresAuth: !isAuthenticated,
        userAuthenticated: isAuthenticated,
        userId: user?.id || null
      });
    }

    cartItemsArr.forEach(item => addToCart(item));

    const summary = {
      subtotal: total,
      discount: 0,
      tax: total * 0.08,
      total: total + (total * 0.08),
      itemCount: cartItemsArr.length,
    };

    if (!isAuthenticated) {
      const checkoutData = {
        items: cartItemsArr,
        summary,
        returnUrl: '/checkout',
        timestamp: Date.now()
      };
      sessionStorage.setItem('pendingCheckout', JSON.stringify(checkoutData));
      sessionStorage.setItem('authReturnUrl', '/checkout');
      sessionStorage.setItem('authAction', 'checkout');
      sessionStorage.setItem('redirectMessage', 'Please sign in to complete your secure checkout');
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in to complete your secure checkout',
          action: 'checkout'
        }
      });
    } else {
      navigate('/checkout', {
        state: {
          items: cartItemsArr,
          summary
        }
      });
    }
  };

  const handlePurchase = async () => {
    if (!isValidSelection()) {
      showToast('Please select at least one access option before proceeding', 'warning');
      return;
    }

    if (webinar?.hasFullAccess) {
      showToast('You already have access to this webinar!', 'info');
      return;
    }

    setAddingToCart(true);

    const selectedKeys = [
      selectedOptions.liveOne && "liveOne",
      selectedOptions.liveGroup && "liveGroup",
      selectedOptions.recordedOne && "recordedOne",
      selectedOptions.recordedGroup && "recordedGroup",
      selectedOptions.comboOne && "comboOne",
      selectedOptions.comboGroup && "comboGroup",
    ].filter(Boolean);

    try {
      for (const optionKey of selectedKeys) {
        let price, webinarType, accessType, description;
        if (optionKey === "liveOne") {
          price = pricing.live.oneParticipant;
          webinarType = 'live';
          accessType = 'Live - Single Attendee';
          description = 'Live webinar access';
        } else if (optionKey === "liveGroup") {
          price = pricing.live.groupAttendees;
          webinarType = 'live';
          accessType = 'Live - Multi Attendees';
          description = 'Live webinar access';
        } else if (optionKey === "recordedOne") {
          price = pricing.recorded.oneParticipant;
          webinarType = 'recorded';
          accessType = 'Recorded - Single Attendee';
          description = '6 months access to recorded webinar';
        } else if (optionKey === "recordedGroup") {
          price = pricing.recorded.groupAttendees;
          webinarType = 'recorded';
          accessType = 'Recorded - Multi Attendees';
          description = '6 months access to recorded webinar';
        } else if (optionKey === "comboOne") {
          price = pricing.combo.oneParticipant?.price;
          webinarType = 'combo';
          accessType = 'Combo - Single Attendee';
          description = 'Live + Recorded access';
        } else if (optionKey === "comboGroup") {
          price = pricing.combo.groupAttendees?.price;
          webinarType = 'combo';
          accessType = 'Combo - Multi Attendees';
          description = 'Live + Recorded access';
        }
        await addToCart({
          cartId: `${webinar.webinarId}_${optionKey}_${Date.now()}`,
          id: webinar.id,
          webinarId: webinar.webinarId,
          title: webinar.title,
          instructor: webinar.instructor?.name,
          image: webinar.videoThumbnail || webinar.preview,
          price: price || 0,
          webinarType,
          accessType,
          description,
          duration: webinar.duration,
          itemType: optionKey,
          requiresAuth: !isAuthenticated,
          userAuthenticated: isAuthenticated,
          userId: user?.id || null,
          addedAt: new Date().toISOString()
        });
      }
      showToast('Added all selected options to cart', 'success');
      if (!isAuthenticated) {
        setTimeout(() => {
          showToast('Sign in to complete your secure checkout', 'info', 4000);
        }, 2000);
      }
    } catch (error) {
      showToast('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
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
      console.log('🔑 Accessing webinar:', webinar.webinarId, 'as user:', user?.id, webinar.zoom_access.start_url);
      if (webinar.webinarType === "live" && webinar.zoom_access?.start_url) {
        window.open(webinar.zoom_access.start_url, '_blank');
        showToast('Starting the live webinar...', 'success');
      } else if (webinar.webinarType === "live" && webinar.zoom_access?.join_url) {
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

  const handleMyWebinar = () => {
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

  // Updated hasItemsInCart - checks if any SELECTED option is in cart
  const hasItemsInCart = () => {
    // Get all selected options
    const selectedKeys = [
      "liveOne", "liveGroup", "recordedOne", "recordedGroup", "comboOne", "comboGroup",
    ].filter(opt => selectedOptions[opt]); // Only get the ones that are selected

    // Check if ANY of the selected options is already in cart
    return selectedKeys.some(optionKey =>
      cartItems.some(item => item.webinarId === webinar.webinarId && item.itemType === optionKey)
    );
  };

  const hasLivePricing = pricing?.live?.oneParticipant > 0 || pricing?.live?.groupAttendees > 0;
  const hasRecordedPricing = pricing?.recorded?.oneParticipant > 0 || pricing?.recorded?.groupAttendees > 0;
  const hasComboPricing = pricing?.combo?.oneParticipant?.price > 0 || pricing?.combo?.groupAttendees?.price > 0;

  // Section-wide warning component - shows once per section (Live/Recorded/Combo)
  function SectionWarning({ sectionType }) {
    const isEnrolled = webinar?.hasFullAccess;

    // Define option groups
    const sectionGroups = {
      live: ['liveOne', 'liveGroup'],
      recorded: ['recordedOne', 'recordedGroup'],
      combo: ['comboOne', 'comboGroup']
    };

    const currentGroup = sectionGroups[sectionType] || [];

    // Check if ANY option from this section is selected
    const anySelected = currentGroup.some(opt => selectedOptions[opt]);

    // Check if ANY option from this section is in cart
    const anyInCart = currentGroup.some(opt =>
      cartItems.some(
        (item) => item.webinarId === webinar.webinarId && item.itemType === opt
      )
    );

    // Only show warning if:
    // 1. Something from this section is selected
    // 2. AND something from this section is in cart OR user is enrolled
    if (!anySelected) return null;

    if (isEnrolled) {
      return (
        <div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 my-2 border border-green-200 rounded-lg p-3 flex items-center space-x-2"
        >
          <Icon name="AlertTriangle" size={16} className="text-green-600 flex-shrink-0" />
          <div className="text-sm text-green-700">
            <span className="font-medium">You are already enrolled in this webinar.</span>
          </div>
        </div>
      );
    }

    if (anyInCart) {
      return (
        <div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 my-2 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2"
        >
          <Icon name="AlertTriangle" size={16} className="text-yellow-600 flex-shrink-0" />
          <div className="text-sm text-yellow-700">
            <span className="font-medium">Another option from this section is already in your cart.</span>
            <button 
              onClick={() => navigate('/cart')} 
              className="ml-2 underline hover:text-yellow-800 font-medium"
            >
              View Cart
            </button>
          </div>
        </div>
      );
    }

    return null;
  }

  const renderActionButtons = () => {
    if (!webinar) return null;

    // User has full access or is privileged
    if (webinar.hasFullAccess || webinar.isOwner || webinar.isAdmin) {
      return (
        <div className="space-y-4">
          <Button
            className="w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl hover:scale-105 transition duration-300"
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
                <Icon name={webinar.webinarType === "live" && (webinar.isAdmin || webinar.isOwner) ? "Star" : "Play"} size={18} className="mr-2" />
                {webinar.webinarType === "live" && (webinar.isAdmin || webinar.isOwner) ? "Start Webinar" : "Join Webinar"}
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
            <Button variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-700" onClick={handleMyWebinar}>
              <Icon name="BookOpen" size={16} className="mr-2" />
              My Webinars
            </Button>
            <Button variant="outline" className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-700" onClick={() => {
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

    // Free webinar
    if (webinar.is_free) {
      return (
        <div className="space-y-4 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-green-600 mb-4">Free Access!</h3>
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 rounded-lg shadow-lg"
            onClick={handleAccess}
          >
            <Icon name="Play" size={18} className="mr-2" />
            WATCH NOW - FREE
          </Button>
        </div>
      );
    }

    // Purchase options (for users without access)
    return (
      <div className="space-y-3">
        {hasItemsInCart() && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2"
          >
            <Icon name="AlertTriangle" size={16} className="text-yellow-600 flex-shrink-0" />
            <div className="text-sm text-yellow-700">
              <span className="font-medium">This item is already in your cart.</span>
              <button 
                onClick={() => navigate('/cart')} 
                className="ml-2 underline hover:text-yellow-800 font-medium"
              >
                View Cart
              </button>
            </div>
          </motion.div>
        )}

        {/* Add to Cart Button */}
        {!hasItemsInCart() && (
          <Button 
            className={`w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg bg-gradient-to-r transition-all duration-300 shadow-lg transform ${
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
          className={`w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg bg-gradient-to-r transition-all duration-300 shadow-lg transform ${
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
            className="w-full border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-700 font-medium py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300"
          >
            <Icon name="ShoppingBag" size={16} className="mr-2" />
            View Cart ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="lg:col-span-1 w-full lg:w-full mx-auto">
      <div className="top-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{ border: "1px solid rgba(209, 213, 219, 0.3)" }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden space-y-4">
            <div className="space-y-4 p-6">
              {/* Live Pricing Section */}
              <div className="md:grid md:grid-cols-2 md:gap-6 lg:block items-center">
                {hasLivePricing && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1 text-lg flex items-center">
                      <Icon name="Video" size={18} className="mr-2 text-red-500" />
                      Live Version
                    </h3>
                    <div className="space-y-3">
                      {/* Single Attendee */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${
                          selectedOptions.liveOne
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                        onClick={() => handleOptionChange("liveOne")}
                      >
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <Checkbox
                            checked={selectedOptions.liveOne}
                            onChange={() => handleOptionChange("liveOne")}
                            color="blue"
                            id="liveOne"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-900">Single Attendee</span>
                              <div className="text-xs text-gray-600 mt-1">Individual access</div>
                            </div>
                            <span className="text-lg font-bold text-blue-600">
                              ${pricing.live.oneParticipant}
                            </span>
                          </div>
                        </label>
                      </motion.div>

                      {/* Multi Attendees */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 relative ${
                          selectedOptions.liveGroup
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                        }`}
                        onClick={() => handleOptionChange("liveGroup")}
                      >
                        <div className="absolute -top-1 right-2">
                          <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                            TEAMS
                          </span>
                        </div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <Checkbox
                            checked={selectedOptions.liveGroup}
                            onChange={() => handleOptionChange("liveGroup")}
                            color="green"
                            id="liveGroup"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-900">Multi Attendees</span>
                              <div className="text-xs text-gray-600 mt-1">For organizations</div>
                            </div>
                            <span className="text-lg font-bold text-green-600">
                              ${pricing.live.groupAttendees}
                            </span>
                          </div>
                        </label>
                      </motion.div>
                      
                      {/* ONE warning for entire Live section */}
                      <SectionWarning sectionType="live" />
                    </div>
                  </div>
                )}

                {/* Recorded Pricing Section */}
                {hasRecordedPricing && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1 text-lg flex items-center">
                      <Icon name="Download" size={18} className="mr-2 text-purple-500" />
                      Recorded Version
                    </h3>
                    <div className="space-y-3">
                      {/* Single Recorded */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${
                          selectedOptions.recordedOne
                            ? "border-purple-500 bg-purple-50 shadow-md"
                            : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                        onClick={() => handleOptionChange("recordedOne")}
                      >
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <Checkbox
                            checked={selectedOptions.recordedOne}
                            onChange={() => handleOptionChange("recordedOne")}
                            color="purple"
                            id="recordedOne"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-900">Single Recorded</span>
                              <div className="text-xs text-gray-600 mt-1">6 months access</div>
                            </div>
                            <span className="text-lg font-bold text-purple-600">
                              ${pricing.recorded.oneParticipant}
                            </span>
                          </div>
                        </label>
                      </motion.div>

                      {/* Multi Recorded */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${
                          selectedOptions.recordedGroup
                            ? "border-indigo-500 bg-indigo-50 shadow-md"
                            : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                        onClick={() => handleOptionChange("recordedGroup")}
                      >
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <Checkbox
                            checked={selectedOptions.recordedGroup}
                            onChange={() => handleOptionChange("recordedGroup")}
                            color="indigo"
                            id="recordedGroup"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-900">Multi Recorded</span>
                              <div className="text-xs text-gray-600 mt-1">Team access</div>
                            </div>
                            <span className="text-lg font-bold text-indigo-600">
                              ${pricing.recorded.groupAttendees}
                            </span>
                          </div>
                        </label>
                      </motion.div>
                      
                      {/* ONE warning for entire Recorded section */}
                      <SectionWarning sectionType="recorded" />
                    </div>
                  </div>
                )}
              </div>
             
              <div className="md:grid md:grid-cols-2 md:gap-6 lg:block items-center">
                {hasComboPricing && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg flex items-center">
                      <Icon name="Star" size={18} className="mr-2 text-yellow-600" />
                      Combo Offers
                      <span className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        BEST VALUE
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Live + Recorded - Save More!
                    </p>
                    <div className="space-y-3">
                      {/* Single Combo */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${
                          selectedOptions.comboOne
                            ? "border-yellow-500 bg-yellow-50 shadow-md"
                            : "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50"
                        }`}
                        onClick={() => handleOptionChange("comboOne")}
                      >
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <Checkbox
                            checked={selectedOptions.comboOne}
                            onChange={() => handleOptionChange("comboOne")}
                            color="yellow"
                            id="comboOne"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-900 text-sm">Single Attendee</span>
                              <div className="text-xs text-gray-600">+ Single Record</div>
                            </div>
                            <span className="text-lg font-bold text-yellow-600">
                              ${pricing.combo.oneParticipant.price}
                            </span>
                          </div>
                        </label>
                      </motion.div>

                      {/* Multi Combo */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 relative ${
                          selectedOptions.comboGroup
                            ? "border-orange-500 bg-orange-50 shadow-md"
                            : "border-orange-200 hover:border-orange-400 hover:bg-orange-50"
                        }`}
                        onClick={() => handleOptionChange("comboGroup")}
                      >
                        <div className="absolute -top-1 right-2">
                          <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                            POPULAR
                          </span>
                        </div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <Checkbox
                            checked={selectedOptions.comboGroup}
                            onChange={() => handleOptionChange("comboGroup")}
                            color="orange"
                            id="comboGroup"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-900 text-sm">Multi Attendees</span>
                              <div className="text-xs text-gray-600">+ Multi Record</div>
                            </div>
                            <span className="text-lg font-bold text-orange-600">
                              ${pricing.combo.groupAttendees.price}
                            </span>
                          </div>
                        </label>
                      </motion.div>
                      
                      {/* ONE warning for entire Combo section */}
                      <SectionWarning sectionType="combo" />
                    </div>
                  </div>
                )}

                <div>
                  {/* Total Price Display */}
                  {total > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r mt-3 from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-gray-800">Total Amount:</span>
                          <div className="text-xs text-gray-600">Secure payment</div>
                        </div>
                        <span className="text-2xl font-bold text-green-600">${total}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6">
                    {renderActionButtons()}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-4 mt-4 rounded-xl">
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
        </motion.div>
      </div>
    </div>
  );
}

export default PricingSelection;
