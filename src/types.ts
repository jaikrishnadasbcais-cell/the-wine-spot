export interface Wine {
  id: string;
  brand: string;
  name: string;
  price: number;
  desc: string;
  image?: string;
  category: 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'NOLO' | 'Blend';
  aroma: string;
  palate: string;
}

export interface TastingExperience {
  id: string;
  name: string;
  price: number;
  duration: string;
  pours: string;
  tour: string;
  desc: string;
  image?: string;
  highlights: string[];
}

export type CartItemType = 'wine' | 'experience';

export interface CartItem {
  id: string; // wine id or experience booking id
  name: string;
  price: number;
  brand?: string;
  quantity: number;
  type: CartItemType;
  // Specific for experience bookings
  date?: string;
  time?: string;
  guests?: number;
}

export interface B2BInquiry {
  company: string;
  contact: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}
