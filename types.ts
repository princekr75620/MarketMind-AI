
export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number | 'Custom';
  interval: string;
  features: string[];
  description: string;
}

export interface CartItem extends Plan {
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  campaignName: string;
  channel: 'Email' | 'Ads' | 'Social' | 'Direct';
  spend: number;
  leads: number;
  conversions: number;
  revenue: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
