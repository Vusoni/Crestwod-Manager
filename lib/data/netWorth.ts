import type {
  Asset,
  Business,
  Liability,
  NetWorthSnapshot,
  Profile,
} from '@/types/netWorth';
import {
  SEED_ASSETS,
  SEED_BUSINESSES,
  SEED_LIABILITIES,
  SEED_PROFILE,
  SEED_SNAPSHOTS,
} from '@/lib/mock/seedNetWorth';

const businesses: Business[] = [...SEED_BUSINESSES];
const assets: Asset[] = [...SEED_ASSETS];
const liabilities: Liability[] = [...SEED_LIABILITIES];
const snapshots: NetWorthSnapshot[] = [...SEED_SNAPSHOTS];
const profile: Profile = { ...SEED_PROFILE };

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

export async function getBusinesses(): Promise<Business[]> {
  await tick();
  return businesses.slice();
}

export async function getAssets(): Promise<Asset[]> {
  await tick();
  return assets.slice();
}

export async function getLiabilities(): Promise<Liability[]> {
  await tick();
  return liabilities.slice();
}

export async function getSnapshots(): Promise<NetWorthSnapshot[]> {
  await tick();
  return snapshots.slice();
}

export async function getProfile(): Promise<Profile> {
  await tick();
  return { ...profile };
}

export async function updateAssetValue(id: string, value: number): Promise<Asset> {
  await tick();
  const idx = assets.findIndex((a) => a.id === id);
  if (idx < 0) throw new Error(`Asset not found: ${id}`);
  const current = assets[idx];
  if (!current) throw new Error(`Asset not found: ${id}`);
  const next: Asset = { ...current, value };
  assets[idx] = next;
  return next;
}

export async function updateLiabilityValue(id: string, value: number): Promise<Liability> {
  await tick();
  const idx = liabilities.findIndex((l) => l.id === id);
  if (idx < 0) throw new Error(`Liability not found: ${id}`);
  const current = liabilities[idx];
  if (!current) throw new Error(`Liability not found: ${id}`);
  const next: Liability = { ...current, value };
  liabilities[idx] = next;
  return next;
}
