var { motion, AnimatePresence } = window.Motion;

window.VenueSwitcher = () => {
    const { venues, selectedVenue, setSelectedVenue, mode, setMode, requestOpsMode, language, setLanguage, t } = window.useAppContext();

    const LanguageCombobox = window.LanguageCombobox;

    return (
        <div className="flex items-center space-x-3">
            
            <div className="w-48 z-50">
                <LanguageCombobox value={language} onChange={setLanguage} />
            </div>

            <select 
                aria-label="Select Venue"
                className="bg-charcoal-800 text-white rounded-lg px-2 sm:px-4 py-2 border border-charcoal-700 shadow-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pitch-500 hover:bg-charcoal-700 transition cursor-pointer max-w-[150px] sm:max-w-none text-ellipsis"
                value={selectedVenue.id}
                onChange={(e) => {
                    const venue = venues.find(v => v.id === e.target.value);
                    if(venue) setSelectedVenue(venue);
                }}
            >
                {venues.map(v => (
                    <option key={v.id} value={v.id}>{v.name} - {v.city}</option>
                ))}
            </select>
            
            <button 
                aria-label={mode === 'fan' ? 'Switch to Ops Mode' : 'Switch to Fan Mode'}
                className={`flex-shrink-0 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg font-medium transition text-sm flex items-center gap-2 ${mode === 'fan' ? 'bg-red-600 hover:bg-red-500' : 'bg-pitch-600 hover:bg-pitch-500'} focus:outline-none focus:ring-2 focus:ring-pitch-500`}
                onClick={() => {
                    if (mode === 'fan') {
                        requestOpsMode();
                    } else {
                        setMode('fan');
                    }
                }}
            >
                {mode === 'fan' ? (
                    <><span className="text-lg">🛡️</span> {t('ops_mode')}</>
                ) : (
                    <><span className="text-lg">🎉</span> {t('fan_mode')}</>
                )}
            </button>
        </div>
    );
};
