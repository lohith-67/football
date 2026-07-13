var { useState, useEffect } = React;
var { motion } = window.Motion;

window.MatchPanel = () => {
    const { selectedVenue, t, isFindMySeatMode, setIsFindMySeatMode, matchContext, matchContextError } = window.useAppContext();
    
    const [countdownDiff, setCountdownDiff] = useState(null);
    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {
        if (matchContext) {
            const now = new Date();
            setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
    }, [matchContext]);

    useEffect(() => {
        if (!matchContext || !matchContext.kickoff) return;
        setCountdownDiff(new Date(matchContext.kickoff) - new Date());
        const interval = setInterval(() => {
            const diff = new Date(matchContext.kickoff) - new Date();
            setCountdownDiff(diff);
            if (diff <= 0) {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [matchContext]);

    let countdownDisplay = "Calculating...";
    if (countdownDiff !== null) {
        if (countdownDiff <= 0) {
            countdownDisplay = t('kickoff_in') + " 0 " + t('mins');
        } else {
            const h = Math.floor(countdownDiff / (1000 * 60 * 60));
            const m = Math.floor((countdownDiff % (1000 * 60 * 60)) / (1000 * 60));
            countdownDisplay = `${t('kickoff_in')} ${h}h ${m}m`;
        }
    }

    if (!matchContext) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel-dark rounded-xl p-6 w-full shadow-2xl border border-charcoal-700/50 flex items-center justify-center h-48"
            >
                {matchContextError ? (
                    <div className="text-red-400 font-semibold flex items-center gap-2">
                        <span className="text-xl">⚠️</span> {t('error_loading')}
                    </div>
                ) : (
                    <div className="text-charcoal-400 font-semibold animate-pulse">Loading match data...</div>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel-dark accent-gradient-top rounded-xl p-6 w-full shadow-2xl border border-charcoal-700/50 overflow-hidden"
        >
            <div className="flex justify-between items-center mb-4 border-b border-charcoal-700 pb-4">
                <div className="text-sm text-charcoal-400 font-semibold tracking-wider uppercase flex items-center h-4">
                    <span className="accent-gradient-bar mr-2"></span>
                    {t('live_match_context')}
                </div>
                <div className="flex items-center space-x-2 text-sm text-charcoal-300 bg-charcoal-800/50 px-3 py-1 rounded-full">
                    {/* Fallback weather for now, could be added to matchContext */}
                    <span>☀️</span>
                    <span>72°F</span>
                </div>
            </div>
            
            <div className="flex justify-between items-center px-4">
                <div className="text-center flex-1">
                    <div className="text-4xl font-bold tracking-wider">{matchContext.teams?.home || '?'}</div>
                    <div className="text-xs text-charcoal-400 uppercase mt-2 font-semibold">Home</div>
                </div>
                
                <div className="text-center flex-1 flex flex-col items-center justify-center">
                    <div className="text-5xl font-black text-accent mb-3 tracking-widest">{matchContext.score || '0 - 0'}</div>
                    <div className={`flex items-center text-xs px-3 py-1.5 rounded-full border shadow-inner accent-gradient-top overflow-hidden relative ${matchContext.status === 'Live' ? 'text-red-400 bg-red-900/40 border-red-800/50' : 'text-green-400 bg-green-900/40 border-green-800/50'}`}>
                        {matchContext.status === 'Live' && <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>}
                        <span className="font-semibold uppercase tracking-wider">{matchContext.status || 'Pre-match'}</span>
                    </div>
                </div>
                
                <div className="text-center flex-1">
                    <div className="text-4xl font-bold tracking-wider">{matchContext.teams?.away || '?'}</div>
                    <div className="text-xs text-charcoal-400 uppercase mt-2 font-semibold">Away</div>
                </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-charcoal-700/80 flex justify-between items-center text-sm">
                <div className="flex flex-col gap-1">
                    <div className="text-charcoal-400 font-medium flex items-center bg-charcoal-800/40 px-3 py-1.5 rounded-lg accent-gradient-top overflow-hidden relative border border-charcoal-700/50">
                        <span className="mr-1.5 opacity-70">⏱️</span>
                        {countdownDisplay}
                    </div>
                    {lastUpdated && <div className="text-[10px] text-charcoal-500">Last updated: {lastUpdated}</div>}
                    {matchContext.is_estimated && <div className="text-[10px] text-yellow-500 mt-1">⚠️ Live data temporarily estimated</div>}
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-charcoal-300 font-medium">{matchContext.venue_name || selectedVenue.name}</div>
                    <button 
                        onClick={() => setIsFindMySeatMode(!isFindMySeatMode)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${isFindMySeatMode ? 'bg-pitch-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-charcoal-800 text-pitch-400 hover:bg-charcoal-700 border border-pitch-500/30'}`}
                    >
                        🎟️ {t('find_my_seat') || 'Find My Seat'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
