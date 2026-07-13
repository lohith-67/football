var { useState, useEffect, useRef } = React;
var { AnimatePresence, motion } = window.Motion;

window.LanguageCombobox = ({ value, onChange, position = 'bottom', className = "" }) => {
    const { fifaLanguages } = window.useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Pinned languages
    const pinnedCodes = ['en', 'es', 'fr', 'pt'];
    
    // Sort and filter all languages
    const allLanguages = Object.entries(fifaLanguages).map(([code, name]) => ({ code, name }));
    const filteredLanguages = allLanguages.filter(lang => 
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));

    const pinnedLanguages = filteredLanguages.filter(l => pinnedCodes.includes(l.code));
    const otherLanguages = filteredLanguages.filter(l => !pinnedCodes.includes(l.code));

    const selectedName = fifaLanguages[value] || value;

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Select Language"
                className="w-full text-left bg-charcoal-800 text-white rounded-lg px-4 py-2 border border-charcoal-700 shadow-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pitch-500 hover:bg-charcoal-700 transition flex justify-between items-center"
            >
                <span className="truncate">{selectedName}</span>
                <span className="text-charcoal-400 ml-2">▼</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: position === 'top' ? 10 : -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: position === 'top' ? 10 : -10 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 w-64 bg-charcoal-900 border border-charcoal-700 rounded-lg shadow-2xl overflow-hidden flex flex-col ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0`}
                    >
                        <div className="p-2 border-b border-charcoal-800">
                            <input
                                type="text"
                                placeholder="Search languages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-charcoal-800 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pitch-500 border border-charcoal-700"
                                autoFocus
                            />
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto">
                            {pinnedLanguages.length > 0 && (
                                <div className="py-1">
                                    <div className="px-3 py-1 text-xs font-bold text-charcoal-300 uppercase tracking-wider bg-charcoal-900/50">
                                        Suggested
                                    </div>
                                    {pinnedLanguages.map(l => (
                                        <button
                                            key={l.code}
                                            onClick={() => { onChange(l.code); setIsOpen(false); setSearchTerm(""); }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${value === l.code ? 'bg-pitch-600/30 text-pitch-400 font-semibold' : 'text-charcoal-300 hover:bg-charcoal-800'}`}
                                        >
                                            {l.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {otherLanguages.length > 0 && (
                                <div className="py-1 border-t border-charcoal-800">
                                    <div className="px-3 py-1 text-xs font-bold text-charcoal-300 uppercase tracking-wider bg-charcoal-900/50">
                                        All Languages
                                    </div>
                                    {otherLanguages.map(l => (
                                        <button
                                            key={l.code}
                                            onClick={() => { onChange(l.code); setIsOpen(false); setSearchTerm(""); }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${value === l.code ? 'bg-pitch-600/30 text-pitch-400 font-semibold' : 'text-charcoal-300 hover:bg-charcoal-800'}`}
                                        >
                                            {l.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {filteredLanguages.length === 0 && (
                                <div className="px-4 py-3 text-sm text-charcoal-300 text-center">
                                    No languages found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
