import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Order, OrderStatus, OrderItem, Product } from '../types';
import { v4 as uuidv4 } from 'uuid';

const mockOrders: Order[] = [
  { id: 'ord1', customerName: 'Ma Thi Da', items: [], total: 23000, status: OrderStatus.Shipped, date: '2023-10-26' },
  { id: 'ord2', customerName: 'Ko Aung Aung', items: [], total: 15000, status: OrderStatus.Processing, date: '2023-10-26' },
  { id: 'ord3', customerName: 'Ma Hla Hla', items: [], total: 5000, status: OrderStatus.Pending, date: '2023-10-25' },
  { id: 'ord4', customerName: 'U Ba', items: [], total: 38000, status: OrderStatus.Delivered, date: '2023-10-24' },
  { id: 'ord5', customerName: 'Daw Mya', items: [], total: 12000, status: OrderStatus.Cancelled, date: '2023-10-23' },
];

type OrderState = {
  orders: Order[];
};

type OrderActions = {
  addOrder: (orderData: Omit<Order, 'id'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
};

export const useOrderStore = create<OrderState & OrderActions>()(
  immer((set) => ({
    orders: mockOrders,

    addOrder: (orderData) =>
      set((state) => {
        const newOrder: Order = {
          id: uuidv4(),
          ...orderData,
        };
        state.orders.unshift(newOrder);
      }),

    updateOrderStatus: (orderId, status) =>
      set((state) => {
        const orderIndex = state.orders.findIndex((o) => o.id === orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = status;
        }
      }),

    deleteOrder: (orderId) =>
      set((state) => {
        state.orders = state.orders.filter((o) => o.id !== orderId);
      }),
  }))
);
