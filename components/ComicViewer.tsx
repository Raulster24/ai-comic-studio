import React, { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import type { ComicPanel as ComicPanelType } from '../types';
import { Panel } from './Panel';
import { SparklesIcon } from './icons/SparklesIcon';

interface ComicViewerProps {
    panels: ComicPanelType[];
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
}

export const ComicViewer: React.FC<ComicViewerProps> = ({ panels, isLoading, loadingMessage, error }) => {
    const comicRef = useRef<HTMLDivElement>(null);
    const isGenerating = isLoading || panels.some(p => p.isLoading);

    const handleDownload = useCallback(() => {
        if (comicRef.current === null) {
            return;
        }

        toPng(comicRef.current, { cacheBust: true, backgroundColor: '#1f2937' }) // bg-gray-800
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'ai-comic-studio.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Failed to download comic image.', err);
            });
    }, []);

    const getGridClass = (count: number) => {
        switch (count) {
            case 1: // Full splash page
                return 'grid-cols-1 grid-rows-1';
            case 2: // 2-panel strip, vertical split
                return 'grid-cols-1 grid-rows-2';
            case 4: // 4-panel grid, 2x2
                return 'grid-cols-2 grid-rows-2';
            case 6: // 6-panel page, 2x3 or 3x2 on large screens
                return 'grid-cols-2 grid-rows-3 lg:grid-cols-3 lg:grid-rows-2';
            default:
                 // Fallback for any unexpected panel counts
                return 'grid-cols-1 md:grid-cols-2';
        }
    };

    const renderContent = () => {
        if (isLoading && panels.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin mb-4"></div>
                    <h2 className="text-2xl font-bold text-yellow-300">{loadingMessage}</h2>
                    <p className="text-gray-400 mt-2">The AI is warming up its pencils...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center bg-red-900/20 p-8 rounded-lg">
                     <h2 className="text-2xl font-bold text-red-400">An Error Occurred</h2>
                     <p className="text-red-300 mt-2 max-w-lg">{error}</p>
                </div>
            );
        }

        if (panels.length > 0) {
            return (
                <div className="flex flex-col h-full w-full">
                    <div ref={comicRef} className={`grid ${getGridClass(panels.length)} gap-4 flex-grow p-4 bg-gray-800 rounded-lg shadow-inner min-h-0`}>
                        {panels.map(panel => (
                            <Panel key={panel.panel} panel={panel} />
                        ))}
                    </div>
                    {!isGenerating && (
                         <div className="mt-6 text-center flex-shrink-0">
                            <button 
                                onClick={handleDownload}
                                className="font-bangers text-xl tracking-wider py-2 px-6 bg-yellow-400 text-gray-900 rounded-lg shadow-lg hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 transform hover:scale-105 transition-all duration-200"
                            >
                                Download Comic
                            </button>
                        </div>
                    )}
                </div>
            );
        }
        
        return (
            <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-gray-700 rounded-xl p-8">
                <SparklesIcon className="w-16 h-16 text-yellow-400/50 mb-4" />
                <h2 className="text-3xl font-bangers text-gray-300 tracking-wider">Your Comic Awaits!</h2>
                <p className="text-gray-500 mt-2 max-w-sm">Fill out the form on the left to generate your very own AI-powered comic book.</p>
            </div>
        );
    };

    return (
        <div className="w-full h-full">
            {renderContent()}
        </div>
    );
};