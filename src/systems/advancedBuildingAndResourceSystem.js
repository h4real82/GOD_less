import { gameState } from '../config/constantsAndState.js';

/**
 * AdvancedBuildingAndResourceSystem: 
 * Steuert das ressourcenbasierte Gebäude- und Upgrade-System (Siedler-Style),
 * den Entwicklungsbaum (Holzhütte -> Steinhaus -> Mehrfamilienhaus),
 * Gebäude-Gesundheit (Zerstörung durch Unwetter, Katastrophen, Raubzüge)
 * sowie das Kontext-Menü für die Götterhand (Rechtsklick-Aktionen).
 */
export class AdvancedBuildingAndResourceSystem {
    constructor() {
        // Freigeschaltete Gebäude nach Entwicklungsstufe
        this.unlockedBuildings = {
            wood_hut: true,
            stone_house: false,
            apartment_block: false,
            shrine: true,
            school: false,
            university: false,
            blacksmith: false,
            tavern: false,
            doctor: false,
            community_center: false,
            entertainment_park: false
        };

        // Aktive Gebäude in der Welt mit Gesundheit & Upgrade-Pfad
        this.buildingsInWorld = [];
    }

    /**
     * Erstellt ein neues Gebäude in der Welt
     */
    constructBuilding(type, position, tier = 1) {
        if (!this.unlockedBuildings[type]) {
            console.warn(`[GEBÄUDE-SYSTEM]: Gebäude ${type} ist noch nicht durch den Tech-Tree freigeschaltet!`);
            return null;
        }

        const building = {
            id: 'b_' + Math.random().toString(36.substring(2, 9)),
            type: type,
            tier: tier, // 1 = Hütte, 2 = Haus, 3 = Mehrfamilienhaus
            position: position,
            health: 100.0, // Gesundheit für das Zerstörungssystem
            maxHealth: 100.0,
            status: 'active'
        };

        this.buildingsInWorld.push(building);
        console.log(`[GEBÄUDE-SYSTEM]: ${type} (Tier ${tier}) erbaut bei`, position);
        return building;
    }

    /**
     * Upgrade-System: Entwickelt ein Gebäude weiter (z.B. Holzhütte -> Steinhaus)
     */
    upgradeBuilding(buildingId, resourcesAvailable) {
        const building = this.buildingsInWorld.find(b => b.id === buildingId);
        if (!building) return false;

        if (building.tier === 1 && building.type === 'wood_hut') {
            if (resourcesAvailable.stone >= 20 && resourcesAvailable.wood >= 10) {
                building.type = 'stone_house';
                building.tier = 2;
                building.maxHealth = 200.0;
                building.health = 200.0;
                console.log(`[UPGRADE]: Holzhütte wurde zu einem Steinhaus weiterentwickelt!`);
                return true;
            }
        } else if (building.tier === 2 && building.type === 'stone_house') {
            if (resourcesAvailable.stone >= 50 && resourcesAvailable.tools >= 10) {
                building.type = 'apartment_block';
                building.tier = 3;
                building.maxHealth = 400.0;
                building.health = 400.0;
                console.log(`[UPGRADE]: Steinhaus wurde zu einem Mehrfamilienhaus weiterentwickelt!`);
                return true;
            }
        }
        return false;
    }

    /**
     * Zerstörungssystem: Beschädigung durch Unwetter, Katastrophen oder Kriege
     */
    damageBuilding(buildingId, damageAmount) {
        const building = this.buildingsInWorld.find(b => b.id === buildingId);
        if (!building) return;

        building.health = Math.max(0, building.health - damageAmount);
        if (building.health === 0) {
            building.status = 'destroyed';
            console.log(`[ZERSTÖRUNG]: Gebäude ${building.type} wurde vollständig zerstört!`);
        }
    }
}
