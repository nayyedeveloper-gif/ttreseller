
import React, { useMemo } from 'react';
import Card from './shared/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DollarSignIcon, PackageIcon, ShoppingCartIcon, UsersIcon } from './shared/Icons';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import { useResellerStore } from '../store/resellerStore';
import { OrderStatus } from '../types';

const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444'];

const Dashboard: React.FC = () => {
  const orders = useOrderStore((state) => state.orders);
  const products = useProductStore((state) => state.products);
  const resellers = useResellerStore((state) => state.resellers);

  // Memoize computed stats
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const numOrders = useMemo(() => orders.length, [orders]);
  const totalStock = useMemo(() => products.reduce((sum, p) => sum + p.stock, 0), [products]);
  const lowStockCount = useMemo(() => products.filter(p => p.stock < 10).length, [products]);
  const numResellers = useMemo(() => resellers.length, [resellers]);

  // Memoize top products data
  const topProductsData = useMemo(() => {
    const productSales: { [key: string]: number } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        productSales[item.product.name] = (productSales[item.product.name] || 0) + item.quantity;
      });
    });
    return Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, sold]) => ({ name, sold }));
  }, [orders]);

  // Memoize order status data
  const orderStatusData = useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as { [key in OrderStatus]: number });
    return Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }));
  }, [orders]);

  // Memoize reseller data
  const resellerData = useMemo(() => resellers.map(r => ({ name: r.name, commission: r.commissionEarned })), [resellers]);

  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={<DollarSignIcon className="h-6 w-6 text-green-500"/>}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="text-3xl font-bold">Ks {totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-500 mt-1">+12% from last month</p>
        </Card>
        <Card icon={<ShoppingCartIcon className="h-6 w-6 text-blue-500"/>}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
          <p className="text-3xl font-bold">{numOrders}</p>
          <p className="text-sm text-green-500 mt-1">+5 today</p>
        </Card>
        <Card icon={<PackageIcon className="h-6 w-6 text-yellow-500"/>}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Products in Stock</p>
          <p className="text-3xl font-bold">{totalStock}</p>
          <p className="text-sm text-red-500 mt-1">{lowStockCount} items low stock</p>
        </Card>
        <Card icon={<UsersIcon className="h-6 w-6 text-indigo-500"/>}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Resellers</p>
          <p className="text-3xl font-bold">{numResellers}</p>
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

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Order Status Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Reseller Commission Performance">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resellerData}>
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
                <Bar dataKey="commission" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
