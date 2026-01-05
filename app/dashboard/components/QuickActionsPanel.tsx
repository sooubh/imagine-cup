'use client';

import Link from 'next/link';

export function QuickActionsPanel() {
  const quickActions = [
    {
      title: 'Restock Items',
      description: 'Quickly reorder low stock items',
      icon: '📦',
      href: '/reorder',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Add New Item',
      description: 'Add products to inventory',
      icon: '➕',
      href: '/inventory',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'AI Insights',
      description: 'View AI-powered recommendations',
      icon: '🤖',
      href: '/insights',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Reports',
      description: 'Generate inventory reports',
      icon: '📊',
      href: '/reports',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-black text-neutral-dark dark:text-white">
          Quick Actions
        </h2>
        <span className="text-sm text-neutral-500 font-medium">
          Shortcuts to common tasks
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-[1px] hover:shadow-lg transition-all duration-300"
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative bg-white dark:bg-[#1a1909] rounded-2xl p-5 h-full flex flex-col gap-3">
              <div className="text-3xl">{action.icon}</div>
              <div>
                <h3 className="font-bold text-neutral-dark dark:text-white mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {action.description}
                </p>
              </div>
              <div className="mt-auto">
                <span className="text-xs font-bold text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  Click to open →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
