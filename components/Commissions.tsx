
import React, { useState } from 'react';
import { Seller } from '../types';
import Card from './shared/Card';

const mockSellers: Seller[] = [
  { id: 's1', name: 'Seller A', totalSales: 550000, commissionRate: 0.10, commissionEarned: 55000, avatarUrl: 'https://picsum.photos/id/237/100/100' },
  { id: 's2', name: 'Seller B', totalSales: 320000, commissionRate: 0.12, commissionEarned: 38400, avatarUrl: 'https://picsum.photos/id/238/100/100' },
  { id: 's3', name: 'Seller C', totalSales: 780000, commissionRate: 0.10, commissionEarned: 78000, avatarUrl: 'https://picsum.photos/id/239/100/100' },
  { id: 's4', name: 'Seller D', totalSales: 150000, commissionRate: 0.15, commissionEarned: 22500, avatarUrl: 'https://picsum.photos/id/240/100/100' },
];

const Commissions: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>(mockSellers);

  return (
    <Card title="Seller Commissions">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Seller</th>
              <th scope="col" className="px-6 py-3">Total Sales (MMK)</th>
              <th scope="col" className="px-6 py-3">Rate</th>
              <th scope="col" className="px-6 py-3">Commission Earned (MMK)</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                   <img src={seller.avatarUrl} alt={seller.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                  {seller.name}
                </td>
                <td className="px-6 py-4">{seller.totalSales.toLocaleString()}</td>
                <td className="px-6 py-4">{(seller.commissionRate * 100).toFixed(0)}%</td>
                <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">{seller.commissionEarned.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">Details</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Commissions;
