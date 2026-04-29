export type Currency = 'USD' | 'EUR' | 'GBP' | 'PLN';

export type BusinessStatus = 'growing' | 'stable' | 'declining';

export type AssetCategory = 'cash' | 'investments' | 'property' | 'other';
export type LiabilityCategory = 'loans' | 'subscriptions' | 'other';

export interface Business {
  id: string;
  name: string;
  monthlyRevenue: number;
  currency: Currency;
  status: BusinessStatus;
  createdAt: string;
}

export interface Asset {
  id: string;
  category: AssetCategory;
  name: string;
  value: number;
  currency: Currency;
}

export interface Liability {
  id: string;
  category: LiabilityCategory;
  name: string;
  value: number;
  currency: Currency;
}

export interface NetWorthSnapshot {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  memberSince: string;
  avatarUrl?: string;
  isPremium: boolean;
}
