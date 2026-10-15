# Architektur- und Design-Spezifikation (GOD:less Overhaul)

> **Rolle:** Lead Technical Director & Senior Game Designer  
> **Ziel:** Fundamentale Neuausrichtung von Engine-Architektur, Spieldesign und Grafik auf AAA-Browser-Niveau (Referenz: *Black & White 2* & moderne *Age of Empires*-Editionen).

---

## 1. Visuelle Referenzen & Technologie-Evaluierung (Ziel: 60 FPS stabile Performance)

### Visueller Ist-Zustand vs. Soll-Qualität (aus `/Media/Black & White 2 Samples/`)
Die Bildreferenzen zeigen monumentale Tempelanlagen, epische Landschaften mit organischen Höhenstufen, detaillierte Echtzeit-Schatten, atmosphärische volumetrische Beleuchtung und riesige Menschenmassen. Aktuell nutzt das Projekt eine einfache Three.js-Implementierung. Um das Soll-Niveau zu erreichen, sind folgende technologische Weichenstellungen zwingend erforderlich:

### Technologie-Entscheidung: Three.js (mit WebGPU-Pfad) vs. Babylon.js vs. WebGPU
* **Entscheidung:** **Three.js** in Kombination mit einem modernen **WebGPU-/WebGL2-Hybrid-Renderer** (bzw. gezieltem Einsatz von WebGL2 mit fortgeschrittenem Custom Shading). 
* **Begründung:** Three.js bietet die flexibelste Shader-Architektur für Custom Materials, ist leichtgewichtig und besitzt eine exzellente Community für Strategie-Spiele. Babylon.js ist zu schwerfällig für hochgradig anpassbare RTS-Partikel- und Instanced-Pipelines.
* **Asset-Pipeline & Rendering-Techniken:**
  - **glTF 2.0 / Draco Compression:** Für optimierte Ladezeiten und kompakte Mesh-Übertragung.
  - **PBR-Materialien (Physically Based Rendering):** Metalligkeit, Rauheit, Normal Maps für Gebäude (Holz, Stein, Marmor) und Terrain.
  - **Instanced Rendering (`InstancedMesh`):** Absolut kritisch, um Tausende von Dorfbewohnern und Bäumen mit nur einem Draw Call pro Typ flüssig (60 FPS) darzustellen.
  - **LODs (Level of Detail):** Automatische Reduzierung der Polygonanzahl bei weit herausgezoomter Kamera.

---

## 2. Datenstruktur & Engine-Architektur (Data-Driven ECS / State-Layer)

Um die Simulationslogik komplett von den visuellen Komponenten zu entkoppeln (Headless-fähig für Multiplayer/Savegames):

### Daten-Schema (TypeScript / JSON)
```typescript
// Beispiel Entity Schema
interface Entity {
    id: string;
    type: 'villager' | 'building' | 'creature' | 'resource';
    transform: {
        position: [number, number, number];
        rotation: [number, number, number];
        scale: [number, number, number];
    };
    stats: {
        health: number;
        maxHealth: number;
        energy?: number;
        faith?: number;
    };
    aiState?: {
        currentNeed: 'hunger' | 'work' | 'sleep' | 'panic';
        targetPosition?: [number, number, number];
    };
}
```
* **Architektur:** Trennung in `SimulationCore` (pure Datenverarbeitung, fester Tick-Rate, deterministisch) und `RenderEngine` (interpolierte Bildwiederholrate, Three.js-Szene).

---

## 3. KI- & Verhaltensplanung

* **Dorfbewohner (Utility AI / Needs-Based):** 
  - Gewichtete Bedürfnispyramide (Überleben > Glaube > Fortpflanzung > Luxus).
  - Panik-System bei göttlichen Eingriffen (Blitz, Feuer, Erdbeben) mit Flucht-Vektoren.
* **Die Kreatur (B&W-Style Learning System):**
  - Verstärkungslernen (Reinforcement Learning / Scripted Cueing): Bestrafung (Schlagen) senkt Aggression/erhöht Furcht; Belohnung (Streicheln) fördert Gehorsam und Liebe.
  - Alignment-Achse: Gut (hilft Dorfbewohnern, baut Tempel aus) vs. Böse (frisst Menschen, terrorisiert Dörfer).
* **Der Spieler (Gott-Interaktionsmodell):**
  - Die Göttliche Hand als physikalischer Cursor (Raycasting + RigidBody-Interaktion).
  - Wundersystem mit Wirkungsradius, Glaubenskosten und visuellen Partikeleffekten.

---

## 4. Techtree & Ingame-Steuerung

* **Entwicklungsbaum (Zeitalter-Matrix):**
  - *Zeitalter I (Nomaden):* Lagerfeuer, Zelte, Holzfäller.
  - *Zeitalter II (Archaische Polis):* Steinmauern, Bauernhöfe, kleine Tempel.
  - *Zeitalter III (Klassische Metropole):* Amphitheater, Kornspeicher, Monumental-Statuen.
  - *Zeitalter IV (Göttliches Imperium):* Gigantische Wunder, fliegende Tempel-Module.
* **Steuerung (Controls):**
  - Kamera: Nahtloser Übergang von der Vogelperspektive (strategische Weltkarte) bis in die Ego-Perspektive (direkt hinter der Kreatur oder neben den Dorfbewohnern).
  - Maus-Gesten für Spezialzauber (z. B. Feuersturm-Symbol zeichnen).
