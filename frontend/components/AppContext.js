var { createContext, useState, useEffect, useContext } = React;

// Define default venues
const VENUES = [
    { id: 'metlife', name: 'New York/New Jersey Stadium', city: 'East Rutherford', country: 'USA', image: '/images/stadium-hero.jpg' },
    { id: 'azteca', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', image: '/images/stadium-hero.jpg' },
    { id: 'bmo', name: 'Toronto Stadium', city: 'Toronto', country: 'Canada', image: '/images/stadium-hero.jpg' }, // Using a generic stadium image for now
    // More venues can be added here
];

const AppContext = createContext();

window.AppProvider = ({ children }) => {
    const [mode, setMode] = useState('landing'); // 'landing', 'fan' or 'ops'
    const [opsToken, setOpsToken] = useState(null);
    const [isOpsAuthModalOpen, setIsOpsAuthModalOpen] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(VENUES[0]);
    const [language, setLanguage] = useState('en');
    const [accessibilityNeeds, setAccessibilityNeeds] = useState(false);
    const [ticketData, setTicketData] = useState({
        section: "112",
        row: "15",
        seat: "14",
        gate: "Gate C"
    });
    const [isFindMySeatMode, setIsFindMySeatMode] = useState(false);
    const [isTicketConfirmed, setIsTicketConfirmed] = useState(false);
    const [matchContext, setMatchContext] = useState(null);
    const [matchContextError, setMatchContextError] = useState(false);
    const [retryTrigger, setRetryTrigger] = useState(0);

    // Fetch match context when venue changes
    useEffect(() => {
        let isMounted = true;
        
        const fetchContext = async () => {
            try {
                // Clear previous context while fetching if we don't have one
                if (!matchContext) setMatchContextError(false);
                const res = await fetch(`${window.API_BASE_URL}/api/match_context/${selectedVenue.id}`);
                if (!res.ok) throw new Error("HTTP " + res.status);
                const data = await res.json();
                if (isMounted) {
                    setMatchContext(data);
                    setMatchContextError(false);
                }
            } catch (err) {
                console.error("Failed to fetch match context:", err);
                if (isMounted) setMatchContextError(true);
            }
        };

        fetchContext();
        
        // Poll every 15 seconds
        const pollInterval = setInterval(fetchContext, 15000);
        return () => {
            isMounted = false;
            clearInterval(pollInterval);
        };
    }, [selectedVenue, retryTrigger]);

    const t = (key) => {
        if (window.translations && window.translations[language] && window.translations[language][key]) {
            return window.translations[language][key];
        }
        
        console.warn(`Missing translation for key: "${key}" in language: "${language}"`);

        // Try regional fallback (e.g. es-MX -> es) if we had dialects, but here we just fallback to EN
        if (window.translations && window.translations['en'] && window.translations['en'][key]) {
            return window.translations['en'][key];
        }
        return key;
    };

    const translateDynamicText = async (text, targetLang) => {
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, target_language: targetLang })
            });
            const data = await res.json();
            return { text: data.translation, fallback: data.fallback };
        } catch (e) {
            console.error("Translation error", e);
            return { text: text, fallback: true }; // Return original on error
        }
    };

    const requestOpsMode = () => {
        if (opsToken) {
            setMode('ops');
        } else {
            setIsOpsAuthModalOpen(true);
        }
    };

    const retryFetchMatchData = () => setRetryTrigger(prev => prev + 1);

    const value = {
        mode, setMode,
        opsToken, setOpsToken,
        isOpsAuthModalOpen, setIsOpsAuthModalOpen,
        requestOpsMode,
        selectedVenue, setSelectedVenue,
        language, setLanguage,
        accessibilityNeeds, setAccessibilityNeeds,
        ticketData, setTicketData,
        isFindMySeatMode, setIsFindMySeatMode,
        isTicketConfirmed, setIsTicketConfirmed,
        matchContext, matchContextError, retryFetchMatchData,
        venues: VENUES,
        fifaLanguages: window.FIFA_LANGUAGES || { 'en': 'English', 'es': 'Spanish', 'fr': 'French', 'pt': 'Portuguese' },
        t, translateDynamicText
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

window.useAppContext = () => useContext(AppContext);
