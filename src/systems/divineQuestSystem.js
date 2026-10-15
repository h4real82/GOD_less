import { gameState } from '../config/constantsAndState.js';

/**
 * DivineQuestAndMiracleSystem: Götter-Quests, Etappen und Wunder-Progression.
 * Bestimmte mächtige Wunder (wie Meteorit, Blitzsturm, Erdbeben) müssen durch
 * göttliche Quests und Glaubens-Etappen freigeschaltet werden.
 */
export class DivineQuestAndMiracleSystem {
    constructor() {
        this.quests = [
            {
                id: 'quest_first_temple',
                title: 'Der erste Schreien',
                description: 'Sammle 150 Glauben von deinen Anhängern, um das Zeitalter der Nomaden zu festigen.',
                rewardBelief: 100,
                requiredFaith: 150,
                rewardMiracle: 'lightning_bolt',
                completed: false
            },
            {
                id: 'quest_grow_population',
                title: 'Wachsende Herde',
                description: 'Erhöhe die Bevölkerung deiner Zivilisation auf mindestens 30 Menschen.',
                rewardBelief: 250,
                requiredPopulation: 30,
                rewardMiracle: 'fireball_storm',
                completed: false
            },
            {
                id: 'quest_divine_wrath',
                title: 'Prüfung des Glaubens',
                description: 'Führe ein Wunder aus und beweise deine absolute Macht über das Terrain.',
                rewardBelief: 500,
                requiredMiraclesCast: 5,
                rewardMiracle: 'earthquake',
                completed: false
            }
        ];

        this.unlockedMiracles = {
            heal: true,          // Standard-Wunder (Heilung/Leben)
            light_beam: true,    // Standard-Wunder (Göttliches Licht)
            lightning_bolt: false, // Freischaltbar durch Quest 1
            fireball_storm: false, // Freischaltbar durch Quest 2
            earthquake: false     // Freischaltbar durch Quest 3
        };

        this.miraclesCastCount = 0;
    }

    /**
     * Prüft, ob Quests abgeschlossen wurden, und schaltet Wunder frei.
     */
    checkQuests() {
        this.quests.forEach(quest => {
            if (quest.completed) return;

            let conditionMet = false;

            if (quest.requiredFaith && gameState.g_belief >= quest.requiredFaith) {
                conditionMet = true;
            } else if (quest.requiredPopulation && gameState.civilization.population >= quest.requiredPopulation) {
                conditionMet = true;
            } else if (quest.requiredMiraclesCast && this.miraclesCastCount >= quest.requiredMiraclesCast) {
                conditionMet = true;
            }

            if (conditionMet) {
                quest.completed = true;
                gameState.g_belief += quest.rewardBelief;
                if (quest.rewardMiracle) {
                    this.unlockedMiracles[quest.rewardMiracle] = true;
                }
                console.log(`[GÖTTLICHE QUEST ABGESCHLOSSEN]: ${quest.title}! Neues Wunder freigeschaltet: ${quest.rewardMiracle}`);
            }
        });
    }

    castMiracle(miracleId) {
        if (!this.unlockedMiracles[miracleId]) {
            console.warn(`[WUNDER GESPERRT]: Das Wunder '${miracleId}' wurde noch nicht durch Götter-Quests freigeschaltet!`);
            return false;
        }
        this.miraclesCastCount++;
        this.checkQuests();
        return true;
    }
}
