import React from 'react';

type Position = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

interface SpeechBubbleProps {
    character: string;
    speech: string;
    position: Position;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ character, speech, position }) => {
    const getTailClasses = () => {
        switch (position) {
            case 'bottom-left':
                return 'left-4 -bottom-2 border-t-white';
            case 'bottom-right':
                return 'right-4 -bottom-2 border-t-white';
            case 'top-left':
                return 'left-4 -top-2 border-b-white transform rotate-180';
            case 'top-right':
                return 'right-4 -top-2 border-b-white transform rotate-180';
            default:
                return '';
        }
    };

    return (
        <div className="relative" aria-live="polite">
            <div className="bg-white text-black py-2 px-3 rounded-xl shadow-md font-comic-neue">
                <p className="font-bold text-sm mb-1">{character}:</p>
                <p className="text-sm leading-tight">{speech}</p>
                <div
                    className={`absolute w-0 h-0 
                    border-l-[10px] border-l-transparent 
                    border-r-[10px] border-r-transparent 
                    border-t-[10px]
                    ${getTailClasses()}`}
                />
            </div>
        </div>
    );
};
