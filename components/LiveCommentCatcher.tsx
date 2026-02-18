import React, { useState } from 'react';
import Card from './shared/Card';
import { useProductStore } from '../store/productStore';
import { useOrderStore } from '../store/orderStore';
import { OrderStatus, OrderItem } from '../types';
import { getCurrentTenant } from '../utils';

const LiveCommentCatcher: React.FC = () => {
  const [comments, setComments] = useState('');
  const [detectedOrders, setDetectedOrders] = useState<any[]>([]);
  const products = useProductStore((state) => state.products).filter(p => p.tenantId === getCurrentTenant());
  const { addOrder } = useOrderStore();

  const processComments = () => {
    const lines = comments.split('\n').filter(line => line.trim());
    const newOrders: any[] = [];

    lines.forEach((comment, index) => {
      const lowerComment = comment.toLowerCase();
      const customerName = `Live Customer ${index + 1}`;

      // Simple keyword detection for SKUs
      const matchedProducts: OrderItem[] = [];
      products.forEach(product => {
        if (lowerComment.includes(product.sku.toLowerCase())) {
          // Extract quantity if present, e.g., "BC-001 x2" or just "BC-001"
          const qtyMatch = comment.match(new RegExp(`${product.sku}\\s*x?(\\d+)`, 'i'));
          const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;

          if (product.stock >= quantity) {
            matchedProducts.push({ product, quantity });
          }
        }
      });

      // Also check for "ယူမယ်" (take) with product codes
      if (lowerComment.includes('ယူမယ်') || lowerComment.includes('take')) {
        // For simplicity, assume any mention with take
        // But already checked SKUs
      }

      if (matchedProducts.length > 0) {
        const total = matchedProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        newOrders.push({
          customerName,
          items: matchedProducts,
          total,
          status: OrderStatus.Pending,
          date: new Date().toISOString().split('T')[0],
        });
      }
    });

    setDetectedOrders(newOrders);
  };

  const createDraftOrders = () => {
    detectedOrders.forEach(order => {
      addOrder(order);
    });
    setDetectedOrders([]);
    setComments('');
    alert('Draft orders created successfully!');
  };

  return (
    <div className="space-y-6">
      <Card title="TikTok Live Comment Catcher">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paste Live Comments (one per line)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter comments from live stream, e.g.&#10;User1: ယူမယ် BC-001 x2&#10;User2: Take TS-003"
              className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={processComments}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Process Comments
          </button>
        </div>
      </Card>

      {detectedOrders.length > 0 && (
        <Card title="Detected Orders">
          <div className="space-y-4">
            {detectedOrders.map((order, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="font-semibold">{order.customerName}</h3>
                <ul className="list-disc list-inside mt-2">
                  {order.items.map((item: OrderItem, i: number) => (
                    <li key={i}>
                      {item.product.name} (SKU: {item.product.sku}) x{item.quantity} - {item.product.price * item.quantity} MMK
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-bold">Total: {order.total} MMK</p>
              </div>
            ))}
            <button
              onClick={createDraftOrders}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Draft Orders
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LiveCommentCatcher;
