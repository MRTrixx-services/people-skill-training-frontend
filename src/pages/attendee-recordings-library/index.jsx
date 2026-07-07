import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import AttendeeBottomNav from '../../components/ui/AttendeeBottomNav';
import SearchAndFilters from './components/SearchAndFilters';
import AdvancedFilters from './components/AdvancedFilters';
import RecordingCard from './components/RecordingCard';
import PurchaseModal from './components/PurchaseModal';
import RecommendationSection from './components/RecommendationSection';
import LoadingSkeleton from './components/LoadingSkeleton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AttendeeRecordingsLibrary = () => {
  const [recordings, setRecordings] = useState([]);
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Mock data
  const mockRecordings = [
    {
      id: 1,
      title: "Advanced React Patterns and Performance Optimization",
      instructor: "Sarah Johnson",
      duration: 120,
      rating: 4.8,
      reviewCount: 234,
      price: 49.99,
      originalPrice: 79.99,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
      isPurchased: false,
      progress: 0,
      tags: ["React", "JavaScript", "Performance"],
      category: "programming",
      level: "advanced",
      isInWishlist: false
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals for Developers",
      instructor: "Michael Chen",
      duration: 90,
      rating: 4.6,
      reviewCount: 189,
      price: 0,
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
      isPurchased: false,
      progress: 0,
      tags: ["Design", "UI/UX", "Figma"],
      category: "design",
      level: "beginner",
      isInWishlist: true
    },
    {
      id: 3,
      title: "Digital Marketing Strategy for 2024",
      instructor: "Emily Davis",
      duration: 75,
      rating: 4.9,
      reviewCount: 456,
      price: 39.99,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      isPurchased: true,
      progress: 65,
      tags: ["Marketing", "Strategy", "Digital"],
      category: "marketing",
      level: "intermediate",
      isInWishlist: false
    },
    {
      id: 4,
      title: "Python Data Science Masterclass",
      instructor: "David Wilson",
      duration: 180,
      rating: 4.7,
      reviewCount: 312,
      price: 69.99,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      isPurchased: false,
      progress: 0,
      tags: ["Python", "Data Science", "Machine Learning"],
      category: "data-science",
      level: "intermediate",
      isInWishlist: false
    },
    {
      id: 5,
      title: "Business Leadership in Remote Teams",
      instructor: "Lisa Anderson",
      duration: 60,
      rating: 4.5,
      reviewCount: 167,
      price: 29.99,
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
      isPurchased: true,
      progress: 100,
      tags: ["Leadership", "Management", "Remote Work"],
      category: "business",
      level: "intermediate",
      isInWishlist: false
    },
    {
      id: 6,
      title: "Advanced JavaScript ES2024 Features",
      instructor: "Alex Rodriguez",
      duration: 95,
      rating: 4.8,
      reviewCount: 298,
      price: 0,
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop",
      isPurchased: false,
      progress: 0,
      tags: ["JavaScript", "ES2024", "Web Development"],
      category: "programming",
      level: "advanced",
      isInWishlist: true
    },
    {
      id: 7,
      title: "Personal Branding for Professionals",
      instructor: "Jennifer Kim",
      duration: 45,
      rating: 4.4,
      reviewCount: 123,
      price: 19.99,
      thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=225&fit=crop",
      isPurchased: false,
      progress: 0,
      tags: ["Branding", "Career", "Professional Development"],
      category: "personal-development",
      level: "beginner",
      isInWishlist: false
    },
    {
      id: 8,
      title: "Cloud Architecture with AWS",
      instructor: "Robert Taylor",
      duration: 150,
      rating: 4.9,
      reviewCount: 445,
      price: 89.99,
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop",
      isPurchased: false,
      progress: 0,
      tags: ["AWS", "Cloud", "Architecture"],
      category: "programming",
      level: "expert",
      isInWishlist: false
    }
  ];

  // Initialize data
  useEffect(() => {
    const loadRecordings = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const recordingsWithWishlist = mockRecordings?.map(recording => ({
          ...recording,
          isInWishlist: wishlist?.has(recording?.id)
        }));
        setRecordings(recordingsWithWishlist);
        setFilteredRecordings(recordingsWithWishlist);
        setLoading(false);
      }, 1000);
    };

    loadRecordings();
  }, [wishlist]);

  // Initialize wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('attendee-wishlist');
    if (savedWishlist) {
      setWishlist(new Set(JSON.parse(savedWishlist)));
    }
  }, []);

  // Filter and sort recordings
  useEffect(() => {
    let filtered = [...recordings];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(recording =>
        recording?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        recording?.instructor?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        recording?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(recording => recording?.category === selectedCategory);
    }

    // Apply advanced filters
    if (currentFilters?.priceRange && currentFilters?.priceRange !== 'all') {
      if (currentFilters?.priceRange === 'free') {
        filtered = filtered?.filter(recording => recording?.price === 0);
      } else if (currentFilters?.priceRange === '0-25') {
        filtered = filtered?.filter(recording => recording?.price > 0 && recording?.price <= 25);
      } else if (currentFilters?.priceRange === '25-50') {
        filtered = filtered?.filter(recording => recording?.price > 25 && recording?.price <= 50);
      } else if (currentFilters?.priceRange === '50-100') {
        filtered = filtered?.filter(recording => recording?.price > 50 && recording?.price <= 100);
      } else if (currentFilters?.priceRange === '100+') {
        filtered = filtered?.filter(recording => recording?.price > 100);
      }
    }

    if (currentFilters?.level && currentFilters?.level?.length > 0) {
      filtered = filtered?.filter(recording => currentFilters?.level?.includes(recording?.level));
    }

    if (currentFilters?.rating && currentFilters?.rating > 0) {
      filtered = filtered?.filter(recording => recording?.rating >= currentFilters?.rating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered?.sort((a, b) => b?.id - a?.id);
        break;
      case 'oldest':
        filtered?.sort((a, b) => a?.id - b?.id);
        break;
      case 'rating':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'price-low':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'duration':
        filtered?.sort((a, b) => a?.duration - b?.duration);
        break;
      case 'popular':
        filtered?.sort((a, b) => b?.reviewCount - a?.reviewCount);
        break;
      default:
        break;
    }

    setFilteredRecordings(filtered);
  }, [recordings, searchQuery, selectedCategory, sortBy, currentFilters]);

  const handlePurchase = (recording) => {
    setSelectedRecording(recording);
    setIsPurchaseModalOpen(true);
  };

  const handleWatch = (recording) => {
    // Navigate to video player or open video modal
    console.log('Watching recording:', recording?.title);
  };

  const handleAddToWishlist = (recordingId) => {
    const newWishlist = new Set(wishlist);
    newWishlist?.add(recordingId);
    setWishlist(newWishlist);
    localStorage.setItem('attendee-wishlist', JSON.stringify([...newWishlist]));
    
    // Update recordings state
    setRecordings(prev => prev?.map(recording =>
      recording?.id === recordingId ? { ...recording, isInWishlist: true } : recording
    ));
  };

  const handleRemoveFromWishlist = (recordingId) => {
    const newWishlist = new Set(wishlist);
    newWishlist?.delete(recordingId);
    setWishlist(newWishlist);
    localStorage.setItem('attendee-wishlist', JSON.stringify([...newWishlist]));
    
    // Update recordings state
    setRecordings(prev => prev?.map(recording =>
      recording?.id === recordingId ? { ...recording, isInWishlist: false } : recording
    ));
  };

  const handlePurchaseComplete = (recording) => {
    // Update recording as purchased
    setRecordings(prev => prev?.map(r =>
      r?.id === recording?.id ? { ...r, isPurchased: true, progress: 0 } : r
    ));
  };

  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
  };

  const loadMore = () => {
    // Simulate loading more recordings
    setPage(prev => prev + 1);
  };

  // Get recommendation data
  const getRecommendedRecordings = () => {
    return recordings?.filter(r => r?.rating >= 4.7)?.slice(0, 4);
  };

  const getTrendingRecordings = () => {
    return recordings?.filter(r => r?.reviewCount > 200)?.slice(0, 4);
  };

  const getFreeRecordings = () => {
    return recordings?.filter(r => r?.price === 0)?.slice(0, 4);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="attendee" userName="John Doe" />
      <div className="pt-16 pb-20 md:pb-4 md:pl-64">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            isFilterOpen={isFilterOpen}
          />

          <div className="flex">
            {/* Advanced Filters Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-20">
                <AdvancedFilters
                  isOpen={true}
                  onClose={() => {}}
                  onApplyFilters={handleApplyFilters}
                  currentFilters={currentFilters}
                />
              </div>
            </div>

            {/* Mobile Advanced Filters */}
            <AdvancedFilters
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={handleApplyFilters}
              currentFilters={currentFilters}
            />

            {/* Main Content */}
            <div className="flex-1 p-4 lg:pl-6">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">Recordings Library</h1>
                  <p className="text-text-secondary mt-1">
                    {loading ? 'Loading...' : `${filteredRecordings?.length} recordings found`}
                  </p>
                </div>
                
                {/* View Toggle */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Icon name="Grid3X3" size={20} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Icon name="List" size={20} />
                  </Button>
                </div>
              </div>

              {/* Recommendation Sections */}
              {!searchQuery && selectedCategory === 'all' && Object.keys(currentFilters)?.length === 0 && (
                <div className="mb-8">
                  <RecommendationSection
                    title="Recommended for You"
                    recordings={getRecommendedRecordings()}
                    onPurchase={handlePurchase}
                    onWatch={handleWatch}
                    onAddToWishlist={handleAddToWishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                  
                  <RecommendationSection
                    title="Trending Now"
                    recordings={getTrendingRecordings()}
                    onPurchase={handlePurchase}
                    onWatch={handleWatch}
                    onAddToWishlist={handleAddToWishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                  
                  <RecommendationSection
                    title="Free Recordings"
                    recordings={getFreeRecordings()}
                    onPurchase={handlePurchase}
                    onWatch={handleWatch}
                    onAddToWishlist={handleAddToWishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                </div>
              )}

              {/* All Recordings Grid */}
              {loading ? (
                <LoadingSkeleton count={8} />
              ) : filteredRecordings?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {filteredRecordings?.map((recording) => (
                      <RecordingCard
                        key={recording?.id}
                        recording={recording}
                        onPurchase={handlePurchase}
                        onWatch={handleWatch}
                        onAddToWishlist={handleAddToWishlist}
                        onRemoveFromWishlist={handleRemoveFromWishlist}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={loadMore}
                        iconName="ChevronDown"
                        iconPosition="right"
                        iconSize={16}
                      >
                        Load More Recordings
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No recordings found</h3>
                  <p className="text-text-secondary mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setCurrentFilters({});
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        recording={selectedRecording}
        onPurchaseComplete={handlePurchaseComplete}
      />
      <AttendeeBottomNav currentPath="/attendee-recordings-library" />
    </div>
  );
};

export default AttendeeRecordingsLibrary;