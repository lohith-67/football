var { useState, useEffect } = React;
var { motion, AnimatePresence } = window.Motion;

class OpsSafeBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full w-full p-8 text-charcoal-100 bg-charcoal-900 rounded-2xl border border-red-500/50 shadow-2xl">
                    <h1 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
                        <span>⚠️</span> Something went wrong loading Ops Mode
                    </h1>
                    <div className="w-full max-w-4xl bg-charcoal-950 p-6 rounded-xl border border-charcoal-700 overflow-auto text-left mb-6">
                        <p className="text-red-400 font-mono text-sm font-bold">{this.state.error && this.state.error.toString()}</p>
                    </div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-colors"
                    >
                        Reload Dashboard
                    </button>
                </div>
            );
        }
        if (!this.props.component) {
            return (
                <div className="flex flex-col items-center justify-center h-full w-full p-8 text-charcoal-100 bg-charcoal-900 rounded-2xl border border-red-500/50 shadow-2xl">
                    <h1 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
                        <span>⚠️</span> Ops Mode Component Failed to Load
                    </h1>
                    <div className="w-full max-w-4xl bg-charcoal-950 p-6 rounded-xl border border-charcoal-700 overflow-auto text-left mb-6">
                        <p className="text-red-400 font-mono text-sm font-bold">window.OpsDashboard is undefined. Check console for Script errors.</p>
                    </div>
                </div>
            );
        }
        const Component = this.props.component;
        return <Component />;
    }
}

const App = () => {
    const { mode, t } = window.useAppContext();
    const StadiumBackdrop = window.StadiumBackdrop;
    const VenueSwitcher = window.VenueSwitcher;
    const MatchPanel = window.MatchPanel;
    const MapPanel = window.MapPanel;
    const StandingsTable = window.StandingsTable;
    const PlanCard = window.PlanCard;
    const CopilotChat = window.CopilotChat;
    const OpsDashboard = window.OpsDashboard;
    const LiveTranslator = window.LiveTranslator;
    const LandingPage = window.LandingPage;
    const OpsAuthModal = window.OpsAuthModal;

    const [showTranslator, setShowTranslator] = React.useState(false);

    return (
        <div className="app-container w-full min-h-screen text-charcoal-100 flex flex-col relative overflow-hidden">
            {mode !== 'landing' && <StadiumBackdrop />}
            
            {mode !== 'landing' && (
                <header className="absolute top-0 left-0 w-full p-4 md:p-6 flex flex-wrap justify-between items-center gap-4 z-20">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-charcoal-900 to-[#1B1F3B] rounded-lg flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-white/10">
                        <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="arcGradHeader" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                            <path d="M 8 26 C 8 26, 14 14, 20 14 C 26 14, 32 26, 32 26" fill="none" stroke="url(#arcGradHeader)" strokeWidth="4" strokeLinecap="round" />
                            <path d="M 12 30 C 12 30, 16 20, 20 20 C 24 20, 28 30, 28 30" fill="none" stroke="url(#arcGradHeader)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                            <circle cx="20" cy="9" r="2.5" fill="#C9A24B" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-wide">{t('app_title')}</h1>
                        <div className="text-xs text-pitch-400 font-medium">{t('app_subtitle')}</div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setShowTranslator(true)}
                        className="p-2 bg-charcoal-800 text-charcoal-300 hover:text-white hover:bg-charcoal-700 rounded-lg border border-charcoal-700 shadow-lg transition-colors flex items-center justify-center"
                        title={t('live_translator')}
                    >
                        <span className="text-lg">🌐</span>
                    </button>
                    <VenueSwitcher />
                </div>
            </header>
            )}
            
            <main className={`relative z-10 w-full flex-1 ${mode === 'landing' ? '' : 'pt-20 pb-6 px-6'}`}>
                <AnimatePresence mode="wait">
                    {mode === 'landing' ? (
                        <motion.div 
                            key="landing-mode"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-screen"
                        >
                            <LandingPage />
                        </motion.div>
                    ) : mode === 'fan' ? (
                        <motion.div 
                            key="fan-mode"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)]"
                        >
                            {/* Left Column: Match & Map & Standings */}
                            <div className="w-full md:w-7/12 flex flex-col gap-6 h-full">
                                <MatchPanel />
                                <div className="flex-1 flex flex-col xl:flex-row gap-6 min-h-[300px]">
                                    <AnimatePresence mode="popLayout">
                                        {window.useAppContext().isFindMySeatMode && (
                                            <motion.div 
                                                initial={{ opacity: 0, width: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, width: "100%", scale: 1 }}
                                                exit={{ opacity: 0, width: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex-1 min-h-[250px]"
                                            >
                                                <MapPanel />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <motion.div layout className="flex-1 min-h-[250px] transition-all duration-300">
                                        <StandingsTable />
                                    </motion.div>
                                </div>
                            </div>
                            
                            {/* Right Column: Chat & Plan */}
                            <div className="w-full md:w-5/12 flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-4">
                                <PlanCard />
                                <CopilotChat />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="ops-mode"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-[calc(100vh-120px)]"
                        >
                            <OpsSafeBoundary component={OpsDashboard} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            
            {/* Overlay components */}
            <AnimatePresence>
                {showTranslator && <LiveTranslator onClose={() => setShowTranslator(false)} />}
                <OpsAuthModal />
            </AnimatePresence>
            {/* Floating Action Button for Live Translator removed as per request */}
        </div>
    );
};

// Render the app
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
    <window.AppProvider>
        <App />
    </window.AppProvider>
);
