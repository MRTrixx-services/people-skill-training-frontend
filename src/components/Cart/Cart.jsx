// components/Cart/Cart.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';
import { useCart } from 'contexts/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, isOpen, removeFromCart, setCartOpen, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl lg:relative lg:max-w-none lg:w-96 lg:shadow-xl lg:rounded-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Icon name="ShoppingCart" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Your Cart</h3>
                    <p className="text-sm text-gray-600">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                >
                  <Icon name="X" size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Icon name="ShoppingCart" size={24} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h4>
                    <p className="text-gray-600 mb-6">Add some webinars to get started</p>
                    <Button
                      onClick={() => {
                        setCartOpen(false);
                        navigate('/webinars');
                      }}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl"
                    >
                      Browse Webinars
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.cartId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">by {item.instructor}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.webinarType === 'live' 
                                  ? 'bg-red-100 text-red-600' 
                                  : 'bg-blue-100 text-blue-600'
                              }`}>
                                {item.webinarType === 'live' ? 'LIVE' : 'RECORDED'}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                                {item.accessType}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-lg font-bold text-indigo-600">${item.price}</span>
                              <button
                                onClick={() => removeFromCart(item.cartId)}
                                className="p-1 hover:bg-red-100 rounded-lg transition-colors group"
                              >
                                <Icon name="Trash2" size={16} className="text-gray-400 group-hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 p-4 sm:p-6 bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Icon name="CreditCard" size={20} className="mr-2" />
                        Proceed to Checkout
                      </Button>
                      
                      <button
                        onClick={clearCart}
                        className="w-full text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
