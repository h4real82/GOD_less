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
