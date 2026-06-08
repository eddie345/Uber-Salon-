export interface ServiceCategory {
  id: string;
  name: string;
  icon: string; // Key to map to a Tabler icon
  description: string;
  durationMins: number;
  priceGHS: number;
}

export const mockServices: ServiceCategory[] = [
  {
    id: "sc-1",
    name: "Haircut",
    icon: "Scissors",
    description: "Professional cuts, fades, and trims for all hair types.",
    durationMins: 30,
    priceGHS: 50
  },
  {
    id: "sc-2",
    name: "Braids",
    icon: "Braids",
    description: "Knotless, box braids, cornrows, and twists styled to perfection.",
    durationMins: 180,
    priceGHS: 150
  },
  {
    id: "sc-3",
    name: "Locs",
    icon: "Locs",
    description: "Installation, interlocking, retwists, and repairs for locs.",
    durationMins: 120,
    priceGHS: 120
  },
  {
    id: "sc-4",
    name: "Beard Trim",
    icon: "Beard",
    description: "Precise beard grooming, shaping, hot towels, and premium oiling.",
    durationMins: 20,
    priceGHS: 30
  },
  {
    id: "sc-5",
    name: "Relaxer",
    icon: "Relaxer",
    description: "Quality relaxing treatment, deep wash, conditioning, and flat iron.",
    durationMins: 90,
    priceGHS: 80
  },
  {
    id: "sc-6",
    name: "Weave",
    icon: "Weave",
    description: "Flawless hair weave sew-ins, wig installations, and customizations.",
    durationMins: 150,
    priceGHS: 130
  }
];
