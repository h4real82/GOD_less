import { gameState, saveGame, loadGame } from './constantsAndState.js';

/**
 * Zivilisations- und Glaubens-System (Familie vs. Arbeit Schieberegler)
 * Angelehnt an die Dokumentation in [[Spiel_logik]].
 */

export function updateCivilizationSimulation(delta) {
    // Schieberegler-Wert (0 = 100% Familie, 1 = 100% Arbeit)
    const focus = gameState.civilization.focusSlider ?? 0.5;
    
    // Wachstumsrate basierend auf Familienfokus und Zufriedenheit
    const satisfactionMultiplier = gameState.civilization.satisfaction || 1.0;
    
    if (satisfactionMultiplier > 0.7) {
        // Gute Umstände: Fortpflanzung und Zivilisationswachstum
        const growthRate = (1.0 - focus) * 0.05 * delta;
        gameState.civilization.population += growthRate * satisfactionMultiplier;
    } else {
        // Schlechte Umstände: Unzufriedenheit führt zu Auswanderung oder Glaubensabfall
        gameState.civilization.population -= 0.02 * delta;
        if (gameState.civilization.population < 0) gameState.civilization.population = 0;
    }

    // Arbeitsorientierung fördert Entwicklung und Versorgung
    const workProgressRate = focus * 0.03 * delta;
    gameState.civilization.developmentProgress += workProgressRate;
}
