'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, LucideIcon } from 'lucide-react';
import stockData from '../data/sampleStockData.json';

interface SearchResult {
    type: 'stock' | 'page';
    title: string;
    subtitle?: string;
    href: string;
    icon?: LucideIcon;
}



export function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            const lowerQuery = query.toLowerCase();

            // Structure of sampleStockData is known
            interface StockData {
                item_name: string;
                item_id: string;
                location_id: string;
                category: string;
            }

            const stockResults: SearchResult[] = (stockData as StockData[])
                .filter((item) =>
                    item.item_name.toLowerCase().includes(lowerQuery) ||
                    item.item_id.toLowerCase().includes(lowerQuery)
                )
                .slice(0, 5) // Limit stock results
                .map((item) => ({
                    type: 'stock',
                    title: item.item_name,
                    subtitle: item.item_id,
                    href: `/dashboard?stock=${item.item_id}`,
                    icon: Package
                }));

            setResults(stockResults);
            if (stockResults.length > 0) setIsOpen(true);
        }, 300); // Debounce duration

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (href: string) => {
        setIsOpen(false);
        setQuery('');
        router.push(href);
    };

    return (
        <div className="relative group hidden lg:flex" ref={containerRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500" />
            </div>
            <input
                className="block w-64 pl-10 pr-3 py-2 border-none rounded-full leading-5 bg-background-light dark:bg-[#323118] text-neutral-dark dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm transition-all"
                placeholder="Search stocks..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setIsOpen(true)}
            />

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#2a2912] rounded-lg shadow-xl border border-neutral-100 dark:border-neutral-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-2">
                        {results.map((result, index) => (
                            <button
                                key={`${result.type}-${index}`}
                                onClick={() => handleSelect(result.href)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition-colors"
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                                    {result.icon && <result.icon className="h-4 w-4" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                        {result.title}
                                    </p>
                                    {result.subtitle && (
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {result.subtitle}
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isOpen && query && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#2a2912] rounded-lg shadow-xl border border-neutral-100 dark:border-neutral-700 p-4 text-center z-50">
                    <p className="text-sm text-neutral-500">No results found.</p>
                </div>
            )}
        </div>
    );
}
