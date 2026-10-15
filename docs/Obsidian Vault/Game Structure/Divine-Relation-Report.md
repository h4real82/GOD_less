# [[Project-Status]] - Göttliches Beziehungs- und Moralsystem

> **Datum:** 15.10.2026
> **Status:** Implementiert & Verifiziert

## Neues System: Menschliche Beziehung zu Gott (`DivineRelationSystem`)
- **Modul:** `src/systems/divineRelationSystem.js`
- **Kernmechaniken:**
  - Berechnet das Verhältnis der Zivilisation zum Spieler über **Liebe**, **Furcht** und den Gesamtwert (**RelationScore**).
  - Reagiert direkt auf destruktives göttliches Eingreifen (z. B. wenn die Hand Menschen wirft oder tötet, wenn die Kreatur Menschen frisst oder Gebäude zerstört).
  - Bei extremer Furcht und niedriger Liebe entsteht ein **Rebellionsrisiko** (`rebelRisk`), welches gemäß [[Spiel_logik]] zu Bevölkerungsverlust durch Abwanderung und Glaubensabfall führt.
- **Build-Status:** Kompiliert fehlerfrei (`npm run build`).
