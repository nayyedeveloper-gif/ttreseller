
import React, { useState } from 'react';
import { Routes, Route, Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Commissions from './components/Commissions';
import AiMarketing from './components/AiMarketing';
import LiveCommentCatcher from './components/LiveCommentCatcher';
import Customer from './components/Customer';
import { HomeIcon, PackageIcon, ShoppingCartIcon, UsersIcon, SparklesIcon, MenuIcon, XIcon, AlertCircleIcon } from './components/shared/Icons';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const currentPageId = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

    const navItems = [
        { id: 'dashboard', path: '/', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
        { id: 'inventory', path: '/inventory', label: 'Inventory', icon: <PackageIcon className="h-5 w-5" /> },
        { id: 'orders', path: '/orders', label: 'Orders', icon: <ShoppingCartIcon className="h-5 w-5" /> },
        { id: 'commissions', path: '/commissions', label: 'Commissions', icon: <UsersIcon className="h-5 w-5" /> },
        { id: 'ai_marketing', path: '/ai_marketing', label: 'AI Marketing', icon: <SparklesIcon className="h-5 w-5" /> },
        { id: 'live_comments', path: '/live_comments', label: 'Live Comments', icon: <AlertCircleIcon className="h-5 w-5" /> },
        { id: 'customers', path: '/customers', label: 'Customers', icon: <UsersIcon className="h-5 w-5" /> },
    ];

    const currentPageLabel = navItems.find(item => item.path === location.pathname)?.label || 'Dashboard';

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Sidebar */}
            <aside className={`bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col`}>
                <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-16`}>
                    <span className={`font-bold text-xl text-indigo-600 dark:text-indigo-400 ${!isSidebarOpen && 'hidden'}`}>Seller<span className="text-gray-500">Dash</span></span>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                        {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                    </button>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map(item => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`flex items-center p-2 rounded-lg transition-colors ${
                                currentPageId === item.id
                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                        >
                            {item.icon}
                            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md h-16">
                    <h1 className="text-2xl font-semibold capitalize">{currentPageLabel}</h1>
                    <div>
                        <img className="h-10 w-10 rounded-full object-cover" src="https://picsum.photos/100/100" alt="User" />
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
            
            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around p-1">
                {navItems.map(item => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 h-16 transition-colors ${
                            currentPageId === item.id
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-500 hover:text-indigo-500'
                        }`}
                    >
                        {item.icon}
                        <span className="text-xs mt-1">{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="md:hidden h-20"></div> {/* Spacer for bottom nav */}
        </div>
    );
};

/**
 * A component that redirects the user to a specific feature page
 * if they are on a recognized subdomain and at the root path.
 */
const SubdomainRedirector: React.FC = () => {
    const location = useLocation();
    const { hostname } = window.location;

    // Only perform redirection logic if the user is at the root path ('/').
    if (location.pathname !== '/') {
        return <Outlet />;
    }

    const parts = hostname.split('.');
    const subdomain = parts[0];

    const subdomainRoutes: { [key: string]: string } = {
        inventory: '/inventory',
        orders: '/orders',
        commissions: '/commissions',
        ai: '/ai_marketing',
    };

    const redirectTo = subdomainRoutes[subdomain];

    if (redirectTo) {
        // If a matching subdomain is found, redirect to its corresponding page.
        return <Navigate to={redirectTo} replace />;
    }

    // If no matching subdomain (e.g., on the root domain), render the children as is.
    return <Outlet />;
};


const App: React.FC = () => {
    return (
        <Routes>
            <Route element={<SubdomainRedirector />}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="commissions" element={<Commissions />} />
                    <Route path="ai_marketing" element={<AiMarketing />} />
                    <Route path="live_comments" element={<LiveCommentCatcher />} />
                    <Route path="customers" element={<Customer />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;
