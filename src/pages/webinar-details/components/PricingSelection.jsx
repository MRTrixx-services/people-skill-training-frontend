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
  
  const { user, isAuthenticated, token } = useAuth();
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

  const hasItemsInCart = () => {
    const selectedKeys = [
      "liveOne", "liveGroup", "recordedOne", "recordedGroup", "comboOne", "comboGroup",
    ].filter(opt => selectedOptions[opt]);

    return selectedKeys.some(optionKey =>
      cartItems.some(item => item.webinarId === webinar.webinarId && item.itemType === optionKey)
    );
  };

  const hasLivePricing = pricing?.live?.oneParticipant > 0 || pricing?.live?.groupAttendees > 0;
  const hasRecordedPricing = pricing?.recorded?.oneParticipant > 0 || pricing?.recorded?.groupAttendees > 0;
  const hasComboPricing = pricing?.combo?.oneParticipant?.price > 0 || pricing?.combo?.groupAttendees?.price > 0;

  function SectionWarning({ sectionType }) {
    const sectionGroups = {
      live: ['liveOne', 'liveGroup'],
      recorded: ['recordedOne', 'recordedGroup'],
      combo: ['comboOne', 'comboGroup']
    };

    const currentGroup = sectionGroups[sectionType] || [];
    
    const anySelected = currentGroup.some(opt => selectedOptions[opt]);
    
    if (!anySelected) return null;

    const userAccessTypes = webinar?.user_access_types || [];
    
    const purchasedInSection = currentGroup.filter(opt => userAccessTypes.includes(opt));
    const hasPurchased = purchasedInSection.length > 0;
    
    const selectedDifferentOption = currentGroup.some(opt => 
      selectedOptions[opt] && !purchasedInSection.includes(opt)
    );

    const anyInCart = currentGroup.some(opt =>
      cartItems.some(item => item.webinarId === webinar.webinarId && item.itemType === opt)
    );

    if (hasPurchased && selectedDifferentOption) {
      const accessTypeLabels = {
        liveOne: 'Live - Single',
        liveGroup: 'Live - Multi',
        recordedOne: 'Recorded - Single',
        recordedGroup: 'Recorded - Multi',
        comboOne: 'Combo - Single',
        comboGroup: 'Combo - Multi'
      };

      const purchasedLabels = purchasedInSection.map(opt => accessTypeLabels[opt]).join(', ');

      return (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#d9ecff] my-2 border border-[#0078d4] rounded-lg p-3 flex items-center space-x-2"
        >
          <Icon name="Info" size={16} className="text-[#0078d4] flex-shrink-0" />
          <div className="text-sm text-[#004b8d]">
            <span className="font-medium">You already own: {purchasedLabels}</span>
            <button 
              onClick={() => navigate('/attendee/orders')} 
              className="ml-2 underline hover:text-[#0078d4] font-medium"
            >
              View Orders
            </button>
          </div>
        </motion.div>
      );
    }

    if (hasPurchased && !selectedDifferentOption) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#e9eff5] my-2 border border-[#064ad4] rounded-lg p-3 flex items-center space-x-2"
        >
          <Icon name="CheckCircle" size={16} className="text-[#064ad4] flex-shrink-0" />
          <div className="text-sm text-[#004b8d]">
            <span className="font-medium">You already own this option!</span>
          </div>
        </motion.div>
      );
    }

    if (anyInCart) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 my-2 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2"
        >
          <Icon name="AlertTriangle" size={16} className="text-yellow-600 flex-shrink-0" />
          <div className="text-sm text-yellow-700">
            <span className="font-medium">Another option is in your cart.</span>
            <button 
              onClick={() => navigate('/cart')} 
              className="ml-2 underline hover:text-yellow-800 font-medium"
            >
              View Cart
            </button>
          </div>
        </motion.div>
      );
    }

    return null;
  }

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
                {hasLivePricing && (
                  <div>
                    <h3 className="font-bold text-[#093389] mb-1 text-lg flex items-center">
                      <Icon name="Video" size={18} className="mr-2 text-[#0078d4]" />
                      Live Version
                    </h3>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${
                          selectedOptions.liveOne
                            ? "border-[#0078d4] bg-[#f5f9ff] shadow-md"
                            : "border-[#d6e6f7] hover:border-[#0078d4] hover:bg-[#f5f9ff]"
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
                              <span className="font-semibold text-[#093389]">Single Attendee</span>
                              <div className="text-xs text-[#555555] mt-1">Solo Participant Access</div>
                            </div>
                            <span className="text-lg font-bold text-[#0078d4]">
                              ${pricing.live.oneParticipant}
                            </span>
                          </div>
                        </label>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 relative ${
                          selectedOptions.liveGroup
                            ? "border-[#064ad4] bg-[#e9eff5] shadow-md"
                            : "border-[#d6e6f7] hover:border-[#064ad4] hover:bg-[#e9eff5]"
                        }`}
                        onClick={() => handleOptionChange("liveGroup")}
                      >
                        <div className="absolute -top-1 right-2">
                          <span className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                            TEAMS
                          </span>
                        </div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <Checkbox
                            checked={selectedOptions.liveGroup}
                            onChange={() => handleOptionChange("liveGroup")}
                            color="blue"
                            id="liveGroup"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-[#093389]">Multi Attendees</span>
                              <div className="text-xs text-[#555555] mt-1">Group License (Up to X Attendees)</div>
                            </div>
                            <span className="text-lg font-bold text-[#064ad4]">
                              ${pricing.live.groupAttendees}
                            </span>
                          </div>
                        </label>
                      </motion.div>
                      
                      <SectionWarning sectionType="live" />
                    </div>
                  </div>
                )}

                {hasRecordedPricing && (
                  <div>
                    <h3 className="font-bold text-[#093389] mb-1 text-lg flex items-center">
                      <Icon name="Download" size={18} className="mr-2 text-[#064ad4]" />
                      Recorded Version 
                      <div className="text-xs ml-1 text-[#555555] mt-1"> (6 Months access) </div>
                    </h3>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${
                          selectedOptions.recordedOne
                            ? "border-[#064ad4] bg-[#e9eff5] shadow-md"
                            : "border-[#d6e6f7] hover:border-[#064ad4] hover:bg-[#e9eff5]"
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
                              <div className="text-xs text-[#555555] mt-1">Individual Recording License</div>
                            </div>
                            <span className="text-lg font-bold text-[#064ad4]">
                              ${pricing.recorded.oneParticipant}
                            </span>
                          </div>
                        </label>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${
                          selectedOptions.recordedGroup
                            ? "border-[#0078d4] bg-[#f5f9ff] shadow-md"
                            : "border-[#d6e6f7] hover:border-[#0078d4] hover:bg-[#f5f9ff]"
                        }`}
                        onClick={() => handleOptionChange("recordedGroup")}
                      >
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
                              <div className="text-xs text-[#555555] mt-1">Group Record Access</div>
                            </div>
                            <span className="text-lg font-bold text-[#0078d4]">
                              ${pricing.recorded.groupAttendees}
                            </span>
                          </div>
                        </label>
                      </motion.div>
                      
                      <SectionWarning sectionType="recorded" />
                    </div>
                  </div>
                )}
              </div>
             
              <div className="md:grid md:grid-cols-2 md:gap-6 lg:block items-center">
                {hasComboPricing && (
                  <div>
                    <h3 className="font-bold text-[#093389] mb-2 text-lg flex items-center">
                      <Icon name="Star" size={18} className="mr-2 text-[#004b8d]" />
                      Combo Offers
                      <span className="ml-2 bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        BEST VALUE
                      </span>
                    </h3>
                    <p className="text-sm text-[#555555] mb-2 font-medium">
                      Live + Recorded version (6 months access)
                    </p>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${
                          selectedOptions.comboOne
                            ? "border-[#004b8d] bg-[#e9eff5] shadow-md"
                            : "border-[#d6e6f7] hover:border-[#004b8d] hover:bg-[#e9eff5]"
                        }`}
                        onClick={() => handleOptionChange("comboOne")}
                      >
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <Checkbox
                            checked={selectedOptions.comboOne}
                            onChange={() => handleOptionChange("comboOne")}
                            color="blue"
                            id="comboOne"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-[#093389] text-sm">Single Attendee</span>
                              <div className="text-xs text-[#555555]">+ Single Record</div>
                            </div>
                            <span className="text-lg font-bold text-[#004b8d]">
                              ${pricing.combo.oneParticipant.price}
                            </span>
                          </div>
                        </label>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 relative ${
                          selectedOptions.comboGroup
                            ? "border-[#093389] bg-[#f5f9ff] shadow-md"
                            : "border-[#d6e6f7] hover:border-[#093389] hover:bg-[#f5f9ff]"
                        }`}
                        onClick={() => handleOptionChange("comboGroup")}
                      >
                        <div className="absolute -top-1 right-2">
                          <span className="bg-gradient-to-r from-[#0078d4] to-[#064ad4] text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                            POPULAR
                          </span>
                        </div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <Checkbox
                            checked={selectedOptions.comboGroup}
                            onChange={() => handleOptionChange("comboGroup")}
                            color="blue"
                            id="comboGroup"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-[#093389] text-sm">Multi Attendees</span>
                              <div className="text-xs text-[#555555]">+ Group Record Access</div>
                            </div>
                            <span className="text-lg font-bold text-[#093389]">
                              ${pricing.combo.groupAttendees.price}
                            </span>
                          </div>
                        </label>
                      </motion.div>
                      
                      <SectionWarning sectionType="combo" />
                    </div>
                  </div>
                )}

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
                          <div className="text-xs text-[#555555]">Secure payment</div>
                        </div>
                        <span className="text-2xl font-bold text-[#0078d4]">${total}</span>
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

                <div className="flex items-start">
                  <div className="w-5 h-5 bg-[#d9ecff] rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <Icon name="Clock" size={10} className="text-[#0078d4]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#093389]">Recording Availability:</span>
                    <span className="text-[#555555] ml-1">Available within 24 hours after live session</span>
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