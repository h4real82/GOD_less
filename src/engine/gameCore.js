import * as THREE from 'three';

/**
 * GameCore: Verwaltet die entkoppelte Simulation (20 Ticks/Sek) und den Render-Loop (60+ FPS).
 */
export class GameCore {
    constructor() {
        this.tickRate = 20; // 20 Ticks pro Sekunde für Simulation
        this.tickInterval = 1000 / this.tickRate;
        this.accumulator = 0;
        this.lastTime = performance.now();
        
        this.simulationState = {
            timeOfDay: 0.0, // 0.0 bis 1.0 (Tag/Nacht)
            population: 15,
            faith: 100,
            creatures: []
        };
    }

    init() {
        console.log("GameCore: Initialisiere entkoppelte Engine-Architektur...");
    }

    // Fest getakteter Simulationsschritt (Headless-fähig)
    updateSimulation(dt) {
        // Tag/Nacht-Zyklus vorantreiben
        this.simulationState.timeOfDay = (this.simulationState.timeOfDay + dt * 0.01) % 1.0;
        
        // Hier greift später die Utility-AI der Dorfbewohner und Kreaturen
    }

    // Hauptschleife
    run(renderCallback) {
        const currentTime = performance.now();
        const frameTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.accumulator += frameTime;

        while (this.accumulator >= this.tickInterval) {
            this.updateSimulation(this.tickInterval / 1000);
            this.accumulator -= this.tickInterval;
        }

        // Interpolationsfaktor für flüssiges Rendering
        const alpha = this.accumulator / this.tickInterval;
        
        if (renderCallback) {
            renderCallback(alpha, this.simulationState);
        }
    }
}
