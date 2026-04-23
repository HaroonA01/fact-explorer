import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY = '@factexplorer/favorite_categories';

export function useFavoriteCategories() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) {
        try {
          const arr = JSON.parse(raw) as string[];
          setFavorites(new Set(arr));
        } catch {
          // ignore malformed
        }
      }
      setLoaded(true);
    });
  }, []);

  const save = useCallback(async (ids: Set<string>) => {
    setFavorites(new Set(ids));
    await AsyncStorage.setItem(KEY, JSON.stringify(Array.from(ids)));
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(favorites);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      save(next);
    },
    [favorites, save],
  );

  return { favorites, loaded, save, toggle };
}
