"use client";

import { Activity } from '@/lib/azureDefaults';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TeamReportProps {
    activities: Activity[];
    isLoading: boolean;
}

export function TeamReport({ activities, isLoading }: TeamReportProps) {
    // Derive unique team members from activity logs
    const teamMembers = Array.from(new Set(activities.map(a => a.user))).map(user => {
        const userActivities = activities.filter(a => a.user === user);
        return {
            name: user,
            lastActive: userActivities[0]?.time, // Sorted descending already
            actionsCount: userActivities.length,
            mostCommonAction: getMostCommonAction(userActivities)
        };
    });

    function getMostCommonAction(acts: Activity[]) {
        const counts = acts.reduce((acc, a) => {
            acc[a.action] = (acc[a.action] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';
    }

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Team Activity Report", 14, 22);
        
        const tableBody = teamMembers.map(m => [
            m.name,
            new Date(m.lastActive).toLocaleString(),
            m.actionsCount.toString(),
            m.mostCommonAction
        ]);

        autoTable(doc, {
            head: [['User', 'Last Active', 'Actions Logged', 'Top Action']],
            body: tableBody,
            startY: 30,
        });
        doc.save('team_report.pdf');
    };

    if (isLoading) return <div className="p-10 text-center">Loading Team Data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <div>
                     <h2 className="text-2xl font-black text-neutral-dark dark:text-white mb-1">Active Team Members</h2>
                     <p className="text-neutral-500">Based on recent system activity logs</p>
                </div>
                <button onClick={handleExportPDF} className="px-6 py-3 bg-primary text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all">
                    Download Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map(member => (
                    <div key={member.name} className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 hover:border-primary transition-all group shadow-sm hover:shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-lg font-bold text-neutral-500 group-hover:bg-primary group-hover:text-black transition-colors">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full inline-block">Active</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-neutral-500">
                             <div className="flex justify-between">
                                 <span>Last Seen</span>
                                 <span className="text-neutral-dark dark:text-white font-medium">{new Date(member.lastActive).toLocaleDateString()}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span>Total Actions</span>
                                 <span className="text-neutral-dark dark:text-white font-medium">{member.actionsCount}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span>Top Action</span>
                                 <span className="text-neutral-dark dark:text-white font-medium">{member.mostCommonAction}</span>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
