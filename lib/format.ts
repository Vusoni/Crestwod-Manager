import type { Currency } from '@/types/netWorth';

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PLN: 'zł',
};

export function formatCurrency(
  amount: number,
  currency: Currency = 'USD',
  options: { compact?: boolean; showSign?: boolean } = {},
): string {
  const { compact = false, showSign = false } = options;
  const symbol = CURRENCY_SYMBOL[currency];
  const sign = amount > 0 && showSign ? '+' : amount < 0 ? '-' : '';
  const abs = Math.abs(amount);

  if (compact) {
    if (abs >= 1_000_000) return `${sign}${symbol}${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 10_000) return `${sign}${symbol}${(abs / 1_000).toFixed(1)}K`;
  }
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: abs < 100 ? 2 : 0,
  }).format(abs);
  return `${sign}${symbol}${formatted}`;
}

export function formatPercent(value: number, options: { showSign?: boolean } = {}): string {
  const { showSign = true } = options;
  const sign = value > 0 && showSign ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDateRelative(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const day = 24 * 60 * 60 * 1000;
  const days = Math.floor(diffMs / day);

  if (days < 1) return 'Today';
  if (days < 2) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateLong(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    const first = parts[0];
    return (first?.slice(0, 2) ?? '?').toUpperCase();
  }
  const a = parts[0]?.[0] ?? '';
  const b = parts[parts.length - 1]?.[0] ?? '';
  return `${a}${b}`.toUpperCase();
}
