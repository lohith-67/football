var { useState, useEffect } = React;
var { motion, AnimatePresence } = window.Motion;

const SEATING_CHART = {
    // North/Top Quadrant
    "111": { path: "M 400 100 Q 450 80 500 90 L 480 135 Q 450 120 400 130 Z", cx: 450, cy: 110, gate: "Gate A (North)", gateCx: 400, gateCy: 20, drawPath: "M 400 20 Q 450 50 480 115" },
    "112": { path: "M 500 90 Q 550 110 580 140 L 540 165 Q 510 140 480 135 Z", cx: 525, cy: 125, gate: "Gate A (North)", gateCx: 400, gateCy: 20, drawPath: "M 400 20 Q 500 50 525 125" },
    "113": { path: "M 580 140 Q 620 180 640 230 L 590 230 Q 570 190 540 165 Z", cx: 590, cy: 180, gate: "Gate B (East)", gateCx: 750, gateCy: 250, drawPath: "M 750 250 Q 650 250 610 200" },
    
    // East/Right Quadrant
    "114": { path: "M 640 230 Q 650 280 640 330 L 590 310 Q 595 270 590 230 Z", cx: 615, cy: 280, gate: "Gate B (East)", gateCx: 750, gateCy: 250, drawPath: "M 750 250 Q 650 250 620 270" },
    "115": { path: "M 640 330 Q 610 390 550 420 L 520 380 Q 560 360 590 310 Z", cx: 580, cy: 370, gate: "Gate B (East)", gateCx: 750, gateCy: 250, drawPath: "M 750 250 Q 650 350 580 370" },
    "116": { path: "M 550 420 Q 480 440 400 440 L 400 390 Q 460 390 520 380 Z", cx: 480, cy: 410, gate: "Gate C (South)", gateCx: 150, gateCy: 450, drawPath: "M 150 450 Q 300 450 480 410" },

    // South/Bottom Quadrant
    "121": { path: "M 400 440 Q 320 440 250 420 L 280 380 Q 340 390 400 390 Z", cx: 330, cy: 410, gate: "Gate C (South)", gateCx: 150, gateCy: 450, drawPath: "M 150 450 Q 250 400 300 400" },
    "122": { path: "M 250 420 Q 190 390 160 330 L 210 310 Q 230 350 280 380 Z", cx: 210, cy: 360, gate: "Gate C (South)", gateCx: 150, gateCy: 450, drawPath: "M 150 450 Q 200 350 200 340" },
    "123": { path: "M 160 330 Q 150 280 160 230 L 210 230 Q 200 270 210 310 Z", cx: 180, cy: 280, gate: "Gate D (West)", gateCx: 50, gateCy: 250, drawPath: "M 50 250 Q 120 250 180 280" },
    
    // West/Left Quadrant
    "131": { path: "M 160 230 Q 180 180 220 140 L 260 170 Q 230 200 210 230 Z", cx: 200, cy: 180, gate: "Gate D (West)", gateCx: 50, gateCy: 250, drawPath: "M 50 250 Q 150 200 190 180" },
    "132": { path: "M 220 140 Q 260 110 320 90 L 340 140 Q 290 150 260 170 Z", cx: 280, cy: 120, gate: "Gate D (West)", gateCx: 50, gateCy: 250, drawPath: "M 50 250 Q 200 100 280 120" },
    "133": { path: "M 320 90 Q 360 80 400 80 L 400 130 Q 370 130 340 140 Z", cx: 360, cy: 110, gate: "Gate A (North)", gateCx: 400, gateCy: 20, drawPath: "M 400 20 Q 380 70 360 110" },
};

function getSeatCoordinates(venueId, section, row, seat) {
    // In a real app, this would fetch from a venue-specific database
    // For now, we look up the section in our mock database
    const sectionData = SEATING_CHART[section];
    if (!sectionData) {
        return null;
    }
    
    // Row/Seat level precision could slightly offset the cx/cy
    // For this implementation, we return section-level coordinates
    return sectionData;
}

