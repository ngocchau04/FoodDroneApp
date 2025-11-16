import React, { createContext, useContext, useMemo, useState } from 'react';
import { MenuItem } from '../types/api';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartContextValue {
  restaurantId: number | null;
  items: CartItem[];
  totalAmount: number;
  addToCart: (restaurantId: number, menuItem: MenuItem) => void;
  removeFromCart: (menuItemId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    [items],
  );

  const addToCart = (restId: number, menuItem: MenuItem) => {
    // Nếu giỏ đang trống → set restaurantId
    if (!restaurantId) {
      setRestaurantId(restId);
    }

    // Nếu giỏ đang thuộc cửa hàng khác → reset giỏ
    if (restaurantId && restaurantId !== restId) {
      setItems([]);
      setRestaurantId(restId);
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: number) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
  };

  return (
    <CartContext.Provider
      value={{ restaurantId, items, totalAmount, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
