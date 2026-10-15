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
