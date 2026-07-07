import React, { useState, useContext, useMemo } from "react";
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
  
  const { user, isAuthenticated, token } = useAuth();
  const isPrivilegeUser = webinar?.isOwner || webinar?.isAdmin;
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, items: cartItems } = useCart();
  const showToast = useContext(ToastContext).showToast;
  const [accessing, setAccessing] = useState(false);

  const getDisplayPrices = useMemo(() => {
    console.log('🔍 Starting price calculation...');
    console.log('Webinar data:', {
      applicable_prices: webinar?.applicable_prices,
      platform_prices: webinar?.platform_prices,
      main_price: webinar?.main_price
    });

    const basePrices = {
      recorded_single: parseFloat(webinar?.applicable_prices?.recorded_single || webinar?.main_price || 0),
      recorded_multi: parseFloat(webinar?.applicable_prices?.recorded_multi || webinar?.main_price || 0),
      live_single: parseFloat(webinar?.applicable_prices?.live_single || webinar?.main_price || 0),
      live_multi: parseFloat(webinar?.applicable_prices?.live_multi || webinar?.main_price || 0),
    };

    console.log('📊 Base prices:', basePrices);

    if (webinar?.platform_prices && Array.isArray(webinar.platform_prices)) {
      const currentPlatformPrice = webinar.platform_prices.find(
        pp => pp.current_platform === true
      );

      console.log('🏢 Current platform price:', currentPlatformPrice);

      if (currentPlatformPrice && currentPlatformPrice.pricing_data) {
        const platformData = currentPlatformPrice.pricing_data;
        
        console.log('💰 Platform pricing data:', platformData);

        if (platformData.recorded_single_price !== null && 
            platformData.recorded_single_price !== undefined && 
            platformData.recorded_single_price !== '') {
          basePrices.recorded_single = parseFloat(platformData.recorded_single_price);
          console.log('✅ Overriding recorded_single:', basePrices.recorded_single);
        }
        
        if (platformData.recorded_multi_price !== null && 
            platformData.recorded_multi_price !== undefined && 
            platformData.recorded_multi_price !== '') {
          basePrices.recorded_multi = parseFloat(platformData.recorded_multi_price);
          console.log('✅ Overriding recorded_multi:', basePrices.recorded_multi);
        }
        
        if (platformData.live_single_price !== null && 
            platformData.live_single_price !== undefined && 
            platformData.live_single_price !== '') {
          basePrices.live_single = parseFloat(platformData.live_single_price);
          console.log('✅ Overriding live_single:', basePrices.live_single);
        }
        
        if (platformData.live_multi_price !== null && 
            platformData.live_multi_price !== undefined && 
            platformData.live_multi_price !== '') {
          basePrices.live_multi = parseFloat(platformData.live_multi_price);
          console.log('✅ Overriding live_multi:', basePrices.live_multi);
        }

        console.log('✅ Platform-specific prices applied:', {
          platform: currentPlatformPrice.platform_name,
          prices: basePrices
        });
      }
    }

    console.log('🎯 Final display prices:', basePrices);
    return basePrices;
  }, [webinar]);

  const getTotal = () => {
    if (selectedOptions.recordedOne) return getDisplayPrices.recorded_single;
    if (selectedOptions.recordedGroup) return getDisplayPrices.recorded_multi;
    if (selectedOptions.liveOne) return getDisplayPrices.live_single;
    if (selectedOptions.liveGroup) return getDisplayPrices.live_multi;
    
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

  const hasItemsInCart = () => {
    return selectedCartExists;
  };

  const hasRecordedPricing = getDisplayPrices.recorded_single > 0 || getDisplayPrices.recorded_multi > 0;
  const hasLivePricing = getDisplayPrices.live_single > 0 || getDisplayPrices.live_multi > 0;

  const currentPlatform = webinar?.platform_prices?.find(pp => pp.current_platform);
  const platformName = currentPlatform?.platform_name || webinar?.current_platform?.platform_name || 'Platform';

  const renderActionButtons = () => {
    if (!webinar) return null;

    if (webinar.hasFullAccess || webinar.isOwner || webinar.isAdmin) {
      return (
        <div className="space-y-4">
          <Button
            className="w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white shadow-xl hover:scale-105 transition duration-300"
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

          <div className="bg-[#f5f9ff] border border-[#d6e6f7] rounded-xl p-4 flex items-center space-x-3">
            <Icon name="CheckCircle" size={20} className="text-[#0078d4]" />
            <div>
              <h4 className="text-[#093389] font-semibold">
                ✅ {webinar.isOwner ? 'Owner Access' : webinar.isAdmin ? 'Admin Access' : 'Full Access'}
              </h4>
              <p className="text-[#555555] text-sm">
                {webinar.isOwner && 'You own this webinar'}
                {webinar.isAdmin && !webinar.isOwner && 'Administrator access'}
                {!webinar.isOwner && !webinar.isAdmin && 'Purchased access to this webinar'}
                {webinar.user_enrollment_status && <span> • Status: {webinar.user_enrollment_status}</span>}
                {webinar.access_expires_at && <span> • Expires: {new Date(webinar.access_expires_at).toLocaleDateString()}</span>}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" className="flex-1 border-[#d6e6f7] text-[#0078d4] hover:bg-[#f5f9ff]" onClick={handleMyWebinar}>
              <Icon name="BookOpen" size={16} className="mr-2" />
              My Webinars
            </Button>
            <Button variant="outline" className="flex-1 border-[#d6e6f7] text-[#064ad4] hover:bg-[#f5f9ff]" onClick={() => {
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

    if (webinar.is_free) {
      return (
        <div className="space-y-4 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-[#0078d4] mb-4">Free Access!</h3>
          <Button
            className="w-full bg-gradient-to-r from-[#0078d4] to-[#064ad4] hover:from-[#064ad4] hover:to-[#004b8d] text-white font-bold py-3 sm:py-4 rounded-lg shadow-lg"
            onClick={handleAccess}
          >
            <Icon name="Play" size={18} className="mr-2" />
            WATCH NOW - FREE
          </Button>
        </div>
      );
    }

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

        {!hasItemsInCart() && (
          <Button 
            className={`w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg bg-gradient-to-r transition-all duration-300 shadow-lg transform ${
              isValidSelection() && !addingToCart
                ? 'bg-gradient-to-r from-[#0078d4] to-[#064ad4] hover:from-[#064ad4] hover:to-[#004b8d] text-white hover:scale-105 shadow-xl' 
                : 'bg-[#d6e6f7] text-[#555555] cursor-not-allowed'
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

        <Button 
          className={`w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg bg-gradient-to-r transition-all duration-300 shadow-lg transform ${
            isValidSelection() 
              ? 'bg-gradient-to-r from-[#004b8d] to-[#093389] hover:from-[#093389] hover:to-[#004b8d] text-white hover:scale-105 shadow-xl' 
              : 'bg-[#d6e6f7] text-[#555555] cursor-not-allowed'
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

        {cartItems.length > 0 && (
          <Button 
            variant="outline"
            onClick={() => navigate('/cart')}
            className="w-full border-2 border-[#d6e6f7] text-[#0078d4] hover:bg-[#f5f9ff] font-medium py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300"
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
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#d6e6f7] overflow-hidden space-y-4">
            <div className="space-y-4 p-6">
              <div className="md:grid md:grid-cols-2 md:gap-6 lg:block items-center">
                {hasRecordedPricing && (
                  <div>
                    <h3 className="font-bold text-[#093389] mb-1 text-lg flex items-center">
                      <Icon name="Download" size={18} className="mr-2 text-[#0078d4]" />
                      Recorded Version
                    </h3>
                    <div className="space-y-3">
                      {getDisplayPrices.recorded_single > 0 && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${
                            selectedOptions.recordedOne
                              ? "border-[#0078d4] bg-[#f5f9ff] shadow-md"
                              : "border-[#d6e6f7] hover:border-[#0078d4] hover:bg-[#f5f9ff]"
                          }`}
                          onClick={() => handleOptionChange("recordedOne")}
                        >
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <Checkbox
                              checked={selectedOptions.recordedOne}
                              onChange={() => handleOptionChange("recordedOne")}
                              color="blue"
                              id="recordedOne"
                            />
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-[#093389]">Single Recorded</span>
                                <div className="text-xs text-[#555555] mt-1">Perfect for individual learning</div>
                              </div>
                              <span className="text-lg font-bold text-[#0078d4]">
                                ${getDisplayPrices.recorded_single.toFixed(2)}
                              </span>
                            </div>
                          </label>
                        </motion.div>
                      )}

                      {getDisplayPrices.recorded_multi > 0 && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 relative ${
                            selectedOptions.recordedGroup
                              ? "border-[#064ad4] bg-[#e9eff5] shadow-md"
                              : "border-[#d6e6f7] hover:border-[#064ad4] hover:bg-[#e9eff5]"
                          }`}
                          onClick={() => handleOptionChange("recordedGroup")}
                        >
                          <div className="absolute -top-1 sm:-top-2 right-2 sm:right-3">
                            <span className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold">
                              POPULAR
                            </span>
                          </div>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <Checkbox
                              checked={selectedOptions.recordedGroup}
                              onChange={() => handleOptionChange("recordedGroup")}
                              color="blue"
                              id="recordedGroup"
                            />
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-[#093389]">Multi Recorded</span>
                                <div className="text-xs text-[#555555] mt-1">Ideal for teams & organizations</div>
                              </div>
                              <span className="text-lg font-bold text-[#064ad4]">
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
             
              <div className="md:grid md:grid-cols-2 md:gap-6 lg:block items-center">
                <div>
                  {total > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r mt-3 from-[#f5f9ff] to-[#e9eff5] border-2 border-[#d6e6f7] rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-[#093389]">Total Amount:</span>
                          <div className="text-xs text-[#555555]">One-time secure payment</div>
                        </div>
                        <span className="text-2xl font-bold text-[#0078d4]">${total.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-6">
                    {renderActionButtons()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#f5f9ff] via-[#e9eff5] to-[#f5f9ff] px-6 py-4 mt-4 rounded-xl">
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-[#d9ecff] rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <Icon name="Users" size={10} className="text-[#0078d4]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#093389]">Multi Attendees:</span>
                    <span className="text-[#555555] ml-1">Unlimited team members</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-[#e9eff5] rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <Icon name="Download" size={10} className="text-[#064ad4]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#093389]">Recording Access:</span>
                    <span className="text-[#555555] ml-1">6 months unlimited viewing</span>
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