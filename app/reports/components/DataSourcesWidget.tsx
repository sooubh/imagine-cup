'use client';

import { useState, useEffect } from 'react';

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'Connected' | 'Error' | 'Synced' | 'Uploaded';
  lastSynced?: string;
  meta?: string;
}

const DEFAULT_SOURCES: DataSource[] = [
  { id: '1', name: 'Azure Cosmos DB', type: 'Database', status: 'Connected', lastSynced: 'Just now', meta: 'Primary' },
];

export function DataSourcesWidget() {
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [newSource, setNewSource] = useState({ name: '', type: 'API', url: '' });

  // Load from localStorage or use defaults
  useEffect(() => {
    const saved = localStorage.getItem('reports_data_sources');
    if (saved) {
      setSources(JSON.parse(saved));
    } else {
      setSources(DEFAULT_SOURCES);
    }
  }, []);

  const saveSources = (newSources: DataSource[]) => {
    setSources(newSources);
    localStorage.setItem('reports_data_sources', JSON.stringify(newSources));
  };

  const handleAddSource = () => {
    if (!newSource.name) return;

    const source: DataSource = {
      id: Math.random().toString(36).substring(7),
      name: newSource.name,
      type: newSource.type,
      status: 'Connected', // Simulate success
      lastSynced: 'Just now'
    };

    saveSources([...sources, source]);
    setShowAddModal(false);
    setNewSource({ name: '', type: 'API', url: '' });
  };

  const removeSource = (id: string) => {
    saveSources(sources.filter(s => s.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'bg-green-500';
      case 'Synced': return 'bg-green-500';
      case 'Error': return 'bg-red-500';
      case 'Uploaded': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Database': return 'database';
      case 'API': return 'api';
      case 'File Upload': return 'upload_file';
      default: return 'dns';
    }
  };

  const getIconBg = (type: string, isDark: boolean) => {
    // varied colors based on type
    if (type === 'Database') return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
    if (type === 'API') return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
    return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
  };

  // Only show first 3 for widget view
  const visibleSources = sources.slice(0, 3);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-neutral-dark dark:text-white">Data Sources</h3>
          <button onClick={() => setShowManageModal(true)} className="text-primary text-sm font-bold hover:underline">Manage</button>
        </div>
        <div className="bg-white dark:bg-[#23220f] p-5 rounded-[2rem] border border-neutral-100 dark:border-neutral-700 shadow-sm flex flex-col gap-4 h-full">
          {/* Source Items */}
          {visibleSources.map((source, i) => (
            <div key={source.id} className={`flex items-center gap-4 ${i !== visibleSources.length - 1 ? 'pb-4 border-b border-neutral-100 dark:border-neutral-700' : ''}`}>
              <div className={`size-10 rounded-full flex items-center justify-center ${getIconBg(source.type, false)}`}>
                <span className="material-symbols-outlined">{getIcon(source.type)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-neutral-dark dark:text-white">{source.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${getStatusColor(source.status)}`}></span>
                  <p className="text-xs text-neutral-500">{source.status} • {source.lastSynced}</p>
                </div>
              </div>
              {source.status === 'Error' && <button className="text-xs font-bold text-neutral-dark dark:text-white underline">Fix</button>}
            </div>
          ))}

          {visibleSources.length === 0 && (
            <div className="text-center py-8 text-neutral-400 text-sm">No data sources connected.</div>
          )}

          <div className="mt-auto pt-4">
            <button onClick={() => setShowAddModal(true)} className="w-full h-10 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-center gap-2 text-neutral-500 text-sm font-bold hover:border-primary hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span> Add New Source
            </button>
          </div>
        </div>
      </div>

      {/* Manage Sources Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowManageModal(false)}>
          <div className="bg-white dark:bg-[#1f1e0b] w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/20 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-neutral-dark dark:text-white">Manage Data Sources</h2>
              <button onClick={() => setShowManageModal(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/30 rounded-xl">
                  <div>
                    <p className="font-bold text-neutral-dark dark:text-white">{source.name}</p>
                    <p className="text-xs text-neutral-500">Last synced: {source.lastSynced}</p>
                    <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-400 mt-1 inline-block">{source.type}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">Test</button>
                    <button onClick={() => removeSource(source.id)} className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200">Remove</button>
                  </div>
                </div>
              ))}
              {sources.length === 0 && <p className="text-center text-neutral-500">No sources found.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Add New Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowAddModal(false)}>
          <div className="bg-white dark:bg-[#1f1e0b] w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/20 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-neutral-dark dark:text-white">Add Data Source</h2>
              <button onClick={() => setShowAddModal(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase">Source Name</label>
                <input value={newSource.name} onChange={e => setNewSource({ ...newSource, name: e.target.value })} className="w-full p-3 border rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:outline-primary" placeholder="e.g., Regional Database" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase">Source Type</label>
                <select value={newSource.type} onChange={e => setNewSource({ ...newSource, type: e.target.value })} className="w-full p-3 border rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:outline-primary">
                  <option>API</option>
                  <option>File Upload</option>
                  <option>Database</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase">URL / Path</label>
                <input value={newSource.url} onChange={e => setNewSource({ ...newSource, url: e.target.value })} className="w-full p-3 border rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:outline-primary" placeholder="https://..." />
              </div>
              <div className="pt-4 flex gap-3">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-bold hover:brightness-95">Cancel</button>
                <button onClick={handleAddSource} disabled={!newSource.name} className="flex-1 py-3 bg-primary text-black rounded-xl font-bold shadow-lg hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed">Add Source</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
