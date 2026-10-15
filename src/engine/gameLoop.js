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
