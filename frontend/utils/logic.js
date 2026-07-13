// logic.js - Core business logic utilities

/**
 * Translates a given key using the translations object.
 */
export function translate(key, language, translationsObj) {
    if (!translationsObj) return key;
    const langDict = translationsObj[language] || translationsObj['en'];
    if (!langDict) return key;
    return langDict[key] || translationsObj['en'][key] || key;
}

/**
 * Calculates a route score based on the priority (Fastest vs Lowest Carbon).
 * Lower score is better.
 */
export function scoreRoute(route, priority) {
    if (priority === 'Fastest') {
        // Time is primary, emissions are secondary tie-breaker
        const ecoPenalty = route.eco_friendly ? 0 : 5;
        return route.eta_mins + ecoPenalty;
    } else if (priority === 'Lowest Carbon') {
        // Emissions primary, time is secondary
        const ecoScore = route.eco_friendly ? 0 : 100;
        return ecoScore + (route.eta_mins * 0.5);
    }
    // Default score
    return route.eta_mins;
}

/**
 * Looks up seat coordinates from a given seating chart.
 */
export function getSeatCoordinates(section, row, seat, seatingChart) {
    if (!seatingChart || !seatingChart[section]) return null;
    return seatingChart[section]; // In real implementation, would calculate precise offset based on row/seat
}

/**
 * Classifies an incident description and returns a severity level and color.
 */
export function classifyIncident(description) {
    const text = description.toLowerCase();
    
    if (text.includes("fight") || text.includes("fire") || text.includes("medical emergency") || text.includes("weapon")) {
        return { severity: "CRITICAL", color: "red", score: 90 };
    }
    
    if (text.includes("spill") || text.includes("broken") || text.includes("crowd") || text.includes("capacity")) {
        return { severity: "HIGH", color: "yellow", score: 70 };
    }
    
    if (text.includes("lost") || text.includes("question") || text.includes("clean")) {
        return { severity: "LOW", color: "green", score: 30 };
    }
    
    return { severity: "INFO", color: "blue", score: 10 };
}

// Expose to window for browser usage without bundler
if (typeof window !== 'undefined') {
    window.StadiumLogic = {
        translate,
        scoreRoute,
        getSeatCoordinates,
        classifyIncident
    };
}
