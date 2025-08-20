import React from 'react';
import type { ComicPanel } from '../types';
import { Spinner } from './Spinner';
import { SpeechBubble } from './SpeechBubble';

interface PanelProps {
    panel: ComicPanel;
}

export const Panel: React.FC<PanelProps> = ({ panel }) => {
    return (
        <div className="bg-black border-2 border-gray-500 flex flex-col relative overflow-hidden shadow-lg">
            <div className="flex-grow bg-gray-900/50 relative flex items-center justify-center">
                {panel.isLoading && <Spinner />}
                {panel.imageUrl && <img src={panel.imageUrl} alt={`Panel ${panel.panel}`} className="w-full h-full object-contain" />}
                {!panel.isLoading && !panel.imageUrl && (
                    <div className="text-center text-red-400 p-4">
                        <p className="font-bold">Image Failed</p>
                        <p className="text-sm">Could not generate image for this panel.</p>
                    </div>
                )}
                
                {panel.soundEffect && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                        <p className="font-bangers text-7xl text-yellow-300" style={{ WebkitTextStroke: '3px black', textShadow: '4px 4px 0 #000' }}>
                            {panel.soundEffect}
                        </p>
                    </div>
                )}
                
                {panel.dialogue && panel.dialogue.map((d, index) => (
                    <div key={index} className={`absolute ${index % 2 === 0 ? 'bottom-4 left-4' : 'top-4 right-4'} max-w-[60%] z-10`}>
                        <SpeechBubble
                            character={d.character}
                            speech={d.speech}
                            position={index % 2 === 0 ? 'bottom-left' : 'top-right'}
                        />
                    </div>
                ))}
            </div>
            
            {panel.caption && (
                <div className="bg-yellow-400/10 border-t-2 border-yellow-400/50 p-2 text-center">
                    <p className="text-sm italic text-white font-comic-neue">{panel.caption}</p>
                </div>
            )}
        </div>
    );
};