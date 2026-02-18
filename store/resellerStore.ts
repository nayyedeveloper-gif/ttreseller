import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Reseller } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentTenant } from '../utils';

const mockResellers: Reseller[] = [
  { id: 'r1', name: 'Reseller A', totalSales: 550000, commissionRate: 0.10, commissionEarned: 55000, avatarUrl: 'https://picsum.photos/id/237/100/100', tenantId: 'default' },
  { id: 'r2', name: 'Reseller B', totalSales: 320000, commissionRate: 0.12, commissionEarned: 38400, avatarUrl: 'https://picsum.photos/id/238/100/100', tenantId: 'default' },
  { id: 'r3', name: 'Reseller C', totalSales: 780000, commissionRate: 0.10, commissionEarned: 78000, avatarUrl: 'https://picsum.photos/id/239/100/100', tenantId: 'default' },
  { id: 'r4', name: 'Reseller D', totalSales: 150000, commissionRate: 0.15, commissionEarned: 22500, avatarUrl: 'https://picsum.photos/id/240/100/100', tenantId: 'default' },
];

type ResellerState = {
  resellers: Reseller[];
};

type ResellerActions = {
  addReseller: (resellerData: Omit<Reseller, 'id' | 'tenantId'>) => void;
  updateReseller: (resellerId: string, updatedData: Partial<Reseller>) => void;
  deleteReseller: (resellerId: string) => void;
  calculateCommissions: () => void; // To recalculate based on orders
};

export const useResellerStore = create<ResellerState & ResellerActions>()(
  immer((set, get) => ({
    resellers: mockResellers,

    addReseller: (resellerData) =>
      set((state) => {
        const newReseller: Reseller = {
          id: uuidv4(),
          tenantId: getCurrentTenant(),
          ...resellerData,
        };
        state.resellers.unshift(newReseller);
      }),

    updateReseller: (resellerId, updatedData) =>
      set((state) => {
        const resellerIndex = state.resellers.findIndex((r) => r.id === resellerId);
        if (resellerIndex !== -1) {
          state.resellers[resellerIndex] = { ...state.resellers[resellerIndex], ...updatedData };
        }
      }),

    deleteReseller: (resellerId) =>
      set((state) => {
        state.resellers = state.resellers.filter((r) => r.id !== resellerId);
      }),

    calculateCommissions: () => {
      // This would require access to orders, but for now, keep static
      // In a real app, this would calculate from orders assigned to resellers
    },
  }))
);
