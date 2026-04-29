import type {
  Asset,
  Business,
  Liability,
  NetWorthSnapshot,
  Profile,
} from '@/types/netWorth';

export const SEED_PROFILE: Profile = {
  id: 'p_1',
  name: 'Oliwier Kraszewski',
  title: 'Founder',
  memberSince: '2023-08-12T00:00:00.000Z',
  isPremium: true,
};

export const SEED_BUSINESSES: Business[] = [
  {
    id: 'b_crestwod',
    name: 'Crestwod Studio',
    monthlyRevenue: 18400,
    currency: 'USD',
    status: 'growing',
    createdAt: '2023-08-12T00:00:00.000Z',
  },
  {
    id: 'b_vantmore',
    name: 'Vantmore',
    monthlyRevenue: 7250,
    currency: 'USD',
    status: 'growing',
    createdAt: '2024-04-02T00:00:00.000Z',
  },
  {
    id: 'b_letter',
    name: 'Founder Letter',
    monthlyRevenue: 1320,
    currency: 'USD',
    status: 'stable',
    createdAt: '2024-11-09T00:00:00.000Z',
  },
];

export const SEED_ASSETS: Asset[] = [
  { id: 'a_mercury', category: 'cash', name: 'Mercury operating', value: 84200, currency: 'USD' },
  { id: 'a_revolut', category: 'cash', name: 'Revolut personal', value: 12400, currency: 'USD' },
  { id: 'a_brokerage', category: 'investments', name: 'IBKR portfolio', value: 142800, currency: 'USD' },
  { id: 'a_crypto', category: 'investments', name: 'Crypto cold wallet', value: 38600, currency: 'USD' },
  { id: 'a_apt', category: 'property', name: 'Warsaw apartment', value: 285000, currency: 'USD' },
  { id: 'a_misc', category: 'other', name: 'Equipment & gear', value: 9400, currency: 'USD' },
];

export const SEED_LIABILITIES: Liability[] = [
  { id: 'l_mortgage', category: 'loans', name: 'Apartment mortgage', value: 162000, currency: 'USD' },
  { id: 'l_subs', category: 'subscriptions', name: 'Software stack', value: 1280, currency: 'USD' },
  { id: 'l_tax', category: 'other', name: 'Q2 estimated tax', value: 18400, currency: 'USD' },
];

export const SEED_SNAPSHOTS: NetWorthSnapshot[] = [
  { date: '2025-11-01', totalAssets: 510000, totalLiabilities: 192000, netWorth: 318000 },
  { date: '2025-12-01', totalAssets: 521000, totalLiabilities: 188000, netWorth: 333000 },
  { date: '2026-01-01', totalAssets: 514000, totalLiabilities: 186000, netWorth: 328000 },
  { date: '2026-02-01', totalAssets: 535000, totalLiabilities: 184000, netWorth: 351000 },
  { date: '2026-03-01', totalAssets: 558000, totalLiabilities: 183000, netWorth: 375000 },
  { date: '2026-04-01', totalAssets: 572400, totalLiabilities: 181680, netWorth: 390720 },
];
