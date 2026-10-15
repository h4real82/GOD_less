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

            // Volumetric Floating Cloud Cuff around the Wrist (sample1.jpg)
            const mistTex = AssetForge.createCloudMistSpriteTexture();
            for (let c = 0; c < 6; c++) {
                const sp = new THREE.Sprite(
                    new THREE.SpriteMaterial({ map: mistTex, transparent: true, opacity: 0.62, depthWrite: false })
                );
                const ang = (c / 6) * Math.PI * 2;
                sp.position.set(Math.cos(ang) * 0.85, 0.25, 1.35 + Math.sin(ang) * 0.45);
                sp.scale.set(2.9, 2.9, 1);
                palmGroup.add(sp);
                handOfGod.cloudSprites.push(sp);
            }

            handOfGod.root.position.set(0, 7, 6);
            scene.add(handOfGod.root);
        }
        buildAnatomicalCloudHand();
