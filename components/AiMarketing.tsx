
import React, { useState, useCallback } from 'react';
import { AiContentType } from '../types';
import { generateMarketingContent } from '../services/geminiService';
import Card from './shared/Card';
import { SparklesIcon } from './shared/Icons';

const AiMarketing: React.FC = () => {
  const [contentType, setContentType] = useState<AiContentType>(AiContentType.SALES_CAPTION);
  const [productName, setProductName] = useState('Premium Beauty Cream');
  const [productDescription, setProductDescription] = useState('A nourishing cream that brightens skin and reduces dark spots. Made with natural ingredients.');
  const [price, setPrice] = useState('15000');
  const [customerObjection, setCustomerObjection] = useState('Is it too expensive compared to other creams?');
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setGeneratedContent('');
    const context = {
      productName,
      productDescription,
      price,
      customerObjection
    };
    try {
      const content = await generateMarketingContent(contentType, context);
      setGeneratedContent(content);
    } catch (error) {
      console.error(error);
      setGeneratedContent('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [contentType, productName, productDescription, price, customerObjection]);
  
  const renderFormFields = () => {
    return (
        <>
            <div className="mb-4">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            {contentType === AiContentType.OBJECTION_HANDLING ? (
                <div className="mb-4">
                    <label htmlFor="customerObjection" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Objection</label>
                    <input type="text" id="customerObjection" value={customerObjection} onChange={(e) => setCustomerObjection(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Description</label>
                        <textarea id="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (MMK)</label>
                        <input type="text" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </>
            )}
        </>
    )
  }
  
  const contentTypes = Object.values(AiContentType);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="AI Content Generator" className="lg:col-span-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1. Select Content Type</label>
          <div className="flex flex-col gap-2">
            {contentTypes.map(type => (
              <button
                key={type}
                onClick={() => setContentType(type)}
                className={`w-full text-left p-3 text-sm font-medium rounded-lg transition-colors flex items-center ${
                  contentType === type
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <SparklesIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{type}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">2. Provide Context</label>
            {renderFormFields()}
        </div>

        <button 
          onClick={handleGenerate} 
          disabled={isLoading}
          className="w-full mt-6 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow hover:bg-indigo-700 transition disabled:bg-indigo-400 flex items-center justify-center font-semibold"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
             <>
               <SparklesIcon className="h-5 w-5 mr-2" /> Generate Content
             </>
          )}
        </button>
      </Card>

      <Card title="Generated Content (in Burmese)" className="lg:col-span-2">
        {isLoading && (
            <div className="flex justify-center items-center h-full min-h-[300px]">
                <div className="text-center">
                    <SparklesIcon className="h-12 w-12 text-indigo-400 animate-pulse mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">AI is crafting your content...</p>
                </div>
            </div>
        )}
        {generatedContent && (
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p>{generatedContent}</p>
          </div>
        )}
        {!isLoading && !generatedContent && (
             <div className="flex justify-center items-center h-full min-h-[300px] text-center text-gray-500">
                <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <p>Your generated content will appear here.</p>
                    <p className="text-xs mt-1">Select a content type, fill in the details, and click generate.</p>
                </div>
            </div>
        )}
      </Card>
    </div>
  );
};

export default AiMarketing;
