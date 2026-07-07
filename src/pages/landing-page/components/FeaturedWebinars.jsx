import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedWebinars = ({ onEnrollClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  const webinars = [
    {
      id: 1,
      title: "Advanced React Patterns and Performance Optimization",
      instructor: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        expertise: "Senior Frontend Developer"
      },
      date: "September 5, 2025",
      time: "2:00 PM EST",
      duration: "90 minutes",
      attendees: 245,
      price: "$49",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Web Development"
    },
    {
      id: 2,
      title: "Digital Marketing Strategy for 2025: AI-Powered Growth",
      instructor: {
        name: "Michael Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        expertise: "Marketing Director"
      },
      date: "September 8, 2025",
      time: "1:00 PM EST",
      duration: "120 minutes",
      attendees: 189,
      price: "$39",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Marketing"
    },
    {
      id: 3,
      title: "Data Science Fundamentals: From Python to Machine Learning",
      instructor: {
        name: "Dr. Emily Watson",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        expertise: "Data Science Lead"
      },
      date: "September 12, 2025",
      time: "3:00 PM EST",
      duration: "150 minutes",
      attendees: 312,
      price: "$59",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Data Science"
    },
    {
      id: 4,
      title: "Leadership in Remote Teams: Building Culture & Performance",
      instructor: {
        name: "James Thompson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        expertise: "Executive Coach"
      },
      date: "September 15, 2025",
      time: "11:00 AM EST",
      duration: "100 minutes",
      attendees: 156,
      price: "$45",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Leadership"
    }
  ];

  const updateItemsPerSlide = () => {
    if (window.innerWidth >= 1024) {
      setItemsPerSlide(3);
    } else if (window.innerWidth >= 768) {
      setItemsPerSlide(2);
    } else {
      setItemsPerSlide(1);
    }
  };

  useEffect(() => {
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

  const totalSlides = Math.ceil(webinars?.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentWebinars = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return webinars?.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Featured Webinars
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            Join our most popular upcoming sessions led by industry experts
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {getCurrentWebinars()?.map((webinar) => (
              <div key={webinar?.id} className="bg-card rounded-xl shadow-lg hover-elevate overflow-hidden">
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <Image
                    src={webinar?.image}
                    alt={webinar?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <span className="bg-primary text-primary-foreground px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                      {webinar?.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 md:top-4 md:right-4">
                    <span className="bg-success text-success-foreground px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                      {webinar?.price}
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 line-clamp-2 leading-tight">
                    {webinar?.title}
                  </h3>

                  <div className="flex items-center mb-3 md:mb-4">
                    <Image
                      src={webinar?.instructor?.avatar}
                      alt={webinar?.instructor?.name}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover mr-2 md:mr-3"
                    />
                    <div>
                      <div className="font-medium text-foreground text-sm md:text-base">{webinar?.instructor?.name}</div>
                      <div className="text-xs md:text-sm text-text-secondary">{webinar?.instructor?.expertise}</div>
                    </div>
                  </div>

                  <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                    <div className="flex items-center text-xs md:text-sm text-text-secondary">
                      <Icon name="Calendar" size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{webinar?.date}</span>
                    </div>
                    <div className="flex items-center text-xs md:text-sm text-text-secondary">
                      <Icon name="Clock" size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{webinar?.time} • {webinar?.duration}</span>
                    </div>
                    <div className="flex items-center text-xs md:text-sm text-text-secondary">
                      <Icon name="Users" size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{webinar?.attendees} enrolled</span>
                    </div>
                  </div>

            

                  <Button
                    variant="default"
                    fullWidth
                    onClick={() => onEnrollClick(webinar)}
                    className="font-medium text-sm md:text-base py-2 md:py-3"
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons - Hidden on small screens when not needed */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-4 w-10 h-10 md:w-12 md:h-12 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center focus-ring"
                aria-label="Previous webinars"
              >
                <Icon name="ChevronLeft" size={18} color="currentColor" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-4 w-10 h-10 md:w-12 md:h-12 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center focus-ring"
                aria-label="Next webinars"
              >
                <Icon name="ChevronRight" size={18} color="currentColor" />
              </button>
            </>
          )}

          {/* Dots indicator for mobile */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 md:hidden space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-primary w-6' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onEnrollClick(null)}
            className="font-medium text-sm md:text-base px-6 md:px-8 py-3 md:py-4"
          >
            View All Webinars
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWebinars;
