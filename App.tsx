import { Clipboard } from '@capacitor/clipboard';
import React, { useState, useEffect } from 'react';
import { StreamPlayer } from './components/StreamPlayer';
import { parseStreamUrl } from './services/streamService';
import type { Stream } from './types';
import { PlusIcon } from './components/icons/PlusIcon';
import { SaveIcon } from './components/icons/SaveIcon';

const App: React.FC = () => {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [notification, setNotification] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    const [showButtons, setShowButtons] = useState(false);
    const hideButtonsTimeout = React.useRef<NodeJS.Timeout | null>(null);

    // Load streams from localStorage on initial render
    useEffect(() => {
        try {
            const savedStreams = localStorage.getItem('streams');
            if (savedStreams) {
                setStreams(JSON.parse(savedStreams));
            }
        } catch (error) {
            console.error("Failed to parse streams from localStorage", error);
        }
    }, []);

    // Save streams to localStorage whenever they change
    const saveStreams = (streamsToSave: Stream[]) => {
        try {
            localStorage.setItem('streams', JSON.stringify(streamsToSave));
            setNotificationType('success');
            setNotification('Layout saved!');
            setTimeout(() => setNotification(null), 2000);
        }
        catch (error) {
            console.error("Failed to save streams to localStorage", error);
            setNotificationType('error');
            setNotification('Failed to save layout.');
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const pasteAndAddStream = async () => {
        try {
            const { value: url } = await Clipboard.read();
            if (!url.trim()) {
                setNotificationType('error');
                setNotification("El portapapeles está vacío.");
                setTimeout(() => setNotification(null), 3000);
                return;
            }
            const errorMessage = handleAddStream(url);
            if (errorMessage) {
                setNotificationType('error');
                setNotification(errorMessage);
                setTimeout(() => setNotification(null), 5000); // Longer timeout for errors
            }
        } catch (err) {
            console.error("Failed to read clipboard contents: ", err);
            setNotificationType('error');
            setNotification("No se pudo pegar desde el portapapeles.");
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleButtonsMouseEnter = () => {
        if (hideButtonsTimeout.current) {
            clearTimeout(hideButtonsTimeout.current);
        }
        setShowButtons(true);
        hideButtonsTimeout.current = setTimeout(() => {
            setShowButtons(false);
        }, 5000);
    };

    const handleButtonsMouseLeave = () => {
        if (hideButtonsTimeout.current) {
            clearTimeout(hideButtonsTimeout.current);
        }
        setShowButtons(false);
    };
    
    const handleAddStream = (url: string): string | null => {
        const parsed = parseStreamUrl(url);

        if (parsed.platform !== 'm3u8' && (parsed.platform === 'unknown' || !parsed.videoId)) {
            return "Invalid or unsupported YouTube/Twitch/Kick URL.";
        }

        if (streams.some(s => s.videoId === parsed.videoId && s.platform === parsed.platform)) {
            return "This stream has already been added.";
        }

        const newStream: Stream = {
            id: `${parsed.platform}-${parsed.videoId}-${Date.now()}`,
            originalUrl: url,
            platform: parsed.platform,
            videoId: parsed.videoId,
            twitchContentType: parsed.twitchContentType,
            youtubeContentType: parsed.youtubeContentType,
        };

        const updatedStreams = [...streams, newStream];
        setStreams(updatedStreams);
        // Do not auto-save on add, let user save manually
        return null; // Success
    };

    const handleRemoveStream = (id: string) => {
        const updatedStreams = streams.filter(stream => stream.id !== id);
        setStreams(updatedStreams);
    };

    const getGridCols = (count: number) => {
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-1 lg:grid-cols-2';
        if (count === 3 || count === 4) return 'grid-cols-1 md:grid-cols-2';
        if (count > 4) return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
        return 'grid-cols-1';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white font-sans relative">
            
            {/* Floating Action Buttons - Visible only when streams exist */}
            {streams.length > 0 && (
                <div 
                    className="fixed bottom-16 right-8 z-50"
                    onMouseEnter={handleButtonsMouseEnter}
                    onMouseLeave={handleButtonsMouseLeave}
                >
                    <div className={`flex flex-row-reverse items-center space-x-4 space-x-reverse p-4 transition-opacity duration-300 ${showButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {/* Add Button */}
                        <button
                            onClick={pasteAndAddStream}
                            className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-500/30 flex items-center justify-center"
                            title="Add Stream from Clipboard"
                        >
                            <PlusIcon />
                        </button>

                        {/* Save Button */}
                        <button
                            onClick={() => saveStreams(streams)}
                            className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-500/30 flex items-center justify-center"
                            title="Save Layout"
                        >
                            <SaveIcon />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Add Button - Visible only on initial empty screen, with animation */}
            {streams.length === 0 && (
                <button
                    onClick={pasteAndAddStream}
                    className="fixed bottom-16 right-8 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-500/30 flex items-center justify-center animate-pulse animate-ping"
                    title="Add First Stream from Clipboard"
                >
                    <PlusIcon />
                </button>
            )}

            <main className="p-2 min-h-screen">
                {streams.length > 0 ? (
                    <div className={`grid ${getGridCols(streams.length)} gap-2 max-w-full mx-auto`}>
                        {streams.map(stream => (
                            <StreamPlayer key={stream.id} stream={stream} onRemove={handleRemoveStream} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-100px)]">
                        <div className="max-w-lg mx-auto space-y-6">
                            
                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                    Todos tus streams en una sola pantalla.
                                </h2>
                                <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
                                    Armá tu panel. Pega links y Mirá todo al mismo tiempo.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <button
                                    onClick={pasteAndAddStream}
                                    className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl transition-all duration-300 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/30 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 mx-auto"
                                >
                                    <PlusIcon />
                                    <span>Pegar primer Stream</span>
                                </button>
                                <p className="text-xs text-gray-500 mt-2">No necesitás cuenta. Es instantáneo.</p>
                                
                                <div className="text-sm text-gray-500 space-y-1">
                                
                                    <div className="flex justify-center space-x-4 text-xs">
                                        <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full">YouTube</span>
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">Twitch</span>
                                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full">Kick</span>
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">M3U8</span>
                                    </div>
                                </div>
                                                                    <p className="text-xs text-gray-500">Beta Publica</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>



            {notification && (
                <div className={`fixed bottom-6 right-6 text-white px-6 py-3 rounded-2xl shadow-2xl animate-fade-in-out backdrop-blur-sm border ${notificationType === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400/30' : 'bg-gradient-to-r from-red-500 to-rose-500 border-red-400/30'}`}>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 bg-white rounded-full ${notificationType === 'error' ? 'animate-ping' : 'animate-pulse'}`}></div>
                        <span className="font-medium">{notification}</span>
                    </div>
                </div>
            )}
             
            <style>{`
                @keyframes stream-enter {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-stream-enter {
                    animation: stream-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: translateY(20px) scale(0.9); }
                    15% { opacity: 1; transform: translateY(0) scale(1); }
                    85% { opacity: 1; transform: translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(31, 41, 55, 0.5);
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #7c3aed, #2563eb);
                }
                
                /* Smooth transitions for all interactive elements */
                * {
                    transition-duration: 0.2s;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </div>
    );
};

export default App;
