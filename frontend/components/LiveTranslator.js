var { useState, useEffect, useRef } = React;
var { motion, AnimatePresence } = window.Motion;

window.LiveTranslator = ({ onClose }) => {
    const { language, t } = window.useAppContext(); // Default language for device holder
    const [guestLanguage, setGuestLanguage] = useState('es');
    const [hostLanguage, setHostLanguage] = useState(language);
    const [isRecording, setIsRecording] = useState(false);
    const LanguageCombobox = window.LanguageCombobox;
    
    // Auto-detect simulated
    const [conversation, setConversation] = useState([
        { id: 1, speaker: 'host', text: "Hello! I need help finding my seat.", translation: "¡Hola! Necesito ayuda para encontrar mi asiento." },
        { id: 2, speaker: 'guest', text: "Siga recto y luego gire a la izquierda.", translation: "Go straight and then turn left." }
    ]);

    const handleMicClick = () => {
        if(isRecording) return;
        setIsRecording(true);
        // Simulate auto-detecting and adding a new message after 2 seconds
        setTimeout(() => {
            setIsRecording(false);
            setConversation(prev => [...prev, { 
                id: Date.now(), 
                speaker: Math.random() > 0.5 ? 'host' : 'guest', 
                text: "Where is Gate D?", 
                translation: "¿Dónde está la Puerta D?" 
            }]);
        }, 2000);
    };

    const MessageList = ({ isHost }) => (
        <div className="flex-1 overflow-y-auto flex flex-col justify-end space-y-6 p-6">
            <AnimatePresence>
                {conversation.slice().reverse().map(msg => {
                    // host message on host side is "own" message, so right-aligned. On guest side it's "their" message.
                    const isOwnMessage = isHost ? msg.speaker === 'host' : msg.speaker === 'guest';
                    return (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                        >
                            <div className="text-3xl md:text-5xl font-bold text-white mb-2 max-w-[85%] text-center leading-tight drop-shadow-lg">
                                {isOwnMessage ? msg.text : msg.translation}
                            </div>
                            <div className="text-lg md:text-2xl text-emerald-400 font-semibold opacity-80">
                                {isOwnMessage ? msg.translation : msg.text}
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900"
        >
            <div className="w-full h-full flex flex-col relative bg-black">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 left-6 z-50 bg-charcoal-800/80 backdrop-blur w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-charcoal-700 transition shadow-xl border border-charcoal-600"
                >
                    ✕
                </button>

                {/* Top Half (Guest) - Rotated 180 */}
                <div className="flex-1 bg-gradient-to-t from-black to-pitch-900/20 rotate-180 flex flex-col relative overflow-hidden border-b border-charcoal-800">
                    <div className="p-4 flex justify-between items-center opacity-80 bg-black/40 shadow-sm">
                        <div className="w-48 z-50">
                            <LanguageCombobox value={guestLanguage} onChange={setGuestLanguage} position="bottom" />
                        </div>
                        <button className="bg-charcoal-800 hover:bg-charcoal-700 px-4 py-2 rounded-full text-sm text-charcoal-300 font-medium transition flex items-center gap-2">
                            <span>⌨️</span> {t('keyboard')}
                        </button>
                    </div>
                    <MessageList isHost={false} />
                </div>

                {/* Center Divider & Universal Mic */}
                <div className="h-0 w-full relative z-40 flex items-center justify-center">
                    <button 
                        onClick={handleMicClick}
                        className={`absolute w-24 h-24 rounded-full flex items-center justify-center text-5xl transition-all duration-300 shadow-2xl border-4 border-charcoal-900 z-50 ${isRecording ? 'bg-red-500 scale-110 animate-pulse shadow-red-500/50' : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-105 shadow-emerald-500/30'}`}
                    >
                        🎤
                    </button>
                </div>

                {/* Bottom Half (Host) - Normal */}
                <div className="flex-1 bg-gradient-to-t from-black to-emerald-900/20 flex flex-col relative overflow-hidden border-t border-charcoal-800">
                    <div className="p-4 flex justify-between items-center opacity-80 bg-black/40 shadow-sm">
                        <div className="w-48 z-50">
                            <LanguageCombobox value={hostLanguage} onChange={setHostLanguage} position="top" />
                        </div>
                        <button className="bg-charcoal-800 hover:bg-charcoal-700 px-4 py-2 rounded-full text-sm text-charcoal-300 font-medium transition flex items-center gap-2">
                            <span>⌨️</span> {t('keyboard')}
                        </button>
                    </div>
                    <MessageList isHost={true} />
                </div>

                {/* Footer */}
                <div className="h-14 border-t border-charcoal-800 bg-charcoal-900 flex justify-between items-center px-6 text-sm shadow-inner z-50">
                    <div className="flex items-center text-emerald-400 font-bold uppercase tracking-wide">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        {t('live_conversation')}
                    </div>
                    <div className="text-charcoal-400 font-medium opacity-80">
                        {t('tap_mic_to_speak')} {hostLanguage} / {guestLanguage}
                    </div>
                </div>

            </div>
        </motion.div>
    );
};
