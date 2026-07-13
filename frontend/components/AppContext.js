var { createContext, useState, useEffect, useContext } = React;

// Define default venues
const VENUES = [
    { id: 'metlife', name: 'New York/New Jersey Stadium', city: 'East Rutherford', country: 'USA', image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=2000' },
    { id: 'azteca', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=2000' },
    { id: 'bmo', name: 'Toronto Stadium', city: 'Toronto', country: 'Canada', image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=2000' }, // Using a generic stadium image for now
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

    // Fetch match context when venue changes
    useEffect(() => {
        let isMounted = true;
        
        const fetchContext = async () => {
            try {
                // Clear previous context while fetching
                setMatchContext(null);
                const res = await fetch(`/api/match_context/${selectedVenue.id}`);
                const data = await res.json();
                if (isMounted) {
                    setMatchContext(data);
                }
            } catch (err) {
                console.error("Failed to fetch match context:", err);
            }
        };

        fetchContext();
        
        // Poll every 15 seconds
        const pollInterval = setInterval(fetchContext, 15000);
        return () => {
            isMounted = false;
            clearInterval(pollInterval);
        };
    }, [selectedVenue]);

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
            const res = await fetch('/api/translate', {
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
        matchContext,
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
