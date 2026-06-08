import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import heroImage from '../assets/hero.png';
import {
  IconSearch,
  IconStar,
  IconMapPin,
  IconChevronRight,
  IconSparkles,
  IconScissors,
  IconCheck,
  IconDna,
  IconUser,
  IconDroplet,
  IconCrown,
  IconPalette,
  IconHeart,
  IconWind,
  IconSparkles as IconWedding
} from '@tabler/icons-react';

export const HomePage: React.FC = () => {
  const { artisans, services, setSearchFilter, selectedCity, setSelectedCity } = useApp();
  const navigate = useNavigate();

  const [showCityModal, setShowCityModal] = useState(false);

  // Filter artisans by currently selected city
  const localArtisans = artisans.filter(art => art.city === selectedCity);

  // Featured artisans (e.g. rating >= 4.8)
  const featuredArtisans = localArtisans.filter(art => art.rating >= 4.8);

  // Top Rated Near You (sorted by rating desc)
  const topRatedArtisans = [...localArtisans].sort((a, b) => b.rating - a.rating);

  const handleServiceClick = (serviceName: string) => {
    setSearchFilter(serviceName);
    navigate('/search');
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  // Helper to map mock icon names to actual tabler icons
  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scissors':
        return <IconScissors className="w-6 h-6 text-primary group-hover:text-white transition-colors" />;
      case 'Braids':
        return <IconSparkles className="w-6 h-6 text-primary group-hover:text-white transition-colors" />;
      case 'Locs':
        return <IconDna className="w-6 h-6 text-primary group-hover:text-white transition-colors" />;
      case 'Beard':
        return <IconUser className="w-6 h-6 text-primary group-hover:text-white transition-colors" />;
      case 'Relaxer':
        return <IconDroplet className="w-6 h-6 text-primary group-hover:text-white transition-colors" />;
      case 'Weave':
        return <IconCrown className="w-6 h-6 text-primary group-hover:text-white transition-colors" />;
      default:
        return <IconSparkles className="w-6 h-6 text-primary group-hover:text-white transition-colors" />;
    }
  };

  // Hair service categories for Upwork-style grid
  const hairServiceCategories = [
    { id: 'haircuts', name: 'Haircuts & Fades', icon: 'Scissors', description: 'Classic cuts, fades, and modern styles' },
    { id: 'beard', name: 'Beard Grooming', icon: 'Beard', description: 'Beard trimming, shaping, and care' },
    { id: 'braids', name: 'Braids & Cornrows', icon: 'Braids', description: 'Box braids, cornrows, and intricate styles' },
    { id: 'locs', name: 'Dreadlocks & Locs', icon: 'Locs', description: 'Loc installation, retwist, and maintenance' },
    { id: 'weaves', name: 'Weaves & Extensions', icon: 'Weave', description: 'Sew-ins, wig installs, and hair extensions' },
    { id: 'natural', name: 'Natural Hair Care', icon: 'Heart', description: 'Natural hair treatments and styling' },
    { id: 'coloring', name: 'Hair Coloring', icon: 'Palette', description: 'Dye, highlights, and color treatments' },
    { id: 'kids', name: 'Kids Haircuts', icon: 'User', description: 'Gentle cuts for children of all ages' },
    { id: 'wedding', name: 'Event Styling', icon: 'Wedding', description: 'Wedding, party, and special occasion styling' },
    { id: 'treatments', name: 'Hair Treatments', icon: 'Wind', description: 'Deep conditioning, masks, and therapies' }
  ];

  // Helper to render category icons
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scissors':
        return <IconScissors className="w-8 h-8" />;
      case 'Beard':
        return <IconUser className="w-8 h-8" />;
      case 'Braids':
        return <IconSparkles className="w-8 h-8" />;
      case 'Locs':
        return <IconDna className="w-8 h-8" />;
      case 'Weave':
        return <IconCrown className="w-8 h-8" />;
      case 'Heart':
        return <IconHeart className="w-8 h-8" />;
      case 'Palette':
        return <IconPalette className="w-8 h-8" />;
      case 'User':
        return <IconUser className="w-8 h-8" />;
      case 'Wedding':
        return <IconWedding className="w-8 h-8" />;
      case 'Wind':
        return <IconWind className="w-8 h-8" />;
      default:
        return <IconScissors className="w-8 h-8" />;
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSearchFilter(categoryName);
    navigate('/search');
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      {/* City Picker Modal */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-scaleUp">
            <h3 className="text-[20px] font-heading font-bold text-dark mb-4">Select City</h3>
            <div className="space-y-2">
              {(['Accra', 'Kumasi', 'Takoradi', 'Tamale', 'Cape Coast'] as const).map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCityModal(false);
                  }}
                  className={`w-full text-left h-12 px-4 rounded-xl flex items-center justify-between font-semibold transition ${
                    selectedCity === city ? 'bg-[#E6F3EC] text-primary' : 'hover:bg-gray-50 text-dark'
                  }`}
                >
                  <span>{city}</span>
                  {selectedCity === city && <IconCheck className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCityModal(false)}
              className="mt-4 w-full h-[52px] rounded-[10px] bg-gray-100 font-bold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hero Header Section - Modern Design */}
      <section className="bg-gradient-to-br from-white via-[#F8FFFB] to-[#E6F3EC] py-16 lg:py-24 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        </div>
        
        <div className="max-width-container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Side - Text Content */}
            <div className="flex-1 w-full">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <IconSparkles className="w-4 h-4" />
                <span>Top-rated barbers near you</span>
              </div>
              
              <h1 className="text-[52px] md:text-[64px] font-heading font-black text-dark leading-[1.1] mb-6">
                Your Perfect
                <span className="text-primary block">Style Awaits</span>
              </h1>
              <p className="text-[18px] font-medium text-muted mb-10 max-w-xl leading-relaxed">
                Discover skilled barbers and stylists in Ghana. Book appointments instantly, read reviews, and transform your look today.
              </p>
              
              {/* Search Bar - Modern */}
              <div
                onClick={handleSearchClick}
                className="flex items-center w-full h-[64px] rounded-2xl bg-white shadow-lg shadow-primary/10 border border-gray-100 px-6 cursor-pointer hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 group mb-6"
              >
                <IconSearch className="w-6 h-6 text-muted group-hover:text-primary transition-colors mr-4" />
                <span className="text-muted text-[16px] font-medium">Search barbers, services, or locations...</span>
                <div className="ml-auto bg-primary text-white p-3 rounded-xl group-hover:scale-105 transition-transform">
                  <IconSearch className="w-5 h-5" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSearchClick}
                  className="bg-primary text-white text-[16px] font-bold px-8 py-4 rounded-2xl hover:bg-[#005230] hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Explore Barbers
                  <IconChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowCityModal(true)}
                  className="bg-white text-primary text-[16px] font-bold px-8 py-4 rounded-2xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <IconMapPin className="w-5 h-5" />
                  {selectedCity}
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-black text-dark">500+</p>
                  <p className="text-sm font-medium text-muted">Verified Barbers</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-dark">4.9</p>
                  <p className="text-sm font-medium text-muted">Average Rating</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-dark">24/7</p>
                  <p className="text-sm font-medium text-muted">Booking Available</p>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="flex-1 w-full flex justify-center">
              <div className="relative w-full max-w-[520px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border-4 border-white">
                  {/* Animated stroke effect */}
                  <div className="absolute inset-0 rounded-3xl p-[4px]">
                    <div className="absolute inset-0 rounded-3xl animate-spin-slow" style={{
                      background: 'conic-gradient(from 0deg, transparent 0deg, #006B3F 90deg, transparent 180deg, #006B3F 270deg, transparent 360deg)',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      WebkitMaskComposite: 'xor',
                      padding: '4px'
                    }}></div>
                  </div>
                  <img 
                    src={heroImage} 
                    alt="Barber and happy customer" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <IconStar className="w-6 h-6 text-primary fill-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-dark">4.9 Rating</p>
                      <p className="text-sm font-medium text-muted">10k+ Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-width-container space-y-16">
        {/* Browse by Service - Modern Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[32px] font-heading font-black text-dark mb-2">
                Browse by Service
              </h2>
              <p className="text-muted font-medium">Find the perfect service for your needs</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {services.map((ser) => (
              <div
                key={ser.id}
                onClick={() => handleServiceClick(ser.name)}
                className="bg-white border border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer p-6 rounded-3xl flex flex-col items-center justify-center text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#E6F3EC] to-[#F0F9F4] group-hover:from-primary group-hover:to-primary/90 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                  {renderServiceIcon(ser.icon)}
                </div>
                <span className="text-[15px] font-bold text-dark truncate w-full group-hover:text-primary transition-colors">
                  {ser.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Artisans - Upwork-style Category Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[32px] font-heading font-black text-dark mb-2">
                Find Hair Services for Every Style
              </h2>
              <p className="text-muted font-medium">Browse categories and discover skilled barbers & stylists in Ghana</p>
            </div>
          </div>

          {/* Upwork-style category grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {hairServiceCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="bg-white border border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer p-6 rounded-2xl flex flex-col items-center justify-center text-center group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#E6F3EC] to-[#F0F9F4] group-hover:from-primary group-hover:to-primary/90 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                  <div className="text-primary group-hover:text-white transition-colors">
                    {renderCategoryIcon(category.icon)}
                  </div>
                </div>
                <span className="text-[15px] font-bold text-dark truncate w-full group-hover:text-primary transition-colors mb-1">
                  {category.name}
                </span>
                <span className="text-[12px] font-medium text-muted line-clamp-2">
                  {category.description}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Artisans - Top Professionals */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[32px] font-heading font-black text-dark mb-2">
                Featured Artisans
              </h2>
              <p className="text-muted font-medium">Top-rated professionals in {selectedCity}</p>
            </div>
          </div>

          {/* Horizontally scroll on mobile, 3-column grid on desktop (lg:1024px) */}
          <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide snap-x">
            {featuredArtisans.length > 0 ? (
              featuredArtisans.map((art) => (
                <div key={art.id} className="min-w-[300px] md:min-w-[360px] lg:min-w-0 snap-align-start flex-shrink-0 lg:flex-shrink">
                  <div 
                    className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/50 p-5 flex flex-col h-full hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/artisan/${art.id}`)}
                  >
                    <div className="relative w-full h-[200px] rounded-2xl overflow-hidden mb-4">
                      <img src={art.photo} alt={art.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                        <IconStar className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-[13px] font-bold text-dark">{art.rating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-primary/95 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                        <span className="text-[12px] font-bold text-white uppercase tracking-wide">{art.specialty}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-[18px] font-bold text-dark mb-2">{art.name}</h3>
                      
                      <div className="flex items-center text-muted gap-1.5 text-[14px] font-medium mb-3">
                        <IconMapPin className="w-4 h-4 text-primary" />
                        <span>{art.city}, Ghana • {art.yearsActive} years experience</span>
                      </div>

                      {/* Skills Tags - Upwork style */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {art.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold text-primary bg-[#E6F3EC] px-2.5 py-1 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {art.skills.length > 4 && (
                          <span className="text-[11px] font-semibold text-muted bg-gray-100 px-2.5 py-1 rounded-md">
                            +{art.skills.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 text-[13px] font-medium text-muted mb-2">
                        <span className="flex items-center gap-1">
                          <IconStar className="w-4 h-4 text-accent fill-accent" />
                          {art.rating} ({art.reviewCount} reviews)
                        </span>
                        <span>•</span>
                        <span>{art.services.length} services</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-[12px] font-semibold text-muted leading-tight mb-0.5">Starting from</p>
                        <p className="text-[18px] font-black text-dark">GHS {art.priceFrom}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/book/${art.id}`);
                        }}
                        className="bg-primary text-white text-[14px] font-bold px-6 py-3 rounded-xl hover:bg-[#005230] hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted">
                No featured artisans found in {selectedCity} right now.
              </div>
            )}
          </div>
        </section>

        {/* Top Rated Near You */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[32px] font-heading font-black text-dark mb-2">
                Top Rated Near You
              </h2>
              <p className="text-muted font-medium">Highest rated professionals in your area</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRatedArtisans.length > 0 ? (
              topRatedArtisans.map((art) => (
                <div
                  key={art.id}
                  onClick={() => navigate(`/artisan/${art.id}`)}
                  className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/50 p-5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={art.photo}
                        alt={art.name}
                        className="w-[80px] h-[80px] rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -top-2 -right-2 bg-accent text-dark w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                        <IconStar className="w-4 h-4 fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-dark truncate mb-1">{art.name}</h3>
                      <p className="text-[14px] font-semibold text-primary capitalize mb-2">{art.specialty}</p>
                      
                      <div className="flex items-center gap-2 text-[13px] font-medium text-muted mb-3">
                        <span>{art.yearsActive} yrs exp</span>
                        <span>•</span>
                        <span>{art.reviewCount} reviews</span>
                      </div>

                      {/* Skills Tags - Upwork style */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {art.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold text-primary bg-[#E6F3EC] px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {art.skills.length > 3 && (
                          <span className="text-[10px] font-semibold text-muted bg-gray-100 px-2 py-0.5 rounded-md">
                            +{art.skills.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[16px] font-black text-dark">
                          GHS {art.priceFrom}
                        </span>
                        <span className="text-[13px] font-bold text-primary flex items-center group-hover:underline">
                          View <IconChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted">
                No artisans found near you in {selectedCity}.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
