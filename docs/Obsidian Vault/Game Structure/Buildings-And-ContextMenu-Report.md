# [[Project-Status]] - Kontextmenü, Rohstoff- & Gebäude-Evolutionssystem

> **Datum:** 15.10.2026
> **Status:** Implementiert & Verifiziert

## Neueste Features & Mechaniken
1. **Rechtsklick-Kontextmenü (`AdvancedContextMenuSystem`):**
   - Modul: `src/systems/advancedContextMenuSystem.js`
   - Bietet interaktive Aktionsmöglichkeiten bei Rechtsklick auf Ressourcen (*Holz ernten, Stein abbauen*), Gebäude (*Reparieren, Upgraden, Zerstören*) oder die Kreatur (*Lob, Strafe, Bewegen*).
2. **Ressourcen-, Gebäude- & Upgrade-System (`AdvancedBuildingAndResourceSystem`):**
   - Modul: `src/systems/advancedBuildingAndResourceSystem.js`
   - **Objektpfad & Evolution:** Holzhütten (Tier 1) können bei passender Entwicklungsstufe und Rohstoffen direkt zu Steinhäusern (Tier 2) und Mehrfamilienhäusern (Tier 3) weiterentwickelt werden.
   - **Spezial-Objekte nach Tech-Stufe:** Integration von *Schulen, Universitäten, Hufschmieden, Tavernen, Ärzten, Gemeindezentren und Vergnügungsparks*.
   - **Zerstörungssystem:** Jedes Gebäude besitzt Gesundheit (`health` / `maxHealth`), die durch Unwetter, Katastrophen, Raubzüge oder Kriege reduziert und durch Hand/Bürger repariert werden kann.
- **Build-Status:** Kompiliert fehlerfrei (`npm run build`).
