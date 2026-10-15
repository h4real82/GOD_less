import { gameState } from '../config/constantsAndState.js';

/**
 * AdvancedGodHandPhysicsSystem: 
 * Steuert die Physik der göttlichen Hand (Greifen, Bewegen, Werfen von Menschen & Objekten)
 * inklusive ballistischer Flugbahnen und Schadensberechnung bei Aufprall.
 */
export class AdvancedGodHandPhysicsSystem {
    constructor() {
        this.heldObject = null; // Kann ein Mensch, ein Stein oder ein Gebäudefragment sein
        this.throwVelocity = new THREE.Vector3();
    }

    /**
     * Die Hand greift ein Ziel (Mensch oder Objekt)
     */
    grab(entity) {
        if (this.heldObject) return false;
        this.heldObject = entity;
        console.log(`[GÖTTLICHES PHYSIK-SYSTEM]: Objekt/Mensch gegriffen.`);
        return true;
    }

    /**
     * Die Hand wirft das gehaltene Objekt mit Wucht (Ballistik & Verletzung)
     */
    throw(targetDirection, force = 50.0) {
        if (!this.heldObject) return false;

        this.throwVelocity.copy(targetDirection).normalize().multiplyScalar(force);
        const thrownEntity = this.heldObject;
        this.heldObject = null;

        console.log(`[GÖTTLICHES PHYSIK-SYSTEM]: Objekt/Mensch geworfen mit Kraft ${force}!`);
        return {
            entity: thrownEntity,
            velocity: this.throwVelocity
        };
    }

    /**
     * Simuliert die Flugbahn und berechnet Aufprallschaden (Verletzung/Tod)
     */
    updatePhysics(dt, entityList, relationSystem) {
        if (!this.heldObject && this.throwVelocity.lengthSq() > 0.01) {
            // Beispielhafte Flugbahn-Simulation für geworfene Entitäten
            this.throwVelocity.y -= 9.81 * dt; // Schwerkraft
            
            // Aufprallprüfung (vereinfacht auf Bodenhöhe y <= 0)
            if (this.throwVelocity.y <= 0) {
                this.throwVelocity.set(0, 0, 0);
                // Wenn ein Mensch geworfen wurde und aufprallt -> Verletzung oder Tod!
                if (relationSystem) {
                    relationSystem.registerEvent('villager_thrown');
                }
            }
        }
    }
}
