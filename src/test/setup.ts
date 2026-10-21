import { transferableAbortController } from "node:util";
import "@testing-library/jest-dom/vitest";

// Node exposes an incomplete global localStorage in some versions; provide the browser contract.
const values = new Map<string, string>();
Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, String(value)),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() { return values.size; },
  },
});

// Keep Request and AbortSignal in Node's realm when React Router uses native fetch objects.
const nativeController = transferableAbortController();
Object.defineProperty(globalThis, "AbortController", { configurable: true, writable: true, value: nativeController.constructor });
Object.defineProperty(globalThis, "AbortSignal", { configurable: true, writable: true, value: nativeController.signal.constructor });
