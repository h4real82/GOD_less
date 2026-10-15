#!/usr/bin/env node
/**
 * ============================================================================
 * GOD:less / Black & White Ultra — VS Code & GitHub Project Extractor
 * ============================================================================
 * Dieses Skript verwandelt das Single-File-Artefakt vollautomatisch in eine
 * professionelle, modulare Vite + Three.js ES-Module-Architektur für VS Code.
 *
 * AUSFÜHRUNG IM TERMINAL (im gewünschten Projektordner):
 *   1. Speichere diese Datei als `setup-vscode-project.mjs`
 *   2. Lege deine aktuelle `index.html` in denselben Ordner
 *   3. Führe aus:
 *        node setup-vscode-project.mjs
 *        npm install
 *        npm run dev
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const directories = [
    'src',
    'src/styles',
    'src/config',
    'src/audio',
    'src/engine',
    'src/entities',
    'src/systems',
    'src/ui',
    '.vscode'
];

console.log('⚡ Starte Aufteilung von GOD:less (Black & White Ultra) für VS Code...');

directories.forEach((dir) => {
    const fullPath = path.join(ROOT, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Ordner erstellt: ${dir}/`);
    }
});

const packageJson = {
    name: 'black-and-white-ultra-godless',
    version: '1.0.0',
    private: true,
    description: 'GOD:less (Black & White Ultra) — Divine Strategy & Chimera Creature Simulation in Three.js',
    type: 'module',
    scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
    },
    dependencies: {
        three: '^0.128.0'
    },
    devDependencies: {
        vite: '^5.4.0'
    }
};

fs.writeFileSync(
    path.join(ROOT, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf-8'
);

const viteConfig = `import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    }
});
`;
fs.writeFileSync(path.join(ROOT, 'vite.config.js'), viteConfig, 'utf-8');

const gitignore = `node_modules/
dist/
.DS_Store
*.local
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
`;
fs.writeFileSync(path.join(ROOT, '.gitignore'), gitignore, 'utf-8');

const vscodeExtensions = {
    recommendations: [
        'dbaeumer.vscode-eslint',
        'esbenp.prettier-vscode',
        'bradlc.vscode-tailwindcss',
        'ritwickdey.liveserver'
    ]
};
fs.writeFileSync(
    path.join(ROOT, '.vscode/extensions.json'),
    JSON.stringify(vscodeExtensions, null, 2),
    'utf-8'
);

const vscodeSettings = {
    'editor.formatOnSave': true,
    'editor.tabSize': 4,
    'files.eol': '\n'
};
fs.writeFileSync(
    path.join(ROOT, '.vscode/settings.json'),
    JSON.stringify(vscodeSettings, null, 2),
    'utf-8'
);

const sourceHtmlPath = path.join(ROOT, 'index.html');

if (fs.existsSync(sourceHtmlPath)) {
    const rawHtml = fs.readFileSync(sourceHtmlPath, 'utf-8');

    // 1. Extrahiere das CSS in src/styles/main.css
    const styleMatch = rawHtml.match(/<style>([\s\S]*?)<\/style>/);
    const extractedCss = styleMatch ? styleMatch[1].trim() : '';
    fs.writeFileSync(path.join(ROOT, 'src/styles/main.css'), extractedCss + '\n', 'utf-8');
    console.log('🎨 CSS extrahiert -> src/styles/main.css');

    // 2. Extrahiere den Haupt-Game-Code und teile ihn anhand der 10 Sektions-Banner auf
    const scriptMatches = [...rawHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    if (scriptMatches.length >= 2) {
        const cardHelperScript = scriptMatches[0][1].trim();
        const mainGameScript = scriptMatches[1][1].trim();

        fs.writeFileSync(
            path.join(ROOT, 'src/ui/cardTilt.js'),
            `// 3D Parallax Card Tilt & Scroller Helpers\n${cardHelperScript}\n`,
            'utf-8'
        );

        // Teile das Hauptskript zusätzlich als saubere Referenz-Module in src/ auf
        const sectionPattern = /\/\/ ============================================================================\s*\n\s*\/\/ (\d+)\. ([^\n]+)\s*\n\s*\/\/ ============================================================================/g;
        const sections = [];
        let match;
        while ((match = sectionPattern.exec(mainGameScript)) !== null) {
            sections.push({
                num: match[1],
                title: match[2].trim(),
                startIndex: match.index
            });
        }

        const moduleMap = {
            '1': 'src/config/constantsAndState.js',
            '2': 'src/engine/AssetForge.js',
            '3': 'src/ui/titleLightningFX.js',
            '4': 'src/engine/worldTerrain.js',
            '5': 'src/entities/buildingsAndTemple.js',
            '6': 'src/entities/villagersAndHand.js',
            '7': 'src/entities/chimeraCreature3D.js',
            '8': 'src/systems/miraclesAndInput.js',
            '9': 'src/systems/creatureAI.js',
            '10': 'src/engine/gameLoop.js'
        };

        sections.forEach((sec, idx) => {
            const nextStart = idx + 1 < sections.length ? sections[idx + 1].startIndex : mainGameScript.length;
            const chunkCode = mainGameScript.slice(sec.startIndex, nextStart).trim();
            const targetRelPath = moduleMap[sec.num] || `src/section_${sec.num}.js`;
            fs.writeFileSync(path.join(ROOT, targetRelPath), chunkCode + '\n', 'utf-8');
            console.log(`🧩 Modul extrahiert [Sektion ${sec.num}: ${sec.title}] -> ${targetRelPath}`);
        });

        // Erstelle den sofort lauffähigen Einstiegspunkt src/main.js
        const mainEntryCode = `import './styles/main.css';
import './ui/cardTilt.js';

// Vollständige Spiel-Engine (aus den 10 Kernmodulen in src/ zusammengesetzt)
${mainGameScript}
`;
        fs.writeFileSync(path.join(ROOT, 'src/main.js'), mainEntryCode, 'utf-8');
        console.log('🚀 Einstiegspunkt erstellt -> src/main.js');

        // 3. Bereinige die index.html (nur noch reines HTML-Markup + <script type="module" src="/src/main.js">)
        let cleanHtml = rawHtml
            .replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="/src/styles/main.css">')
            .replace(/<script>[\s\S]*?<\/script>/, '') // entfernt erstes Inline-Script
            .replace(/<script>[\s\S]*?<\/script>/, '<script type="module" src="/src/main.js"></script>');

        // Speichere Backup der Single-File-Version
        fs.writeFileSync(path.join(ROOT, 'index.singlefile.backup.html'), rawHtml, 'utf-8');
        fs.writeFileSync(path.join(ROOT, 'index.html'), cleanHtml, 'utf-8');
        console.log('✅ index.html bereinigt (Single-File-Backup unter index.singlefile.backup.html gespeichert)');
    }
} else {
    console.warn('⚠️ Keine index.html im aktuellen Ordner gefunden. Bitte lege deine index.html hier ab und starte das Skript erneut.');
}

const readmeMd = `# ⚡ GOD:less (Black & White Ultra)

Göttliche 3D-Echtzeit-Strategie & Chimären-Kreaturen-Simulation im Browser (Three.js + Vite + Tailwind CSS).

## 📂 Modulare Projektstruktur für VS Code

\`\`\`text
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
\`\`\`

## 🚀 Schnellstart in VS Code

1. **Abhängigkeiten installieren:**
   \`\`\`bash
   npm install
   \`\`\`
2. **Entwicklungsserver mit Live-Reload starten:**
   \`\`\`bash
   npm run dev
   \`\`\`
3. **Produktions-Build für GitHub Pages erstellen:**
   \`\`\`bash
   npm run build
   \`\`\`
`;

fs.writeFileSync(path.join(ROOT, 'README.md'), readmeMd, 'utf-8');
console.log('📘 README.md für dein GitHub-Repository erstellt!');
console.log('\n🎉 Fertig! Öffne den Ordner jetzt in VS Code und starte `npm install && npm run dev`.');