window.MapPanel = () => {
    const { t, isFindMySeatMode, ticketData, setTicketData, accessibilityNeeds, isTicketConfirmed, setIsTicketConfirmed } = window.useAppContext();
    
    // Local state for the form inputs
    const [tempSection, setTempSection] = useState(ticketData.section || "");
    const [tempRow, setTempRow] = useState(ticketData.row || "");
    const [tempSeat, setTempSeat] = useState(ticketData.seat || "");

    const seatData = getSeatCoordinates('venue_1', ticketData.section, ticketData.row, ticketData.seat);
    const isSeatFound = !!seatData;

    // Fallback if section isn't found
    const displayData = seatData || {
        path: "", // No highlight
        cx: 400, cy: 250, // Center pitch (won't be shown)
        gate: "Main Gate", gateCx: 400, gateCy: 450,
        drawPath: "M 400 450 L 400 450"
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel-dark rounded-xl p-4 w-full h-[300px] shadow-2xl relative overflow-hidden border border-charcoal-700/50 flex flex-col"
        >
            <AnimatePresence mode="wait">
                {!isTicketConfirmed ? (
                    <motion.div 
                        key="ticket-input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full relative flex flex-col items-center justify-center bg-charcoal-900 rounded-lg border border-charcoal-800 p-6"
                    >
                        <div className="text-pitch-400 text-3xl mb-3">🎟️</div>
                        <h3 className="text-lg font-bold text-white mb-2">Find My Seat</h3>
                        <p className="text-sm text-charcoal-400 mb-6 text-center max-w-[80%]">
                            Scan your ticket QR code or enter your seat details manually to generate an indoor route.
                        </p>
                        
                        <div className="flex gap-2 mb-6 w-full max-w-sm">
                            <div className="flex-1">
                                <label className="block text-[10px] uppercase text-charcoal-500 font-bold mb-1">Section</label>
                                <input 
                                    type="text" 
                                    value={tempSection} 
                                    onChange={e => setTempSection(e.target.value)} 
                                    className="w-full bg-charcoal-800 text-white rounded border border-charcoal-700 px-3 py-2 text-sm focus:border-pitch-500 outline-none transition" 
                                    placeholder="e.g. 112"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] uppercase text-charcoal-500 font-bold mb-1">Row</label>
                                <input 
                                    type="text" 
                                    value={tempRow} 
                                    onChange={e => setTempRow(e.target.value)} 
                                    className="w-full bg-charcoal-800 text-white rounded border border-charcoal-700 px-3 py-2 text-sm focus:border-pitch-500 outline-none transition"
                                    placeholder="e.g. 15"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] uppercase text-charcoal-500 font-bold mb-1">Seat</label>
                                <input 
                                    type="text" 
                                    value={tempSeat} 
                                    onChange={e => setTempSeat(e.target.value)} 
                                    className="w-full bg-charcoal-800 text-white rounded border border-charcoal-700 px-3 py-2 text-sm focus:border-pitch-500 outline-none transition"
                                    placeholder="e.g. 14"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 w-full max-w-sm">
                            <button 
                                onClick={() => {
                                    // Mock scan action
                                    setTempSection("112");
                                    setTempRow("15");
                                    setTempSeat("14");
                                }}
                                className="flex-1 bg-charcoal-800 hover:bg-charcoal-700 text-white font-semibold py-2 px-4 border border-charcoal-600 rounded transition text-sm flex items-center justify-center gap-2"
                            >
                                <span>📷</span> Scan QR
                            </button>
                            <button 
                                onClick={() => {
                                    if (tempSection && tempRow && tempSeat) {
                                        setTicketData({ ...ticketData, section: tempSection, row: tempRow, seat: tempSeat });
                                        setIsTicketConfirmed(true);
                                    }
                                }}
                                disabled={!tempSection || !tempRow || !tempSeat}
                                className="flex-1 bg-pitch-600 hover:bg-pitch-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition shadow-lg text-sm"
                            >
                                Show Route
                            </button>
                        </div>
                        
                        {/* Option to edit/change it later would just be setting isTicketConfirmed to false */}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="indoor-map"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full relative flex items-center justify-center bg-charcoal-900 rounded-lg overflow-hidden border border-charcoal-800"
                    >
                        <div className="absolute top-4 left-4 z-10 bg-pitch-900/80 border border-pitch-500/50 px-3 py-1 rounded text-xs font-semibold backdrop-blur text-pitch-100 flex items-center shadow-lg">
                            <span className="mr-2">📍</span> {t('find_my_seat') || 'Indoor Wayfinding'}
                        </div>
                        <button 
                            onClick={() => setIsTicketConfirmed(false)}
                            className="absolute top-4 right-4 z-10 bg-charcoal-900/80 hover:bg-charcoal-800 border border-charcoal-700 px-3 py-1 rounded text-xs font-semibold backdrop-blur text-charcoal-300 transition shadow-lg"
                        >
                            Edit Ticket
                        </button>

                        {/* Static Seating Chart SVG */}
                        <svg viewBox="0 0 800 500" className="w-full h-full opacity-80" style={{ filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.5))' }}>
                            {/* Pitch */}
                            <rect x="250" y="150" width="300" height="200" rx="20" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" opacity="0.4" />
                            <circle cx="400" cy="250" r="30" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
                            <line x1="400" y1="150" x2="400" y2="350" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
                            
                            {/* General Sections */}
                            <path d="M 200 100 Q 400 50 600 100 L 550 150 Q 400 120 250 150 Z" fill="#374151" stroke="#4b5563" />
                            <path d="M 600 100 Q 700 250 600 400 L 550 350 Q 620 250 550 150 Z" fill="#374151" stroke="#4b5563" />
                            <path d="M 200 400 Q 400 450 600 400 L 550 350 Q 400 380 250 350 Z" fill="#374151" stroke="#4b5563" />
                            <path d="M 200 100 Q 100 250 200 400 L 250 350 Q 180 250 250 150 Z" fill="#374151" stroke="#4b5563" />
                            
                            {/* Highlighted Section */}
                            {isSeatFound && (
                                <motion.path 
                                    key={`highlight-${ticketData.section}`}
                                    initial={{ fill: "#374151" }}
                                    animate={{ fill: "#2563eb" }}
                                    transition={{ duration: 1 }}
                                    d={displayData.path}
                                    stroke="#60a5fa" strokeWidth="2" 
                                />
                            )}
                            
                            {/* Seat Marker */}
                            {isSeatFound && (
                                <motion.circle 
                                    key={`marker-${ticketData.section}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 2, type: "spring" }}
                                    cx={displayData.cx} cy={displayData.cy} r="8" fill="#fbbf24" stroke="#fff" strokeWidth="2" 
                                />
                            )}
                            
                            {/* Gate Marker */}
                            <circle 
                                cx={displayData.gateCx} 
                                cy={displayData.gateCy} 
                                r="12" fill="#10b981" 
                            />
                            <text 
                                x={displayData.gateCx - 15} 
                                y={displayData.gateCy + 30} 
                                fill="#9ca3af" fontSize="14" fontWeight="bold"
                            >
                                {displayData.gate}
                            </text>
                            
                            {/* Drawn Path */}
                            {isSeatFound && (
                                <motion.path 
                                    key={`path-${ticketData.section}`}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                                    d={displayData.drawPath}
                                    fill="none" 
                                    stroke="#10b981" 
                                    strokeWidth="4" 
                                    strokeDasharray="8 8" 
                                />
                            )}
                        </svg>

                        {/* Fallback Warning */}
                        {!isSeatFound && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-16 left-4 right-4 bg-yellow-900/90 border border-yellow-500/50 p-2 rounded-lg text-xs text-yellow-200 text-center shadow-lg backdrop-blur"
                            >
                                ⚠️ Exact seat location unavailable for this section — showing nearest gate
                            </motion.div>
                        )}

                        {/* Info Card Overlay */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute bottom-4 right-4 bg-charcoal-900/95 border border-charcoal-700 p-3 rounded-lg shadow-2xl backdrop-blur max-w-[200px]"
                        >
                            <div className="text-xs text-charcoal-400 uppercase tracking-wider mb-1 font-bold">{t('your_seat') || 'Your Seat'}</div>
                            <div className="text-lg font-bold text-white mb-2">
                                Sec {ticketData.section}, Row {ticketData.row}, Seat {ticketData.seat}
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-charcoal-800 pt-2">
                                <span className="text-charcoal-400">{t('walk_time') || 'Walk time'}:</span>
                                <span className="font-semibold text-emerald-400">8 mins</span>
                            </div>
                            {accessibilityNeeds && (
                                <div className="text-[10px] text-pitch-400 mt-2 bg-pitch-900/20 p-1.5 rounded flex items-start gap-1.5">
                                    <span>♿</span>
                                    <span>Accessible path routed via Elevator 3 (East Concourse).</span>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
