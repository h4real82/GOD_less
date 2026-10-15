import { gameState } from '../config/constantsAndState.js';

/**
 * AdvancedCreatureDesignerSystem: 
 * Steuert den Kreaturen-Designer, das modulare Gewebe- und Mischmodell,
 * Oberflächen-Beschaffenheiten (Fell/Haut) sowie das punktebasierte Maximalwert-System
 * (Evolution, Alterung und Werteveränderung im Spielverlauf).
 */
export class AdvancedCreatureDesignerSystem {
    constructor() {
        // Verfügbare Tier-Komponenten (aus dem Design-Konzept)
        this.availableSpecies = [
            'lion', 'wolf', 'leopard', 'bull', 'gazelle', 
            'snake', 'eagle', 'wasp', 'ape', 'horse', 'rhino', 'elephant', 'crocodile', 'bison'
        ];

        // Verfügbare Oberflächen / Fell- & Hautmuster
        this.availableSurfaces = [
            'pied', 'leopard_fur', 'lion_fur', 'tiger_fur', 'wolf_fur', 
            'bison_fur', 'snake_skin', 'crocodile_skin', 'elephant_skin', 'eagle_feathers'
        ];

        // Aktuelle Designer-Konfiguration der Kreatur (Slots: Kopf, Körper, Beine, Schwanz/Flügel etc.)
        this.currentDesign = {
            name: 'Chimära',
            slots: {
                head: 'lion',
                body: 'bull',
                limbs: 'ape',
                tail: 'snake'
            },
            surface: 'lion_fur',
            colorPrimary: '#c87d32',
            colorSecondary: '#5c2c0c'
        };

        // Punktebasiertes Maximalwert-System (Eigenschaften mit Max-Limit & Evolution)
        this.statCap = 100.0; // Absolutes Maximum für Basiswerte
        this.stats = {
            strength: 50.0,   // Physische Kraft (z.B. für Gebäude werfen / Kämpfen)
            speed: 50.0,      // Bewegungsgeschwindigkeit
            intelligence: 50.0,// Lernfähigkeit & Gehorsam
            aggressiveness: 40.0 // Aggression gegen Menschen/Feinde
        };

        this.statPointsAvailable = 20.0; // Freie Entwicklungspunkte im Designer
    }

    /**
     * Setzt ein Körperteil auf ein spezifisches Tier, falls verfügbar.
     */
    setBodyPart(slotName, speciesId) {
        if (!this.availableSpecies.includes(speciesId)) {
            console.warn(`[CREATURE DESIGNER]: Unbekannte Spezies ${speciesId}`);
            return false;
        }
        this.currentDesign.slots[slotName] = speciesId;
        return true;
    }

    /**
     * Legt die Fell- oder Hautbeschaffenheit fest.
     */
    setSurface(surfaceId) {
        if (!this.availableSurfaces.includes(surfaceId)) {
            console.warn(`[CREATURE DESIGNER]: Unbekanntes Muster ${surfaceId}`);
            return false;
        }
        this.currentDesign.surface = surfaceId;
        return true;
    }

    /**
     * Verteilt verbleibende Entwicklungspunkte auf die Werte (unter Beachtung des Maximalwerts).
     */
    allocateStat(statName, amount) {
        if (this.stats[statName] === undefined) return false;
        
        const potentialNewVal = this.stats[statName] + amount;
        if (potentialNewVal <= this.statCap && this.statPointsAvailable >= amount) {
            this.stats[statName] = potentialNewVal;
            this.statPointsAvailable -= amount;
            return true;
        }
        return false;
    }

    /**
     * Aktualisiert die Werte im Spielverlauf (Evolution, Alterung oder Misshandlung)
     */
    updateEvolution(delta, alignment, healthStatus) {                       
        // Wenn die Kreatur gut behandelt wird oder lernt, steigt die Intelligenz/Stärke
        if (alignment > 0.5) {
            this.stats.intelligence = Math.min(this.statCap, this.stats.intelligence + delta * 0.1);
        } else if (alignment < -0.5) {
            this.stats.aggressiveness = Math.min(this.statCap, this.stats.aggressiveness + delta * 0.15);
        }

        // Alterung / Erschöpfung senkt die physischen Werte leicht, wenn ungepflegt
        if (healthStatus < 0.3) {
            this.stats.strength = Math.max(10.0, this.stats.strength - delta * 0.05);
        }
    }
}
