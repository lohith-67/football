var { motion } = window.Motion;
var { useState, useEffect } = React;

const KPICard = ({ title, value, sub, icon, iconColor, isUrgent }) => {
    const textColors = {
        blue: 'text-pitch-400',
        green: 'text-green-400',
        red: 'text-red-400',
        purple: 'text-purple-400',
        emerald: 'text-emerald-400',
    };
    
    const bgClass = isUrgent 
        ? 'bg-red-900/20 border-red-500/30' 
        : 'bg-charcoal-800/60 border-charcoal-600/60 shadow-[0_0_15px_rgba(255,255,255,0.05)]';

    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 border ${bgClass} flex items-center justify-between backdrop-blur transition-all duration-300 ease-out cursor-pointer motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] motion-safe:active:scale-[0.98] ${!isUrgent && 'hover:bg-charcoal-700/60'}`}
        >
            <div>
                <div className="text-xs text-charcoal-300 uppercase tracking-wider font-semibold mb-1">{title}</div>
                <div className={`text-2xl font-bold ${textColors[iconColor] || 'text-white'}`}>{value}</div>
                <div className="text-xs text-charcoal-400 mt-1">{sub}</div>
            </div>
            <div className={`text-3xl opacity-80 ${textColors[iconColor] || ''}`}>{icon}</div>
        </motion.div>
    );
};

const ZoneSensorFeed = React.memo(() => {
    const { t } = window.useAppContext();
    const zones = [
        { name: 'Zone A (North)', density: 92, color: 'bg-red-500' },
        { name: 'Zone B (East)', density: 45, color: 'bg-green-500' },
        { name: 'Zone C (South)', density: 78, color: 'bg-yellow-500' },
        { name: 'Zone D (West)', density: 20, color: 'bg-pitch-500' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-charcoal-300 font-mono">{t('live_feed')}</span>
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {zones.map(z => (
                    <div key={z.name} className="bg-charcoal-800/60 rounded-xl border border-charcoal-600/60 p-4 relative overflow-hidden group cursor-pointer transition-all duration-300 ease-out hover:bg-charcoal-700/60 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] motion-safe:active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30" style={{ backgroundColor: z.color.replace('bg-', '').replace('-500', '') }}></div>
                        <div className="relative z-10 flex flex-col items-center justify-center h-16">
                            <span className="text-[10px] text-charcoal-300 font-bold mb-1 text-center">{z.name}</span>
                            <span className={`text-lg font-mono font-bold ${z.density > 80 ? 'text-red-400' : z.density > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {z.density}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

const QuickPhraseTranslator = () => {
    const { language } = window.useAppContext();
    const phrases = [
        { en: "Please move to Gate D.", es: "Por favor, muévase a la Puerta D.", fr: "Veuillez vous diriger vers la porte D.", pt: "Por favor, vá para o Portão D." },
        { en: "Is anyone hurt?", es: "¿Alguien está herido?", fr: "Y a-t-il des blessés?", pt: "Alguém está machucado?" },
        { en: "Show me your ticket.", es: "Muéstrame tu boleto.", fr: "Montrez-moi votre billet.", pt: "Mostre-me o seu bilhete." },
    ];

    return (
        <div className="space-y-4 mt-4">
            {phrases.map((p, i) => (
                <button key={i} className="w-full text-left bg-charcoal-800/60 hover:bg-charcoal-700/60 border border-charcoal-600/60 p-4 rounded-xl transition-all duration-300 ease-out group shadow-[0_0_15px_rgba(255,255,255,0.05)] motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] motion-safe:active:scale-[0.98]">
                    <div className="text-xs text-charcoal-300 mb-1">{p.en}</div>
                    <div className="text-sm text-emerald-400 font-semibold">{p[language] || p.en}</div>
                </button>
            ))}
        </div>
    );
};

const StaffBreakdown = () => {
    const { t } = window.useAppContext();
    const staffData = [
        { role: t('security'), count: 184, total: 200, color: 'bg-pitch-500' },
        { role: t('guest_services'), count: 145, total: 150, color: 'bg-purple-500' },
        { role: t('medical'), count: 42, total: 45, color: 'bg-red-500' },
        { role: t('maintenance'), count: 85, total: 90, color: 'bg-yellow-500' },
        { role: 'Accessibility', count: 18, total: 20, color: 'bg-emerald-500' },
    ];

    return (
        <div className="space-y-4 mt-4">
            {staffData.map(s => (
                <div key={s.role} className="space-y-2 p-3 -mx-3 rounded-xl transition-all duration-300 ease-out cursor-pointer hover:bg-charcoal-800/60 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] motion-safe:active:scale-[0.98]">
                    <div className="flex justify-between text-xs text-charcoal-300 font-semibold">
                        <span>{s.role}</span>
                        <span>{s.count} / {s.total}</span>
                    </div>
                    <div className="w-full bg-charcoal-800/50 rounded-full h-2 overflow-hidden border border-charcoal-700">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.count / s.total) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${s.color}`}
                        ></motion.div>
                    </div>
                </div>
            ))}
            <div className="pt-6 border-t border-charcoal-600/60 mt-6 flex items-center justify-between text-xs text-charcoal-400">
                <span>{t('shift_change')}: 18:00</span>
                <button className="text-pitch-400 hover:text-pitch-300 font-medium">{t('request_backup')}</button>
            </div>
        </div>
    );
};

const CommandFeedAlert = ({ title, severity, severityText, description, genAiResolution, genAiBroadcast }) => {
    const { t, language } = window.useAppContext();
    
    return (
        <div className="flex flex-col gap-6 mb-6 border-b border-charcoal-600/60 pb-6 last:border-0 last:pb-0">
            <div className={`bg-${severity}-900/20 border border-${severity}-800/50 p-4 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 ease-out cursor-pointer hover:bg-${severity}-900/30 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] motion-safe:active:scale-[0.98]`}>
                <div className="flex justify-between items-start mb-2">
                    <span className={`font-semibold text-${severity}-300 text-sm`}>{title}</span>
                    <span className={`text-[10px] uppercase font-bold bg-${severity}-600 px-2 py-1 rounded-md text-white`}>{severityText}</span>
                </div>
                <div className="text-sm text-charcoal-300 leading-relaxed">{description}</div>
            </div>

            {genAiResolution && (
                <div className="bg-pitch-900/20 border border-pitch-800/50 p-4 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 ease-out cursor-pointer hover:bg-pitch-900/30 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] motion-safe:active:scale-[0.98]">
                    <h3 className="font-semibold text-pitch-300 text-sm mb-2 flex items-center gap-2">
                        <span className="text-pitch-400">✨</span> {t('genai_resolution')}
                    </h3>
                    <p className="text-sm text-charcoal-300 mb-3 leading-relaxed">
                        {genAiResolution}
                    </p>
                    {genAiBroadcast && (
                        <div className="bg-charcoal-900/50 p-3 rounded-lg text-xs text-charcoal-300 border border-charcoal-800 font-mono mb-3 shadow-inner">
                            {genAiBroadcast}
                        </div>
                    )}
                    
                    {genAiBroadcast && (
                        <div className="text-[10px] text-charcoal-400 mb-3 flex items-center gap-1">
                            <span>{t('auto_translating') || "Auto-translating to"}</span>
                            <span title="English" className={language === 'en' ? 'opacity-100 scale-125' : 'opacity-50 transition-opacity'}>🇺🇸</span>
                            <span title="Español" className={language === 'es' ? 'opacity-100 scale-125' : 'opacity-50 transition-opacity'}>🇲🇽</span>
                            <span title="Français" className={language === 'fr' ? 'opacity-100 scale-125' : 'opacity-50 transition-opacity'}>🇫🇷</span>
                            <span title="Português" className={language === 'pt' ? 'opacity-100 scale-125' : 'opacity-50 transition-opacity'}>🇧🇷</span>
                        </div>
                    )}

                    <button className="w-full bg-pitch-600 hover:bg-pitch-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-lg hover:shadow-pitch-500/25 active:scale-[0.98]">
                        {t('execute') || "EXECUTE"}
                    </button>
                </div>
            )}
        </div>
    );
};

class OpsErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("OpsErrorBoundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full w-full p-8 text-charcoal-100 bg-charcoal-900 rounded-2xl border border-red-500/50 shadow-2xl">
                    <h1 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
                        <span>⚠️</span> Something went wrong loading Ops Mode
                    </h1>
                    <div className="w-full max-w-4xl bg-charcoal-950 p-6 rounded-xl border border-charcoal-700 overflow-auto text-left mb-6">
                        <p className="text-red-400 font-mono text-sm mb-4 font-bold">{this.state.error && this.state.error.toString()}</p>
                        <pre className="text-charcoal-400 font-mono text-xs whitespace-pre-wrap">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
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
        return this.props.children;
    }
}

const OpsDashboardContent = () => {
    const CopilotChat = window.CopilotChat;
    const { t, language, translateDynamicText } = window.useAppContext();

    const [genAiResolution1, setGenAiResolution1] = useState("Gate D has 80% lower congestion. Re-routing fans from Zone 2 will balance load optimally.");
    const [genAiBroadcast1, setGenAiBroadcast1] = useState('"Attention fans, for faster entry, please proceed to Gate D via North concourse."');
    const [genAiResolution2, setGenAiResolution2] = useState("Shuttle Line 2 at 40% capacity — reroute Zone C foot traffic to boost eco-transit share.");
    const [genAiResolution3, setGenAiResolution3] = useState("Shuttle capacity critically low at West Gate. Reroute departing rideshare traffic to North lot.");
    const [genAiResolution4, setGenAiResolution4] = useState("Post-match egress planning — recommended exit sequencing to prevent transit bottlenecks at concourse exits.");

    // Dynamic Translation for GenAI content
    useEffect(() => {
        const translateTexts = async () => {
            if (language === 'en') {
                setGenAiResolution1("Gate D has 80% lower congestion. Re-routing fans from Zone 2 will balance load optimally.");
                setGenAiBroadcast1('"Attention fans, for faster entry, please proceed to Gate D via North concourse."');
                setGenAiResolution2("Shuttle Line 2 at 40% capacity — reroute Zone C foot traffic to boost eco-transit share.");
                setGenAiResolution3("Shuttle capacity critically low at West Gate. Reroute departing rideshare traffic to North lot.");
                setGenAiResolution4("Post-match egress planning — recommended exit sequencing to prevent transit bottlenecks at concourse exits.");
                return;
            }
            
            setGenAiResolution1(await translateDynamicText("Gate D has 80% lower congestion. Re-routing fans from Zone 2 will balance load optimally.", language));
            setGenAiBroadcast1(await translateDynamicText('"Attention fans, for faster entry, please proceed to Gate D via North concourse."', language));
            setGenAiResolution2(await translateDynamicText("Shuttle Line 2 at 40% capacity — reroute Zone C foot traffic to boost eco-transit share.", language));
            setGenAiResolution3(await translateDynamicText("Shuttle capacity critically low at West Gate. Reroute departing rideshare traffic to North lot.", language));
            setGenAiResolution4(await translateDynamicText("Post-match egress planning — recommended exit sequencing to prevent transit bottlenecks at concourse exits.", language));
        };
        translateTexts();
    }, [language, translateDynamicText]);

    return (
        <div className="flex flex-col h-full w-full p-6 space-y-6 overflow-y-auto pb-10">
            
            {/* Top Row: KPIs */}
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
            >
                <KPICard title={t('attendance')} value="68,450" sub={`85% ${t('capacity_reached')}`} icon="👥" iconColor="blue" isUrgent={false} />
                <KPICard title={t('avg_gate_wait')} value={`12 ${t('mins')}`} sub={`-3m ${t('moving_avg')}`} icon="⏱️" iconColor="green" isUrgent={false} />
                <KPICard title={t('active_incidents')} value="1" sub={t('gate_bottleneck')} icon="⚠️" iconColor="red" isUrgent={true} />
                <KPICard title={t('staff_deployed')} value="474" sub={`94% ${t('fulfillment_rate')}`} icon="🛡️" iconColor="purple" isUrgent={false} />
                <KPICard title={t('eco_transit')} value="62%" sub={`+5% ${t('last_match')}`} icon="🌱" iconColor="emerald" isUrgent={false} />
            </motion.div>

            {/* Main Layout: 2 Columns */}
            <div className="flex flex-col lg:flex-row gap-6 h-auto">
                
                {/* Left Column: Action Needed (Wider) */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                    className="w-full lg:w-2/3 flex flex-col space-y-6"
                >
                    
                    {/* Command Feed */}
                    <div className="bg-charcoal-800/60 rounded-2xl p-6 border border-charcoal-600/60 flex flex-col h-auto shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-bold text-charcoal-300 uppercase tracking-wider flex items-center h-5">
                                <span className="accent-gradient-bar mr-2 h-4"></span>
                                {t('command_feed')}
                            </h2>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4" aria-live="polite">
                            <CommandFeedAlert 
                                title={t('gate_bottleneck')}
                                severity="red"
                                severityText={t('high')}
                                description={t('wait_time_risk')}
                                genAiResolution={genAiResolution1}
                                genAiBroadcast={genAiBroadcast1}
                            />
                            
                            <CommandFeedAlert 
                                title="Sustainability Alert"
                                severity="emerald"
                                severityText="MED"
                                description="Eco-transit share is below target for Zone C arrivals."
                                genAiResolution={genAiResolution2}
                            />

                            <CommandFeedAlert 
                                title="Transportation Alert"
                                severity="purple"
                                severityText="MED"
                                description="Shuttle rideshare capacity issue at West Gate."
                                genAiResolution={genAiResolution3}
                            />

                            <CommandFeedAlert 
                                title="Navigation / Egress Alert"
                                severity="blue"
                                severityText="INFO"
                                description="Preparing for post-match egress flow."
                                genAiResolution={genAiResolution4}
                            />
                        </div>
                    </div>

                    {/* Quick Phrases */}
                    <div className="bg-charcoal-800/60 rounded-2xl p-6 border border-charcoal-600/60 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <h2 className="text-sm font-bold text-charcoal-300 uppercase tracking-wider mb-2 flex items-center h-5">
                            <span className="accent-gradient-bar mr-2 h-4"></span>
                            {t('quick_phrases')}
                        </h2>
                        <QuickPhraseTranslator />
                    </div>

                    {/* Ops Assistant Chat */}
                    <div className="w-full">
                        <CopilotChat />
                    </div>

                </motion.div>

                {/* Right Column: Live Monitoring (Narrower) */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                    className="w-full lg:w-1/3 flex flex-col space-y-6"
                >
                    
                    {/* Zone Sensors */}
                    <div className="bg-charcoal-800/60 rounded-2xl p-6 border border-charcoal-600/60 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <h2 className="text-sm font-bold text-charcoal-300 uppercase tracking-wider mb-2 flex items-center h-5">
                            <span className="accent-gradient-bar mr-2 h-4"></span>
                            {t('zone_sensors')}
                        </h2>
                        <ZoneSensorFeed />
                    </div>
                    
                    {/* Resource Allocation */}
                    <div className="bg-charcoal-800/60 rounded-2xl p-6 border border-charcoal-600/60 flex-grow flex flex-col shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <h2 className="text-sm font-bold text-charcoal-300 uppercase tracking-wider mb-4 flex items-center h-5">
                            <span className="accent-gradient-bar mr-2 h-4"></span>
                            {t('resource_allocation')}
                        </h2>
                        <div className="flex-1 overflow-y-auto pr-2">
                            <StaffBreakdown />
                        </div>
                    </div>

                </motion.div>
            </div>
            
        </div>
    );
};

window.OpsDashboard = () => {
    return (
        <OpsErrorBoundary>
            <OpsDashboardContent />
        </OpsErrorBoundary>
    );
};
