import { gameState } from '../config/constantsAndState.js';

export class AdvancedUIManager {
    constructor(systems) {
        this.systems = systems;
        this.contextMenuElement = null;
        this.initDOM();
    }

    initDOM() {
        if (document.getElementById('godless-hud')) return;

        const hudHTML = `
            <div id="godless-hud" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; font-family: sans-serif; color: #fff; z-index: 100;">
                <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); border: 2px solid #d97706; padding: 10px 20px; border-radius: 8px; display: flex; gap: 15px; pointer-events: auto;">
                    <div>⚡ Kraft: <span id="hud-power">100</span></div>
                    <div>✨ Glaube: <span id="hud-belief">50</span></div>
                    <div>👥 Pop: <span id="hud-pop">15</span></div>
                    <div>🪵 Holz: <span id="hud-wood">50</span></div>
                    <div>🪨 Stein: <span id="hud-stone">30</span></div>
                    <div>🌾 Nahrung: <span id="hud-food">100</span></div>
                </div>
                <div style="position: absolute; top: 90px; left: 20px; width: 240px; background: rgba(15, 23, 42, 0.9); border: 2px solid #b45309; padding: 12px; border-radius: 8px; pointer-events: auto;">
                    <h4 style="margin: 0 0 8px 0; color: #fbbf24; text-align: center;">Zivilisations-Fokus</h4>
                    <input type="range" id="slider-social" min="0" max="1" step="0.05" value="0.5" style="width: 100%;">
                    <div id="slider-label" style="text-align: center; font-size: 11px; margin-top: 4px;">Ausgeglichen</div>
                </div>
                <div id="context-menu" style="display: none; position: absolute; background: #0f172a; border: 2px solid #fbbf24; border-radius: 6px; padding: 6px; pointer-events: auto; z-index: 1000;">
                    <div id="context-options" style="display: flex; flex-direction: column; gap: 4px;"></div>
                </div>
            </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = hudHTML;
        document.body.appendChild(div);
        this.contextMenuElement = document.getElementById('context-menu');
        this.initEvents();
    }

    initEvents() {
        const slider = document.getElementById('slider-social');
        const label = document.getElementById('slider-label');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                if (this.systems?.civSystem) this.systems.civSystem.socialSlider = val;
                if (val < 0.3) label.textContent = 'Familienorientiert';
                else if (val > 0.7) label.textContent = 'Arbeitsorientiert';
                else label.textContent = 'Ausgeglichen';
            });
        }
        window.addEventListener('click', () => {
            if (this.contextMenuElement) this.contextMenuElement.style.display = 'none';
        });
    }

    update() {
        const p = document.getElementById('hud-power'); if(p) p.textContent = Math.floor(gameState.g_godPower);
        const b = document.getElementById('hud-belief'); if(b) b.textContent = Math.floor(gameState.g_belief);
        const pop = document.getElementById('hud-pop'); if(pop) pop.textContent = Math.floor(gameState.civilization.population);
        if (this.systems?.civSystem) {
            const res = this.systems.civSystem.resources;
            const w = document.getElementById('hud-wood'); if(w) w.textContent = Math.floor(res.wood);
            const s = document.getElementById('hud-stone'); if(s) s.textContent = Math.floor(res.stone);
            const f = document.getElementById('hud-food'); if(f) f.textContent = Math.floor(res.food);
        }
    }

    showContextMenu(screenX, screenY, options, callback) {
        if (!this.contextMenuElement) return;
        const container = document.getElementById('context-options');
        container.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt.label;
            btn.style.cssText = 'background: #1e293b; border: none; color: #fff; padding: 6px 12px; text-align: left; border-radius: 4px; cursor: pointer; font-size: 12px;';
            btn.onclick = () => { callback(opt.action); this.contextMenuElement.style.display = 'none'; };
            container.appendChild(btn);
        });
        this.contextMenuElement.style.left = `${screenX}px`;
        this.contextMenuElement.style.top = `${screenY}px`;
        this.contextMenuElement.style.display = 'block';
    }
}
