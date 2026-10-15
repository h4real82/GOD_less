# ⚡ GOD:less (Black & White Ultra)

Göttliche 3D-Echtzeit-Strategie & Chimären-Kreaturen-Simulation im Browser (Three.js + Vite + Tailwind CSS).

## 📂 Modulare Projektstruktur für VS Code

```text
├── .vscode/                        # VS Code Workspace-Einstellungen & Empfehlungen
├── src/
│   ├── config/
│   │   └── constantsAndState.js    # Sektion 1: Epochen, 14 Spezies, 13 Beschaffenheiten, 5 Slots & Welt-State
│   ├── engine/
│   │   ├── AssetForge.js           # Sektion 2: Prozedurale 512px Texturen & Kreaturen-Logo-Renderer
│   │   ├── worldTerrain.js         # Sektion 4: 3D-Inselwelt, Höhenmodell, Wasser, Bäume & Erz-Felsen
│   │   └── gameLoop.js             # Sektion 10: Haupt- Simulations- & Render-Loop
│   ├── entities/
│   │   ├── buildingsAndTemple.js   # Sektion 5: Kuppeltempel, Stufenplatz, Baugerüste, Kräne & Ruinen
│   │   ├── villagersAndHand.js     # Sektion 6: Animierte 3D-Siedler & Göttliche Wolkenhand
│   │   └── chimeraCreature3D.js    # Sektion 7: Modularer 3D-Chimären-Titan (Kopf, Oberkörper, Unterkörper)
│   ├── systems/
│   │   ├── miraclesAndInput.js     # Sektion 8: Gesten-Runen-Erkennung, Wunder & Raycasting
│   │   └── creatureAI.js           # Sektion 9: Autonome Kreaturen-KI & Kinematik
│   ├── ui/
│   │   ├── cardTilt.js             # 3D-Parallax-Karten im Startbildschirm
│   │   └── titleLightningFX.js     # Sektion 3: Interaktive Maus-Blitze im Hauptmenü
│   ├── styles/
│   │   └── main.css                # Ausgelagertes Styling & Glasmorphismus-Effekte
│   └── main.js                     # Vite Application Entrypoint
├── index.html                      # Sauberes HTML-Grundgerüst & UI-Overlays
├── package.json                    # NPM-Skripte & Dependencies
└── vite.config.js                  # Vite Dev-Server & Bundler-Konfiguration
```

## 🚀 Schnellstart in VS Code

1. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```
2. **Entwicklungsserver mit Live-Reload starten:**
   ```bash
   npm run dev
   ```
3. **Produktions-Build für GitHub Pages erstellen:**
   ```bash
   npm run build
   ```
