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
