import React, { useState, useContext ,useMemo} from "react";
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
  handleDirectCheckout,
  navigate,
  isValidSelection,
}) {
  
  const { user, isAuthenticated, token, } = useAuth();
  const isPrivilegeUser = webinar?.isOwner || webinar?.isAdmin;
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, items: cartItems } = useCart();
  const showToast = useContext(ToastContext).showToast;
  const [accessing, setAccessing] = useState(false);
 const getDisplayPrices = useMemo(() => {
    // Start with base prices from applicable_prices
    const basePrices = {
      recorded_single: parseFloat(webinar?.applicable_prices?.recorded_single || webinar?.main_price || 0),
      recorded_multi: parseFloat(webinar?.applicable_prices?.recorded_multi || webinar?.main_price || 0),
      live_single: parseFloat(webinar?.applicable_prices?.live_single || webinar?.main_price || 0),
      live_multi: parseFloat(webinar?.applicable_prices?.live_multi || webinar?.main_price || 0),
    };

    // ✅ Override with platform-specific prices if available
    if (webinar?.platform_prices && Array.isArray(webinar.platform_prices)) {
      // Find current platform pricing
      const currentPlatformPrice = webinar.platform_prices.find(
        pp => pp.current_platform === true
      );

      if (currentPlatformPrice && currentPlatformPrice.pricing_data) {
        const platformData = currentPlatformPrice.pricing_data;

        // Override only the prices that are set in platform_prices
        if (platformData.recorded_single_price !== null && platformData.recorded_single_price !== undefined) {
          basePrices.recorded_single = parseFloat(platformData.recorded_single_price);
        }
        if (platformData.recorded_multi_price !== null && platformData.recorded_multi_price !== undefined) {
          basePrices.recorded_multi = parseFloat(platformData.recorded_multi_price);
        }
        if (platformData.live_single_price !== null && platformData.live_single_price !== undefined) {
          basePrices.live_single = parseFloat(platformData.live_single_price);
        }
        if (platformData.live_multi_price !== null && platformData.live_multi_price !== undefined) {
          basePrices.live_multi = parseFloat(platformData.live_multi_price);
        }

        console.log('✅ Platform-specific prices applied:', {
          platform: currentPlatformPrice.platform_name,
          prices: basePrices
        });
      }
    }

    return basePrices;
  }, [webinar]);

  console.log('💰 Display Prices:', {
    webinarType: webinar?.webinar_type,
    basePrices: webinar?.applicable_prices,
    platformOverrides: webinar?.platform_prices?.find(pp => pp.current_platform),
    finalPrices: getDisplayPrices
  });
   const getTotal = () => {
    if (selectedOptions.recordedOne) return getDisplayPrices.recorded_single;
    if (selectedOptions.recordedGroup) return getDisplayPrices.recorded_multi;
    if (selectedOptions.liveOne) return getDisplayPrices.live_single;
    if (selectedOptions.liveGroup) return getDisplayPrices.live_multi;
    
    // Combo options (if needed)
    if (selectedOptions.comboOne) return pricing?.combo?.oneParticipant?.price || 0;
    if (selectedOptions.comboGroup) return pricing?.combo?.groupAttendees?.price || 0;
    
    return 0;
  };

  // const getTotal = () => {
  //   if (selectedOptions.liveOne) return pricing.live.oneParticipant;
  //   if (selectedOptions.liveGroup) return pricing.live.groupAttendees;
  //   if (selectedOptions.recordedOne) return pricing.recorded.oneParticipant;
  //   if (selectedOptions.recordedGroup) return pricing.recorded.groupAttendees;
  //   if (selectedOptions.comboOne) return pricing.combo.oneParticipant.price;
  //   if (selectedOptions.comboGroup) return pricing.combo.groupAttendees.price;
  //   return 0;
  // };
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
    cartItems.some(item => item.webinarId === webinar.webinarId && item.itemType === selectedOptionKey);

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
         id: webinar.id,
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
      console.log('🔑 Accessing webinar:', webinar.webinarId, 'as user:', user?.id,webinar.zoom_access.start_url);
      if (webinar.webinarType === "live"  && webinar.zoom_access?.start_url) {
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

  const hasItemsInCart = () => {
    return selectedCartExists;
  };

  // const hasLivePricing = pricing?.live?.oneParticipant > 0 || pricing?.live?.groupAttendees > 0;
  // const hasRecordedPricing = pricing?.recorded?.oneParticipant > 0 || pricing?.recorded?.groupAttendees > 0;
  // const hasComboPricing = pricing?.combo?.oneParticipant?.price > 0 || pricing?.combo?.groupAttendees?.price > 0;
  const hasRecordedPricing = getDisplayPrices.recorded_single > 0 || getDisplayPrices.recorded_multi > 0;
  const hasLivePricing = getDisplayPrices.live_single > 0 || getDisplayPrices.live_multi > 0;

  // Get current platform name for display
  const currentPlatform = webinar?.platform_prices?.find(pp => pp.current_platform);
  const platformName = currentPlatform?.platform_name || webinar?.current_platform?.platform_name || 'Platform';


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
            className={`w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg bg-gradient-to-r transition-all duration-300 shadow-lg transform  ${
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
    // <div className="lg:col-span-1 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sticky top-0 z-50 bg-white p-4 rounded shadow">

     <div className="lg:col-span-1 w-full lg:w-full  mx-auto">
      <div className=" top-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{ border: "1px solid rgba(209, 213, 219, 0.3)" }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden space-y-4">
            <div className="space-y-4 p-6 ">
              {/* Show sign-in prompt if not authenticated */}
            
           

              {/* Live Pricing Section */}
               <div className="md:grid md:grid-cols-2 md:gap-6 lg:block  items-center">
 

              {/* Recorded Pricing Section */}
              {hasRecordedPricing && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-1 text-lg flex items-center">
                    <Icon name="Download" size={18} className="mr-2 text-purple-500" />
                    Recorded Version
                  </h3>
                  <div className="space-y-3">
                    {/* Single Recorded */}
                   {getDisplayPrices.recorded_single > 0 && (
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
                                <div className="text-xs text-gray-600 mt-1">Perfect for individual learning</div>
                              </div>
                              <span className="text-lg font-bold text-purple-600">
                                ${getDisplayPrices.recorded_single.toFixed(2)}
                              </span>
                            </div>
                          </label>
                        </motion.div>
                      )}

                      {/* Multi Recorded - Show merged price */}
                      {getDisplayPrices.recorded_multi > 0 && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 relative ${
                            selectedOptions.recordedGroup
                              ? "border-indigo-500 bg-indigo-50 shadow-md"
                              : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                          }`}
                          onClick={() => handleOptionChange("recordedGroup")}
                        >
                          <div className="absolute -top-1 sm:-top-2 right-2 sm:right-3">
                            <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold">
                              POPULAR
                            </span>
                          </div>
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
                                <div className="text-xs text-gray-600 mt-1">Ideal for teams & organizations</div>
                              </div>
                              <span className="text-lg font-bold text-indigo-600">
                                ${getDisplayPrices.recorded_multi.toFixed(2)}
                              </span>
                            </div>
                          </label>
                        </motion.div>
                      )}
                  </div>
                </div>
              )}
 
               </div>
             
 <div className="md:grid md:grid-cols-2  md:gap-6 lg:block items-center">
 

              
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
                          <div className="text-xs text-gray-600">One-time secure payment</div>
                        </div>
                        <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
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