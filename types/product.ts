export interface Price {
  primaryText: string;
  secondaryText?: string;
}

export interface PricingItem {
  primaryText: string;
  secondaryText?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: Price;
  priceAnnual?: Price;
  recommendedText?: string;
  buttonText: string;
  buttonUrl?: string;
  items: PricingItem[];
  everythingFrom?: string;
} 