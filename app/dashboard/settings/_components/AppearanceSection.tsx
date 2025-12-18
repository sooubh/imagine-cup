'use client';

import { useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { clsx } from 'clsx';

export function AppearanceSection() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h4 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Theme</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setTheme('light')}
                        className={clsx(
                            'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
                            theme === 'light'
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        )}
                    >
                        <Sun className={clsx("h-8 w-8 mb-3", theme === 'light' ? 'text-indigo-600' : 'text-slate-500')} />
                        <span className={clsx("font-medium", theme === 'light' ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300')}>Light</span>
                    </button>
                    <button
                        onClick={() => setTheme('dark')}
                        className={clsx(
                            'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
                            theme === 'dark'
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        )}
                    >
                        <Moon className={clsx("h-8 w-8 mb-3", theme === 'dark' ? 'text-indigo-600' : 'text-slate-500')} />
                        <span className={clsx("font-medium", theme === 'dark' ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300')}>Dark</span>
                    </button>
                    <button
                        onClick={() => setTheme('system')}
                        className={clsx(
                            'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
                            theme === 'system'
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        )}
                    >
                        <Monitor className={clsx("h-8 w-8 mb-3", theme === 'system' ? 'text-indigo-600' : 'text-slate-500')} />
                        <span className={clsx("font-medium", theme === 'system' ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300')}>System</span>
                    </button>
                </div>
            </div>

            <div>
                <h4 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Content Density</h4>
                <div className="flex gap-4">
                    <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer w-full hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <input
                            type="radio"
                            name="density"
                            value="comfortable"
                            checked={density === 'comfortable'}
                            onChange={() => setDensity('comfortable')}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Comfortable</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer w-full hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <input
                            type="radio"
                            name="density"
                            value="compact"
                            checked={density === 'compact'}
                            onChange={() => setDensity('compact')}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Compact</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
