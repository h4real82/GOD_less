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
