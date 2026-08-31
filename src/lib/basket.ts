import { useEffect, useState } from "react";

export type SavedBasketLine = {
  key: string;
  label: string;
  qty: number;
  price: number;
  from?: boolean;
};

export type SavedBasket = {
  lines: SavedBasketLine[];
  addons: { key: string; label: string; price: number }[];
  totalItems: number;
  totalPrice: number;
  isFrom: boolean;
  updatedAt: number;
};

const STORAGE_KEY = "ll_basket_v1";
const EVENT = "ll-basket-change";

export function saveBasket(basket: SavedBasket | null) {
  if (typeof window === "undefined") return;
  try {
    if (!basket || basket.totalItems === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
    }
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* storage unavailable — basket stays session-only */
  }
}

export function readBasket(): SavedBasket | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedBasket;
    if (!parsed || !Array.isArray(parsed.lines) || parsed.totalItems <= 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Hydration-safe read of the saved basket, kept in sync across tabs and pages. */
export function useSavedBasket() {
  const [basket, setBasket] = useState<SavedBasket | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setBasket(readBasket());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { basket, ready };
}
