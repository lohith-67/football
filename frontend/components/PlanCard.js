var { useState, useEffect } = React;
var { motion, AnimatePresence } = window.Motion;

window.PlanCard = () => {
    const { t, accessibilityNeeds } = window.useAppContext();
    
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state
    const [startLocation, setStartLocation] = useState("Current Location");
    const [priority, setPriority] = useState("Lowest Carbon");
    const [accRequired, setAccRequired] = useState(accessibilityNeeds);
    const [transports, setTransports] = useState({
        transit: true,
        rideshare: true,
        walking: true
    });

    const [isLoading, setIsLoading] = useState(false);

    // Toggle transport preference
    const toggleTransport = (type) => {
        setTransports(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleSave = () => {
        setIsLoading(true);
        // Mock a backend re-calculation
        setTimeout(() => {
            setIsLoading(false);
            setIsEditing(false);
        }, 800);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel-dark rounded-xl shadow-2xl border border-charcoal-700/50 overflow-hidden"
        >
            <div className="p-5 border-b border-charcoal-700/50 flex justify-between items-center bg-charcoal-800/20">
                <h3 className="text-lg font-bold flex items-center h-6">
                    <span className="accent-gradient-bar mr-2 h-5"></span>
                    <span className="bg-green-500/20 text-green-400 p-1.5 rounded-lg mr-2 flex items-center h-full">🌱</span>
                    {t('recommended_route')}
                </h3>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1.5 bg-charcoal-800 hover:bg-charcoal-700 rounded text-charcoal-400 hover:text-white transition-colors border border-charcoal-700"
                    title="Edit Preferences"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                </button>
            </div>
            
            <AnimatePresence initial={false}>
                {isEditing && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-charcoal-900/50 border-b border-charcoal-700/50"
                    >
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase text-charcoal-300 font-bold mb-1">Starting Point</label>
                                <input 
                                    type="text" 
                                    value={startLocation}
                                    onChange={e => setStartLocation(e.target.value)}
                                    className="w-full bg-charcoal-800 text-white rounded border border-charcoal-700 px-3 py-2 text-sm focus:border-pitch-500 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase text-charcoal-300 font-bold mb-2">Transport Preferences</label>
                                <div className="flex flex-wrap gap-2">
                                    <button 
                                        onClick={() => toggleTransport('transit')}
                                        className={`px-3 py-1 text-xs rounded-full border transition ${transports.transit ? 'bg-pitch-600/30 border-pitch-500 text-pitch-300' : 'bg-charcoal-800 border-charcoal-700 text-charcoal-400'}`}
                                    >Transit + Walk</button>
                                    <button 
                                        onClick={() => toggleTransport('rideshare')}
                                        className={`px-3 py-1 text-xs rounded-full border transition ${transports.rideshare ? 'bg-pitch-600/30 border-pitch-500 text-pitch-300' : 'bg-charcoal-800 border-charcoal-700 text-charcoal-400'}`}
                                    >Rideshare</button>
                                    <button 
                                        onClick={() => toggleTransport('walking')}
                                        className={`px-3 py-1 text-xs rounded-full border transition ${transports.walking ? 'bg-pitch-600/30 border-pitch-500 text-pitch-300' : 'bg-charcoal-800 border-charcoal-700 text-charcoal-400'}`}
                                    >Walking</button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase text-charcoal-300 font-bold mb-2">Priority</label>
                                <div className="flex gap-2">
                                    {['Fastest', 'Lowest Carbon', 'Most Accessible'].map(p => (
                                        <button 
                                            key={p}
                                            onClick={() => setPriority(p)}
                                            className={`flex-1 py-1.5 text-xs rounded border transition ${priority === p ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400 font-bold' : 'bg-charcoal-800 border-charcoal-700 text-charcoal-400 hover:bg-charcoal-750'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-[10px] uppercase text-charcoal-300 font-bold">Accessible Route Required</label>
                                <button 
                                    onClick={() => setAccRequired(!accRequired)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${accRequired ? 'bg-pitch-500' : 'bg-charcoal-700'}`}
                                >
                                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${accRequired ? 'translate-x-5' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="pt-2">
                                <button 
                                    onClick={handleSave}
                                    className="w-full bg-pitch-600 hover:bg-pitch-500 text-white font-bold py-2 rounded transition shadow flex items-center justify-center"
                                >
                                    {isLoading ? <span className="animate-spin mr-2">⏳</span> : null}
                                    Save & Recalculate
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="p-5 space-y-4">
                {transports.transit && (
                    <div className={`bg-charcoal-800/60 rounded-lg p-4 border transition-colors cursor-pointer ${priority === 'Lowest Carbon' || priority === 'Fastest' ? 'border-green-500/50 bg-charcoal-800/80 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'border-charcoal-700/50 hover:bg-charcoal-800'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold text-pitch-400">{t('transit_walk')}</div>
                            <div className="text-right">
                                <div className="text-lg font-bold">24 min</div>
                                <div className="text-xs text-charcoal-400">{t('eta')} 6:45 PM</div>
                            </div>
                        </div>
                        
                        <div className="flex text-xs space-x-2 mt-3">
                            <span className="bg-green-900/40 text-green-400 px-2 py-1 rounded border border-green-800/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]">{t('lowest_co2')}</span>
                            {(accRequired || priority === 'Most Accessible') && (
                                <span className="bg-pitch-900/40 text-pitch-400 px-2 py-1 rounded border border-pitch-800/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]">{t('accessible')} ♿</span>
                            )}
                        </div>
                    </div>
                )}
                
                {transports.rideshare && (
                    <div className="bg-charcoal-800/40 rounded-lg p-4 border border-charcoal-700/50 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="flex justify-between items-start">
                            <div className="font-semibold text-charcoal-300">{t('rideshare')}</div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-charcoal-300">18 min</div>
                            </div>
                        </div>
                        <div className="flex text-xs mt-2">
                            <span className="bg-yellow-900/40 text-yellow-500 px-2 py-1 rounded border border-yellow-800/50 shadow-[0_0_10px_rgba(234,179,8,0.3)] flex items-center">
                                <span className="mr-1">⚠️</span> {t('high_congestion')}
                            </span>
                        </div>
                        {accRequired && (
                            <div className="flex text-xs mt-3">
                                <span className="bg-pitch-900/40 text-pitch-400 px-2 py-1 rounded border border-pitch-800/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]">{t('accessible')} ♿</span>
                            </div>
                        )}
                    </div>
                )}

                {transports.walking && (
                    <div className="bg-charcoal-800/40 rounded-lg p-4 border border-charcoal-700/50 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="flex justify-between items-start">
                            <div className="font-semibold text-charcoal-300">{t('walking_scenic')}</div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-charcoal-300">35 min</div>
                            </div>
                        </div>
                        <div className="flex text-xs space-x-2 mt-3">
                            <span className="bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded border border-emerald-800/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]">{t('zero_carbon')} 🌳</span>
                        </div>
                    </div>
                )}

                {!transports.transit && !transports.rideshare && !transports.walking && (
                    <div className="text-center text-charcoal-300 py-4 text-sm font-medium border border-dashed border-charcoal-700 rounded-lg">
                        No transport modes selected.
                    </div>
                )}
            </div>
        </motion.div>
    );
};
