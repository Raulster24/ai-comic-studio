
import React, { useState } from 'react';
import type { StoryFormData } from '../types';
import { GENRES, ART_STYLES, PANEL_LAYOUTS } from '../constants';
import { GenreIcon } from './icons/GenreIcon';
import { StyleIcon } from './icons/StyleIcon';
import { LayoutIcon } from './icons/LayoutIcon';
import { CharacterIcon } from './icons/CharacterIcon';
import { SettingIcon } from './icons/SettingIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface StoryFormProps {
    onSubmit: (data: StoryFormData) => void;
    isLoading: boolean;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<StoryFormData>({
        storyPrompt: 'A young scientist gains powers from a lab accident and faces their first villain.',
        genre: 'Superhero',
        artStyle: 'Classic American Comics',
        panelLayout: '6-panel page',
        protagonist: 'Alex, a brilliant but shy college student.',
        antagonist: 'Dr. Chaos, a megalomaniac with a grudge.',
        supportingChars: 'Alex\'s witty best friend, Jamie.',
        setting: 'A sprawling, futuristic metropolis at night.',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };
    
    const inputLabelClass = "flex items-center gap-2 mb-2 text-sm font-bold text-yellow-300/90";
    const inputBaseClass = "w-full p-2.5 bg-gray-700/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-white placeholder-gray-400";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="storyPrompt" className={inputLabelClass}>
                    <SparklesIcon /> Your Story Idea
                </label>
                <textarea
                    id="storyPrompt"
                    name="storyPrompt"
                    value={formData.storyPrompt}
                    onChange={handleChange}
                    className={`${inputBaseClass} min-h-[100px]`}
                    placeholder="e.g., A detective solves a mystery in a city of robots."
                    required
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="genre" className={inputLabelClass}><GenreIcon /> Genre</label>
                    <select id="genre" name="genre" value={formData.genre} onChange={handleChange} className={inputBaseClass}>
                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="artStyle" className={inputLabelClass}><StyleIcon /> Art Style</label>
                    <select id="artStyle" name="artStyle" value={formData.artStyle} onChange={handleChange} className={inputBaseClass}>
                        {ART_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="panelLayout" className={inputLabelClass}><LayoutIcon /> Panel Layout</label>
                <select id="panelLayout" name="panelLayout" value={formData.panelLayout} onChange={handleChange} className={inputBaseClass}>
                    {PANEL_LAYOUTS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="protagonist" className={inputLabelClass}><CharacterIcon /> Characters</label>
                 <textarea
                    id="protagonist"
                    name="protagonist"
                    value={formData.protagonist}
                    onChange={handleChange}
                    className={`${inputBaseClass} mb-2`}
                    placeholder="Protagonist description"
                />
                 <textarea
                    id="antagonist"
                    name="antagonist"
                    value={formData.antagonist}
                    onChange={handleChange}
                    className={`${inputBaseClass} mb-2`}
                    placeholder="Antagonist description"
                />
                 <textarea
                    id="supportingChars"
                    name="supportingChars"
                    value={formData.supportingChars}
                    onChange={handleChange}
                    className={`${inputBaseClass}`}
                    placeholder="Supporting characters"
                />
            </div>

            <div>
                <label htmlFor="setting" className={inputLabelClass}><SettingIcon /> Setting</label>
                <textarea
                    id="setting"
                    name="setting"
                    value={formData.setting}
                    onChange={handleChange}
                    className={inputBaseClass}
                    placeholder="e.g., A neon-lit cyberpunk city, a magical forest"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full font-bangers text-2xl tracking-wider py-3 px-4 bg-yellow-400 text-gray-900 rounded-lg shadow-lg hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 transform hover:scale-105 transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    'Create My Comic!'
                )}
            </button>
        </form>
    );
};
