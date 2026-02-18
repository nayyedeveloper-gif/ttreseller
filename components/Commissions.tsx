
import React, { useState } from 'react';
import { Reseller } from '../types';
import Card from './shared/Card';
import Modal from './shared/Modal';
import { PlusIcon } from './shared/Icons';
import { useResellerStore } from '../store/resellerStore';

const ResellerForm: React.FC<{ reseller?: Reseller; onClose: () => void }> = ({ reseller, onClose }) => {
    const addReseller = useResellerStore((state) => state.addReseller);
    const updateReseller = useResellerStore((state) => state.updateReseller);
    const [name, setName] = useState(reseller?.name || '');
    const [commissionRate, setCommissionRate] = useState(reseller?.commissionRate || 0.1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        if (reseller) {
            updateReseller(reseller.id, { name, commissionRate });
        } else {
            const newReseller: Omit<Reseller, 'id'> = {
                name,
                totalSales: 0,
                commissionRate,
                commissionEarned: 0,
                avatarUrl: `https://picsum.photos/seed/${Math.random()}/100/100`
            };
            addReseller(newReseller);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reseller Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Commission Rate (%)</label>
                <input type="number" id="rate" value={commissionRate * 100} onChange={e => setCommissionRate(Number(e.target.value) / 100)} min="0" max="100" step="0.01" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="flex justify-end pt-4 gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">{reseller ? 'Update' : 'Add'} Reseller</button>
            </div>
        </form>
    );
};


const Commissions: React.FC = () => {
  const { resellers, deleteReseller } = useResellerStore((state) => ({ resellers: state.resellers, deleteReseller: state.deleteReseller }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReseller, setEditingReseller] = useState<Reseller | null>(null);

  return (
    <>
      <Card title="Reseller Commissions">
        <div className="mb-4 flex justify-end">
          <button 
            onClick={() => { setEditingReseller(null); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Reseller
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Reseller</th>
                <th scope="col" className="px-6 py-3">Total Sales (MMK)</th>
                <th scope="col" className="px-6 py-3">Rate</th>
                <th scope="col" className="px-6 py-3">Commission Earned (MMK)</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resellers.map((reseller) => (
                <tr key={reseller.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                     <img src={reseller.avatarUrl} alt={reseller.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                    {reseller.name}
                  </td>
                  <td className="px-6 py-4">{reseller.totalSales.toLocaleString()}</td>
                  <td className="px-6 py-4">{(reseller.commissionRate * 100).toFixed(0)}%</td>
                  <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">{reseller.commissionEarned.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => { setEditingReseller(reseller); setIsModalOpen(true); }} className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline mr-4">Edit</button>
                    <button onClick={() => { if (window.confirm('Are you sure you want to delete this reseller?')) deleteReseller(reseller.id); }} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingReseller(null); }} title={editingReseller ? "Edit Reseller" : "Add New Reseller"}>
        <ResellerForm reseller={editingReseller} onClose={() => { setIsModalOpen(false); setEditingReseller(null); }} />
      </Modal>
    </>
  );
};

export default Commissions;
