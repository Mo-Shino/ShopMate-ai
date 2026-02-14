import { create } from 'zustand';

export interface Product {
    id: string;
    name: string;
    price?: number; // Price is now optional
    category: string;
    image?: string;
    barcode?: string; // Barcode is now optional
}

export interface CartItem extends Product {
    quantity: number;
    checked?: boolean; // New property for checklist
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    toggleItemCheck: (productId: string) => void;
    updateItem: (productId: string, updates: Partial<CartItem>) => void; // New action for editing
    clearCart: () => void;
    total: number;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: [],
    total: 0,
    addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            set({
                cart: cart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            });
        } else {
            // Initialize checked as false
            set({ cart: [...cart, { ...product, quantity: 1, checked: false }] });
        }
        // Recalculate total (only for items with price)
        const newCart = get().cart;
        set({ total: newCart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0) });
    },
    removeFromCart: (productId) => {
        set((state) => ({
            cart: state.cart.filter((item) => item.id !== productId),
        }));
        const newCart = get().cart;
        set({ total: newCart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0) });
    },
    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
        }
        set((state) => ({
            cart: state.cart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            ),
        }));
        const newCart = get().cart;
        set({ total: newCart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0) });
    },
    toggleItemCheck: (productId) => {
        set((state) => ({
            cart: state.cart.map((item) =>
                item.id === productId ? { ...item, checked: !item.checked } : item
            ),
        }));
    },
    updateItem: (productId, updates) => {
        set((state) => ({
            cart: state.cart.map((item) =>
                item.id === productId ? { ...item, ...updates } : item
            )
        }));
        // Recalculate total
        const newCart = get().cart;
        set({ total: newCart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0) });
    },
    clearCart: () => set({ cart: [], total: 0 }),
}));
