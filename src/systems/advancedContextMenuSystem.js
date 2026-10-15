/**
 * AdvancedContextMenuSystem: 
 * Steuert das Rechtsklick-Kontextmenü für Gebäude, Kreatur und Ressourcen in der Spielwelt.
 */
export class AdvancedContextMenuSystem {
    constructor() {
        this.activeMenu = null;
    }

    /**
     * Öffnet das Kontextmenü für ein angeklicktes Objekt
     * @param {string} targetType - 'resource' ('wood', 'stone'), 'building', oder 'creature'
     * @param {Object} targetData - Positions- oder Entitätsdaten
     * @param {Object} screenPosition - {x, y} für UI-Darstellung
     */
    showMenu(targetType, targetData, screenPosition) {
        this.activeMenu = {
            type: targetType,
            data: targetData,
            position: screenPosition,
            options: this.getOptionsForTarget(targetType)
        };
        console.log(`[KONTEXTMENÜ]: Geöffnet für ${targetType} an Position`, screenPosition);
        return this.activeMenu;
    }

    getOptionsForTarget(targetType) {
        switch (targetType) {
            case 'resource_wood':
                return [
                    { label: 'Holz ernten (Mensch zuweisen)', action: 'assign_villagers_wood' },
                    { label: 'Kreatur zum Fällen schicken', action: 'send_creature_wood' }
                ];
            case 'resource_stone':
                return [
                    { label: 'Stein abbauen (Mensch zuweisen)', action: 'assign_villagers_stone' },
                    { label: 'Kreatur zum Zerkleinern schicken', action: 'send_creature_stone' }
                ];
            case 'building':
                return [
                    { label: 'Reparieren', action: 'repair_building' },
                    { label: 'Aufwerten (Upgrade)', action: 'upgrade_building' },
                    { label: 'Einreißen / Zerstören', action: 'destroy_building' }
                ];
            case 'creature':
                return [
                    { label: 'Lobchen / Belohnen', action: 'praise_creature' },
                    { label: 'Bestrafen / Züchtigen', action: 'punish_creature' },
                    { label: 'Hierher befehlen', action: 'command_move_creature' }
                ];
            default:
                return [];
        }
    }

    hideMenu() {
        this.activeMenu = null;
    }
}
