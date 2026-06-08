import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { IconSearch, IconStar, IconMapPin, IconX, IconScissors } from '@tabler/icons-react';

export const SearchPage: React.FC = () => {
  const { artisans, searchFilter, setSearchFilter, searchQuery, setSearchQuery, selectedCity } = useApp();
  const navigate = useNavigate();

  const [textQuery, setTextQuery] = useState(searchQuery);
  const [expandedPhoto, setExpandedPhoto] = useState<{ artisanId: string; photoIndex: number } | null>(null);

  const chips = [
    'All',
    'Near Me',
    'Top Rated',
    'Haircut',
    'Braids',
    'Locs',
    'Beard',
    'Relaxer',
    'Weave'
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setTextQuery('');
    setSearchQuery('');
  };

  const handleClearFilters = () => {
    setSearchFilter('All');
    setTextQuery('');
    setSearchQuery('');
  };

  const filteredArtisans = useMemo(() => {
    return artisans.filter((art) => {
      if (textQuery.trim() !== '') {
        const query = textQuery.toLowerCase();
        const matchesName = art.name.toLowerCase().includes(query);
        const matchesSpecialty = art.specialty.toLowerCase().includes(query);
        const matchesCity = art.city.toLowerCase().includes(query);
        const matchesServices = art.services.some(
          (s) => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesSpecialty && !matchesCity && !matchesServices) {
          return false;
        }
      }

      if (searchFilter === 'All') {
        return true;
      }
      if (searchFilter === 'Near Me') {
        return art.city === selectedCity;
      }
      if (searchFilter === 'Top Rated') {
        return art.rating >= 4.8;
      }

      const filterLower = searchFilter.toLowerCase();
      const matchesSpecialty = art.specialty.toLowerCase().includes(filterLower);
      const matchesServices = art.services.some((s) => s.name.toLowerCase().includes(filterLower));
      
      if (filterLower === 'beard') {
        return matchesSpecialty || art.services.some((s) => s.name.toLowerCase().includes('beard'));
      }

      return matchesSpecialty || matchesServices;
    });
  }, [artisans, searchFilter, textQuery, selectedCity]);

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20">
      {/* Page Header Section */}
      <div className="bg-white pt-8 pb-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-[32px] font-extrabold text-[#1A1A1A] mb-2">
            Find Your Artisan
          </h1>
          <p className="text-[15px] text-gray-500 mb-6">
            Browse talented barbers and hair dressers across Ghana. See their work, then book.
          </p>
          
          <div className="relative flex items-center w-full max-w-[700px]">
            <IconSearch className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, service or city…"
              value={textQuery}
              onChange={handleSearchChange}
              className="w-full h-[56px] rounded-[12px] border-2 border-[#E0E0E0] pl-12 pr-12 bg-white text-[#1A1A1A] text-[15px] focus:outline-none focus:border-[#006B3F] font-sans transition"
            />
            {textQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 text-gray-400 hover:text-gray-600 transition p-1"
              >
                <IconX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 bg-white border-b border-[#F0F0F0] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto py-3 scrollbar-hide">
            {chips.map((chip) => {
              const isActive = searchFilter === chip;
              return (
                <button
                  key={chip}
                  onClick={() => setSearchFilter(chip)}
                  className={`h-[38px] px-4 rounded-[20px] text-[13px] font-semibold transition duration-150 flex-shrink-0 ${
                    isActive
                      ? 'bg-[#006B3F] text-white border-none'
                      : 'bg-white text-[#1A1A1A] border-[1.5px] border-[#E0E0E0] hover:border-gray-300'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
          <div className="pb-3">
            <span className="text-[13px] text-gray-500 font-medium">
              Showing {filteredArtisans.length} artisans
            </span>
          </div>
        </div>
      </div>

      {/* Artisan Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredArtisans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtisans.map((art) => {
              const isExpanded = expandedPhoto?.artisanId === art.id;
              const expandedIndex = expandedPhoto?.photoIndex ?? 0;

              return (
                <div
                  key={art.id}
                  className="bg-white rounded-[14px] border border-[#F0F0F0] overflow-hidden hover:border-[#006B3F] hover:border-[1.5px] hover:shadow-lg hover:-translate-y-1 transition-all duration-150"
                >
                  {/* Gallery Strip */}
                  <div className="relative h-[180px] flex">
                    {art.galleryPhotos.map((photo, index) => (
                      <div
                        key={index}
                        className={`flex-1 overflow-hidden cursor-pointer transition-all duration-200 ${
                          isExpanded && expandedIndex === index ? 'flex-[3]' : 'flex-1'
                        }`}
                        onClick={() => {
                          if (isExpanded && expandedIndex === index) {
                            setExpandedPhoto(null);
                          } else {
                            setExpandedPhoto({ artisanId: art.id, photoIndex: index });
                          }
                        }}
                      >
                        <img
                          src={photo}
                          alt={`${art.name} work ${index + 1}`}
                          className={`w-full h-full object-cover object-center-top ${
                            index === 0 ? 'rounded-l-[14px]' : index === 2 ? 'rounded-r-[14px]' : ''
                          }`}
                        />
                      </div>
                    ))}
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md">
                      <span className="text-white text-[11px] font-bold">📸 3 photos</span>
                    </div>
                  </div>

                  {/* Artisan Identity Row */}
                  <div className="px-4 pt-3.5">
                    <div className="flex items-start gap-3">
                      <img
                        src={art.photo}
                        alt={art.name}
                        className="w-[52px] h-[52px] rounded-full object-cover object-center-top border-2 border-[#006B3F] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[16px] font-bold text-[#1A1A1A] truncate">
                            {art.name}
                          </h3>
                          <span className="text-[11px] font-bold text-[#006B3F] bg-[#E8F5EF] px-2 py-0.5 rounded-md uppercase flex-shrink-0">
                            {art.specialty}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 text-[13px]">
                          <IconMapPin className="w-4 h-4 text-[#006B3F] mr-1" />
                          <span>{art.city} • {art.yearsActive} years active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services Chips Row */}
                  <div className="px-4 py-2">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {art.services.slice(0, 3).map((s) => (
                        <span
                          key={s.id}
                          className="text-[12px] font-medium text-[#555] bg-[#F5F5F5] px-2.5 py-1 rounded-[6px] flex-shrink-0"
                        >
                          {s.name}
                        </span>
                      ))}
                      {art.services.length > 3 && (
                        <span className="text-[12px] font-medium text-[#555] bg-[#F5F5F5] px-2.5 py-1 rounded-[6px] flex-shrink-0">
                          +{art.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating Row */}
                  <div className="px-4 py-1">
                    <div className="flex items-center text-[13px]">
                      <IconStar className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-bold text-[#1A1A1A]">{art.rating}</span>
                      <span className="text-gray-500 ml-1">({art.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Price and Action Row */}
                  <div className="px-4 py-3 border-t border-[#F5F5F5] mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[12px] text-gray-500 font-medium">From</span>
                      <div className="text-[18px] font-extrabold text-[#006B3F]">
                        GHS {art.priceFrom}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/book/${art.id}`)}
                        className="bg-[#006B3F] text-white font-bold h-[40px] px-5 rounded-[8px] hover:bg-[#005230] transition duration-200"
                      >
                        Book Now
                      </button>
                      <button
                        onClick={() => navigate(`/artisan/${art.id}`)}
                        className="bg-white text-[#006B3F] font-semibold h-[40px] px-4 rounded-[8px] border-[1.5px] border-[#006B3F] hover:bg-[#E8F5EF] transition duration-200"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4">
              <IconScissors className="w-12 h-12 text-[#006B3F]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-2">
              No artisans found
            </h3>
            <p className="text-gray-500 mb-6">
              Try a different service or remove filters
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-white text-[#006B3F] font-semibold h-[48px] px-6 rounded-[8px] border-[1.5px] border-[#006B3F] hover:bg-[#E8F5EF] transition duration-200"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
