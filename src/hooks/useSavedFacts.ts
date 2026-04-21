import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@factexplorer/saved';

export function useSavedFacts() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setSavedIds(new Set(JSON.parse(raw) as string[]));
        } catch {
          // ignore corrupt data
        }
      }
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((next: Set<string>) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  }, []);

  const toggle = useCallback(
    (factId: string) => {
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (next.has(factId)) {
          next.delete(factId);
        } else {
          next.add(factId);
        }
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isSaved = useCallback((factId: string) => savedIds.has(factId), [savedIds]);

  return { savedIds, isSaved, toggle, loaded };
}
