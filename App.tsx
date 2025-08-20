import React, { useState, useCallback } from 'react';
import { StoryForm } from './components/StoryForm';
import { ComicViewer } from './components/ComicViewer';
import { generateComicScript, generatePanelImage } from './services/geminiService';
import type { StoryFormData, ComicScript, PanelData, ComicPanel } from './types';

const App: React.FC = () => {
    const [comicPanels, setComicPanels] = useState<ComicPanel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = useCallback(async (formData: StoryFormData) => {
        setIsLoading(true);
        setError(null);
        setComicPanels([]);
        
        try {
            setLoadingMessage('Generating comic script...');
            const script: ComicScript = await generateComicScript(formData);

            if (!script || !script.panels || script.panels.length === 0) {
                throw new Error("Failed to generate a valid comic script.");
            }

            // Initialize panels with script data and loading state
            const initialPanels: ComicPanel[] = script.panels.map(panelData => ({
                ...panelData,
                imageUrl: null,
                isLoading: true,
            }));
            setComicPanels(initialPanels);

            setLoadingMessage('Generating panel images...');
            
            // Create a character description string for consistency
            const characterDescriptions = `
                CHARACTER DESCRIPTIONS FOR VISUAL CONSISTENCY:
                - Protagonist: ${formData.protagonist}
                - Antagonist: ${formData.antagonist}
                - Supporting Characters: ${formData.supportingChars}
            `.trim();

            const panelPromises = script.panels.map((panelData: PanelData, index: number) => {
                // Prepend character descriptions to each image prompt
                const enhancedImagePrompt = `${characterDescriptions}\n\nPANEL SCENE: ${panelData.imagePrompt}`;
                
                return generatePanelImage(enhancedImagePrompt, formData.artStyle)
                    .then(imageUrl => ({imageUrl, index}))
                    .catch(e => {
                        console.error(`Failed to generate image for panel ${index + 1}:`, e);
                        return { imageUrl: 'error', index }; // Mark panel as errored
                    });
            });


            for (const promise of panelPromises) {
                const { imageUrl, index } = await promise;
                setComicPanels(prevPanels => {
                    const newPanels = [...prevPanels];
                    if (newPanels[index]) {
                        newPanels[index].imageUrl = imageUrl === 'error' ? null : `data:image/jpeg;base64,${imageUrl}`;
                        newPanels[index].isLoading = false;
                    }
                    return newPanels;
                });
            }

        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Failed to generate comic. ${errorMessage}`);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row">
            <header className="lg:hidden w-full bg-gray-900/80 backdrop-blur-sm border-b border-yellow-400/30 p-4 flex items-center justify-center sticky top-0 z-20">
                <h1 className="text-3xl font-bangers text-yellow-400 tracking-wider">AI Comic Studio</h1>
            </header>

            <aside className="w-full lg:w-1/3 xl:w-1/4 p-6 bg-gray-800/50 border-r border-yellow-400/20 overflow-y-auto">
                <div className="sticky top-6">
                    <div className="hidden lg:flex items-center gap-3 mb-8">
                         <h1 className="text-4xl font-bangers text-yellow-400 tracking-wider">AI Comic Studio</h1>
                    </div>
                    <StoryForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                </div>
            </aside>
            
            <main className="flex-1 p-6 lg:p-10">
                <ComicViewer 
                    panels={comicPanels} 
                    isLoading={isLoading} 
                    loadingMessage={loadingMessage} 
                    error={error} 
                />
            </main>
        </div>
    );
};

export default App;