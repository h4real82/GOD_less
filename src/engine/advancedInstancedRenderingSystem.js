import * as THREE from 'three';

/**
 * AdvancedInstancedRenderingSystem: 
 * Verwaltet hochperformantes Instanced Rendering für Tausende von Bäumen und Dorfbewohnern.
 * Reduziert Draw Calls drastisch, um stabile 60 FPS im Browser zu garantieren.
 */
export class AdvancedInstancedRenderingSystem {
    constructor(scene) {
        this.scene = scene;
        this.instancedMeshes = new Map();
    }

    /**
     * Erstellt ein InstancedMesh für eine bestimmte Objektart (z.B. Bäume).
     * @param {string} key - Eindeutiger Identifizierer
     * @param {THREE.BufferGeometry} geometry - Geometrie des Objekts
     * @param {THREE.Material} material - Material (PBR / Shader)
     * @param {number} count - Maximale Anzahl von Instanzen
     */
    createInstancedGroup(key, geometry, material, count = 1000) {
        const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        
        // Standardmäßig alle Instanzen initial ausserhalb oder skaliert auf 0 setzen
        const dummy = new THREE.Object3D();
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        
        for (let i = 0; i < count; i++) {
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;

        this.scene.add(instancedMesh);
        this.instancedMeshes.set(key, { mesh: instancedMesh, count: count, activeCount: 0 });
        return instancedMesh;
    }

    /**
     * Aktualisiert die Positionen und Transformationen einer Instanzgruppe.
     */
    updateInstances(key, transforms) {
        const group = this.instancedMeshes.get(key);
        if (!group) return;

        const dummy = new THREE.Object3D();
        const limit = Math.min(transforms.length, group.count);

        for (let i = 0; i < limit; i++) {
            const t = transforms[i];
            dummy.position.set(t.x, t.y, t.z);
            if (t.rotation) dummy.rotation.set(t.rotX || 0, t.rotY || 0, t.rotZ || 0);
            if (t.scale) dummy.scale.set(t.scale, t.scale, t.scale);
            else dummy.scale.set(1, 1, 1);
            
            dummy.updateMatrix();
            group.mesh.setMatrixAt(i, dummy.matrix);
        }

        // Nicht genutzte Instanzen unsichtbar machen (Scale = 0)
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        for (let i = limit; i < group.count; i++) {
            group.mesh.setMatrixAt(i, dummy.matrix);
        }

        group.mesh.instanceMatrix.needsUpdate = true;
        group.activeCount = limit;
    }
}
