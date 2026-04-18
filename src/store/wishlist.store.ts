import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (slug: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.slug === item.slug);
          return {
            items: exists
              ? state.items.filter((i) => i.slug !== item.slug)
              : [...state.items, item],
          };
        }),
      isWishlisted: (slug) => get().items.some((i) => i.slug === slug),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: "byredo-wishlist" }
  )
);
