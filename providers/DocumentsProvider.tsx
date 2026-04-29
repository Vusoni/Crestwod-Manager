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
  addDocument as addDocumentData,
  deleteDocument as deleteDocumentData,
  getDocuments,
  updateDocument as updateDocumentData,
  type NewDocumentInput,
} from '@/lib/data/documents';
import type { Document, DocumentFilter } from '@/types/business';

interface State {
  loaded: boolean;
  documents: Document[];
  filter: DocumentFilter;
  investorMode: boolean;
}

type Action =
  | { type: 'hydrate'; payload: Document[] }
  | { type: 'filter/set'; payload: DocumentFilter }
  | { type: 'investor/toggle' }
  | { type: 'doc/add'; payload: Document }
  | { type: 'doc/update'; payload: Document }
  | { type: 'doc/delete'; payload: string };

const initialState: State = {
  loaded: false,
  documents: [],
  filter: 'all',
  investorMode: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, loaded: true, documents: action.payload };
    case 'filter/set':
      return { ...state, filter: action.payload };
    case 'investor/toggle':
      return { ...state, investorMode: !state.investorMode };
    case 'doc/add':
      return { ...state, documents: [action.payload, ...state.documents] };
    case 'doc/update':
      return {
        ...state,
        documents: state.documents.map((d) => (d.id === action.payload.id ? action.payload : d)),
      };
    case 'doc/delete':
      return { ...state, documents: state.documents.filter((d) => d.id !== action.payload) };
  }
}

interface DocumentsContextValue extends State {
  setFilter: (filter: DocumentFilter) => void;
  toggleInvestorMode: () => void;
  addDocument: (input: NewDocumentInput) => Promise<Document>;
  updateDocument: (
    id: string,
    patch: Partial<Omit<Document, 'id' | 'createdAt'>>,
  ) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentById: (id: string) => Document | undefined;
}

const DocumentsContext = createContext<DocumentsContextValue | null>(null);

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const docs = await getDocuments();
      if (!cancelled) dispatch({ type: 'hydrate', payload: docs });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setFilter = useCallback((filter: DocumentFilter) => {
    dispatch({ type: 'filter/set', payload: filter });
  }, []);

  const toggleInvestorMode = useCallback(() => {
    dispatch({ type: 'investor/toggle' });
  }, []);

  const addDocument = useCallback(async (input: NewDocumentInput) => {
    const next = await addDocumentData(input);
    dispatch({ type: 'doc/add', payload: next });
    return next;
  }, []);

  const updateDocument = useCallback(
    async (id: string, patch: Partial<Omit<Document, 'id' | 'createdAt'>>) => {
      const next = await updateDocumentData(id, patch);
      dispatch({ type: 'doc/update', payload: next });
      return next;
    },
    [],
  );

  const deleteDocument = useCallback(async (id: string) => {
    await deleteDocumentData(id);
    dispatch({ type: 'doc/delete', payload: id });
  }, []);

  const getDocumentByIdFromState = useCallback(
    (id: string) => state.documents.find((d) => d.id === id),
    [state.documents],
  );

  const value = useMemo<DocumentsContextValue>(
    () => ({
      ...state,
      setFilter,
      toggleInvestorMode,
      addDocument,
      updateDocument,
      deleteDocument,
      getDocumentById: getDocumentByIdFromState,
    }),
    [state, setFilter, toggleInvestorMode, addDocument, updateDocument, deleteDocument, getDocumentByIdFromState],
  );

  return <DocumentsContext.Provider value={value}>{children}</DocumentsContext.Provider>;
}

export function useDocuments(): DocumentsContextValue {
  const ctx = useContext(DocumentsContext);
  if (!ctx) throw new Error('useDocuments must be used inside DocumentsProvider');
  return ctx;
}
