'use client';

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'update' | 'create' | 'delete' | 'alert';
}

const activities: Activity[] = [
  { id: '1', user: 'Sourabh', action: 'updated stock', target: 'Insulin', time: '2 mins ago', type: 'update' },
  { id: '2', user: 'System', action: 'generated alert', target: 'Low Stock: Masks', time: '10 mins ago', type: 'alert' },
  { id: '3', user: 'Priya', action: 'approved reorder', target: 'Order #402', time: '1 hour ago', type: 'create' },
  { id: '4', user: 'Marcus', action: 'updated region', target: 'North District', time: '3 hours ago', type: 'update' },
];

export function RecentActivityFeed() {
  return (
    <div className="bg-white dark:bg-[#2a2912] rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Recent Activity</h3>
        <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">View All</button>
      </div>
      
      <div className="relative border-l-2 border-neutral-100 dark:border-neutral-800 ml-2 space-y-6 pl-4">
        {activities.map((activity) => (
          <div key={activity.id} className="relative">
            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-[#2a2912] ${
                activity.type === 'alert' ? 'bg-red-500' :
                activity.type === 'create' ? 'bg-green-500' : 'bg-blue-500'
            }`}></div>
            
            <p className="text-sm text-neutral-800 dark:text-neutral-200">
              <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-medium text-neutral-600 dark:text-neutral-400">{activity.target}</span>
            </p>
            <span className="text-xs text-neutral-400">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
