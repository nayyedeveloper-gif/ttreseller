import React from 'react';
import Card from './shared/Card';
import { useOrderStore } from '../store/orderStore';
import { Order } from '../types';

const Customer: React.FC = () => {
  const orders = useOrderStore((state) => state.orders);

  // Compute customers from orders
  const customerMap: { [name: string]: { orders: Order[], total: number, lastDate: string } } = {};
  orders.forEach(order => {
    if (!customerMap[order.customerName]) {
      customerMap[order.customerName] = { orders: [], total: 0, lastDate: order.date };
    }
    customerMap[order.customerName].orders.push(order);
    customerMap[order.customerName].total += order.total;
    if (order.date > customerMap[order.customerName].lastDate) {
      customerMap[order.customerName].lastDate = order.date;
    }
  });

  const customers = Object.entries(customerMap).map(([name, data]) => ({ name, ...data }));

  return (
    <div className="space-y-6">
      <Card title="Customer Management (CRM)">
        <div className="space-y-4">
          {customers.map((customer, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{customer.name}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Purchases: Ks {customer.total.toLocaleString()} | Last Purchase: {customer.lastDate}
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Purchase History ({customer.orders.length} orders)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-2">Order ID</th>
                      <th scope="col" className="px-4 py-2">Date</th>
                      <th scope="col" className="px-4 py-2">Total</th>
                      <th scope="col" className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map(order => (
                      <tr key={order.id} className="bg-white dark:bg-gray-800">
                        <td className="px-4 py-2">#{order.id}</td>
                        <td className="px-4 py-2">{order.date}</td>
                        <td className="px-4 py-2">Ks {order.total.toLocaleString()}</td>
                        <td className="px-4 py-2">{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Send Promotion
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Customer;
