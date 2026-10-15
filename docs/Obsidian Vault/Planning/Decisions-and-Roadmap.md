# Architektonische Entscheidungen & Roadmap (GOD:less Overhaul)

> **Status:** Freigabe erteilt. Alle 3 Richtungsentscheidungen wurden basierend auf Best Practices für High-Performance Browser-Spiele getroffen.

## Getroffene Architekturentscheidungen

1. **Grafik-Pipeline & Shader:**
   - *Entscheidung:* **Hybrid aus optimierten PBR-Standardmaterialien und maßgeschneiderten GLSL-Shadern (Custom Shaders)**.
   - *Begründung:* PBR sorgt für realistische Oberflächen (Holz, Stein, Fell), während gezielte Custom Shader (für dynamische Wind-Animationen an Bäumen, prozedurale Wolkenschatten und sanftes Terrain-Blending) die visuelle AAA-Atmosphäre von *Black & White 2* im Browser ermöglichen, ohne die Performance zu sprengen.

2. **Simulations-Tickrate (Entkoppelte Logik):**
   - *Entscheidung:* **Fester, entkoppelter Simulations-Loop (20 Ticks/Sekunde)** getrennt vom Render-Loop (60+ FPS).
   - *Begründung:* Garantiert deterministisches Verhalten der Dorfbewohner-KI, stabile Wirtschaftssimulation und entlastet den CPU-Main-Thread massiv, da komplexe Pfadfindungs- und Bedürfnis-Berechnungen nicht jeden Frame ausgeführt werden müssen.

3. **Kamera-Modus (Nahtloser Zoom):**
   - *Entscheidung:* **Stufenloser, grenzenloser Seamless-Zoom** (von der strategischen Götter-Vogelperspektive bis hin zur immersiven Third-Person-Schulterperspektive der Kreatur/Dorfbewohner).
   - *Begründung:* Das ist das absolute Herzstück und Markenzeichen von *Black & White*-Spielen. Es erzeugt die maximale spielerische Immersion und trennt das Spiel von Standard-Strategiespielen.

---
## Nächster Schritt: Beginn der Umsetzung von Phase 1 (Engine-Setup & Core Data-Layer)
