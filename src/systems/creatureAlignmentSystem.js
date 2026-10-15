import { gameState } from '../config/constantsAndState.js';

/**
 * CreatureAlignmentSystem: Das klassische Schwarze-&-Weiß-Lern- und Alignmentsystem.
 * Die Kreatur lernt durch Lob (Streicheln/Belohnung) und Strafe (Schlagen/Bestrafung).
 * Bestimmt das Alignment von Rein Gut (Heilig, Helfend) bis Rein Böse (Teuflisch, Zerstörerisch).
 */
export class CreatureAlignmentSystem {
    constructor() {
        this.alignment = 0.0;     // -1.0 (Voll Böse) bis +1.0 (Voll Gut)
        this.righteousness = 0.5; // Respekt / Frömmigkeit der Kreatur
        this.fatigue = 0.0;       // Ermüdung durch Handlungen
        this.hunger = 0.2;        // Hunger der Kreatur
    }

    /**
     * Gott lobt die Kreatur (Positive Verstärkung)
     * @param {string} context - Was hat die Kreatur gerade getan? ('helped_villager', 'ate_tree', etc.)
     */
    praise(context) {
        this.alignment = Math.min(1.0, this.alignment + 0.15);
        this.righteousness = Math.min(1.0, this.righteousness + 0.1);
        
        if (context === 'helped_villager') {
            gameState.g_belief += 25;
        }
        return { success: true, message: "Kreatur fühlt sich geliebt und gestärkt! (Alignment: Gut)" };
    }

    /**
     * Gott bestraft die Kreatur (Negative Verstärkung)
     * @param {string} context - Wofür wird sie bestraft? ('attacked_villager', 'destroyed_building')
     */
    punish(context) {
        this.alignment = Math.max(-1.0, this.alignment - 0.2);
        this.fatigue = Math.min(1.0, this.fatigue + 0.2);

        if (context === 'attacked_villager') {
            gameState.g_belief = Math.max(0, gameState.g_belief - 10);
        }
        return { success: true, message: "Kreatur zeigt Demut und Furcht vor der göttlichen Rache! (Alignment: Böse/Eingeschüchtert)" };
    }

    update(dt) {
        // Natürlicher Verfall von Hunger und Ermüdung
        this.hunger = Math.min(1.0, this.hunger + dt * 0.005);
        this.fatigue = Math.max(0.0, this.fatigue - dt * 0.01);
    }
}
