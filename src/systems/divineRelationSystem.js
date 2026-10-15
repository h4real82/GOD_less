import { gameState } from '../config/constantsAndState.js';

/**
 * DivineRelationSystem: Steuert, wie die Menschen (Zivilisation) zum Spieler als Gott stehen.
 * Faktoren: Glaube, Furcht, Liebe, Zorn, Verrat & Opferbereitschaft.
 * Reagiert dynamisch auf göttliche Grausamkeit (Menschen werfen/töten), Kreaturen-Angriffe oder Wohlstand.
 */
export class DivineRelationSystem {
    constructor() {
        this.relationScore = 50.0;   // 0 (Vollständige Ablehnung/Hass) bis 100 (Absolute Verehrung)
        this.fearScore = 20.0;       // 0 (Keine Furcht) bis 100 (Todesangst)
        this.loveScore = 40.0;       // 0 (Gleichgültigkeit) bis 100 (Tiefe Zuneigung)
        
        this.rebelRisk = 0.0;        // Wahrscheinlichkeit, dass Bürger gegen Gott arbeiten oder auswandern
    }

    /**
     * Reagiert auf Aktionen der Götter-Hand oder der Kreatur.
     * @param {string} eventType - Art des Ereignisses ('villager_thrown', 'villager_killed', 'creature_ate_human', 'building_destroyed', 'miracle_blessing')
     */
    registerEvent(eventType) {
        switch (eventType) {
            case 'villager_thrown':
            case 'villager_killed':
                this.fearScore = Math.min(100, this.fearScore + 15);
                this.loveScore = Math.max(0, this.loveScore - 12);
                this.relationScore = Math.max(0, this.relationScore - 10);
                console.log("[GÖTTLICHES RELATIONS-SYSTEM]: Menschen wurden von Gott verletzt/getötet! Furcht steigt, Liebe sinkt.");
                break;

            case 'creature_ate_human':
            case 'building_destroyed':
                this.fearScore = Math.min(100, this.fearScore + 8);
                this.loveScore = Math.max(0, this.loveScore - 10);
                this.relationScore = Math.max(0, this.relationScore - 8);
                console.log("[GÖTTLICHES RELATIONS-SYSTEM]: Die Kreatur hat Schaden angerichtet! Das Vertrauen leidet.");
                break;

            case 'miracle_blessing':
            case 'helped_build':
                this.loveScore = Math.min(100, this.loveScore + 10);
                this.relationScore = Math.min(100, this.relationScore + 8);
                this.fearScore = Math.max(0, this.fearScore - 3);
                console.log("[GÖTTLICHES RELATIONS-SYSTEM]: Gott hat geholfen/gesegnet! Die Liebe wächst.");
                break;
            
            default:
                break;
        }

        this.recalculateStatus();
    }

    recalculateStatus() {
        // Das Verhältnis ist ein Mix aus Liebe und Furcht (Respekt)
        // Zu viel Furcht ohne Liebe erzeugt Rebellionsrisiko!
        if (this.fearScore > 70 && this.loveScore < 30) {
            this.rebelRisk = (this.fearScore - 70) * 0.02; // Aufstand / Ketzerei droht
        } else {
            this.rebelRisk = 0.0;
        }

        // Aktualisierung des globalen Glaubens basierend auf der Relation
        gameState.g_belief = Math.max(0, gameState.g_belief + (this.relationScore - 50) * 0.05);
    }

    update(dt) {
        // Natürlicher Drift zu neutralen Werten, wenn nichts passiert
        if (this.rebelRisk > 0) {
            // Rebellen wandern ab oder arbeiten gegen den Glauben ([[Spiel_logik]])
            gameState.civilization.population = Math.max(0, gameState.civilization.population - dt * 0.05);
        }
    }
}
