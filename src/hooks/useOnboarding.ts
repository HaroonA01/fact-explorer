import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY = '@factexplorer/onboarded';

type State = 'unknown' | 'pending' | 'completed';

let current: State = 'unknown';
let hydrated = false;
const listeners = new Set<(s: State) => void>();

function setCurrent(next: State) {
  if (current === next) return;
  current = next;
  listeners.forEach((l) => l(next));
}

async function hydrate() {
  if (hydrated) return;
  hydrated = true;
  const v = await AsyncStorage.getItem(KEY);
  setCurrent(v === '1' ? 'completed' : 'pending');
}

export function useOnboarding() {
  const [state, setState] = useState<State>(current);

  useEffect(() => {
    const listener = (s: State) => setState(s);
    listeners.add(listener);
    setState(current);
    hydrate();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const complete = useCallback(async () => {
    await AsyncStorage.setItem(KEY, '1');
    setCurrent('completed');
  }, []);

  const reset = useCallback(async () => {
    await AsyncStorage.removeItem(KEY);
    setCurrent('pending');
  }, []);

  return { state, complete, reset };
}
