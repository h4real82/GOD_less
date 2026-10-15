// ============================================================================
        // 4. THREE.JS WORLD, TERRAIN, WATER, FLORA & RIVAL TRIBES
        // ============================================================================
        const container = document.getElementById('webgl-container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b1528);
        scene.fog = new THREE.FogExp2(0x0e1c36, 0.0022);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 900);
        const cameraTarget = new THREE.Vector3(0, 2.5, 8);
        const camSpherical = { radius: 68, theta: 0.35, phi: 0.92 };

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        container.appendChild(renderer.domElement);

        const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x3f2e21, 0.68);
        scene.add(hemiLight);

        const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.38);
        sunLight.position.set(85, 115, 65);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 10;
        sunLight.shadow.camera.far = 360;
        const dCam = 135;
        sunLight.shadow.camera.left = -dCam;
        sunLight.shadow.camera.right = dCam;
        sunLight.shadow.camera.top = dCam;
        sunLight.shadow.camera.bottom = -dCam;
        scene.add(sunLight);

        const sunOrb = new THREE.Mesh(
            new THREE.SphereGeometry(7, 20, 20),
            new THREE.MeshBasicMaterial({ color: 0xfde047 })
        );
        const moonOrb = new THREE.Mesh(
            new THREE.SphereGeometry(5, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xe2e8f0 })
        );
        scene.add(sunOrb, moonOrb);

        const sharedMats = {
            roofTile: new THREE.MeshStandardMaterial({ map: AssetForge.createRoofTileTexture(), roughness: 0.65 }),
            verdiDome: new THREE.MeshStandardMaterial({ map: AssetForge.createVerdiDomeTexture(), roughness: 0.45, metalness: 0.3 }),
            classicalWall: new THREE.MeshStandardMaterial({ map: AssetForge.createClassicalWallTexture(), roughness: 0.78 }),
            cobbleRoad: new THREE.MeshStandardMaterial({ map: AssetForge.createCobbleRoadTexture(), roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -1 }),
            marble: new THREE.MeshStandardMaterial({ color: 0xf1ece1, roughness: 0.45 }),
            goldTrim: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.28, metalness: 0.82 }),
            wood: new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.85 }),
            charredWood: new THREE.MeshStandardMaterial({ color: 0x1e1b18, roughness: 0.95 }),
            stone: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.88 }),
            fireSpriteMat: new THREE.SpriteMaterial({ map: AssetForge.createFireSmokeTexture(true), transparent: true, depthWrite: false }),
            smokeSpriteMat: new THREE.SpriteMaterial({ map: AssetForge.createFireSmokeTexture(false), transparent: true, depthWrite: false })
        };

        function getTerrainHeight(x, z) {
            const r = Math.hypot(x, z);
            if (r > 165) return -4.5;
            const centerFlat = Math.min(1, Math.max(0, (r - 28) / 40));
            const hills = (Math.sin(x * 0.045) * Math.cos(z * 0.045) * 4.2 + Math.sin(x * 0.09 + z * 0.07) * 1.8) * centerFlat;
            const northMountains = z < -55 ? Math.pow(Math.min(1, (-z - 55) / 70), 1.6) * 22 * (0.6 + 0.4 * Math.cos(x * 0.06)) : 0;
            const riverX = Math.sin(z * 0.035) * 18 - 32;
            const distRiver = Math.abs(x - riverX);
            const riverCut = distRiver < 6.5 ? -2.2 * Math.cos((distRiver / 6.5) * (Math.PI / 2)) : 0;
            const coastDrop = r > 125 ? -Math.pow((r - 125) / 40, 1.8) * 7.5 : 0;
            return Math.max(-4.2, 1.4 + hills + northMountains + riverCut + coastDrop);
        }

        const terrainGeo = new THREE.PlaneGeometry(340, 340, 150, 150);
        terrainGeo.rotateX(-Math.PI / 2);
        const posAttr = terrainGeo.attributes.position;
        const colorsArr = new Float32Array(posAttr.count * 3);

        for (let i = 0; i < posAttr.count; i++) {
            const vx = posAttr.getX(i);
            const vz = posAttr.getZ(i);
            const vy = getTerrainHeight(vx, vz);
            posAttr.setY(i, vy);

            const c = new THREE.Color();
            if (vy < 0.2) c.setHex(0xd6bf8e);
            else if (vy < 4.5) {
                const grassNoise = (Math.sin(vx * 0.14) * Math.cos(vz * 0.14)) * 0.04;
                c.setRGB(0.22 + grassNoise, 0.45 + grassNoise, 0.18);
            } else if (vy < 12) c.setHex(0x57534e);
            else c.setHex(0xf1f5f9);
            colorsArr[i * 3] = c.r;
            colorsArr[i * 3 + 1] = c.g;
            colorsArr[i * 3 + 2] = c.b;
        }
        terrainGeo.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));
        terrainGeo.computeVertexNormals();

        const terrainMesh = new THREE.Mesh(
            terrainGeo,
            new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0.04 })
        );
        terrainMesh.receiveShadow = true;
        scene.add(terrainMesh);

        const waterMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(900, 900),
            new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.18, metalness: 0.65, transparent: true, opacity: 0.82 })
        );
        waterMesh.rotation.x = -Math.PI / 2;
        waterMesh.position.y = -0.35;
        scene.add(waterMesh);

        let influenceRingMesh = null;
        function updateInfluenceRing() {
            if (influenceRingMesh) scene.remove(influenceRingMesh);
            const rad = EPOCHS[state.epochIndex].influenceRadius;
            const ringGeo = new THREE.RingGeometry(rad - 1.1, rad, 96);
            ringGeo.rotateX(-Math.PI / 2);
            const ringPos = ringGeo.attributes.position;
            for (let i = 0; i < ringPos.count; i++) {
                const rx = ringPos.getX(i);
                const rz = ringPos.getZ(i);
                ringPos.setY(i, Math.max(0.2, getTerrainHeight(rx, rz) + 0.35));
            }
            const ringColor = state.alignment > 20 ? 0x38bdf8 : (state.alignment < -20 ? 0xef4444 : 0x4ade80);
            influenceRingMesh = new THREE.Mesh(
                ringGeo,
                new THREE.MeshBasicMaterial({ color: ringColor, side: THREE.DoubleSide, transparent: true, opacity: 0.72 })
            );
            scene.add(influenceRingMesh);
        }
        updateInfluenceRing();

        const resourcesNodes = [];
        const treeFoliageMaterials = [];

        function spawnTree(x, z) {
            const y = getTerrainHeight(x, z);
            if (y < 0.8 || y > 11) return;
            const g = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.38, 2.4, 7), sharedMats.wood);
            trunk.position.y = 1.2;
            trunk.castShadow = true;
            g.add(trunk);

            const folMat = new THREE.MeshStandardMaterial({ color: SEASONS[0].foliageColor, roughness: 0.8 });
            treeFoliageMaterials.push(folMat);
            for (let l = 0; l < 3; l++) {
                const cone = new THREE.Mesh(new THREE.ConeGeometry(1.65 - l * 0.38, 2.2, 8), folMat);
                cone.position.y = 2.4 + l * 1.15;
                cone.castShadow = true;
                g.add(cone);
            }
            g.position.set(x, y, z);
            g.userData = { entityType: 'resource', resType: 'wood' };
            scene.add(g);
            resourcesNodes.push(g);
        }

        function spawnOreRock(x, z) {
            const y = getTerrainHeight(x, z);
            if (y < 0.8) return;
            const g = new THREE.Group();
            const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 1), sharedMats.stone);
            rock.scale.set(1.2, 0.85, 1.1);
            rock.position.y = 0.7;
            rock.castShadow = true;
            g.add(rock);

            const vein = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), sharedMats.goldTrim);
            vein.position.set(0.4, 1.0, 0.3);
            g.add(vein);

            g.position.set(x, y, z);
            g.userData = { entityType: 'resource', resType: 'ore' };
            scene.add(g);
            resourcesNodes.push(g);
        }

        for (let i = 0; i < 65; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = 26 + Math.random() * 88;
            spawnTree(Math.cos(a) * r, Math.sin(a) * r);
        }
        for (let i = 0; i < 22; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = 24 + Math.random() * 80;
            spawnOreRock(Math.cos(a) * r, Math.sin(a) * r);
        }
