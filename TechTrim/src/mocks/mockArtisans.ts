export interface Service {
  id: string;
  name: string;
  durationMins: number;
  priceGHS: number;
  description: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Artisan {
  id: string;
  name: string;
  city: 'Accra' | 'Kumasi' | 'Takoradi' | 'Tamale' | 'Cape Coast';
  specialty: string;
  rating: number;
  reviewCount: number;
  yearsActive: number;
  priceFrom: number;
  photo: string;
  services: Service[];
  portfolio: string[];
  galleryPhotos: string[];
  reviews: Review[];
  skills: string[];
}

export const mockArtisans: Artisan[] = [
  {
    id: "art-1",
    name: "Kwesi Mensah",
    city: "Accra",
    specialty: "Barber",
    rating: 4.9,
    reviewCount: 120,
    yearsActive: 8,
    priceFrom: 50,
    photo: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=800&fit=crop&q=80",
    galleryPhotos: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"
    ],
    services: [
      { id: "ser-1", name: "Premium Fade", durationMins: 30, priceGHS: 50, description: "Classic fade or tapers with custom razor finish." },
      { id: "ser-2", name: "Beard Trim & Oil", durationMins: 20, priceGHS: 30, description: "Precise shaping with hot towel treatment and organic oils." },
      { id: "ser-3", name: "Haircut & Beard Deluxe", durationMins: 50, priceGHS: 75, description: "Full premium haircut + beard grooming + black mask." }
    ],
    // Barber portfolio: fades, lineups, beard trims
    portfolio: [
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=400&h=400&fit=crop&auto=format"
    ],
    reviews: [
      { id: "rev-1", reviewerName: "Kojo Boateng", rating: 5, date: "2026-06-01", comment: "The sharpest line-up in Accra. Hands down!" },
      { id: "rev-2", reviewerName: "Emmanuel Osei", rating: 4.8, date: "2026-05-28", comment: "Very professional, clean tools, and nice vibe." }
    ],
    skills: ["Fade Cuts", "Beard Trimming", "Line-ups", "Hot Towel Shave", "Classic Haircuts", "Razor Finish", "Hair Design", "Grooming Services"]
  },
  {
    id: "art-2",
    name: "Ama Serwaa",
    city: "Kumasi",
    specialty: "Hair dresser",
    rating: 4.8,
    reviewCount: 95,
    yearsActive: 5,
    priceFrom: 80,
    photo: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=800&fit=crop&q=80",
    galleryPhotos: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop"
    ],
    services: [
      { id: "ser-4", name: "Box Braids", durationMins: 180, priceGHS: 150, description: "Neat, uniform box braids. Extension packs excluded." },
      { id: "ser-5", name: "Ghana Weaving", durationMins: 120, priceGHS: 100, description: "Traditional cornrow patterns with flawless parting." },
      { id: "ser-6", name: "Hair Relaxing & Styling", durationMins: 90, priceGHS: 80, description: "Quality relaxer application, deep conditioning and flat iron." }
    ],
    // Hair dresser portfolio: box braids, cornrows, weaving
    portfolio: [
      "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1614093302611-8efc4c41c50c?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=400&h=400&fit=crop&auto=format"
    ],
    reviews: [
      { id: "rev-3", reviewerName: "Abena Mansa", rating: 5, date: "2026-05-30", comment: "Ama is so fast and the parting is absolutely perfect!" },
      { id: "rev-4", reviewerName: "Gifty Arthur", rating: 4.5, date: "2026-05-15", comment: "Very satisfied with my box braids, received many compliments!" }
    ],
    skills: ["Box Braids", "Ghana Weaving", "Cornrows", "Hair Relaxing", "Natural Hair Styling", "Braiding Techniques", "Hair Treatment", "Protective Styles"]
  },
  {
    id: "art-3",
    name: "Yaw Owusu",
    city: "Accra",
    specialty: "Barber",
    rating: 4.7,
    reviewCount: 80,
    yearsActive: 6,
    priceFrom: 40,
    photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=800&fit=crop&q=80",
    galleryPhotos: [
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&h=300&fit=crop"
    ],
    services: [
      { id: "ser-7", name: "Basic Haircut", durationMins: 20, priceGHS: 40, description: "Simple trim or low-cut without beard work." },
      { id: "ser-8", name: "Beard Shave (Smooth)", durationMins: 15, priceGHS: 25, description: "Clean shave using premium shaving soap and safety razor." },
      { id: "ser-9", name: "Children's Cut", durationMins: 20, priceGHS: 30, description: "Gentle haircut for kids under 12 years." }
    ],
    // Barber portfolio: clipper cuts, clean shaves
    portfolio: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?w=400&h=400&fit=crop&auto=format"
    ],
    reviews: [
      { id: "rev-5", reviewerName: "Fredrick Appiah", rating: 5, date: "2026-06-02", comment: "Great with kids. My son loved his haircut!" },
      { id: "rev-6", reviewerName: "Nii Lante", rating: 4, date: "2026-05-20", comment: "Good service, just had to wait a few minutes." }
    ],
    skills: ["Basic Haircuts", "Beard Shaving", "Children's Haircuts", "Clipper Cuts", "Buzz Cuts", "Clean Shaves", "Hair Lineups", "Kids Grooming"]
  },
  {
    id: "art-4",
    name: "Esi Bedu",
    city: "Takoradi",
    specialty: "Hair dresser",
    rating: 4.9,
    reviewCount: 110,
    yearsActive: 10,
    priceFrom: 90,
    photo: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&h=800&fit=crop&q=80",
    galleryPhotos: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=300&fit=crop"
    ],
    services: [
      { id: "ser-10", name: "Sisterlocks Installation", durationMins: 360, priceGHS: 450, description: "Professional loc installation. Consultant certified." },
      { id: "ser-11", name: "Loc Retwist & Style", durationMins: 120, priceGHS: 120, description: "Wash, retwist using palm roll method, and style of choice." },
      { id: "ser-12", name: "Dreadlocks Repair", durationMins: 90, priceGHS: 90, description: "Crochet hook method for interlocking and repair work." }
    ],
    // Hair dresser portfolio: dreadlocks, sisterlocks, locs
    portfolio: [
      "https://images.unsplash.com/photo-1597983073493-88cd9a72a1f6?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1609270232338-56d151fcf2a2?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&auto=format"
    ],
    reviews: [
      { id: "rev-7", reviewerName: "Sandra Mensah", rating: 5, date: "2026-06-03", comment: "The lock queen! My sisterlocks are neat and growing so well." },
      { id: "rev-8", reviewerName: "Araba Eshun", rating: 4.9, date: "2026-05-25", comment: "Clean environment and very professional consultation." }
    ],
    skills: ["Sisterlocks Installation", "Loc Retwist", "Dreadlocks Repair", "Loc Maintenance", "Crochet Method", "Hair Locking", "Natural Hair Care", "Loc Styling"]
  },
  {
    id: "art-5",
    name: "Mustapha Ali",
    city: "Tamale",
    specialty: "Barber",
    rating: 4.6,
    reviewCount: 45,
    yearsActive: 4,
    priceFrom: 35,
    photo: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&h=800&fit=crop&q=80",
    galleryPhotos: [
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=400&h=300&fit=crop"
    ],
    services: [
      { id: "ser-13", name: "Buzz Cut & Lineup", durationMins: 20, priceGHS: 35, description: "Standard single-guard cut with sharp hairline outline." },
      { id: "ser-14", name: "Beard Trim & Hot Dye", durationMins: 30, priceGHS: 40, description: "Beard lining and natural black/brown dye application." }
    ],
    // Barber portfolio: buzz cuts, lineups
    portfolio: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop&auto=format"
    ],
    reviews: [
      { id: "rev-9", reviewerName: "Iddrisu Mohammed", rating: 5, date: "2026-05-29", comment: "Best barber in Tamale! Very punctual and clean work." }
    ],
    skills: ["Buzz Cuts", "Hair Lineups", "Beard Trimming", "Beard Dyeing", "Clipper Cuts", "Fade Techniques", "Hot Towel Service", "Hair Design"]
  },
  {
    id: "art-6",
    name: "Akosua Addae",
    city: "Cape Coast",
    specialty: "Hair dresser",
    rating: 4.9,
    reviewCount: 64,
    yearsActive: 7,
    priceFrom: 70,
    photo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop&q=80",
    galleryPhotos: [
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1617634787921-f8bfdf5f4aba?w=400&h=300&fit=crop"
    ],
    services: [
      { id: "ser-15", name: "Weave-On Sew In", durationMins: 150, priceGHS: 130, description: "Full sew-in with leave-out. Hair extensions are not included." },
      { id: "ser-16", name: "Wig Cap Customization", durationMins: 90, priceGHS: 100, description: "Bleaching knots, plucking, band attachment, and styling." },
      { id: "ser-17", name: "Deep Conditioning Treatment", durationMins: 60, priceGHS: 70, description: "Steam wash, protein mask, and blow dry for natural hair." }
    ],
    // Hair dresser portfolio: weaves, wigs, natural styling
    portfolio: [
      "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&auto=format"
    ],
    reviews: [
      { id: "rev-10", reviewerName: "Maame Esi", rating: 5, date: "2026-06-02", comment: "Superb styling! My wig looks so natural." }
    ],
    skills: ["Weave Sew-ins", "Wig Customization", "Deep Conditioning", "Natural Hair Care", "Wig Installation", "Hair Treatment", "Steam Therapy", "Protective Styling"]
  },
  {
    id: "art-7",
    name: "Kofi Ansah",
    city: "Accra",
    specialty: "Barber",
    rating: 4.8,
    reviewCount: 140,
    yearsActive: 12,
    priceFrom: 60,
    photo: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800&h=800&fit=crop&q=80",
    galleryPhotos: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"
    ],
    services: [
      { id: "ser-18", name: "Executive Haircut", durationMins: 45, priceGHS: 80, description: "Signature haircut, beard outline, facial massage, and splash wash." },
      { id: "ser-19", name: "Hair Dye / Highlights", durationMins: 45, priceGHS: 60, description: "Full head color dye or trendy highlights." }
    ],
    // Barber portfolio: executive cuts, styled looks, color work
    portfolio: [
      "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1541533848490-bc8115cd6522?w=400&h=400&fit=crop&auto=format"
    ],
    reviews: [
      { id: "rev-11", reviewerName: "Prince Lamptey", rating: 5, date: "2026-05-24", comment: "Executive cut is top notch! Worth every single cedi." }
    ],
    skills: ["Executive Haircuts", "Hair Coloring", "Highlights", "Beard Styling", "Facial Massage", "Premium Cuts", "Hair Dyeing", "Luxury Grooming"]
  },
  {
    id: "art-8",
    name: "Yaa Dufie",
    city: "Kumasi",
    specialty: "Hair dresser",
    rating: 4.7,
    reviewCount: 50,
    yearsActive: 4,
    priceFrom: 60,
    photo: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=800&fit=crop&q=80",
    galleryPhotos: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop"
    ],
    services: [
      { id: "ser-20", name: "Natural Hair Twist", durationMins: 90, priceGHS: 60, description: "Finger coils or double-strand twists on short-to-medium natural hair." },
      { id: "ser-21", name: "Knotless Braids", durationMins: 240, priceGHS: 180, description: "Painless knotless braids. Small or medium size." }
    ],
    // Hair dresser portfolio: knotless braids, twists, natural styles
    portfolio: [
      "https://images.unsplash.com/photo-1619784293700-5f41e3d23a44?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&auto=format"
    ],
    reviews: [
      { id: "rev-12", reviewerName: "Mary Prempeh", rating: 4.8, date: "2026-05-19", comment: "Knotless braids look beautiful and are not tight at all." }
    ],
    skills: ["Natural Hair Twists", "Knotless Braids", "Finger Coils", "Double-strand Twists", "Natural Styling", "Braiding", "Hair Moisturizing", "Protective Styles"]
  }
];
