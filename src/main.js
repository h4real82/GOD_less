import './styles/main.css';
import './ui/cardTilt.js';

// Vollständige Spiel-Engine (aus den 10 Kernmodulen in src/ zusammengesetzt)
// ============================================================================
        // 1. GLOBAL STATE, 5 CREATURE SLOTS & WORLD SAVE/LOAD SYSTEM
        // ============================================================================
        const EPOCHS = [
            { id: 1, roman: 'I', name: 'Ursprung (Nomaden)', faithReq: 0, influenceRadius: 50 },
            { id: 2, roman: 'II', name: 'Archaische Polis', faithReq: 100, influenceRadius: 72 },
            { id: 3, roman: 'III', name: 'Klassische Metropole', faithReq: 260, influenceRadius: 96 },
            { id: 4, roman: 'IV', name: 'Göttliches Imperium', faithReq: 500, influenceRadius: 126 }
        ];

        const SEASONS = [
            { id: 'spring', name: 'Frühling', icon: '🌱', foliageColor: 0x387834, foodMult: 1.2 },
            { id: 'summer', name: 'Sommer', icon: '☀️', foliageColor: 0x2c6829, foodMult: 1.35 },
            { id: 'autumn', name: 'Herbst', icon: '🍂', foliageColor: 0xb85d1e, foodMult: 1.0 },
            { id: 'winter', name: 'Winter', icon: '❄️', foliageColor: 0xdbeafe, foodMult: 0.7 }
        ];

        const CREATURE_SPECIES_LIST = [
            { id: 'lion',      label: 'Löwe',      icon: '🦁', primary: '#c87d32', secondary: '#5c2c0c', defaultSurface: 'lion_fur' },
            { id: 'wolf',      label: 'Wolf',      icon: '🐺', primary: '#5b6572', secondary: '#232931', defaultSurface: 'wolf_fur' },
            { id: 'leopard',   label: 'Leopard',   icon: '🐆', primary: '#dca242', secondary: '#261a0d', defaultSurface: 'leopard_fur' },
            { id: 'bull',      label: 'Stier',     icon: '🐂', primary: '#5e3a22', secondary: '#26160c', defaultSurface: 'pied' },
            { id: 'gazelle',   label: 'Gazelle',   icon: '🦌', primary: '#c68b52', secondary: '#f3e5d0', defaultSurface: 'gazelle_fur' },
            { id: 'snake',     label: 'Schlange',  icon: '🐍', primary: '#3d6b37', secondary: '#1b3318', defaultSurface: 'snake_skin' },
            { id: 'eagle',     label: 'Adler',     icon: '🦅', primary: '#63442b', secondary: '#f5f5f4', defaultSurface: 'eagle_feathers' },
            { id: 'wasp',      label: 'Wespe',     icon: '🐝', primary: '#eab308', secondary: '#18181b', defaultSurface: 'tiger_fur' },
            { id: 'ape',       label: 'Affe',      icon: '🦍', primary: '#3b3d42', secondary: '#1f2024', defaultSurface: 'ape_fur' },
            { id: 'horse',     label: 'Pferd',     icon: '🐎', primary: '#8c532b', secondary: '#24150b', defaultSurface: 'pied' },
            { id: 'rhino',     label: 'Nashorn',   icon: '🦏', primary: '#6e737b', secondary: '#3f434a', defaultSurface: 'elephant_skin' },
            { id: 'elephant',  label: 'Elefant',   icon: '🐘', primary: '#787d85', secondary: '#494d54', defaultSurface: 'elephant_skin' },
            { id: 'crocodile', label: 'Krokodil',  icon: '🐊', primary: '#3b5932', secondary: '#1e3019', defaultSurface: 'crocodile_skin' },
            { id: 'bison',     label: 'Bison',     icon: '🦬', primary: '#4a2e1b', secondary: '#24150b', defaultSurface: 'bison_fur' }
        ];

        const SPECIES_META = {};
        CREATURE_SPECIES_LIST.forEach(s => { SPECIES_META[s.id] = s; });
        SPECIES_META.tiger = SPECIES_META.leopard;
        SPECIES_META.cow = SPECIES_META.bull;

        const CREATURE_SURFACES_LIST = [
            { id: 'pied',           label: 'Gescheckt',      c1: '#e7e5e4', c2: '#442816', pattern: 'pied',     rough: 0.72 },
            { id: 'leopard_fur',    label: 'Leopardenfell',  c1: '#eab354', c2: '#231709', pattern: 'rosettes', rough: 0.68 },
            { id: 'lion_fur',       label: 'Löwenfell',      c1: '#cf8438', c2: '#6e3711', pattern: 'fur',      rough: 0.70 },
            { id: 'tiger_fur',      label: 'Tigerfell',      c1: '#e07222', c2: '#181512', pattern: 'stripes',  rough: 0.68 },
            { id: 'bison_fur',      label: 'Bisonfell',      c1: '#4d2f1c', c2: '#21130a', pattern: 'shaggy',   rough: 0.88 },
            { id: 'gazelle_fur',    label: 'Gazellenfell',   c1: '#c98e54', c2: '#f5ebe0', pattern: 'gazelle',  rough: 0.60 },
            { id: 'ape_fur',        label: 'Affenfell',      c1: '#3c3f46', c2: '#1b1d21', pattern: 'fur',      rough: 0.80 },
            { id: 'elephant_skin',  label: 'Elefantenhaut',  c1: '#757a82', c2: '#454950', pattern: 'wrinkles', rough: 0.92 },
            { id: 'human_skin',     label: 'Menschenhaut',   c1: '#eab692', c2: '#c28863', pattern: 'skin',     rough: 0.52 },
            { id: 'snake_skin',     label: 'Schlangenhaut',  c1: '#44783c', c2: '#183015', pattern: 'scales',   rough: 0.35 },
            { id: 'crocodile_skin', label: 'Krokodilshaut',  c1: '#3a5931', c2: '#1b2c16', pattern: 'scutes',   rough: 0.45 },
            { id: 'eagle_feathers', label: 'Adlergefieder',  c1: '#5e4027', c2: '#f5f5f4', pattern: 'feathers', rough: 0.64 },
            { id: 'wolf_fur',       label: 'Wolfsfell',      c1: '#646e7a', c2: '#252b33', pattern: 'fur',      rough: 0.75 }
        ];

        const SURFACE_META = {};
        CREATURE_SURFACES_LIST.forEach(sf => { SURFACE_META[sf.id] = sf; });

        const DEFAULT_CREATURE_SLOTS = [
            {
                slot: 1, name: 'Aurion',
                headSpecies: 'lion', headSurface: 'lion_fur',
                upperSpecies: 'lion', upperSurface: 'lion_fur',
                lowerSpecies: 'lion', lowerSurface: 'lion_fur',
                eyeColor: '#f59e0b', scale: 1.15, muscle: 1.20, armor: 'gold',
                social: 85, aggr: 35, prod: 80, vit: 85, logoDataUrl: ''
            },
            {
                slot: 2, name: 'Gorgor',
                headSpecies: 'ape', headSurface: 'ape_fur',
                upperSpecies: 'bison', upperSurface: 'bison_fur',
                lowerSpecies: 'elephant', lowerSurface: 'elephant_skin',
                eyeColor: '#ef4444', scale: 1.25, muscle: 1.38, armor: 'obsidian',
                social: 55, aggr: 80, prod: 75, vit: 90, logoDataUrl: ''
            },
            {
                slot: 3, name: 'Fenris',
                headSpecies: 'wolf', headSurface: 'wolf_fur',
                upperSpecies: 'leopard', upperSurface: 'leopard_fur',
                lowerSpecies: 'horse', lowerSurface: 'pied',
                eyeColor: '#38bdf8', scale: 1.10, muscle: 1.12, armor: 'none',
                social: 70, aggr: 65, prod: 90, vit: 80, logoDataUrl: ''
            },
            {
                slot: 4, name: 'Garuda',
                headSpecies: 'eagle', headSurface: 'eagle_feathers',
                upperSpecies: 'wasp', upperSurface: 'tiger_fur',
                lowerSpecies: 'snake', lowerSurface: 'snake_skin',
                eyeColor: '#34d399', scale: 1.12, muscle: 1.05, armor: 'gold',
                social: 60, aggr: 70, prod: 85, vit: 75, logoDataUrl: ''
            },
            {
                slot: 5, name: 'Asterion',
                headSpecies: 'bull', headSurface: 'pied',
                upperSpecies: 'rhino', upperSurface: 'elephant_skin',
                lowerSpecies: 'crocodile', lowerSurface: 'crocodile_skin',
                eyeColor: '#fbbf24', scale: 1.22, muscle: 1.35, armor: 'gold',
                social: 75, aggr: 60, prod: 85, vit: 95, logoDataUrl: ''
            }
        ];

        function normalizeCreatureSlot(s, idx) {
            const def = DEFAULT_CREATURE_SLOTS[idx] || DEFAULT_CREATURE_SLOTS[0];
            const legacySpecies = (s && s.species === 'tiger') ? 'leopard' : ((s && s.species === 'cow') ? 'bull' : (s && s.species));
            const hSp = (s && s.headSpecies && SPECIES_META[s.headSpecies]) ? s.headSpecies : (legacySpecies && SPECIES_META[legacySpecies] ? legacySpecies : def.headSpecies);
            const uSp = (s && s.upperSpecies && SPECIES_META[s.upperSpecies]) ? s.upperSpecies : hSp;
            const lSp = (s && s.lowerSpecies && SPECIES_META[s.lowerSpecies]) ? s.lowerSpecies : hSp;
            return {
                slot: idx + 1,
                name: (s && s.name) ? s.name : def.name,
                headSpecies: hSp,
                headSurface: (s && s.headSurface && SURFACE_META[s.headSurface]) ? s.headSurface : SPECIES_META[hSp].defaultSurface,
                upperSpecies: uSp,
                upperSurface: (s && s.upperSurface && SURFACE_META[s.upperSurface]) ? s.upperSurface : SPECIES_META[uSp].defaultSurface,
                lowerSpecies: lSp,
                lowerSurface: (s && s.lowerSurface && SURFACE_META[s.lowerSurface]) ? s.lowerSurface : SPECIES_META[lSp].defaultSurface,
                eyeColor: (s && s.eyeColor) || def.eyeColor,
                scale: parseFloat(s && s.scale) || def.scale,
                muscle: parseFloat(s && s.muscle) || def.muscle,
                armor: (s && s.armor) || def.armor,
                social: typeof (s && s.social) === 'number' ? s.social : def.social,
                aggr: typeof (s && s.aggr) === 'number' ? s.aggr : def.aggr,
                prod: typeof (s && s.prod) === 'number' ? s.prod : def.prod,
                vit: typeof (s && s.vit) === 'number' ? s.vit : def.vit,
                logoDataUrl: (s && s.logoDataUrl) || ''
            };
        }

        const state = {
            inTitleScreen: true,
            mode: 'singleplayer',
            epochIndex: 0,
            faith: 15,
            alignment: 0,
            resources: { food: 160, wood: 160, ore: 90, mana: 280, pop: 7, maxPop: 16 },
            time: {
                day: 1,
                hour: 10.2,
                scale: 1,
                seasonIndex: 0
            },
            activeSlotIndex: 0,
            creatureSlots: DEFAULT_CREATURE_SLOTS.map((s, i) => normalizeCreatureSlot(s, i)),
            creature: {
                role: 'free',
                hp: 100,
                stamina: 100,
                resting: false,
                hunger: 10,
                mesh: null,
                joints: {},
                targetPos: new THREE.Vector3(14, 0, 12),
                stateText: 'Denkt nach & wacht über die Polis',
                walkPhase: 0,
                animMode: 'think',
                animTimer: 0
            },
            tribes: {
                vikings: { name: 'Wikinger', impress: 35, pos: new THREE.Vector3(0, 0, -95) },
                japanese: { name: 'Japaner', impress: 20, pos: new THREE.Vector3(95, 0, 5) },
                aztecs: { name: 'Azteken', impress: 5, pos: new THREE.Vector3(-10, 0, 98) }
            },
            buildMode: null,
            heldObject: null,
            hoveredEntity: null,
            lightningIntensity: 1.2,
            tutorial: { active: false, step: 0 }
        };

        try {
            const savedSlots = localStorage.getItem('godless_creature_slots_v3') || localStorage.getItem('godless_creature_slots_v2');
            if (savedSlots) {
                const parsed = JSON.parse(savedSlots);
                if (Array.isArray(parsed) && parsed.length === 5) {
                    state.creatureSlots = parsed.map((s, i) => normalizeCreatureSlot(s, i));
                }
            }
            const savedWorld = localStorage.getItem('godless_saved_world_v2');
            if (savedWorld) {
                const btn = document.getElementById('btn-continue-saved');
                if (btn) { btn.classList.remove('hidden'); btn.classList.add('inline-flex'); }
            }
        } catch (e) {}

        const SoundFX = {
            ctx: null,
            init() {
                if (!this.ctx) {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) this.ctx = new AudioCtx();
                }
            },
            playTone(freq = 440, duration = 0.22, type = 'sine', gainVal = 0.07) {
                try {
                    this.init();
                    if (!this.ctx) return;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = type;
                    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start();
                    osc.stop(this.ctx.currentTime + duration);
                } catch (e) {}
            },
            playThunder() {
                this.playTone(62, 0.52, 'sawtooth', 0.11);
                setTimeout(() => this.playTone(44, 0.68, 'triangle', 0.09), 80);
            },
            playChime() {
                this.playTone(523.25, 0.22, 'sine', 0.06);
                setTimeout(() => this.playTone(659.25, 0.28, 'sine', 0.06), 90);
                setTimeout(() => this.playTone(783.99, 0.4, 'sine', 0.07), 180);
            }
        };

        function showToast(msg) {
            const el = document.getElementById('divine-toast');
            if (!el) return;
            el.textContent = msg;
            el.style.opacity = '1';
            clearTimeout(el._timer);
            el._timer = setTimeout(() => { el.style.opacity = '0'; }, 3200);
        }

        // ============================================================================
        // 2. HIGH-RESOLUTION PROCEDURAL TEXTURE & SPRITE FORGE (AssetForge)
        // ============================================================================
        const AssetForge = {
            createRoofTileTexture() {
                const c = document.createElement('canvas');
                c.width = 512; c.height = 512;
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#9e3b1c';
                ctx.fillRect(0, 0, 512, 512);
                const rows = 12, cols = 16;
                const rw = 512 / cols, rh = 512 / rows;
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        const shade = (Math.random() - 0.5) * 26;
                        ctx.fillStyle = `rgb(${176 + shade}, ${68 + shade * 0.6}, ${32 + shade * 0.4})`;
                        ctx.fillRect(x * rw + 2, y * rh + 2, rw - 4, rh - 3);
                        const grad = ctx.createLinearGradient(x * rw, y * rh, (x + 1) * rw, y * rh);
                        grad.addColorStop(0, 'rgba(0,0,0,0.38)');
                        grad.addColorStop(0.5, 'rgba(255,210,160,0.28)');
                        grad.addColorStop(1, 'rgba(0,0,0,0.42)');
                        ctx.fillStyle = grad;
                        ctx.fillRect(x * rw, y * rh, rw, rh);
                    }
                    ctx.fillStyle = 'rgba(0,0,0,0.45)';
                    ctx.fillRect(0, y * rh, 512, 3);
                }
                const tex = new THREE.CanvasTexture(c);
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                tex.repeat.set(2, 2);
                return tex;
            },

            createVerdiDomeTexture() {
                const c = document.createElement('canvas');
                c.width = 512; c.height = 512;
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#3d5949';
                ctx.fillRect(0, 0, 512, 512);
                for (let x = 0; x < 512; x += 32) {
                    ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
                    ctx.fillRect(x, 0, 4, 512);
                    ctx.fillStyle = 'rgba(15, 25, 20, 0.45)';
                    ctx.fillRect(x + 4, 0, 3, 512);
                }
                for (let y = 0; y < 512; y += 48) {
                    ctx.strokeStyle = 'rgba(215, 180, 75, 0.4)';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(4, y + 4, 504, 40);
                }
                const tex = new THREE.CanvasTexture(c);
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                return tex;
            },

            createClassicalWallTexture() {
                const c = document.createElement('canvas');
                c.width = 512; c.height = 512;
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#dfd3bc';
                ctx.fillRect(0, 0, 512, 512);
                for (let y = 0; y < 512; y += 32) {
                    ctx.fillStyle = 'rgba(90, 75, 58, 0.16)';
                    ctx.fillRect(0, y, 512, 2);
                    const offset = (y / 32) % 2 === 0 ? 0 : 32;
                    for (let x = offset; x < 512; x += 64) {
                        ctx.fillRect(x, y, 2, 32);
                    }
                }
                const winCols = [80, 224, 368];
                const winRows = [110, 300];
                winRows.forEach(wy => {
                    winCols.forEach(wx => {
                        ctx.fillStyle = '#4a321c';
                        ctx.fillRect(wx - 6, wy - 6, 76, 96);
                        ctx.fillStyle = '#1e293b';
                        ctx.fillRect(wx, wy, 64, 84);
                        const g = ctx.createRadialGradient(wx + 32, wy + 42, 4, wx + 32, wy + 42, 38);
                        g.addColorStop(0, 'rgba(255, 200, 90, 0.55)');
                        g.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
                        ctx.fillStyle = g;
                        ctx.fillRect(wx, wy, 64, 84);
                        ctx.fillStyle = '#5c3d22';
                        ctx.fillRect(wx + 30, wy, 4, 84);
                        ctx.fillRect(wx, wy + 40, 64, 4);
                    });
                });
                const tex = new THREE.CanvasTexture(c);
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                return tex;
            },

            createCobbleRoadTexture() {
                const c = document.createElement('canvas');
                c.width = 256; c.height = 256;
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#6c655b';
                ctx.fillRect(0, 0, 256, 256);
                for (let i = 0; i < 320; i++) {
                    const rx = Math.random() * 256;
                    const ry = Math.random() * 256;
                    const r = 5 + Math.random() * 7;
                    const v = 105 + Math.floor(Math.random() * 45);
                    ctx.fillStyle = `rgb(${v}, ${v - 4}, ${v - 10})`;
                    ctx.beginPath();
                    ctx.arc(rx, ry, r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(30,25,20,0.45)';
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
                const tex = new THREE.CanvasTexture(c);
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                return tex;
            },

            createHandSkinTexture() {
                const c = document.createElement('canvas');
                c.width = 512; c.height = 512;
                const ctx = c.getContext('2d');
                const baseGrad = ctx.createLinearGradient(0, 0, 512, 512);
                baseGrad.addColorStop(0, '#f5caa6');
                baseGrad.addColorStop(0.5, '#eab38c');
                baseGrad.addColorStop(1, '#d6976e');
                ctx.fillStyle = baseGrad;
                ctx.fillRect(0, 0, 512, 512);

                for (let i = 0; i < 600; i++) {
                    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,235,215,0.06)' : 'rgba(165,95,65,0.05)';
                    ctx.beginPath();
                    ctx.arc(Math.random() * 512, Math.random() * 512, 2 + Math.random() * 6, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.strokeStyle = 'rgba(255, 230, 130, 0.72)';
                ctx.shadowColor = '#f5c542';
                ctx.shadowBlur = 10;
                ctx.lineWidth = 2.4;
                for (let b = 0; b < 7; b++) {
                    ctx.beginPath();
                    let vx = 140 + b * 38;
                    let vy = 490;
                    ctx.moveTo(vx, vy);
                    for (let s = 0; s < 10; s++) {
                        vx += (Math.random() - 0.5) * 28;
                        vy -= 42;
                        ctx.lineTo(vx, vy);
                    }
                    ctx.stroke();
                }
                return new THREE.CanvasTexture(c);
            },

            createSurfaceTexture(surfaceId) {
                const sf = SURFACE_META[surfaceId] || SURFACE_META.lion_fur;
                const c = document.createElement('canvas');
                c.width = 512; c.height = 512;
                const ctx = c.getContext('2d');
                ctx.fillStyle = sf.c1;
                ctx.fillRect(0, 0, 512, 512);

                if (sf.pattern === 'pied') {
                    ctx.fillStyle = sf.c2;
                    for (let i = 0; i < 18; i++) {
                        ctx.beginPath();
                        ctx.ellipse(Math.random() * 512, Math.random() * 512, 30 + Math.random() * 55, 22 + Math.random() * 45, Math.random() * Math.PI, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else if (sf.pattern === 'rosettes') {
                    for (let i = 0; i < 95; i++) {
                        const rx = Math.random() * 512, ry = Math.random() * 512, r = 9 + Math.random() * 11;
                        ctx.fillStyle = '#b4691e';
                        ctx.beginPath(); ctx.arc(rx, ry, r * 0.7, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = sf.c2;
                        ctx.lineWidth = 4.5;
                        ctx.beginPath(); ctx.arc(rx, ry, r, 0.2, Math.PI * 1.75); ctx.stroke();
                    }
                } else if (sf.pattern === 'stripes') {
                    ctx.fillStyle = sf.c2;
                    for (let y = 16; y < 512; y += 36) {
                        ctx.beginPath();
                        ctx.ellipse(256 + (Math.random() - 0.5) * 40, y, 230, 9, (Math.random() - 0.5) * 0.18, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else if (sf.pattern === 'scales') {
                    const sz = 24;
                    for (let y = 0; y < 512; y += sz) {
                        for (let x = 0; x < 512; x += sz) {
                            const ox = (y / sz) % 2 === 0 ? 0 : sz / 2;
                            ctx.strokeStyle = sf.c2;
                            ctx.lineWidth = 2.2;
                            ctx.beginPath();
                            ctx.arc(x + ox, y, sz * 0.55, 0, Math.PI);
                            ctx.stroke();
                        }
                    }
                } else if (sf.pattern === 'scutes') {
                    for (let y = 0; y < 512; y += 32) {
                        for (let x = 0; x < 512; x += 40) {
                            ctx.fillStyle = (x + y) % 64 === 0 ? sf.c2 : sf.c1;
                            ctx.fillRect(x + 3, y + 3, 34, 26);
                            ctx.strokeStyle = 'rgba(0,0,0,0.55)';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(x + 3, y + 3, 34, 26);
                        }
                    }
                } else if (sf.pattern === 'wrinkles') {
                    ctx.strokeStyle = sf.c2;
                    ctx.lineWidth = 1.8;
                    for (let i = 0; i < 220; i++) {
                        const sx = Math.random() * 512, sy = Math.random() * 512;
                        ctx.beginPath();
                        ctx.moveTo(sx, sy);
                        ctx.lineTo(sx + (Math.random() - 0.5) * 60, sy + (Math.random() - 0.5) * 60);
                        ctx.stroke();
                    }
                } else if (sf.pattern === 'feathers') {
                    for (let y = 0; y < 512; y += 22) {
                        for (let x = 0; x < 512; x += 26) {
                            const ox = (y / 22) % 2 === 0 ? 0 : 13;
                            ctx.fillStyle = y < 120 ? sf.c2 : sf.c1;
                            ctx.beginPath();
                            ctx.ellipse(x + ox, y, 12, 18, 0, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = 'rgba(0,0,0,0.35)';
                            ctx.lineWidth = 1.4;
                            ctx.stroke();
                        }
                    }
                } else if (sf.pattern === 'gazelle') {
                    ctx.fillStyle = sf.c2;
                    ctx.fillRect(160, 0, 190, 512);
                    ctx.fillStyle = '#3b2313';
                    ctx.fillRect(140, 0, 22, 512);
                    ctx.fillRect(350, 0, 22, 512);
                }

                if (sf.pattern !== 'scales' && sf.pattern !== 'scutes' && sf.pattern !== 'skin') {
                    const strokes = sf.pattern === 'shaggy' ? 5000 : 2800;
                    for (let i = 0; i < strokes; i++) {
                        const hx = Math.random() * 512;
                        const hy = Math.random() * 512;
                        ctx.strokeStyle = i % 3 === 0 ? sf.c2 : (i % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.22)');
                        ctx.lineWidth = sf.pattern === 'shaggy' ? 2.2 : 1.3;
                        ctx.beginPath();
                        ctx.moveTo(hx, hy);
                        ctx.lineTo(hx + (Math.random() - 0.5) * 5, hy + 8 + Math.random() * 8);
                        ctx.stroke();
                    }
                }

                const tex = new THREE.CanvasTexture(c);
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                return tex;
            },

            renderCreatureLogoThumbnail(slotCfg, targetCanvas) {
                const c = targetCanvas || document.createElement('canvas');
                c.width = 144; c.height = 144;
                const ctx = c.getContext('2d');

                const headSurf = SURFACE_META[slotCfg.headSurface] || SURFACE_META.lion_fur;
                const upperSurf = SURFACE_META[slotCfg.upperSurface] || SURFACE_META.lion_fur;
                const lowerSurf = SURFACE_META[slotCfg.lowerSurface] || SURFACE_META.lion_fur;
                const headSpec = SPECIES_META[slotCfg.headSpecies] || SPECIES_META.lion;
                const upperSpec = SPECIES_META[slotCfg.upperSpecies] || SPECIES_META.lion;
                const lowerSpec = SPECIES_META[slotCfg.lowerSpecies] || SPECIES_META.lion;

                const bg = ctx.createRadialGradient(72, 72, 12, 72, 72, 70);
                bg.addColorStop(0, '#1e293b');
                bg.addColorStop(0.7, '#0f172a');
                bg.addColorStop(1, '#020617');
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, 144, 144);

                ctx.strokeStyle = slotCfg.eyeColor || '#f59e0b';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(72, 72, 64, 0, Math.PI * 2);
                ctx.stroke();

                const mScale = Math.min(1.35, Math.max(0.85, parseFloat(slotCfg.muscle) || 1.1));

                // 3. Lower Body Silhouette
                ctx.fillStyle = lowerSurf.c1;
                ctx.strokeStyle = lowerSurf.c2;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.rect(46, 94, 18 * mScale, 36);
                ctx.rect(80, 94, 18 * mScale, 36);
                ctx.fill();
                ctx.stroke();

                // 2. Upper Body Silhouette
                ctx.fillStyle = upperSurf.c1;
                ctx.strokeStyle = upperSurf.c2;
                ctx.beginPath();
                ctx.ellipse(72, 78, 30 * mScale, 26, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                if (slotCfg.upperSpecies === 'eagle' || slotCfg.upperSpecies === 'wasp') {
                    ctx.fillStyle = slotCfg.upperSpecies === 'wasp' ? 'rgba(186,230,253,0.55)' : upperSurf.c2;
                    ctx.beginPath();
                    ctx.ellipse(26, 68, 18, 30, -0.45, 0, Math.PI * 2);
                    ctx.ellipse(118, 68, 18, 30, 0.45, 0, Math.PI * 2);
                    ctx.fill();
                }

                // 1. Head Silhouette
                ctx.fillStyle = headSurf.c1;
                ctx.strokeStyle = headSurf.c2;
                ctx.beginPath();
                ctx.arc(72, 42, 22, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                if (slotCfg.headSpecies === 'bull' || slotCfg.headSpecies === 'bison' || slotCfg.headSpecies === 'gazelle') {
                    ctx.strokeStyle = '#f5f5f4';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(46, 30, 14, Math.PI * 0.7, Math.PI * 1.4);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(98, 30, 14, -Math.PI * 0.4, Math.PI * 0.3);
                    ctx.stroke();
                } else if (slotCfg.headSpecies === 'elephant') {
                    ctx.fillStyle = headSurf.c1;
                    ctx.beginPath();
                    ctx.ellipse(38, 42, 14, 20, 0.2, 0, Math.PI * 2);
                    ctx.ellipse(106, 42, 14, 20, -0.2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.fillStyle = slotCfg.eyeColor || '#f59e0b';
                ctx.beginPath();
                ctx.arc(64, 39, 3.5, 0, Math.PI * 2);
                ctx.arc(80, 39, 3.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.font = '14px sans-serif';
                ctx.fillText(headSpec.icon, 10, 24);
                ctx.fillText(upperSpec.icon, 10, 74);
                ctx.fillText(lowerSpec.icon, 10, 124);

                return c.toDataURL('image/png');
            },

            createCloudMistSpriteTexture() {
                const c = document.createElement('canvas');
                c.width = 256; c.height = 256;
                const ctx = c.getContext('2d');
                const g = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
                g.addColorStop(0, 'rgba(235, 252, 255, 0.88)');
                g.addColorStop(0.38, 'rgba(135, 235, 250, 0.48)');
                g.addColorStop(0.72, 'rgba(56, 189, 248, 0.16)');
                g.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, 256, 256);
                return new THREE.CanvasTexture(c);
            },

            createFireSmokeTexture(isFire = true) {
                const c = document.createElement('canvas');
                c.width = 128; c.height = 128;
                const ctx = c.getContext('2d');
                const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
                if (isFire) {
                    g.addColorStop(0, 'rgba(255, 255, 200, 0.95)');
                    g.addColorStop(0.35, 'rgba(255, 145, 20, 0.8)');
                    g.addColorStop(0.7, 'rgba(220, 38, 38, 0.35)');
                    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
                } else {
                    g.addColorStop(0, 'rgba(45, 45, 50, 0.72)');
                    g.addColorStop(0.5, 'rgba(30, 30, 36, 0.42)');
                    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
                }
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, 128, 128);
                return new THREE.CanvasTexture(c);
            }
        };

        // ============================================================================
        // 3. TITLE SCREEN INTERACTIVE MOUSE LIGHTNING FX
        // ============================================================================
        const lCanvas = document.getElementById('lightning-fx-canvas');
        const lCtx = lCanvas.getContext('2d');
        const lBolts = [];
        const lSparks = [];

        function resizeAuxCanvases() {
            lCanvas.width = window.innerWidth;
            lCanvas.height = window.innerHeight;
            const gCanvas = document.getElementById('gesture-canvas');
            if (gCanvas) {
                gCanvas.width = window.innerWidth;
                gCanvas.height = window.innerHeight;
            }
        }
        window.addEventListener('resize', resizeAuxCanvases);
        resizeAuxCanvases();

        function spawnMouseLightning(x, y, burst = false) {
            if (!state.inTitleScreen || state.lightningIntensity <= 0) return;
            const count = burst ? 5 : 1;
            for (let b = 0; b < count; b++) {
                const pts = [{ x, y }];
                let cx = x, cy = y;
                const angleBase = Math.random() * Math.PI * 2;
                const steps = burst ? 12 : 7;
                for (let i = 0; i < steps; i++) {
                    const dist = (burst ? 18 : 12) + Math.random() * 18;
                    const a = angleBase + (Math.random() - 0.5) * 1.4;
                    cx += Math.cos(a) * dist;
                    cy += Math.sin(a) * dist;
                    pts.push({ x: cx, y: cy });
                }
                lBolts.push({
                    pts,
                    alpha: 0.95 * Math.min(1.5, state.lightningIntensity),
                    color: x < window.innerWidth * 0.5 ? '#fbbf24' : '#38bdf8'
                });
            }
            for (let s = 0; s < (burst ? 14 : 3); s++) {
                lSparks.push({
                    x, y,
                    vx: (Math.random() - 0.5) * (burst ? 7 : 3.5),
                    vy: (Math.random() - 0.5) * (burst ? 7 : 3.5) - 1.2,
                    alpha: 1,
                    color: Math.random() < 0.5 ? '#fde047' : '#7dd3fc'
                });
            }
        }

        window.addEventListener('mousemove', (e) => {
            if (state.inTitleScreen && Math.random() < 0.45) {
                spawnMouseLightning(e.clientX, e.clientY, false);
            }
        });
        window.addEventListener('mousedown', (e) => {
            if (state.inTitleScreen) {
                spawnMouseLightning(e.clientX, e.clientY, true);
                SoundFX.playTone(320, 0.12, 'sawtooth', 0.04);
            }
        });

        function renderLightningOverlay() {
            lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
            for (let i = lBolts.length - 1; i >= 0; i--) {
                const b = lBolts[i];
                lCtx.save();
                lCtx.strokeStyle = b.color;
                lCtx.shadowColor = b.color;
                lCtx.shadowBlur = 16;
                lCtx.globalAlpha = b.alpha;
                lCtx.lineWidth = 2.2;
                lCtx.beginPath();
                b.pts.forEach((p, idx) => {
                    if (idx === 0) lCtx.moveTo(p.x, p.y);
                    else lCtx.lineTo(p.x, p.y);
                });
                lCtx.stroke();
                lCtx.restore();
                b.alpha -= 0.06;
                if (b.alpha <= 0) lBolts.splice(i, 1);
            }
            for (let i = lSparks.length - 1; i >= 0; i--) {
                const s = lSparks[i];
                s.x += s.vx;
                s.y += s.vy;
                s.alpha -= 0.04;
                lCtx.fillStyle = s.color;
                lCtx.globalAlpha = Math.max(0, s.alpha);
                lCtx.beginPath();
                lCtx.arc(s.x, s.y, 2.1, 0, Math.PI * 2);
                ctxFill(lCtx);
                if (s.alpha <= 0) lSparks.splice(i, 1);
            }
            lCtx.globalAlpha = 1;
        }
        function ctxFill(c) { c.fill(); }

        // ============================================================================
        // 4. THREE.JS WORLD, TERRAIN, WATER, FLORA & RIVAL TRIBES
        // ============================================================================
        const container = document.getElementById('webgl-container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b1528);
        scene.fog = new THREE.FogExp2(0x0e1c36, 0.0022);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 900);
        const cameraTarget = new THREE.Vector3(0, 2.5, 8);
        const camSpherical = { radius: 68, theta: 0.35, phi: 0.92 };

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        container.appendChild(renderer.domElement);

        const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x3f2e21, 0.68);
        scene.add(hemiLight);

        const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.38);
        sunLight.position.set(85, 115, 65);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 10;
        sunLight.shadow.camera.far = 360;
        const dCam = 135;
        sunLight.shadow.camera.left = -dCam;
        sunLight.shadow.camera.right = dCam;
        sunLight.shadow.camera.top = dCam;
        sunLight.shadow.camera.bottom = -dCam;
        scene.add(sunLight);

        const sunOrb = new THREE.Mesh(
            new THREE.SphereGeometry(7, 20, 20),
            new THREE.MeshBasicMaterial({ color: 0xfde047 })
        );
        const moonOrb = new THREE.Mesh(
            new THREE.SphereGeometry(5, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xe2e8f0 })
        );
        scene.add(sunOrb, moonOrb);

        const sharedMats = {
            roofTile: new THREE.MeshStandardMaterial({ map: AssetForge.createRoofTileTexture(), roughness: 0.65 }),
            verdiDome: new THREE.MeshStandardMaterial({ map: AssetForge.createVerdiDomeTexture(), roughness: 0.45, metalness: 0.3 }),
            classicalWall: new THREE.MeshStandardMaterial({ map: AssetForge.createClassicalWallTexture(), roughness: 0.78 }),
            cobbleRoad: new THREE.MeshStandardMaterial({ map: AssetForge.createCobbleRoadTexture(), roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -1 }),
            marble: new THREE.MeshStandardMaterial({ color: 0xf1ece1, roughness: 0.45 }),
            goldTrim: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.28, metalness: 0.82 }),
            wood: new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.85 }),
            charredWood: new THREE.MeshStandardMaterial({ color: 0x1e1b18, roughness: 0.95 }),
            stone: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.88 }),
            fireSpriteMat: new THREE.SpriteMaterial({ map: AssetForge.createFireSmokeTexture(true), transparent: true, depthWrite: false }),
            smokeSpriteMat: new THREE.SpriteMaterial({ map: AssetForge.createFireSmokeTexture(false), transparent: true, depthWrite: false })
        };

        function getTerrainHeight(x, z) {
            const r = Math.hypot(x, z);
            if (r > 165) return -4.5;
            const centerFlat = Math.min(1, Math.max(0, (r - 28) / 40));
            const hills = (Math.sin(x * 0.045) * Math.cos(z * 0.045) * 4.2 + Math.sin(x * 0.09 + z * 0.07) * 1.8) * centerFlat;
            const northMountains = z < -55 ? Math.pow(Math.min(1, (-z - 55) / 70), 1.6) * 22 * (0.6 + 0.4 * Math.cos(x * 0.06)) : 0;
            const riverX = Math.sin(z * 0.035) * 18 - 32;
            const distRiver = Math.abs(x - riverX);
            const riverCut = distRiver < 6.5 ? -2.2 * Math.cos((distRiver / 6.5) * (Math.PI / 2)) : 0;
            const coastDrop = r > 125 ? -Math.pow((r - 125) / 40, 1.8) * 7.5 : 0;
            return Math.max(-4.2, 1.4 + hills + northMountains + riverCut + coastDrop);
        }

        const terrainGeo = new THREE.PlaneGeometry(340, 340, 150, 150);
        terrainGeo.rotateX(-Math.PI / 2);
        const posAttr = terrainGeo.attributes.position;
        const colorsArr = new Float32Array(posAttr.count * 3);

        for (let i = 0; i < posAttr.count; i++) {
            const vx = posAttr.getX(i);
            const vz = posAttr.getZ(i);
            const vy = getTerrainHeight(vx, vz);
            posAttr.setY(i, vy);

            const c = new THREE.Color();
            if (vy < 0.2) c.setHex(0xd6bf8e);
            else if (vy < 4.5) {
                const grassNoise = (Math.sin(vx * 0.14) * Math.cos(vz * 0.14)) * 0.04;
                c.setRGB(0.22 + grassNoise, 0.45 + grassNoise, 0.18);
            } else if (vy < 12) c.setHex(0x57534e);
            else c.setHex(0xf1f5f9);
            colorsArr[i * 3] = c.r;
            colorsArr[i * 3 + 1] = c.g;
            colorsArr[i * 3 + 2] = c.b;
        }
        terrainGeo.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));
        terrainGeo.computeVertexNormals();

        const terrainMesh = new THREE.Mesh(
            terrainGeo,
            new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0.04 })
        );
        terrainMesh.receiveShadow = true;
        scene.add(terrainMesh);

        const waterMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(900, 900),
            new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.18, metalness: 0.65, transparent: true, opacity: 0.82 })
        );
        waterMesh.rotation.x = -Math.PI / 2;
        waterMesh.position.y = -0.35;
        scene.add(waterMesh);

        let influenceRingMesh = null;
        function updateInfluenceRing() {
            if (influenceRingMesh) scene.remove(influenceRingMesh);
            const rad = EPOCHS[state.epochIndex].influenceRadius;
            const ringGeo = new THREE.RingGeometry(rad - 1.1, rad, 96);
            ringGeo.rotateX(-Math.PI / 2);
            const ringPos = ringGeo.attributes.position;
            for (let i = 0; i < ringPos.count; i++) {
                const rx = ringPos.getX(i);
                const rz = ringPos.getZ(i);
                ringPos.setY(i, Math.max(0.2, getTerrainHeight(rx, rz) + 0.35));
            }
            const ringColor = state.alignment > 20 ? 0x38bdf8 : (state.alignment < -20 ? 0xef4444 : 0x4ade80);
            influenceRingMesh = new THREE.Mesh(
                ringGeo,
                new THREE.MeshBasicMaterial({ color: ringColor, side: THREE.DoubleSide, transparent: true, opacity: 0.72 })
            );
            scene.add(influenceRingMesh);
        }
        updateInfluenceRing();

        const resourcesNodes = [];
        const treeFoliageMaterials = [];

        function spawnTree(x, z) {
            const y = getTerrainHeight(x, z);
            if (y < 0.8 || y > 11) return;
            const g = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.38, 2.4, 7), sharedMats.wood);
            trunk.position.y = 1.2;
            trunk.castShadow = true;
            g.add(trunk);

            const folMat = new THREE.MeshStandardMaterial({ color: SEASONS[0].foliageColor, roughness: 0.8 });
            treeFoliageMaterials.push(folMat);
            for (let l = 0; l < 3; l++) {
                const cone = new THREE.Mesh(new THREE.ConeGeometry(1.65 - l * 0.38, 2.2, 8), folMat);
                cone.position.y = 2.4 + l * 1.15;
                cone.castShadow = true;
                g.add(cone);
            }
            g.position.set(x, y, z);
            g.userData = { entityType: 'resource', resType: 'wood' };
            scene.add(g);
            resourcesNodes.push(g);
        }

        function spawnOreRock(x, z) {
            const y = getTerrainHeight(x, z);
            if (y < 0.8) return;
            const g = new THREE.Group();
            const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 1), sharedMats.stone);
            rock.scale.set(1.2, 0.85, 1.1);
            rock.position.y = 0.7;
            rock.castShadow = true;
            g.add(rock);

            const vein = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), sharedMats.goldTrim);
            vein.position.set(0.4, 1.0, 0.3);
            g.add(vein);

            g.position.set(x, y, z);
            g.userData = { entityType: 'resource', resType: 'ore' };
            scene.add(g);
            resourcesNodes.push(g);
        }

        for (let i = 0; i < 65; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = 26 + Math.random() * 88;
            spawnTree(Math.cos(a) * r, Math.sin(a) * r);
        }
        for (let i = 0; i < 22; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = 24 + Math.random() * 80;
            spawnOreRock(Math.cos(a) * r, Math.sin(a) * r);
        }

        // ============================================================================
        // 5. CLASSICAL TEMPLE ROTUNDA & MULTI-STAGE BUILDINGS (AoE4 / B&W2)
        // ============================================================================
        const templeGroup = new THREE.Group();
        scene.add(templeGroup);

        function rebuildTempleMesh() {
            while (templeGroup.children.length > 0) templeGroup.remove(templeGroup.children[0]);
            const tx = -14, tz = -4;
            const ty = getTerrainHeight(tx, tz);
            templeGroup.position.set(tx, ty, tz);

            for (let s = 0; s < 3; s++) {
                const step = new THREE.Mesh(new THREE.BoxGeometry(12 - s * 1.1, 0.6, 14 - s * 1.1), sharedMats.marble);
                step.position.y = 0.3 + s * 0.6;
                step.receiveShadow = true;
                templeGroup.add(step);
            }

            const cella = new THREE.Mesh(new THREE.BoxGeometry(7.2, 4.8, 8.6), sharedMats.classicalWall);
            cella.position.y = 4.2;
            cella.castShadow = true;
            templeGroup.add(cella);

            for (let cx = -4.2; cx <= 4.2; cx += 2.8) {
                for (let cz = -5.2; cz <= 5.2; cz += 2.6) {
                    if (Math.abs(cx) < 3.8 && Math.abs(cz) < 4.8) continue;
                    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 4.8, 12), sharedMats.marble);
                    col.position.set(cx, 4.2, cz);
                    col.castShadow = true;
                    templeGroup.add(col);
                }
            }

            const drum = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.0, 2.4, 20), sharedMats.marble);
            drum.position.y = 7.6;
            templeGroup.add(drum);

            const dome = new THREE.Mesh(new THREE.SphereGeometry(3.85, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), sharedMats.verdiDome);
            dome.position.y = 8.8;
            dome.castShadow = true;
            templeGroup.add(dome);

            const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.95, 0), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
            crystal.position.y = 13.8;
            crystal.name = 'manaCrystal';
            templeGroup.add(crystal);

            const beam = new THREE.Mesh(
                new THREE.CylinderGeometry(0.45, 1.35, 45, 16, 1, true),
                new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
            );
            beam.position.y = 32;
            templeGroup.add(beam);
        }
        rebuildTempleMesh();

        const plazaGroup = new THREE.Group();
        plazaGroup.position.set(2, getTerrainHeight(2, 2), 2);
        for (let r = 0; r < 3; r++) {
            const disc = new THREE.Mesh(new THREE.CylinderGeometry(6.5 - r * 1.6, 7.0 - r * 1.6, 0.35, 24), sharedMats.marble);
            disc.position.y = 0.18 + r * 0.35;
            disc.receiveShadow = true;
            plazaGroup.add(disc);
        }
        const brazier = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.5, 1.2, 12), sharedMats.goldTrim);
        brazier.position.y = 1.6;
        plazaGroup.add(brazier);
        scene.add(plazaGroup);

        const buildings = [];
        const particles = [];

        function spawnDestructionDebris(x, y, z, count = 16) {
            for (let i = 0; i < count; i++) {
                const chunk = new THREE.Mesh(
                    new THREE.BoxGeometry(0.35 + Math.random() * 0.35, 0.25 + Math.random() * 0.3, 0.35 + Math.random() * 0.35),
                    Math.random() < 0.5 ? sharedMats.roofTile : sharedMats.charredWood
                );
                chunk.position.set(x + (Math.random() - 0.5) * 3, y + 1.5 + Math.random() * 2, z + (Math.random() - 0.5) * 3);
                chunk.userData = {
                    vx: (Math.random() - 0.5) * 11,
                    vy: 5 + Math.random() * 7,
                    vz: (Math.random() - 0.5) * 11,
                    gravity: 19,
                    life: 2.2 + Math.random() * 1.2
                };
                scene.add(chunk);
                particles.push(chunk);
            }
        }

        function createCobbleRoadBetween(x1, z1, x2, z2) {
            const dx = x2 - x1, dz = z2 - z1;
            const len = Math.hypot(dx, dz);
            if (len < 2) return;
            const steps = Math.ceil(len / 2.5);
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const rx = x1 + dx * t;
                const rz = z1 + dz * t;
                const ry = getTerrainHeight(rx, rz) + 0.06;
                const tile = new THREE.Mesh(new THREE.CircleGeometry(1.45, 10), sharedMats.cobbleRoad);
                tile.rotation.x = -Math.PI / 2;
                tile.position.set(rx, ry, rz);
                tile.receiveShadow = true;
                scene.add(tile);
            }
        }

        function createDetailedBuilding(type, x, z, instantComplete = false) {
            const y = getTerrainHeight(x, z);
            const root = new THREE.Group();
            root.position.set(x, y, z);

            const found = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.55, 5.6), sharedMats.stone);
            found.position.y = 0.27;
            found.receiveShadow = true;
            root.add(found);

            const intactGroup = new THREE.Group();
            let windmillSails = null;

            if (type === 'house') {
                const body = new THREE.Mesh(new THREE.BoxGeometry(4.6, 3.2, 4.4), sharedMats.classicalWall);
                body.position.y = 2.1;
                body.castShadow = true;
                intactGroup.add(body);

                const roof = new THREE.Mesh(new THREE.ConeGeometry(3.7, 2.1, 4), sharedMats.roofTile);
                roof.rotation.y = Math.PI / 4;
                roof.position.y = 4.75;
                roof.castShadow = true;
                intactGroup.add(roof);
            } else if (type === 'mill') {
                const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.1, 4.8, 12), sharedMats.classicalWall);
                tower.position.y = 2.8;
                tower.castShadow = true;
                intactGroup.add(tower);

                const cap = new THREE.Mesh(new THREE.ConeGeometry(1.9, 1.5, 12), sharedMats.roofTile);
                cap.position.y = 5.9;
                intactGroup.add(cap);

                windmillSails = new THREE.Group();
                windmillSails.position.set(0, 4.3, 1.85);
                for (let b = 0; b < 4; b++) {
                    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.45, 4.8, 0.12), sharedMats.wood);
                    blade.rotation.z = (b * Math.PI) / 2;
                    windmillSails.add(blade);
                }
                intactGroup.add(windmillSails);
            } else if (type === 'shrine') {
                const base = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 3.0, 16), sharedMats.marble);
                base.position.y = 2.0;
                intactGroup.add(base);
                const dome = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), sharedMats.verdiDome);
                dome.position.y = 3.5;
                intactGroup.add(dome);
            } else {
                const mainBox = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.6, 4.8), sharedMats.classicalWall);
                mainBox.position.y = 2.3;
                mainBox.castShadow = true;
                intactGroup.add(mainBox);
                const roof = new THREE.Mesh(new THREE.ConeGeometry(4.0, 1.8, 4), sharedMats.roofTile);
                roof.rotation.y = Math.PI / 4;
                roof.position.y = 5.0;
                intactGroup.add(roof);
            }
            root.add(intactGroup);

            const raftersGroup = new THREE.Group();
            for (let r = -1.8; r <= 1.8; r += 1.2) {
                const beam = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.18, 0.18), sharedMats.wood);
                beam.position.set(0, 3.8, r);
                raftersGroup.add(beam);
            }
            root.add(raftersGroup);

            const scaffoldGroup = new THREE.Group();
            for (let sx of [-2.5, 2.5]) {
                for (let sz of [-2.5, 2.5]) {
                    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 4.6, 6), sharedMats.wood);
                    pole.position.set(sx, 2.5, sz);
                    scaffoldGroup.add(pole);
                }
            }
            const cranePivot = new THREE.Group();
            cranePivot.position.set(2.4, 0.5, 2.4);
            const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 5.4, 8), sharedMats.wood);
            mast.position.y = 2.7;
            const jib = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 0.18), sharedMats.wood);
            jib.position.set(-1.2, 5.2, 0);
            cranePivot.add(mast, jib);
            scaffoldGroup.add(cranePivot);
            root.add(scaffoldGroup);

            const fireSmokeGroup = new THREE.Group();
            const fireSprites = [];
            const smokeSprites = [];
            for (let f = 0; f < 3; f++) {
                const fs = new THREE.Sprite(sharedMats.fireSpriteMat);
                fs.position.set((f - 1) * 1.1, 2.8 + f * 0.4, (Math.random() - 0.5) * 1.2);
                fs.scale.set(2.2, 2.8, 1);
                fireSmokeGroup.add(fs);
                fireSprites.push(fs);

                const ss = new THREE.Sprite(sharedMats.smokeSpriteMat);
                ss.position.set((f - 1) * 0.9, 4.2 + f * 1.4, (Math.random() - 0.5) * 1.2);
                ss.scale.set(3.2, 3.2, 1);
                fireSmokeGroup.add(ss);
                smokeSprites.push(ss);
            }
            fireSmokeGroup.visible = false;
            root.add(fireSmokeGroup);

            const ruinsGroup = new THREE.Group();
            for (let c = 0; c < 6; c++) {
                const stump = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8 + Math.random() * 1.1, 0.7), sharedMats.charredWood);
                const angle = (c / 6) * Math.PI * 2;
                stump.position.set(Math.cos(angle) * 1.8, 0.8, Math.sin(angle) * 1.8);
                stump.rotation.z = (Math.random() - 0.5) * 0.4;
                ruinsGroup.add(stump);
            }
            ruinsGroup.visible = false;
            root.add(ruinsGroup);

            const bObj = {
                type, x, z,
                mesh: root,
                intactGroup,
                raftersGroup,
                scaffoldGroup,
                cranePivot,
                windmillSails,
                fireSmokeGroup,
                fireSprites,
                smokeSprites,
                ruinsGroup,
                buildProgress: instantComplete ? 100 : 12,
                hp: 100,
                state: instantComplete ? 'complete' : 'constructing'
            };

            root.userData = { entityType: 'building', buildingRef: bObj };
            scene.add(root);
            buildings.push(bObj);
            createCobbleRoadBetween(2, 2, x, z);
            updateBuildingVisualStage(bObj);
            return bObj;
        }

        function updateBuildingVisualStage(b) {
            if (b.state === 'constructing') {
                const ratio = Math.max(0.15, b.buildProgress / 100);
                b.intactGroup.visible = true;
                b.intactGroup.scale.y = ratio;
                b.raftersGroup.visible = b.buildProgress < 95;
                b.scaffoldGroup.visible = true;
                b.fireSmokeGroup.visible = false;
                b.ruinsGroup.visible = false;
            } else if (b.state === 'complete') {
                b.intactGroup.visible = true;
                b.intactGroup.scale.y = 1;
                b.raftersGroup.visible = false;
                b.scaffoldGroup.visible = false;
                b.fireSmokeGroup.visible = false;
                b.ruinsGroup.visible = false;
            } else if (b.state === 'damaged') {
                b.intactGroup.visible = true;
                b.intactGroup.scale.y = 0.86;
                b.raftersGroup.visible = true;
                b.scaffoldGroup.visible = false;
                b.fireSmokeGroup.visible = true;
                b.ruinsGroup.visible = false;
            } else if (b.state === 'ruins') {
                b.intactGroup.visible = false;
                b.raftersGroup.visible = false;
                b.scaffoldGroup.visible = false;
                b.fireSmokeGroup.visible = true;
                b.ruinsGroup.visible = true;
            }
        }

        createDetailedBuilding('house', 10, -7, true);
        createDetailedBuilding('mill', -4, 13, true);
        createDetailedBuilding('warehouse', 11, 8, true);

        // ============================================================================
        // 6. ARTICULATED 3D VILLAGERS & FLOATING CLOUD HAND OF GOD
        // ============================================================================
        const villagers = [];
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xeab692, roughness: 0.65 });

        function spawnVillager(x, z, role = 'farmer') {
            const y = getTerrainHeight(x, z);
            const g = new THREE.Group();
            g.position.set(x, y, z);

            const roleColors = {
                farmer: 0xd97706,
                woodcutter: 0x15803d,
                miner: 0x475569,
                builder: 0x0284c7,
                priest: 0xfef08a
            };
            const tunicMat = new THREE.MeshStandardMaterial({ color: roleColors[role] || 0xd97706, roughness: 0.78 });

            const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.30, 0.85, 8), tunicMat);
            torso.position.y = 0.92;
            torso.castShadow = true;
            g.add(torso);

            const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), skinMat);
            head.position.y = 1.54;
            head.castShadow = true;
            g.add(head);

            const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.62, 6), skinMat);
            leftArm.position.set(-0.32, 1.0, 0);
            const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.62, 6), skinMat);
            rightArm.position.set(0.32, 1.0, 0);
            g.add(leftArm, rightArm);

            const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.55, 6), skinMat);
            leftLeg.position.set(-0.12, 0.28, 0);
            const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.55, 6), skinMat);
            rightLeg.position.set(0.12, 0.28, 0);
            g.add(leftLeg, rightLeg);

            const vObj = {
                mesh: g,
                role,
                leftArm, rightArm, leftLeg, rightLeg,
                target: new THREE.Vector3(x + (Math.random() - 0.5) * 14, y, z + (Math.random() - 0.5) * 14),
                walkPhase: Math.random() * 6.28,
                timer: 0
            };
            g.userData = { entityType: 'villager', villagerRef: vObj };
            scene.add(g);
            villagers.push(vObj);
            return vObj;
        }

        const initialRoles = ['farmer', 'farmer', 'woodcutter', 'woodcutter', 'builder', 'miner', 'priest'];
        initialRoles.forEach((r, idx) => {
            const ang = (idx / initialRoles.length) * Math.PI * 2;
            spawnVillager(Math.cos(ang) * 8, Math.sin(ang) * 8, r);
        });

        // Floating Cloud-Cuffed Anatomical Hand of God (sample1.jpg & sample13.jpg)
        const handOfGod = {
            root: new THREE.Group(),
            fingers: [],
            cloudSprites: [],
            palmOrb: null,
            pose: 'open',
            worldPos: new THREE.Vector3(0, 6, 0)
        };

        function buildAnatomicalCloudHand() {
            const skinTex = AssetForge.createHandSkinTexture();
            const hMat = new THREE.MeshStandardMaterial({ map: skinTex, roughness: 0.48, metalness: 0.06 });
            const nailMat = new THREE.MeshStandardMaterial({ color: 0xfce7d6, roughness: 0.25 });

            const palmGroup = new THREE.Group();
            handOfGod.root.add(palmGroup);

            const palm = new THREE.Mesh(new THREE.SphereGeometry(1.15, 20, 16), hMat);
            palm.scale.set(1.08, 0.42, 1.28);
            palm.castShadow = true;
            palmGroup.add(palm);

            const thumbMount = new THREE.Group();
            thumbMount.position.set(-1.05, -0.05, 0.35);
            thumbMount.rotation.y = 0.65;
            palmGroup.add(thumbMount);

            const thumbSeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.78, 12), hMat);
            thumbSeg1.rotation.x = Math.PI / 2;
            thumbSeg1.position.z = 0.38;
            thumbMount.add(thumbSeg1);

            const fingerSpecs = [
                { x: -0.72, z: -1.18, len: 0.95, r: 0.20 },
                { x: -0.24, z: -1.28, len: 1.08, r: 0.21 },
                { x:  0.26, z: -1.22, len: 1.00, r: 0.20 },
                { x:  0.72, z: -1.06, len: 0.82, r: 0.17 }
            ];

            fingerSpecs.forEach((fs) => {
                const j1 = new THREE.Group();
                j1.position.set(fs.x, 0, fs.z);
                palmGroup.add(j1);

                const ph1 = new THREE.Mesh(new THREE.CylinderGeometry(fs.r * 0.88, fs.r, fs.len, 12), hMat);
                ph1.rotation.x = Math.PI / 2;
                ph1.position.z = -fs.len * 0.5;
                j1.add(ph1);

                const j2 = new THREE.Group();
                j2.position.z = -fs.len;
                j1.add(j2);

                const ph2 = new THREE.Mesh(new THREE.CylinderGeometry(fs.r * 0.72, fs.r * 0.86, fs.len * 0.82, 12), hMat);
                ph2.rotation.x = Math.PI / 2;
                ph2.position.z = -fs.len * 0.41;
                j2.add(ph2);

                const nail = new THREE.Mesh(new THREE.BoxGeometry(fs.r * 1.1, 0.05, 0.26), nailMat);
                nail.position.set(0, fs.r * 0.65, -fs.len * 0.72);
                j2.add(nail);

                handOfGod.fingers.push({ j1, j2 });
            });

            // Glowing Spell Orb in Palm
            handOfGod.palmOrb = new THREE.Mesh(
                new THREE.SphereGeometry(0.62, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.75 })
            );
            handOfGod.palmOrb.position.set(0, -0.58, -0.45);
            palmGroup.add(handOfGod.palmOrb);

            // Volumetric Floating Cloud Cuff around the Wrist (entfernt für edle goldene Aura)
            const mistTex = AssetForge.createCloudMistSpriteTexture();
            for (let c = 0; c < 6; c++) {
                const sp = new THREE.Sprite(
                    new THREE.SpriteMaterial({ map: mistTex, transparent: true, opacity: 0.15, depthWrite: false, color: 0xf59e0b })
                );
                const ang = (c / 6) * Math.PI * 2;
                sp.position.set(Math.cos(ang) * 0.85, 0.25, 1.35 + Math.sin(ang) * 0.45);
                sp.scale.set(1.5, 1.5, 1);
                palmGroup.add(sp);
                handOfGod.cloudSprites.push(sp);
            }

            handOfGod.root.position.set(0, 7, 6);
            scene.add(handOfGod.root);
        }
        buildAnatomicalCloudHand();

        // ============================================================================
        // 7. MODULAR 3D CHIMERA CREATURE TITAN (KOPF, OBERKÖRPER, UNTERKÖRPER)
        // ============================================================================
        function buildDetailedCreatureFromSlot(slotIndex) {
            const cfg = normalizeCreatureSlot(state.creatureSlots[slotIndex], slotIndex);
            state.creatureSlots[slotIndex] = cfg;

            if (state.creature.mesh) {
                scene.remove(state.creature.mesh);
            }

            const headMat = new THREE.MeshStandardMaterial({
                map: AssetForge.createSurfaceTexture(cfg.headSurface),
                roughness: (SURFACE_META[cfg.headSurface] || SURFACE_META.lion_fur).rough
            });
            const upperMat = new THREE.MeshStandardMaterial({
                map: AssetForge.createSurfaceTexture(cfg.upperSurface),
                roughness: (SURFACE_META[cfg.upperSurface] || SURFACE_META.lion_fur).rough
            });
            const lowerMat = new THREE.MeshStandardMaterial({
                map: AssetForge.createSurfaceTexture(cfg.lowerSurface),
                roughness: (SURFACE_META[cfg.lowerSurface] || SURFACE_META.lion_fur).rough
            });
            const eyeMat = new THREE.MeshBasicMaterial({ color: cfg.eyeColor || '#f59e0b' });
            const hornMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f4, roughness: 0.35 });
            const clawMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });

            const root = new THREE.Group();
            const scaleVal = parseFloat(cfg.scale) || 1.15;
            const muscleVal = parseFloat(cfg.muscle) || 1.20;
            root.scale.setScalar(scaleVal);

            // ----------------- 3. UNTERKÖRPER (Beine, Hufe/Krallen, Schweif/Abdomen) -----------------
            const pelvis = new THREE.Group();
            pelvis.position.y = 3.2;
            root.add(pelvis);

            const hipMesh = new THREE.Mesh(new THREE.SphereGeometry(1.15 * muscleVal, 16, 14), lowerMat);
            hipMesh.scale.set(1.1, 0.85, 0.95);
            hipMesh.castShadow = true;
            pelvis.add(hipMesh);

            function createDigitigradeLeg(side) {
                const hipJoint = new THREE.Group();
                hipJoint.position.set(side * 0.95 * muscleVal, -0.2, 0);
                pelvis.add(hipJoint);

                const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.55 * muscleVal, 0.42 * muscleVal, 1.8, 12), lowerMat);
                thigh.position.y = -0.85;
                thigh.castShadow = true;
                hipJoint.add(thigh);

                const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.40 * muscleVal, 0.32 * muscleVal, 1.65, 12), lowerMat);
                shin.position.set(0, -2.1, -0.15);
                shin.castShadow = true;
                hipJoint.add(shin);

                const foot = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.42, 1.25), lowerMat);
                foot.position.set(0, -2.85, 0.22);
                hipJoint.add(foot);

                const isHoofed = ['bull', 'gazelle', 'horse', 'bison', 'rhino'].includes(cfg.lowerSpecies);
                if (isHoofed) {
                    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.54, 0.42, 10), clawMat);
                    hoof.position.set(0, -2.88, 0.35);
                    hipJoint.add(hoof);
                } else {
                    for (let c = -1; c <= 1; c++) {
                        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.42, 6), clawMat);
                        claw.rotation.x = Math.PI / 2;
                        claw.position.set(c * 0.24, -2.92, 0.88);
                        hipJoint.add(claw);
                    }
                }
                return hipJoint;
            }

            const leftLeg = createDigitigradeLeg(-1);
            const rightLeg = createDigitigradeLeg(1);

            const tailGroup = new THREE.Group();
            tailGroup.position.set(0, 0.1, -0.95);
            pelvis.add(tailGroup);

            if (cfg.lowerSpecies === 'wasp') {
                const abdomen = new THREE.Mesh(new THREE.SphereGeometry(1.1, 14, 14), lowerMat);
                abdomen.scale.set(0.95, 0.9, 1.55);
                abdomen.position.set(0, -0.2, -1.4);
                tailGroup.add(abdomen);
                const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.95, 8), clawMat);
                stinger.rotation.x = -Math.PI / 2;
                stinger.position.set(0, -0.25, -2.95);
                tailGroup.add(stinger);
            } else {
                const tailLen = (cfg.lowerSpecies === 'crocodile' || cfg.lowerSpecies === 'snake') ? 3.2 : 2.1;
                const tailRadius = (cfg.lowerSpecies === 'crocodile' || cfg.lowerSpecies === 'snake') ? 0.42 : 0.18;
                const tailMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, tailRadius, tailLen, 10), lowerMat);
                tailMesh.rotation.x = -Math.PI / 3;
                tailMesh.position.set(0, -0.4, -tailLen * 0.42);
                tailGroup.add(tailMesh);
            }

            // ----------------- 2. OBERKÖRPER (Torso, Brustmuskeln, Schwingen, Arme) -----------------
            const chestGroup = new THREE.Group();
            chestGroup.position.y = 1.65;
            pelvis.add(chestGroup);

            const chestMesh = new THREE.Mesh(new THREE.SphereGeometry(1.45 * muscleVal, 20, 16), upperMat);
            chestMesh.scale.set(1.18, 1.25, 0.95);
            chestMesh.castShadow = true;
            chestGroup.add(chestMesh);

            if (cfg.upperSpecies === 'lion' || cfg.upperSpecies === 'bison') {
                const mane = new THREE.Mesh(new THREE.DodecahedronGeometry(1.62 * muscleVal, 1), upperMat);
                mane.position.set(0, 0.55, -0.15);
                chestGroup.add(mane);
            }

            let leftWing = null, rightWing = null;
            if (cfg.upperSpecies === 'eagle' || cfg.upperSpecies === 'wasp') {
                const wingMat = cfg.upperSpecies === 'wasp'
                    ? new THREE.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.58, side: THREE.DoubleSide })
                    : upperMat;
                leftWing = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.5, 0.12), wingMat);
                leftWing.position.set(-2.1, 0.6, -0.75);
                leftWing.rotation.z = 0.28;
                rightWing = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.5, 0.12), wingMat);
                rightWing.position.set(2.1, 0.6, -0.75);
                rightWing.rotation.z = -0.28;
                chestGroup.add(leftWing, rightWing);
            }

            if (cfg.armor === 'gold' || cfg.armor === 'obsidian') {
                const armMat = cfg.armor === 'gold' ? sharedMats.goldTrim : sharedMats.charredWood;
                const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.48 * muscleVal, 1.28 * muscleVal, 1.35, 12), armMat);
                plate.position.y = 0.1;
                chestGroup.add(plate);
            }

            function createMuscularArm(side) {
                const shoulder = new THREE.Group();
                shoulder.position.set(side * 1.65 * muscleVal, 0.72, 0);
                chestGroup.add(shoulder);

                const deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.55 * muscleVal, 12, 12), upperMat);
                shoulder.add(deltoid);

                const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.44 * muscleVal, 0.36 * muscleVal, 1.55, 10), upperMat);
                upperArm.position.y = -0.75;
                upperArm.castShadow = true;
                shoulder.add(upperArm);

                const elbow = new THREE.Group();
                elbow.position.y = -1.5;
                shoulder.add(elbow);

                const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.38 * muscleVal, 0.30 * muscleVal, 1.45, 10), upperMat);
                forearm.position.y = -0.7;
                forearm.castShadow = true;
                elbow.add(forearm);

                const handPaw = new THREE.Mesh(new THREE.SphereGeometry(0.42 * muscleVal, 10, 10), upperMat);
                handPaw.position.y = -1.45;
                elbow.add(handPaw);

                return { shoulder, elbow };
            }

            const leftArm = createMuscularArm(-1);
            const rightArm = createMuscularArm(1);

            // ----------------- 1. KOPF (14 Wesen-Variationen) -----------------
            const headGroup = new THREE.Group();
            headGroup.position.set(0, 1.75, 0.35);
            chestGroup.add(headGroup);

            const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.96, 18, 16), headMat);
            cranium.castShadow = true;
            headGroup.add(cranium);

            const snoutLen = ['crocodile', 'horse', 'wolf'].includes(cfg.headSpecies) ? 1.15 : 0.72;
            const snout = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.58, snoutLen), headMat);
            snout.position.set(0, -0.15, 0.72);
            headGroup.add(snout);

            const jawPivot = new THREE.Group();
            jawPivot.position.set(0, -0.42, 0.35);
            const jawBox = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.26, snoutLen * 0.92), headMat);
            jawBox.position.z = snoutLen * 0.4;
            jawPivot.add(jawBox);
            headGroup.add(jawPivot);

            const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), eyeMat);
            eyeL.position.set(-0.36, 0.18, 0.82);
            const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), eyeMat);
            eyeR.position.set(0.36, 0.18, 0.82);
            headGroup.add(eyeL, eyeR);

            // Species-specific Head Features
            if (['bull', 'bison', 'gazelle'].includes(cfg.headSpecies)) {
                const hLen = cfg.headSpecies === 'gazelle' ? 1.45 : 1.05;
                for (let s of [-1, 1]) {
                    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.16, hLen, 10), hornMat);
                    horn.position.set(s * 0.75, 0.65, 0);
                    horn.rotation.z = -s * 0.55;
                    headGroup.add(horn);
                }
            } else if (cfg.headSpecies === 'rhino') {
                const horn1 = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.05, 10), hornMat);
                horn1.position.set(0, 0.35, 1.12);
                horn1.rotation.x = 0.35;
                headGroup.add(horn1);
            } else if (cfg.headSpecies === 'elephant') {
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.14, 1.85, 10), headMat);
                trunk.position.set(0, -0.75, 1.15);
                trunk.rotation.x = 0.35;
                headGroup.add(trunk);
                for (let s of [-1, 1]) {
                    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 12), headMat);
                    ear.scale.set(0.18, 1.15, 0.95);
                    ear.position.set(s * 1.05, 0.05, -0.1);
                    headGroup.add(ear);
                    const tusk = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.1, 8), hornMat);
                    tusk.position.set(s * 0.38, -0.45, 1.15);
                    tusk.rotation.x = Math.PI / 2.6;
                    headGroup.add(tusk);
                }
            } else if (cfg.headSpecies === 'eagle') {
                const beak = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.95, 8), sharedMats.goldTrim);
                beak.rotation.x = Math.PI / 2;
                beak.position.set(0, -0.1, 1.25);
                headGroup.add(beak);
            } else if (cfg.headSpecies === 'wasp') {
                for (let s of [-1, 1]) {
                    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 1.1, 6), clawMat);
                    ant.position.set(s * 0.32, 0.85, 0.55);
                    ant.rotation.z = -s * 0.35;
                    headGroup.add(ant);
                }
            }

            const startX = state.creature.mesh ? state.creature.mesh.position.x : 12;
            const startZ = state.creature.mesh ? state.creature.mesh.position.z : 10;
            root.position.set(startX, getTerrainHeight(startX, startZ), startZ);
            root.userData = { entityType: 'creature' };
            scene.add(root);

            state.creature.mesh = root;
            state.creature.joints = {
                pelvis, chestGroup, headGroup, jawPivot,
                leftLeg, rightLeg, leftArm, rightArm,
                tailGroup, leftWing, rightWing
            };

            if (!cfg.logoDataUrl) {
                cfg.logoDataUrl = AssetForge.renderCreatureLogoThumbnail(cfg);
            }
            refreshAllSlotUI();
        }

        // ============================================================================
        // 8. CREATURE DESIGNER UI, MIRACLE GESTURE RECOGNITION & INPUT CONTROLS
        // ============================================================================
        let editingSlotIndex = 0;

        function populateDesignerSelects() {
            const spIds = ['cd-head-species', 'cd-upper-species', 'cd-lower-species'];
            spIds.forEach(id => {
                const sel = document.getElementById(id);
                if (!sel) return;
                sel.innerHTML = CREATURE_SPECIES_LIST.map(s => `<option value="${s.id}">${s.icon} ${s.label}</option>`).join('');
            });

            const sfIds = ['cd-head-surface', 'cd-upper-surface', 'cd-lower-surface'];
            sfIds.forEach(id => {
                const sel = document.getElementById(id);
                if (!sel) return;
                sel.innerHTML = CREATURE_SURFACES_LIST.map(sf => `<option value="${sf.id}">${sf.label}</option>`).join('');
            });
        }
        populateDesignerSelects();

        function getFormDraftSlot() {
            return {
                slot: editingSlotIndex + 1,
                name: (document.getElementById('cd-name')?.value || 'Titan').trim(),
                headSpecies: document.getElementById('cd-head-species')?.value || 'lion',
                headSurface: document.getElementById('cd-head-surface')?.value || 'lion_fur',
                upperSpecies: document.getElementById('cd-upper-species')?.value || 'lion',
                upperSurface: document.getElementById('cd-upper-surface')?.value || 'lion_fur',
                lowerSpecies: document.getElementById('cd-lower-species')?.value || 'lion',
                lowerSurface: document.getElementById('cd-lower-surface')?.value || 'lion_fur',
                scale: parseFloat(document.getElementById('cd-scale')?.value) || 1.15,
                muscle: parseFloat(document.getElementById('cd-muscle')?.value) || 1.20,
                eyeColor: document.getElementById('cd-eye')?.value || '#f59e0b',
                armor: document.getElementById('cd-armor')?.value || 'none',
                social: parseInt(document.getElementById('cd-social')?.value || '75', 10),
                aggr: parseInt(document.getElementById('cd-aggr')?.value || '35', 10),
                prod: parseInt(document.getElementById('cd-prod')?.value || '80', 10),
                vit: parseInt(document.getElementById('cd-vit')?.value || '85', 10)
            };
        }

        window.updateDesignerLogoPreview = function() {
            const canvas = document.getElementById('cd-logo-canvas');
            if (!canvas) return;
            const draft = getFormDraftSlot();
            AssetForge.renderCreatureLogoThumbnail(draft, canvas);
        };

        function loadSlotIntoDesignerForm(idx) {
            editingSlotIndex = idx;
            const cfg = normalizeCreatureSlot(state.creatureSlots[idx], idx);
            document.getElementById('cd-name').value = cfg.name;
            document.getElementById('cd-head-species').value = cfg.headSpecies;
            document.getElementById('cd-head-surface').value = cfg.headSurface;
            document.getElementById('cd-upper-species').value = cfg.upperSpecies;
            document.getElementById('cd-upper-surface').value = cfg.upperSurface;
            document.getElementById('cd-lower-species').value = cfg.lowerSpecies;
            document.getElementById('cd-lower-surface').value = cfg.lowerSurface;
            document.getElementById('cd-scale').value = cfg.scale;
            document.getElementById('cd-scale-val').textContent = cfg.scale + 'x';
            document.getElementById('cd-muscle').value = cfg.muscle;
            document.getElementById('cd-muscle-val').textContent = cfg.muscle + 'x';
            document.getElementById('cd-eye').value = cfg.eyeColor;
            document.getElementById('cd-armor').value = cfg.armor;

            document.getElementById('cd-social').value = cfg.social;
            document.getElementById('cd-social-val').textContent = cfg.social + '%';
            document.getElementById('cd-aggr').value = cfg.aggr;
            document.getElementById('cd-aggr-val').textContent = cfg.aggr + '%';
            document.getElementById('cd-prod').value = cfg.prod;
            document.getElementById('cd-prod-val').textContent = cfg.prod + '%';
            document.getElementById('cd-vit').value = cfg.vit;
            document.getElementById('cd-vit-val').textContent = cfg.vit + '%';

            window.updateDesignerLogoPreview();
            renderDesignerSlotTabs();
        }

        function renderDesignerSlotTabs() {
            const containerEl = document.getElementById('designer-slot-tabs');
            if (!containerEl) return;
            containerEl.innerHTML = state.creatureSlots.map((s, i) => {
                const hIcon = (SPECIES_META[s.headSpecies] || SPECIES_META.lion).icon;
                const active = i === editingSlotIndex;
                return `<button onclick="window.selectDesignerTab(${i})" class="p-2 rounded-xl border text-left transition flex items-center gap-2 ${active ? 'bg-amber-500/25 border-amber-400 text-amber-100' : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'}">
                    <span class="text-base">${hIcon}</span>
                    <div class="truncate">
                        <div class="text-[10px] text-slate-400">Slot ${i + 1}</div>
                        <div class="font-bold text-xs truncate">${s.name}</div>
                    </div>
                </button>`;
            }).join('');
        }

        window.selectDesignerTab = function(idx) {
            loadSlotIntoDesignerForm(idx);
        };

        function refreshAllSlotUI() {
            const titleBar = document.getElementById('title-slot-buttons');
            if (titleBar) {
                titleBar.innerHTML = state.creatureSlots.map((s, i) => {
                    const icon = (SPECIES_META[s.headSpecies] || SPECIES_META.lion).icon;
                    const active = i === state.activeSlotIndex;
                    return `<button onclick="window.activateCreatureSlot(${i})" class="px-2.5 py-1 rounded-xl text-xs font-bold border transition ${active ? 'bg-amber-500 text-slate-950 border-amber-300 shadow' : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800'}">
                        ${icon} ${s.name}
                    </button>`;
                }).join('');
            }

            const hudSwitcher = document.getElementById('hud-slot-switcher');
            if (hudSwitcher) {
                hudSwitcher.innerHTML = state.creatureSlots.map((s, i) => {
                    const icon = (SPECIES_META[s.headSpecies] || SPECIES_META.lion).icon;
                    const active = i === state.activeSlotIndex;
                    return `<button onclick="window.activateCreatureSlot(${i})" class="py-1 rounded text-[10px] font-bold border ${active ? 'bg-amber-500 text-slate-950 border-amber-300' : 'bg-slate-900 text-slate-300 border-slate-800'}" title="${s.name}">
                        S${i + 1}${icon}
                    </button>`;
                }).join('');
            }

            const activeSlot = state.creatureSlots[state.activeSlotIndex];
            if (activeSlot) {
                const nameEl = document.getElementById('hud-creature-name');
                if (nameEl) nameEl.textContent = activeSlot.name;
                const logoEl = document.getElementById('hud-creature-logo');
                if (logoEl) {
                    if (!activeSlot.logoDataUrl) activeSlot.logoDataUrl = AssetForge.renderCreatureLogoThumbnail(activeSlot);
                    logoEl.src = activeSlot.logoDataUrl;
                }
                const subEl = document.getElementById('hud-creature-sub');
                if (subEl) {
                    const i1 = (SPECIES_META[activeSlot.headSpecies] || SPECIES_META.lion).icon;
                    const i2 = (SPECIES_META[activeSlot.upperSpecies] || SPECIES_META.lion).icon;
                    const i3 = (SPECIES_META[activeSlot.lowerSpecies] || SPECIES_META.lion).icon;
                    subEl.textContent = `${i1}${i2}${i3} • ⚡${Math.round(state.creature.stamina)}%`;
                }
            }
        }

        window.activateCreatureSlot = function(idx) {
            state.activeSlotIndex = idx;
            buildDetailedCreatureFromSlot(idx);
            SoundFX.playChime();
            showToast(`Chimären-Slot ${idx + 1} („${state.creatureSlots[idx].name}“) beschworen!`);
        };

        window.openCreatureDesigner = function() {
            loadSlotIntoDesignerForm(state.activeSlotIndex);
            const m = document.getElementById('creature-designer-modal');
            m.classList.remove('hidden');
            m.classList.add('flex');
        };

        window.closeCreatureDesigner = function() {
            const m = document.getElementById('creature-designer-modal');
            m.classList.add('hidden');
            m.classList.remove('flex');
        };

        window.saveCurrentCreatureSlot = function() {
            const draft = getFormDraftSlot();
            draft.logoDataUrl = AssetForge.renderCreatureLogoThumbnail(draft, document.getElementById('cd-logo-canvas'));
            state.creatureSlots[editingSlotIndex] = draft;
            state.activeSlotIndex = editingSlotIndex;
            try {
                localStorage.setItem('godless_creature_slots_v3', JSON.stringify(state.creatureSlots));
            } catch (e) {}
            buildDetailedCreatureFromSlot(editingSlotIndex);
            window.closeCreatureDesigner();
            SoundFX.playChime();
            showToast(`Chimäre „${draft.name}“ (Slot ${editingSlotIndex + 1}) gespeichert!`);
        };

        window.resetCreatureSlotsDefault = function() {
            state.creatureSlots = DEFAULT_CREATURE_SLOTS.map((s, i) => normalizeCreatureSlot(s, i));
            try { localStorage.removeItem('godless_creature_slots_v3'); } catch (e) {}
            loadSlotIntoDesignerForm(0);
            buildDetailedCreatureFromSlot(0);
            showToast('Alle 5 Kreaturen-Slots auf Standard zurückgesetzt.');
        };

        buildDetailedCreatureFromSlot(0);

        // Mode & Modal Functions
        window.startGameMode = function(mode) {
            state.mode = mode;
            state.inTitleScreen = false;
            document.getElementById('title-screen').classList.add('hidden');
            const hud = document.getElementById('game-hud');
            hud.classList.remove('hidden');
            hud.classList.add('flex');

            if (mode === 'tutorial') {
                state.tutorial.active = true;
                state.tutorial.step = 0;
                document.getElementById('tutorial-banner').classList.remove('hidden');
                updateTutorialText();
            } else {
                state.tutorial.active = false;
                document.getElementById('tutorial-banner').classList.add('hidden');
            }
            SoundFX.playChime();
            showToast(`Willkommen in GOD:less — Deine göttliche Herrschaft beginnt!`);
        };

        window.returnToTitleScreen = function() {
            state.inTitleScreen = true;
            document.getElementById('title-screen').classList.remove('hidden');
            const hud = document.getElementById('game-hud');
            hud.classList.add('hidden');
            hud.classList.remove('flex');
        };

        window.saveWorldState = function() {
            try {
                const payload = {
                    epochIndex: state.epochIndex,
                    faith: state.faith,
                    alignment: state.alignment,
                    resources: state.resources,
                    time: state.time,
                    activeSlotIndex: state.activeSlotIndex
                };
                localStorage.setItem('godless_saved_world_v2', JSON.stringify(payload));
                const btn = document.getElementById('btn-continue-saved');
                if (btn) { btn.classList.remove('hidden'); btn.classList.add('inline-flex'); }
                SoundFX.playChime();
                showToast('💾 Weltzustand erfolgreich gespeichert!');
            } catch (e) {}
        };

        window.loadSavedWorld = function() {
            try {
                const raw = localStorage.getItem('godless_saved_world_v2');
                if (!raw) return;
                const data = JSON.parse(raw);
                state.epochIndex = data.epochIndex || 0;
                state.faith = data.faith || 15;
                state.alignment = data.alignment || 0;
                if (data.resources) Object.assign(state.resources, data.resources);
                if (data.time) Object.assign(state.time, data.time);
                state.activeSlotIndex = data.activeSlotIndex || 0;
                buildDetailedCreatureFromSlot(state.activeSlotIndex);
                updateInfluenceRing();
                window.startGameMode('singleplayer');
                showToast('📂 Gespeicherter Weltzustand geladen!');
            } catch (e) {}
        };

        window.openDiscordModal = function() {
            const m = document.getElementById('discord-modal');
            m.classList.remove('hidden'); m.classList.add('flex');
        };
        window.closeDiscordModal = function() {
            const m = document.getElementById('discord-modal');
            m.classList.add('hidden'); m.classList.remove('flex');
        };
        window.copyRoomCode = function() {
            const code = document.getElementById('discord-room-code').textContent;
            const temp = document.createElement('textarea');
            temp.value = code;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            document.getElementById('discord-status-msg').textContent = `✅ Raumcode ${code} in die Zwischenablage kopiert!`;
        };
        window.sendDiscordWebhookPing = function() {
            const url = document.getElementById('discord-webhook-input').value.trim();
            const statusEl = document.getElementById('discord-status-msg');
            if (!url) {
                statusEl.textContent = '🔔 Lokaler Koop-Kanal bereit (für echte Discord-Pings Webhook-URL eintragen).';
                return;
            }
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: `⚡ **GOD:less Pantheon-Lobby aktiv!** Titan: **${state.creatureSlots[state.activeSlotIndex].name}**` })
            }).then(() => {
                statusEl.textContent = '✅ Discord-Ping erfolgreich gesendet!';
            }).catch(() => {
                statusEl.textContent = '⚠️ Webhook konnte nicht erreicht werden.';
            });
        };

        window.openSettingsModal = function() {
            const m = document.getElementById('settings-modal');
            m.classList.remove('hidden'); m.classList.add('flex');
        };
        window.closeSettingsModal = function() {
            const m = document.getElementById('settings-modal');
            m.classList.add('hidden'); m.classList.remove('flex');
        };
        window.setLightningIntensity = function(val) {
            state.lightningIntensity = parseFloat(val);
        };
        window.setRenderQuality = function(val) {
            renderer.setPixelRatio(Math.min(parseFloat(val) || 1.5, 2));
        };

        const TUTORIAL_STEPS = [
            '1/5: Bewege die Kamera mit WASD oder den Pfeiltasten und drehe sie mit Q und E.',
            '2/5: Schwebe mit deiner göttlichen Wolkenhand über einen Siedler oder Baum und klicke links, um ihn aufzuheben oder Arbeit zuzuweisen.',
            '3/5: Wähle unten in der Bauleiste ein Gebäude (z. B. Klassische Villa) und platziere es per Linksklick im grünen Einflussring.',
            '4/5: Halte die RECHTE Maustaste gedrückt und zeichne eine Rune (z. B. Kreis für Feuerball oder Zick-Zack für Blitzschlag).',
            '5/5: Öffne links den Kreatur-Designer, um Kopf, Oberkörper & Unterkörper deiner Chimäre frei zu kombinieren!'
        ];
        function updateTutorialText() {
            const el = document.getElementById('tutorial-text');
            if (el) el.textContent = TUTORIAL_STEPS[state.tutorial.step] || TUTORIAL_STEPS[0];
        }
        window.nextTutorialStep = function() {
            state.tutorial.step = (state.tutorial.step + 1) % TUTORIAL_STEPS.length;
            updateTutorialText();
        };

        window.setTimeScale = function(sc) {
            state.time.scale = sc;
            [0, 1, 2, 4].forEach(v => {
                const btn = document.getElementById('speed-' + v);
                if (btn) {
                    btn.className = v === sc
                        ? 'px-2 py-1 rounded text-[10px] font-bold bg-amber-500 text-slate-950'
                        : 'px-2 py-1 rounded text-[10px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700';
                }
            });
        };

        window.selectBuildMode = function(type) {
            state.buildMode = state.buildMode === type ? null : type;
            ['house', 'mill', 'warehouse', 'barracks', 'shrine'].forEach(t => {
                const btn = document.getElementById('build-' + t);
                if (btn) {
                    btn.style.borderColor = state.buildMode === t ? '#fbbf24' : 'rgba(51,65,85,1)';
                }
            });
            if (state.buildMode) {
                showToast(`Baumodus aktiv: Klicke in deinen Einflussbereich, um „${type}“ zu errichten.`);
            }
        };

        window.setCreatureRole = function(role) {
            state.creature.role = role;
            ['free', 'gather', 'builder', 'entertain', 'soldier'].forEach(r => {
                const btn = document.getElementById('crole-' + r);
                if (btn) {
                    btn.className = r === role
                        ? 'px-1.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px]'
                        : 'px-1.5 py-1 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]';
                }
            });
            showToast(`Kreaturen-Rolle geändert: ${role.toUpperCase()}`);
        };

        window.praiseCreature = function() {
            state.alignment = Math.min(100, state.alignment + 6);
            state.faith += 5;
            const slot = state.creatureSlots[state.activeSlotIndex];
            slot.social = Math.min(100, slot.social + 3);
            updateInfluenceRing();
            SoundFX.playChime();
            showToast(`🙌 Du streichelst ${slot.name} (+Glaube, +Sozialverhalten, +Gute Gesinnung)`);
        };

        window.punishCreature = function() {
            state.alignment = Math.max(-100, state.alignment - 8);
            const slot = state.creatureSlots[state.activeSlotIndex];
            slot.aggr = Math.min(100, slot.aggr + 4);
            updateInfluenceRing();
            SoundFX.playThunder();
            showToast(`⚡ Du tadelst ${slot.name} (+Aggressivität, +Dunkle Gesinnung)`);
        };

        // Raycasting, Hand of God Interaction & Right-Click Rune Gesture Canvas
        const raycaster = new THREE.Raycaster();
        const mouseNDC = new THREE.Vector2();
        const gCanvas = document.getElementById('gesture-canvas');
        const gCtx = gCanvas.getContext('2d');
        let isDrawingRune = false;
        let runePoints = [];

        function updateHandWorldPosition(clientX, clientY) {
            mouseNDC.x = (clientX / window.innerWidth) * 2 - 1;
            mouseNDC.y = -(clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseNDC, camera);

            const hits = raycaster.intersectObject(terrainMesh);
            if (hits.length > 0) {
                const p = hits[0].point;
                handOfGod.worldPos.copy(p);
                handOfGod.root.position.lerp(new THREE.Vector3(p.x, p.y + 4.4, p.z + 1.5), 0.35);
            }
        }

        window.addEventListener('mousemove', (e) => {
            if (state.inTitleScreen) return;
            updateHandWorldPosition(e.clientX, e.clientY);

            if (isDrawingRune) {
                runePoints.push({ x: e.clientX, y: e.clientY });
                gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
                gCtx.save();
                gCtx.strokeStyle = '#38bdf8';
                gCtx.shadowColor = '#38bdf8';
                gCtx.shadowBlur = 14;
                gCtx.lineWidth = 4;
                gCtx.beginPath();
                runePoints.forEach((pt, idx) => {
                    if (idx === 0) gCtx.moveTo(pt.x, pt.y);
                    else gCtx.lineTo(pt.x, pt.y);
                });
                gCtx.stroke();
                gCtx.restore();
            }
        });

        window.addEventListener('mousedown', (e) => {
            if (state.inTitleScreen) return;
            if (e.target.closest('#game-hud') || e.target.closest('#creature-designer-modal')) return;

            updateHandWorldPosition(e.clientX, e.clientY);

            if (e.button === 2) {
                isDrawingRune = true;
                runePoints = [{ x: e.clientX, y: e.clientY }];
                handOfGod.pose = 'point';
                return;
            }

            if (e.button === 0) {
                if (state.buildMode) {
                    const costs = {
                        house: { wood: 30, ore: 0 },
                        mill: { wood: 40, ore: 0 },
                        warehouse: { wood: 35, ore: 0 },
                        barracks: { wood: 45, ore: 25 },
                        shrine: { wood: 35, ore: 20 }
                    }[state.buildMode];

                    const dist = Math.hypot(handOfGod.worldPos.x, handOfGod.worldPos.z);
                    if (dist > EPOCHS[state.epochIndex].influenceRadius) {
                        showToast('⚠️ Außerhalb deines göttlichen Einflussbereichs!');
                        return;
                    }
                    if (state.resources.wood < costs.wood || state.resources.ore < costs.ore) {
                        showToast('⚠️ Nicht genügend Rohstoffe für dieses Bauwerk!');
                        return;
                    }
                    state.resources.wood -= costs.wood;
                    state.resources.ore -= costs.ore;
                    createDetailedBuilding(state.buildMode, handOfGod.worldPos.x, handOfGod.worldPos.z, false);
                    state.faith += 8;
                    SoundFX.playChime();
                    showToast(`🏗️ Baustelle (${state.buildMode}) errichtet!`);
                    window.selectBuildMode(null);
                    return;
                }

                // Check if clicking near a constructing/damaged building to help build/repair
                for (const b of buildings) {
                    if (Math.hypot(b.x - handOfGod.worldPos.x, b.z - handOfGod.worldPos.z) < 4.5) {
                        if (b.state === 'constructing') {
                            b.buildProgress = Math.min(100, b.buildProgress + 28);
                            if (b.buildProgress >= 100) {
                                b.state = 'complete';
                                if (b.type === 'house') state.resources.maxPop += 4;
                                state.faith += 10;
                                SoundFX.playChime();
                                showToast('🏛️ Bauwerk durch Gottes Hand vollendet!');
                            }
                            updateBuildingVisualStage(b);
                            return;
                        } else if (b.state !== 'complete') {
                            b.hp = 100;
                            b.state = 'complete';
                            updateBuildingVisualStage(b);
                            showToast('✨ Bauwerk durch göttliche Hand restauriert!');
                            return;
                        }
                    }
                }

                // Pick up or drop villager
                if (state.heldObject) {
                    state.heldObject.mesh.position.set(
                        handOfGod.worldPos.x,
                        getTerrainHeight(handOfGod.worldPos.x, handOfGod.worldPos.z),
                        handOfGod.worldPos.z
                    );
                    state.heldObject = null;
                    handOfGod.pose = 'open';
                    showToast('👥 Siedler abgesetzt (+Segen).');
                } else {
                    for (const v of villagers) {
                        if (v.mesh.position.distanceTo(handOfGod.worldPos) < 3.6) {
                            state.heldObject = v;
                            handOfGod.pose = 'fist';
                            SoundFX.playTone(520, 0.14, 'sine', 0.05);
                            showToast(`🖐️ Siedler (${v.role}) mit der Wolkenhand aufgehoben!`);
                            break;
                        }
                    }
                }
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (e.button === 2 && isDrawingRune) {
                isDrawingRune = false;
                gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
                handOfGod.pose = 'open';

                if (runePoints.length > 8) {
                    const first = runePoints[0];
                    const last = runePoints[runePoints.length - 1];
                    const closeDist = Math.hypot(last.x - first.x, last.y - first.y);
                    let dirChanges = 0;
                    for (let i = 2; i < runePoints.length; i++) {
                        const dx1 = runePoints[i - 1].x - runePoints[i - 2].x;
                        const dx2 = runePoints[i].x - runePoints[i - 1].x;
                        if (dx1 * dx2 < 0) dirChanges++;
                    }
                    if (dirChanges >= 3) window.castMiracleAtCursor('lightning');
                    else if (closeDist < 85) window.castMiracleAtCursor('fireball');
                    else window.castMiracleAtCursor('heal');
                }
                runePoints = [];
            }
        });

        window.castMiracleAtCursor = function(miracleType) {
            const costs = { water: 25, heal: 35, fireball: 45, lightning: 55, volcano: 110 };
            const cost = costs[miracleType] || 30;
            if (state.resources.mana < cost) {
                showToast('⚠️ Nicht genügend göttliches Mana!');
                return;
            }
            state.resources.mana -= cost;
            const pos = handOfGod.worldPos.clone();

            if (miracleType === 'water' || miracleType === 'heal') {
                state.alignment = Math.min(100, state.alignment + 5);
                state.faith += 12;
                state.resources.food += 25;
                buildings.forEach(b => {
                    if (Math.hypot(b.x - pos.x, b.z - pos.z) < 16) {
                        b.hp = 100;
                        b.state = 'complete';
                        b.buildProgress = 100;
                        updateBuildingVisualStage(b);
                    }
                });
                SoundFX.playChime();
                showToast(miracleType === 'water' ? '🌧️ Segensregen lässt Felder erblühen (+25 Nahrung, +12 Glaube)!' : '💚 Göttliche Heilung repariert Gebäude & segnet dein Volk!');
            } else {
                state.alignment = Math.max(-100, state.alignment - 7);
                state.faith += 14;
                SoundFX.playThunder();
                spawnDestructionDebris(pos.x, pos.y, pos.z, miracleType === 'volcano' ? 28 : 16);

                buildings.forEach(b => {
                    if (Math.hypot(b.x - pos.x, b.z - pos.z) < 13) {
                        b.hp -= miracleType === 'volcano' ? 80 : 45;
                        b.state = b.hp <= 25 ? 'ruins' : 'damaged';
                        updateBuildingVisualStage(b);
                    }
                });

                Object.values(state.tribes).forEach(tr => {
                    if (tr.pos.distanceTo(pos) < 45) {
                        tr.impress = Math.min(100, tr.impress + 18);
                    }
                });
                showToast(`🔥 Göttlicher Zorn (${miracleType.toUpperCase()}) erschüttert die Erde!`);
            }
            updateInfluenceRing();
        };

        // Keyboard Camera Navigation & Zoom
        const keysPressed = {};
        window.addEventListener('keydown', (e) => { keysPressed[e.key.toLowerCase()] = true; });
        window.addEventListener('keyup', (e) => { keysPressed[e.key.toLowerCase()] = false; });
        window.addEventListener('wheel', (e) => {
            if (state.inTitleScreen) return;
            camSpherical.radius = Math.max(24, Math.min(145, camSpherical.radius + e.deltaY * 0.04));
        });

        // ============================================================================
        // 9. AUTONOMOUS CREATURE UTILITY-AI & BIPEDAL KINEMATICS
        // ============================================================================
        function updateCreatureAI(dt, now) {
            const c = state.creature;
            if (!c.mesh) return;
            const slot = state.creatureSlots[state.activeSlotIndex] || state.creatureSlots[0];
            const j = c.joints;

            // Stamina & Vitality Rest Cycle
            const vitFactor = Math.max(0.2, (slot.vit || 80) / 100);
            if (c.resting) {
                c.stamina = Math.min(100, c.stamina + dt * 14 * vitFactor);
                c.stateText = `💤 Ruht sich aus (Vitalität ${Math.round(c.stamina)}%)`;
                if (c.stamina >= 96) c.resting = false;
            } else {
                c.stamina = Math.max(0, c.stamina - dt * (1.8 / vitFactor));
                if (c.stamina <= 12) c.resting = true;
            }

            c.animTimer -= dt;
            if (c.animTimer <= 0 && !c.resting) {
                c.animTimer = 6 + Math.random() * 5;
                const unfinished = buildings.find(b => b.state === 'constructing');

                if ((c.role === 'builder' || (c.role === 'free' && slot.prod >= 60)) && unfinished) {
                    c.targetPos.set(unfinished.x + 3.2, 0, unfinished.z + 2.5);
                    c.animMode = 'build';
                    c.stateText = `🔨 Hilft beim Bau (${unfinished.type})`;
                    unfinished.buildProgress = Math.min(100, unfinished.buildProgress + 20);
                    if (unfinished.buildProgress >= 100) {
                        unfinished.state = 'complete';
                        updateBuildingVisualStage(unfinished);
                    }
                } else if (c.role === 'gather' || (c.role === 'free' && Math.random() < (slot.prod / 130))) {
                    const angle = Math.random() * Math.PI * 2;
                    c.targetPos.set(Math.cos(angle) * 24, 0, Math.sin(angle) * 24);
                    c.animMode = 'walk';
                    state.resources.wood += 6;
                    state.resources.food += 6;
                    c.stateText = `🌲 Sammelt Nahrung & Holz für die Polis`;
                } else if (c.role === 'soldier' || (c.role === 'free' && slot.aggr > 70)) {
                    c.animMode = 'roar';
                    state.tribes.vikings.impress = Math.min(100, state.tribes.vikings.impress + 2);
                    c.stateText = `🦁 Brüllt majestätisch & schüchtert Rivalen ein`;
                } else {
                    c.animMode = 'think';
                    state.faith += (slot.social || 75) * 0.02;
                    c.stateText = `🤔 Denkt nach & inspiriert Bürger (+Glaube)`;
                }
            }

            // Movement towards targetPos
            const pos = c.mesh.position;
            const dx = c.targetPos.x - pos.x;
            const dz = c.targetPos.z - pos.z;
            const dist = Math.hypot(dx, dz);

            if (dist > 1.4 && !c.resting) {
                const speed = 6.5 * dt;
                pos.x += (dx / dist) * speed;
                pos.z += (dz / dist) * speed;
                pos.y = getTerrainHeight(pos.x, pos.z);
                c.mesh.rotation.y = Math.atan2(dx, dz);

                c.walkPhase += dt * 6.5;
                const swing = Math.sin(c.walkPhase) * 0.48;
                if (j.leftLeg) j.leftLeg.rotation.x = swing;
                if (j.rightLeg) j.rightLeg.rotation.x = -swing;
                if (j.leftArm) j.leftArm.shoulder.rotation.x = -swing * 0.7;
                if (j.rightArm) j.rightArm.shoulder.rotation.x = swing * 0.7;
                if (j.pelvis) j.pelvis.position.y = 3.2 + Math.abs(Math.cos(c.walkPhase)) * 0.22;
            } else {
                // Idle / Think / Roar Poses (sample5.jpg & sample1.jpg)
                const breath = Math.sin(now * 0.0025) * 0.06;
                if (j.leftLeg) j.leftLeg.rotation.x = 0;
                if (j.rightLeg) j.rightLeg.rotation.x = 0;

                if (c.animMode === 'roar' && j.jawPivot) {
                    j.jawPivot.rotation.x = 0.35 + Math.sin(now * 0.015) * 0.18;
                    if (j.leftArm) j.leftArm.shoulder.rotation.z = 0.65;
                    if (j.rightArm) j.rightArm.shoulder.rotation.z = -0.65;
                } else {
                    if (j.jawPivot) j.jawPivot.rotation.x = 0.05;
                    if (j.rightArm) {
                        j.rightArm.shoulder.rotation.x = -0.55 + breath;
                        j.rightArm.elbow.rotation.x = -0.85;
                    }
                    if (j.leftArm) {
                        j.leftArm.shoulder.rotation.z = 0.12;
                        j.leftArm.shoulder.rotation.x = breath;
                    }
                }
            }

            if (j.tailGroup) {
                j.tailGroup.rotation.y = Math.sin(now * 0.004) * 0.35;
            }
            if (j.leftWing && j.rightWing) {
                const flap = Math.sin(now * 0.012) * 0.32;
                j.leftWing.rotation.y = flap;
                j.rightWing.rotation.y = -flap;
            }
        }

        // ============================================================================
        // 10. MAIN SIMULATION & RENDER LOOP
        // ============================================================================
        let lastTime = performance.now();
        let hudTimer = 0;

        function animate(now) {
            requestAnimationFrame(animate);
            const rawDt = Math.min(0.05, (now - lastTime) / 1000);
            lastTime = now;

            if (state.inTitleScreen) {
                renderLightningOverlay();
                camSpherical.theta += rawDt * 0.12;
            } else {
                const panSpeed = 28 * rawDt;
                const forward = new THREE.Vector3(Math.sin(camSpherical.theta), 0, Math.cos(camSpherical.theta));
                const right = new THREE.Vector3(forward.z, 0, -forward.x);

                if (keysPressed['w'] || keysPressed['arrowup']) cameraTarget.addScaledVector(forward, -panSpeed);
                if (keysPressed['s'] || keysPressed['arrowdown']) cameraTarget.addScaledVector(forward, panSpeed);
                if (keysPressed['a'] || keysPressed['arrowleft']) cameraTarget.addScaledVector(right, -panSpeed);
                if (keysPressed['d'] || keysPressed['arrowright']) cameraTarget.addScaledVector(right, panSpeed);
                if (keysPressed['q']) camSpherical.theta -= rawDt * 1.4;
                if (keysPressed['e']) camSpherical.theta += rawDt * 1.4;
            }

            // Update Camera Position from Spherical Coordinates
            camera.position.x = cameraTarget.x + camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta);
            camera.position.y = cameraTarget.y + camSpherical.radius * Math.cos(camSpherical.phi);
            camera.position.z = cameraTarget.z + camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta);
            camera.lookAt(cameraTarget);

            const dt = rawDt * state.time.scale;

            // Realistic Slow Day/Night & Season Cycle
            if (dt > 0) {
                state.time.hour += dt * 0.032;
                if (state.time.hour >= 24) {
                    state.time.hour -= 24;
                    state.time.day++;
                    if (state.time.day % 3 === 0) {
                        state.time.seasonIndex = (state.time.seasonIndex + 1) % SEASONS.length;
                        const s = SEASONS[state.time.seasonIndex];
                        treeFoliageMaterials.forEach(m => m.color.setHex(s.foliageColor));
                        showToast(`${s.icon} Jahreszeitenwechsel: ${s.name} hat begonnen!`);
                    }
                }
            }

            const sunAngle = ((state.time.hour - 6) / 24) * Math.PI * 2;
            sunOrb.position.set(Math.cos(sunAngle) * 165, Math.sin(sunAngle) * 145, -40);
            moonOrb.position.set(-Math.cos(sunAngle) * 165, -Math.sin(sunAngle) * 145, 40);
            sunLight.position.copy(sunOrb.position);
            const daylight = Math.max(0.18, Math.sin(sunAngle));
            sunLight.intensity = daylight * 1.38;

            // Animate Temple Mana Crystal & Buildings
            const crystal = templeGroup.getObjectByName('manaCrystal');
            if (crystal) {
                crystal.rotation.y += rawDt * 1.6;
                crystal.position.y = 13.8 + Math.sin(now * 0.003) * 0.45;
            }

            buildings.forEach(b => {
                if (b.windmillSails && b.state === 'complete') {
                    b.windmillSails.rotation.z += dt * 1.2;
                }
                if (b.state === 'constructing' && b.cranePivot) {
                    b.cranePivot.rotation.y = Math.sin(now * 0.0018) * 0.85;
                }
            });

            // Animate Villagers
            villagers.forEach(v => {
                if (state.heldObject === v) {
                    v.mesh.position.copy(handOfGod.root.position).add(new THREE.Vector3(0, -1.8, 0));
                    return;
                }
                const dx = v.target.x - v.mesh.position.x;
                const dz = v.target.z - v.mesh.position.z;
                const dist = Math.hypot(dx, dz);
                if (dist > 0.6 && dt > 0) {
                    const step = 3.2 * dt;
                    v.mesh.position.x += (dx / dist) * step;
                    v.mesh.position.z += (dz / dist) * step;
                    v.mesh.position.y = getTerrainHeight(v.mesh.position.x, v.mesh.position.z);
                    v.mesh.rotation.y = Math.atan2(dx, dz);
                    v.walkPhase += dt * 9;
                    v.leftLeg.rotation.x = Math.sin(v.walkPhase) * 0.5;
                    v.rightLeg.rotation.x = -Math.sin(v.walkPhase) * 0.5;
                    v.rightArm.rotation.x = -Math.sin(v.walkPhase) * 0.4;
                } else if (dt > 0) {
                    v.timer += dt;
                    v.rightArm.rotation.x = Math.sin(now * 0.01) * 0.65;
                    if (v.timer > 4.5) {
                        v.timer = 0;
                        v.target.set((Math.random() - 0.5) * 34, 0, (Math.random() - 0.5) * 34);
                        if (v.role === 'farmer') state.resources.food += 2;
                        if (v.role === 'woodcutter') state.resources.wood += 2;
                        if (v.role === 'miner') state.resources.ore += 1;
                        if (v.role === 'priest') { state.resources.mana += 3; state.faith += 1.5; }
                    }
                }
            });

            // Animate Hand of God Fingers & Cloud Sprites
            const targetCurl = handOfGod.pose === 'fist' ? 1.15 : (handOfGod.pose === 'point' ? 0.85 : 0.22 + Math.sin(now * 0.003) * 0.06);
            handOfGod.fingers.forEach((f, idx) => {
                const curl = (handOfGod.pose === 'point' && idx === 0) ? 0.08 : targetCurl;
                f.j1.rotation.x += (curl - f.j1.rotation.x) * 0.18;
                f.j2.rotation.x += (curl * 0.85 - f.j2.rotation.x) * 0.18;
            });
            handOfGod.cloudSprites.forEach((sp, i) => {
                sp.material.rotation += rawDt * (i % 2 === 0 ? 0.25 : -0.25);
            });

            // Debris Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.userData.vy -= p.userData.gravity * rawDt;
                p.position.x += p.userData.vx * rawDt;
                p.position.y += p.userData.vy * rawDt;
                p.position.z += p.userData.vz * rawDt;
                p.rotation.x += 3 * rawDt;
                p.userData.life -= rawDt;
                if (p.userData.life <= 0 || p.position.y < -2) {
                    scene.remove(p);
                    particles.splice(i, 1);
                }
            }

            // Update Autonomous Creature AI
            if (dt > 0) {
                updateCreatureAI(dt, now);
            }

            // Periodic HUD Sync & Epoch Progression Check
            hudTimer += rawDt;
            if (hudTimer > 0.25) {
                hudTimer = 0;
                const nextEpoch = EPOCHS[state.epochIndex + 1];
                if (nextEpoch && state.faith >= nextEpoch.faithReq) {
                    state.epochIndex++;
                    updateInfluenceRing();
                    SoundFX.playChime();
                    showToast(`👑 EPOCHEN-AUFSTIEG: ${EPOCHS[state.epochIndex].name} erreicht!`);
                }

                const curEp = EPOCHS[state.epochIndex];
                const nextReq = nextEpoch ? nextEpoch.faithReq : curEp.faithReq * 1.5;
                document.getElementById('hud-epoch-roman').textContent = curEp.roman;
                document.getElementById('hud-epoch-name').textContent = curEp.name;
                document.getElementById('hud-faith-val').textContent = Math.floor(state.faith);
                document.getElementById('hud-faith-max').textContent = nextReq;
                document.getElementById('hud-faith-bar').style.width = Math.min(100, (state.faith / nextReq) * 100) + '%';

                const al = Math.round(state.alignment);
                document.getElementById('hud-align-label').textContent = al > 15 ? `Lichtgott (+${al})` : (al < -15 ? `Kriegsgott (${al})` : `Neutral (${al})`);

                const hrs = Math.floor(state.time.hour);
                const mins = Math.floor((state.time.hour - hrs) * 60);
                document.getElementById('hud-time-clock').textContent = `Tag ${state.time.day}, ${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
                const sObj = SEASONS[state.time.seasonIndex];
                document.getElementById('hud-season-icon').textContent = sObj.icon;
                document.getElementById('hud-season-name').textContent = sObj.name;

                document.getElementById('res-food').textContent = Math.floor(state.resources.food);
                document.getElementById('res-wood').textContent = Math.floor(state.resources.wood);
                document.getElementById('res-ore').textContent = Math.floor(state.resources.ore);
                document.getElementById('res-mana').textContent = Math.floor(state.resources.mana);
                document.getElementById('res-pop').textContent = `${villagers.length}/${state.resources.maxPop}`;

                document.getElementById('hud-creature-state').textContent = state.creature.stateText;
                document.getElementById('tribe-vikings-val').textContent = state.tribes.vikings.impress + '%';
                document.getElementById('tribe-japanese-val').textContent = state.tribes.japanese.impress + '%';
                document.getElementById('tribe-aztecs-val').textContent = state.tribes.aztecs.impress + '%';
            }

            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.onload = function() {
            animate(performance.now());
        };
