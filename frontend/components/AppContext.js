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
                console.warn("Failed to fetch backend, using client-side mock fallback:", err);
                if (isMounted) {
                    const MOCK_CONTEXT = {
                        "teams": { "home": "USA", "away": "Brazil" },
                        "score": "0 - 0",
                        "status": "Scheduled",
                        "kickoff": new Date(Date.now() + 3600000).toISOString(),
                        "venue_name": selectedVenue.name,
                        "group_name": "Group A",
                        "standings": [
                            { "rank": 1, "name": "USA", "emoji": "🇺🇸", "played": 2, "won": 2, "draw": 0, "lost": 0, "pts": 6 },
                            { "rank": 2, "name": "Brazil", "emoji": "🇧🇷", "played": 2, "won": 1, "draw": 1, "lost": 0, "pts": 4 },
                            { "rank": 3, "name": "Italy", "emoji": "🇮🇹", "played": 2, "won": 0, "draw": 1, "lost": 1, "pts": 1 },
                            { "rank": 4, "name": "Japan", "emoji": "🇯🇵", "played": 2, "won": 0, "draw": 0, "lost": 2, "pts": 0 }
                        ],
                        "is_estimated": true
                    };
                    setMatchContext(MOCK_CONTEXT);
                    setMatchContextError(false); // We show mock data instead of an error!
                }
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
        if (window.StadiumLogic) {
            return window.StadiumLogic.translate(key, language, window.translations);
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
