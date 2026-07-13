var { useState } = React;
var { motion, AnimatePresence } = window.Motion;

window.StandingsTable = () => {
    const { t, matchContext, matchContextError, retryFetchMatchData } = window.useAppContext();

    if (!matchContext || !matchContext.standings) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel-dark rounded-xl p-5 flex flex-col h-full border border-charcoal-700/50 shadow-2xl relative overflow-hidden items-center justify-center"
            >
                {matchContextError ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="text-red-400 font-semibold flex items-center gap-2">
                            <span className="text-xl">⚠️</span> {t('error_loading')}
                        </div>
                        <button 
                            onClick={retryFetchMatchData}
                            className="bg-charcoal-700 hover:bg-charcoal-600 text-charcoal-200 px-4 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                            {t('retry') || 'Retry'}
                        </button>
                    </div>
                ) : (
                    <div className="text-charcoal-400 font-semibold animate-pulse">Loading standings...</div>
                )}
            </motion.div>
        );
    }

    const currentGroup = {
        name: matchContext.group_name || 'Group',
        teams: matchContext.standings || []
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel-dark rounded-xl p-5 flex flex-col h-full border border-charcoal-700/50 shadow-2xl relative overflow-hidden"
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pitch-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-sm font-bold text-charcoal-400 mb-4 tracking-wider uppercase flex items-center justify-between z-10 relative h-6">
                <div className="flex items-center">
                    <span className="accent-gradient-bar mr-2 h-4"></span>
                    {t('group_stage_results')}
                </div>
                <div className="flex items-center gap-2 bg-charcoal-800/80 px-2 py-1 rounded-lg border border-charcoal-700 shadow-inner">
                    <div className="overflow-hidden w-20 flex justify-center">
                        <AnimatePresence mode="wait">
                            <motion.span 
                                key={currentGroup.name}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="text-xs text-pitch-300 font-bold whitespace-nowrap"
                            >
                                {currentGroup.name}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-x-auto z-10 relative">
                <table className="w-full text-left text-sm text-charcoal-300 border-collapse">
                    <thead className="text-xs text-charcoal-500 uppercase bg-charcoal-900/60 shadow-sm">
                        <tr>
                            <th className="px-3 py-3 rounded-tl-lg font-semibold tracking-wider">{t('team')}</th>
                            <th className="px-2 py-3 text-center font-semibold tracking-wider">{t('mp')}</th>
                            <th className="px-2 py-3 text-center font-semibold tracking-wider">{t('w')}</th>
                            <th className="px-2 py-3 text-center font-semibold tracking-wider">{t('pts')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal-800/50">
                        <AnimatePresence mode="wait">
                            {currentGroup.teams.map((team, idx) => (
                                <motion.tr 
                                    key={`${currentGroup.name}-${team.name}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                                    className={`transition-all duration-300 hover:bg-charcoal-800/40 ${idx === 0 ? 'bg-pitch-900/10' : ''}`}
                                >
                                    <td className="px-3 py-3.5 flex items-center gap-3">
                                        <div className={`w-5 h-5 flex items-center justify-center rounded-sm text-xs font-bold ${idx < 2 ? 'bg-pitch-600/20 text-pitch-400 border border-pitch-500/30' : 'text-charcoal-500'}`}>
                                            {team.rank}
                                        </div>
                                        <span className="text-xl filter drop-shadow-md">{team.emoji}</span>
                                        <span className={`font-bold tracking-wide ${idx === 0 ? 'text-white' : 'text-charcoal-200'}`}>{team.name}</span>
                                    </td>
                                    <td className="px-2 py-3.5 text-center font-medium text-charcoal-400">{team.played}</td>
                                    <td className="px-2 py-3.5 text-center font-medium text-green-400">{team.won}</td>
                                    <td className="px-2 py-3.5 text-center font-black text-pitch-400 text-base">{team.pts}</td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};
