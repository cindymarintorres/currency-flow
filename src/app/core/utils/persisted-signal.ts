// core/utils/persisted-signal.ts
import { signal, effect, WritableSignal } from '@angular/core';

export function persistedSignal<T>(key: string, initialValue: T): WritableSignal<T> {
  const state = signal<T>(readFromStorage(key, initialValue));

  effect(() => {
    writeToStorage(key, state());
  });

  return state;
}

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // localStorage no disponible (modo incógnito, cuota excedida, etc.)
    console.warn(`[persistedSignal] No se pudo escribir en localStorage (key: ${key})`, e);
  }
}
