
import React, { useState } from 'react';
import { Product } from '../types';
import Card from './shared/Card';
import Modal from './shared/Modal';
import { AlertCircleIcon, PlusIcon } from './shared/Icons';
import { useProductStore } from '../store/productStore';

const ProductForm: React.FC<{ product?: Product; onClose: () => void }> = ({ product, onClose }) => {
    const addProduct = useProductStore((state) => state.addProduct);
    const updateProduct = useProductStore((state) => state.updateProduct);
    const [name, setName] = useState(product?.name || '');
    const [sku, setSku] = useState(product?.sku || '');
    const [stock, setStock] = useState(product?.stock || 0);
    const [price, setPrice] = useState(product?.price || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !sku) return;
        if (product) {
            updateProduct(product.id, { name, sku, stock, price });
        } else {
            const newProduct: Omit<Product, 'id'> = {
                name,
                sku,
                stock,
                price,
                imageUrl: `https://picsum.photos/seed/${Math.random()}/400/400`
            };
            addProduct(newProduct);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
                <input type="text" id="sku" value={sku} onChange={e => setSku(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                    <input type="number" id="stock" value={stock} onChange={e => setStock(Number(e.target.value))} min="0" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (MMK)</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(Number(e.target.value))} min="0" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>
            <div className="flex justify-end pt-4 gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">{product ? 'Update' : 'Add'} Product</button>
            </div>
        </form>
    );
};


const Inventory: React.FC = () => {
  const { products, deleteProduct } = useProductStore((state) => ({ products: state.products, deleteProduct: state.deleteProduct }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const getStockColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (stock < 10) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  };

  return (
    <>
      <Card title="Product Inventory">
        <div className="mb-4 flex justify-end">
          <button 
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Product</th>
                <th scope="col" className="px-6 py-3">SKU</th>
                <th scope="col" className="px-6 py-3">Price (MMK)</th>
                <th scope="col" className="px-6 py-3">Stock</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                    {product.name}
                  </td>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4">{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${getStockColor(product.stock)}`}>
                      {product.stock} units
                    </span>
                    {product.stock > 0 && product.stock < 10 && <AlertCircleIcon className="inline ml-1 h-4 w-4 text-yellow-500" />}
                    {product.stock === 0 && <AlertCircleIcon className="inline ml-1 h-4 w-4 text-red-500" />}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline mr-4">Edit</button>
                    <button onClick={() => { if (window.confirm('Are you sure you want to delete this product?')) deleteProduct(product.id); }} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} title={editingProduct ? "Edit Product" : "Add New Product"}>
        <ProductForm product={editingProduct} onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} />
      </Modal>
    </>
  );
};

export default Inventory;