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
