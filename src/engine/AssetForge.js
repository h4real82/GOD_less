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
