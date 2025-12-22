'use client';

import { useState } from 'react';
import { ReorderStats } from './ReorderStats';
import { ReorderFilters } from './ReorderFilters';
import { ReorderTable } from './ReorderTable';
import { StickyActionFooter } from './StickyActionFooter';
import { ItemDetailsModal } from './ItemDetailsModal';
import { EditItemModal } from './EditItemModal';
import { StockItem } from '../../dashboard/lib/utils';

export function ReorderPageContent() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [activeItem, setActiveItem] = useState<StockItem | null>(null);
    const [modalMode, setModalMode] = useState<'edit' | 'details' | null>(null);

    const handleMarkOrdered = () => {
        if (selectedIds.length === 0) return;

        // Mock action
        console.log('Items marked as ordered:', selectedIds);

        setShowFeedback(true);
        setSelectedIds([]);

        setTimeout(() => {
            setShowFeedback(false);
        }, 3000);
    };

    const handleView = (item: StockItem) => {
        setActiveItem(item);
        setModalMode('details');
    };

    const handleEdit = (item: StockItem) => {
        setActiveItem(item);
        setModalMode('edit');
    };

    return (
        <div className="w-full max-w-[1440px] mx-auto pb-12 px-4 md:px-6">
            {showFeedback && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
                    <div className="bg-primary text-black px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 border border-black/10">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Order successfully processed for selected items
                    </div>
                </div>
            )}
            <ReorderStats />
            <ReorderFilters />
            <ReorderTable
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onViewItem={handleView}
                onEditItem={handleEdit}
            />
            <StickyActionFooter
                selectedCount={selectedIds.length}
                onMarkOrdered={handleMarkOrdered}
                onSendToProcurement={() => console.log('Sending to procurement:', selectedIds)}
            />

            {activeItem && modalMode === 'details' && (
                <ItemDetailsModal item={activeItem} onClose={() => setModalMode(null)} />
            )}
            {activeItem && modalMode === 'edit' && (
                <EditItemModal item={activeItem} onClose={() => setModalMode(null)} />
            )}
        </div>
    );
}
