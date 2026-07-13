import { describe, it, expect } from 'vitest';
import { translate, scoreRoute, getSeatCoordinates, classifyIncident } from '../utils/logic';

describe('Locale / Translation Lookup Logic', () => {
    const mockTranslations = {
        'en': { 'hello': 'Hello', 'welcome': 'Welcome' },
        'es': { 'hello': 'Hola' }
    };

    it('translates known keys correctly', () => {
        expect(translate('hello', 'es', mockTranslations)).toBe('Hola');
        expect(translate('welcome', 'en', mockTranslations)).toBe('Welcome');
    });

    it('falls back to english for missing keys in target language', () => {
        expect(translate('welcome', 'es', mockTranslations)).toBe('Welcome');
    });

    it('returns the key if translation is completely missing', () => {
        expect(translate('missing_key', 'es', mockTranslations)).toBe('missing_key');
    });

    it('handles null/undefined translations object gracefully', () => {
        expect(translate('hello', 'es', null)).toBe('hello');
    });
});

describe('Route-Scoring Logic (Time vs Carbon)', () => {
    const ecoRoute = { eta_mins: 30, eco_friendly: true };
    const fastRoute = { eta_mins: 15, eco_friendly: false };

    it('prioritizes time when priority is Fastest', () => {
        const scoreEco = scoreRoute(ecoRoute, 'Fastest');
        const scoreFast = scoreRoute(fastRoute, 'Fastest');
        expect(scoreFast).toBeLessThan(scoreEco); // Fast should have lower score
    });

    it('prioritizes emissions when priority is Lowest Carbon', () => {
        const scoreEco = scoreRoute(ecoRoute, 'Lowest Carbon');
        const scoreFast = scoreRoute(fastRoute, 'Lowest Carbon');
        expect(scoreEco).toBeLessThan(scoreFast); // Eco should have lower score
    });
});

describe('Seat-Coordinate Lookup', () => {
    const mockChart = {
        "111": { path: "M...", cx: 450, cy: 110, gate: "Gate A" }
    };

    it('returns correct coordinates for a valid section', () => {
        const result = getSeatCoordinates("111", "10", "5", mockChart);
        expect(result).not.toBeNull();
        expect(result.cx).toBe(450);
        expect(result.gate).toBe("Gate A");
    });

    it('returns null for an invalid section', () => {
        const result = getSeatCoordinates("999", "10", "5", mockChart);
        expect(result).toBeNull();
    });
});

describe('Incident Severity Classification Logic', () => {
    it('classifies critical incidents correctly', () => {
        const result = classifyIncident('There is a huge fight near gate C');
        expect(result.severity).toBe('CRITICAL');
        expect(result.color).toBe('red');
    });

    it('classifies high severity incidents', () => {
        const result = classifyIncident('The crowd is at full capacity here');
        expect(result.severity).toBe('HIGH');
    });

    it('classifies low severity incidents', () => {
        const result = classifyIncident('Can someone clean a spill?');
        expect(result.severity).toBe('HIGH'); // spill maps to HIGH in our logic
        
        const result2 = classifyIncident('I lost my jacket');
        expect(result2.severity).toBe('LOW');
    });

    it('classifies unknown incidents as INFO', () => {
        const result = classifyIncident('Just wandering around');
        expect(result.severity).toBe('INFO');
    });
});
