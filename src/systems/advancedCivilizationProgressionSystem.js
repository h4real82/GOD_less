import { gameState } from '../config/constantsAndState.js';

/**
 * AdvancedCivilizationProgressionSystem: 
 * Integriert das Siedler-inspiriertes Wirtschaftssystem, den Familie-vs-Arbeit-Slider,
 * Glaubens-Manifestation durch Schreine/Prediger/Gebote/Opfergaben,
 * sowie Missionen, Kriege, Kreuzzüge und fremde Zivilisations-Einflüsse.
 */
export class AdvancedCivilizationProgressionSystem {
    constructor() {
        // Der in [[Spiel_logik]] beschriebene Schieberegler (0.0 = Familie, 1.0 = Arbeit)
        this.socialSlider = 0.5; 

        // Wirtschaft & Rohstoffe (Siedler-inspirierte Supply-Chain)
        this.resources = {
            wood: 50,
            stone: 30,
            food: 100,
            tools: 10,
            knowledge: 0
        };

        // Glaubens- & Entwicklungs-Metriken
        this.faithManifestations = {
            shrinesBuilt: 0,
            preachersActive: 0,
            commandmentsEnacted: [],
            sacrificesMade: 0
        };

        // Externe Einflüsse & Kriege
        this.foreignReligionsPresent = false; // Reisende mit anderem Glauben
        this.atWar = false;
    }

    /**
     * Steuert die Zivilisations-Zyklen pro Tick
     */
    update(dt) {
        const pop = gameState.civilization.population;
        if (pop <= 0) return;

        // 1. Familie- vs. Arbeits-Slider Logik
        if (this.socialSlider < 0.5) {
            // Familienorientiert: Schnelleres Wachstum & starker Glaube
            const growthMultiplier = (0.5 - this.socialSlider) * 2.0;
            gameState.civilization.population += dt * 0.1 * growthMultiplier;
            gameState.g_belief += dt * 0.5 * growthMultiplier; // Mehr Anhänger = festerer Glaube
        } else {
            // Arbeitsorientiert: Rohstoffabbau, Versorgung & Forschung
            const workMultiplier = (this.socialSlider - 0.5) * 2.0;
            this.resources.wood += dt * 0.5 * workMultiplier;
            this.resources.food = Math.max(0, this.resources.food - dt * 0.2); // Versorgung kostet Food
            this.resources.knowledge += dt * 0.2 * workMultiplier; // Forschung / Entwicklung schreitet voran
        }

        // 2. Glaubens-Manifestation durch Schreine & Prediger
        const shrineBonus = this.faithManifestations.shrinesBuilt * 1.5;
        const preacherBonus = this.faithManifestations.preachersActive * 2.0;
        gameState.g_belief += (shrineBonus + preacherBonus) * dt * 0.1;

        // 3. Glaubensverlust durch Ketzer, fremde Reisende oder Kriege
        if (this.foreignReligionsPresent || this.atWar) {
            gameState.g_belief = Math.max(0, gameState.g_belief - dt * 0.8);
        }
    }

    /**
     * Opfergabe darbringen (festigt den Glauben massiv, opfert Nahrung/Menschen)
     */
    offerSacrifice(type = 'food') {
        if (type === 'food' && this.resources.food >= 20) {
            this.resources.food -= 20;
            this.faithManifestations.sacrificesMade++;
            gameState.g_belief += 50;
            return { success: true, message: "Opfergabe dargebracht! Der Glaube wurde durch Nahrungsgabe gestärkt." };
        }
        return { success: false, message: "Nicht genügend Opfergaben vorhanden!" };
    }

    /**
     * Entsende eine Mission oder einen Kreuzzug zu anderen Zivilisationen
     */
    sendExpedition(type = 'mission') {
        if (gameState.civilization.population < 10) {
            return { success: false, message: "Zu wenig Bevölkerung für eine Expedition!" };
        }

        if (type === 'mission') {
            // Entdecke neue Rohstoffe / Fähigkeiten
            this.resources.knowledge += 50;
            this.resources.tools += 5;
            return { success: true, message: "Mission erfolgreich! Neue Rohstoffe und Wissen wurden ins Heimatland gebracht." };
        } else if (type === 'crusade') {
            this.atWar = true;
            return { success: true, message: "Kreuzzug gestartet! Ein Konflikt mit einer benachbarten Zivilisation entbrennt." };
        }
    }
}
