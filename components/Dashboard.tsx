
import React from 'react';
import Card from './shared/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSignIcon, PackageIcon, ShoppingCartIcon, UsersIcon } from './shared/Icons';

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const topProductsData = [
    { name: 'Beauty Cream', sold: 450 },
    { name: 'T-Shirt', sold: 320 },
    { name: 'Phone Case', sold: 280 },
    { name: 'Handbag', sold: 190 },
    { name: 'Snack Box', sold: 150 },
]

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={<DollarSignIcon className="h-6 w-6 text-green-500"/>}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="text-3xl font-bold">Ks 1,250,000</p>
          <p className="text-sm text-green-500 mt-1">+12% from last month</p>
        </Card>
        <Card icon={<ShoppingCartIcon className="h-6 w-6 text-blue-500"/>}>
          <p className="text-sm text-gray-500 dark:text-gray-400">New Orders</p>
          <p className="text-3xl font-bold">82</p>
          <p className="text-sm text-green-500 mt-1">+5 today</p>
        </Card>
        <Card icon={<PackageIcon className="h-6 w-6 text-yellow-500"/>}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Products in Stock</p>
          <p className="text-3xl font-bold">743</p>
           <p className="text-sm text-red-500 mt-1">5 items low stock</p>
        </Card>
        <Card icon={<UsersIcon className="h-6 w-6 text-indigo-500"/>}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Sellers</p>
          <p className="text-3xl font-bold">15</p>
           <p className="text-sm text-gray-500 mt-1">2 new this week</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Weekly Sales">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.8)',
                        borderColor: '#4a5568',
                        color: '#e5e7eb',
                        borderRadius: '0.5rem'
                    }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Top Selling Products">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700"/>
                    <XAxis type="number" className="text-xs"/>
                    <YAxis dataKey="name" type="category" width={80} className="text-xs"/>
                    <Tooltip 
                        cursor={{fill: 'rgba(79, 70, 229, 0.1)'}}
                        contentStyle={{
                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                            borderColor: '#4a5568',
                            color: '#e5e7eb',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Bar dataKey="sold" fill="#4f46e5" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
