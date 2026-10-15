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
