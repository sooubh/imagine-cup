
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, CheckCircle, Camera, SwitchCamera } from 'lucide-react';

interface InlineScannerProps {
    onClose: () => void;
    onScanSuccess: (decodedText: string) => void;
}

export default function InlineScanner({ onClose, onScanSuccess }: InlineScannerProps) {
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [scannerConfig, setScannerConfig] = useState({ rememberLastUsedCamera: true });
    
    const lastScanTimeRef = useRef<number>(0);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // Use a ref to keep the latest callback without triggering re-initialization
    const onScanSuccessRef = useRef(onScanSuccess);
    useEffect(() => {
        onScanSuccessRef.current = onScanSuccess;
    }, [onScanSuccess]);

    useEffect(() => {
        // Reset state on mount or config change
        setLastScanned(null);
        setFeedbackMessage(null);
        lastScanTimeRef.current = 0;

        const timer = setTimeout(() => {
            // Initialize scanner
            const scanner = new Html5QrcodeScanner(
                "inline-reader",
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.77, 
                    rememberLastUsedCamera: scannerConfig.rememberLastUsedCamera
                },
                /* verbose= */ false
            );
            scannerRef.current = scanner;

            scanner.render(
                (decodedText) => {
                    const now = Date.now();
                    // Cooldown check (2 seconds)
                    if (decodedText === lastScanTimeRef.current.toString() && now - lastScanTimeRef.current < 2000) {
                            return;
                    }
                    if (now - lastScanTimeRef.current < 2000) {
                            return;
                    }

                    // Valid Scan
                    lastScanTimeRef.current = now;
                    // Use the ref to call the latest callback
                    if (onScanSuccessRef.current) {
                        onScanSuccessRef.current(decodedText);
                    }
                    
                    // Visual Feedback
                    setLastScanned(decodedText);
                    setFeedbackMessage(`Added!`);
                    
                    setTimeout(() => setFeedbackMessage(null), 1500);
                },
                (errorMessage) => {
                    // ignore errors
                }
            );
        }, 100);
        
        return () => {
            clearTimeout(timer);
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
                scannerRef.current = null;
            }
        };
    }, [scannerConfig]); // Re-run when config changes (e.g., switch camera clicked)

    const handleSwitchCamera = () => {
        // Trigger a re-initialization with rememberLastUsedCamera = false
        // This forces the "Select Camera" UI to appear
        setScannerConfig({ rememberLastUsedCamera: false });
    };

    return (
        <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-2xl mb-4 overflow-hidden shadow-inner border border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-top-4 duration-300">
            {/* Header / Controls */}
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Camera Scanner Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleSwitchCamera}
                        className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-primary px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                        title="Change Camera"
                    >
                        <SwitchCamera className="w-3.5 h-3.5" />
                        Switch Camera
                    </button>
                    <button 
                        onClick={onClose}
                        className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Scanner Region */}
            <div className="relative bg-black h-[300px] md:h-[350px]">
                <div id="inline-reader" className="w-full h-full"></div>
                
                {/* Feedback Overlay */}
                {feedbackMessage && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40 z-20">
                        <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl flex flex-col items-center animate-in zoom-in fade-in duration-200">
                            <CheckCircle className="w-10 h-10 mb-2" />
                            <span className="text-xl font-bold">{feedbackMessage}</span>
                            <span className="text-xs opacity-90 font-mono mt-1">{lastScanned}</span>
                        </div>
                    </div>
                )}
            </div>

             {/* Style Overrides for html5-qrcode to make it look decent inline */}
             <style jsx global>{`
#inline - reader {
    border: none!important;
}
#inline - reader__scan_region {
    background: black!important;
}
#inline - reader video {
    object - fit: cover;
    border - radius: 0 0 16px 16px;
}
/* Style the controls cleanly */
#inline - reader__dashboard_section_csr button {
    font - size: 14px;
    padding: 6px 12px;
    border - radius: 8px;
    background: #3b82f6;
    color: white;
    border: none;
    cursor: pointer;
    margin: 10px 5px;
}
#inline - reader__dashboard_section_csr span,
    #inline - reader__dashboard_section_swaplink {
    color: #999!important;
    font - size: 12px!important;
    text - decoration: none!important;
}
`}</style>
        </div>
    );
}
