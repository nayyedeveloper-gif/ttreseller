
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Product } from '../types';
import { v4 as uuidv4 } from 'uuid';

const mockProducts: Product[] = [
    { id: 'p1', name: 'Premium Beauty Cream', sku: 'BC-001', stock: 50, price: 15000, imageUrl: 'https://picsum.photos/id/1060/400/400' },
    { id: 'p2', name: 'Summer T-Shirt', sku: 'TS-003', stock: 120, price: 8000, imageUrl: 'https://picsum.photos/id/1080/400/400' },
    { id: 'p3', name: 'Luxury Handbag', sku: 'HB-002', stock: 3, price: 25000, imageUrl: 'https://picsum.photos/id/1025/400/400' },
    { id: 'p4', name: 'Gourmet Snack Box', sku: 'SB-005', stock: 75, price: 12000, imageUrl: 'https://picsum.photos/id/102/400/400' },
    { id: 'p5', name: 'iPhone 15 Pro Case', sku: 'PC-015', stock: 0, price: 5000, imageUrl: 'https://picsum.photos/id/250/400/400' },
];

type ProductState = {
  products: Product[];
};

type ProductActions = {
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, updatedData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
};

export const useProductStore = create<ProductState & ProductActions>()(
  immer((set) => ({
    products: mockProducts,

    addProduct: (productData) =>
      set((state) => {
        const newProduct: Product = {
          id: uuidv4(),
          ...productData,
        };
        state.products.unshift(newProduct);
      }),

    updateProduct: (productId, updatedData) =>
      set((state) => {
        const productIndex = state.products.findIndex((p) => p.id === productId);
        if (productIndex !== -1) {
          state.products[productIndex] = { ...state.products[productIndex], ...updatedData };
        }
      }),

    deleteProduct: (productId) =>
      set((state) => {
        state.products = state.products.filter((p) => p.id !== productId);
      }),
  }))
);