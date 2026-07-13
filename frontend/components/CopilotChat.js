var { useState, useEffect } = React;
var { motion } = window.Motion;

window.CopilotChat = () => {
    const { mode, selectedVenue, language, accessibilityNeeds, t, translateDynamicText } = window.useAppContext();
    
    const [messages, setMessages] = useState([
        { role: 'assistant', text: mode === 'fan' ? t('mock_fan_greeting') : t('mock_ops_greeting') }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(mode === 'fan');

    // Initial greeting changes when mode changes
    useEffect(() => {
        setMessages([
            { role: 'assistant', text: mode === 'fan' ? t('mock_fan_greeting') : t('mock_ops_greeting') }
        ]);
        setIsExpanded(mode === 'fan');
    }, [mode]);

    // Translate existing AI messages when language changes
    useEffect(() => {
        const translateMessages = async () => {
            const updatedMessages = await Promise.all(messages.map(async (msg) => {
                if (msg.role === 'assistant') {
                    const translatedRes = await translateDynamicText(msg.text, language);
                    return { ...msg, text: translatedRes.text, fallback: translatedRes.fallback };
                }
                return msg;
            }));
            setMessages(updatedMessages);
        };
        
        // Only run if we have messages and language changed
        if (messages.length > 0) {
            translateMessages();
        }
    }, [language]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!input.trim() || isLoading) return;
        
        const userMessage = input;
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);
        setIsExpanded(true);
        
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    mode,
                    venue_id: selectedVenue.id,
                    language: language,
                    accessible: accessibilityNeeds,
                    match_context: window.useAppContext().matchContext
                })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data.response, fallback: data.fallback }]);
        } catch (err) {
            console.error("Chat error:", err);
            setMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to orchestrator." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`bg-charcoal-800/60 flex flex-col shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-charcoal-600/60 transition-all duration-300 ${isExpanded ? 'h-[500px] rounded-2xl' : 'h-auto rounded-2xl'}`}
        >
            <div 
                className={`p-6 font-semibold flex justify-between items-center bg-transparent cursor-pointer hover:bg-charcoal-700/30 transition-colors ${isExpanded ? 'border-b border-charcoal-600/60 rounded-t-2xl' : 'rounded-2xl'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <span>{mode === 'fan' ? t('fan_copilot') : t('ops_assistant')}</span>
                    {!isExpanded && (
                        <span className="text-xs text-charcoal-400 font-normal">({t('click_to_expand') || 'Click to expand'})</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center text-xs text-pitch-400 bg-pitch-900/30 px-2 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-pitch-500 mr-2 animate-pulse"></span>
                        {t('online')}
                    </span>
                    <span className="text-charcoal-400 hover:text-white transition-colors">
                        {isExpanded ? '▼' : '▲'}
                    </span>
                </div>
            </div>
            
            {isExpanded && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                    const isRateLimited = msg.fallback;
                    const cleanText = msg.text;

                    return (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                msg.role === 'user' 
                                    ? 'bg-pitch-600 text-white rounded-br-none' 
                                    : 'bg-charcoal-700 text-charcoal-100 rounded-bl-none'
                            }`}>
                                {cleanText}
                                {isRateLimited && (
                                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-yellow-500 bg-yellow-900/30 px-1.5 py-0.5 rounded uppercase font-bold" title="Estimated Response">
                                        ⚠️ Est.
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-charcoal-700 text-charcoal-400 p-3 rounded-lg rounded-bl-none text-sm animate-pulse">
                            {t('thinking')}
                        </div>
                    </motion.div>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 border-t border-charcoal-600/60 bg-charcoal-800/40 rounded-b-2xl flex gap-3">
                <button type="button" className="bg-charcoal-700 hover:bg-charcoal-600 px-4 rounded-xl text-xl transition-colors shadow-sm" title="Voice Input">
                    🎤
                </button>
                <div className="flex flex-1">
                    <input 
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={mode === 'fan' ? t('fan_placeholder') : t('ops_placeholder')}
                        className="flex-1 w-full bg-charcoal-900 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pitch-500 border border-charcoal-700 border-r-0 disabled:opacity-50"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit"
                        className="bg-pitch-600 hover:bg-pitch-700 px-4 py-2 rounded-r-lg font-medium transition-colors disabled:opacity-50 border border-pitch-600"
                        disabled={isLoading}
                    >
                        {t('send')}
                    </button>
                </div>
            </form>
            </>
            )}
        </motion.div>
    );
};
