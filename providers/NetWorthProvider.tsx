import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import {
  getAssets,
  getBusinesses,
  getLiabilities,
  getProfile,
  getSnapshots,
  updateAssetValue,
  updateLiabilityValue,
} from '@/lib/data/netWorth';
import type {
  Asset,
  Business,
  Liability,
  NetWorthSnapshot,
  Profile,
} from '@/types/netWorth';

interface State {
  loaded: boolean;
  businesses: Business[];
  assets: Asset[];
  liabilities: Liability[];
  snapshots: NetWorthSnapshot[];
  profile: Profile | null;
}

type Action =
  | {
      type: 'hydrate';
      payload: Omit<State, 'loaded'>;
    }
  | { type: 'asset/update'; payload: Asset }
  | { type: 'liability/update'; payload: Liability };

const initialState: State = {
  loaded: false,
  businesses: [],
  assets: [],
  liabilities: [],
  snapshots: [],
  profile: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...action.payload, loaded: true };
    case 'asset/update':
      return {
        ...state,
        assets: state.assets.map((a) => (a.id === action.payload.id ? action.payload : a)),
      };
    case 'liability/update':
      return {
        ...state,
        liabilities: state.liabilities.map((l) =>
          l.id === action.payload.id ? action.payload : l,
        ),
      };
  }
}

interface Derived {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  netWorthPrev: number;
  netWorthDelta: number;
  netWorthDeltaPct: number;
}

interface NetWorthContextValue extends State, Derived {
  setAssetValue: (id: string, value: number) => Promise<void>;
  setLiabilityValue: (id: string, value: number) => Promise<void>;
}

const NetWorthContext = createContext<NetWorthContextValue | null>(null);

export function NetWorthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [businesses, assets, liabilities, snapshots, profile] = await Promise.all([
        getBusinesses(),
        getAssets(),
        getLiabilities(),
        getSnapshots(),
        getProfile(),
      ]);
      if (cancelled) return;
      dispatch({
        type: 'hydrate',
        payload: { businesses, assets, liabilities, snapshots, profile },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setAssetValue = useCallback(async (id: string, value: number) => {
    const updated = await updateAssetValue(id, value);
    dispatch({ type: 'asset/update', payload: updated });
  }, []);

  const setLiabilityValue = useCallback(async (id: string, value: number) => {
    const updated = await updateLiabilityValue(id, value);
    dispatch({ type: 'liability/update', payload: updated });
  }, []);

  const derived = useMemo<Derived>(() => {
    const totalAssets = state.assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = state.liabilities.reduce((sum, l) => sum + l.value, 0);
    const netWorth = totalAssets - totalLiabilities;
    const lastSnapshot = state.snapshots[state.snapshots.length - 2];
    const netWorthPrev = lastSnapshot?.netWorth ?? netWorth;
    const netWorthDelta = netWorth - netWorthPrev;
    const netWorthDeltaPct =
      netWorthPrev === 0 ? 0 : (netWorthDelta / netWorthPrev) * 100;
    return { totalAssets, totalLiabilities, netWorth, netWorthPrev, netWorthDelta, netWorthDeltaPct };
  }, [state.assets, state.liabilities, state.snapshots]);

  const value = useMemo<NetWorthContextValue>(
    () => ({ ...state, ...derived, setAssetValue, setLiabilityValue }),
    [state, derived, setAssetValue, setLiabilityValue],
  );

  return <NetWorthContext.Provider value={value}>{children}</NetWorthContext.Provider>;
}

export function useNetWorth(): NetWorthContextValue {
  const ctx = useContext(NetWorthContext);
  if (!ctx) throw new Error('useNetWorth must be used inside NetWorthProvider');
  return ctx;
}
