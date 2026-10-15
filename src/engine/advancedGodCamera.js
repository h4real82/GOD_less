import * as THREE from 'three';

/**
 * AdvancedGodCamera: Implementiert den stufenlosen, nahtlosen Seamless-Zoom
 * von der Satelliten-Götterperspektive bis zur Schulterperspektive (First/Third-Person).
 */
export class AdvancedGodCamera {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        // Spherical coordinates for smooth orbit & zoom
        this.targetLookAt = new THREE.Vector3(0, 0, 0);
        this.currentLookAt = new THREE.Vector3(0, 0, 0);
        
        this.distance = 80;      // Start-Zoom (Götterperspektive)
        this.minDistance = 2;    // Nah an Kreatur / Mensch
        this.maxDistance = 300;  // Maximale Vogelperspektive
        
        this.polarAngle = Math.PI / 4;   // Höhe (Pitch)
        this.azimuthAngle = 0;           // Rotation (Yaw)

        this.isDragging = false;
        this.isPanning = false;
        this.previousMousePosition = { x: 0, y: 0 };

        this.initListeners();
    }

    initListeners() {
        this.domElement.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.isDragging = true; // Linksklick = Orbit / Rotation
            if (e.button === 2) this.isPanning = true;  // Rechtsklick = Pan (Verschieben)
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.isPanning = false;
        });

        this.domElement.addEventListener('mousemove', (e) => {
            const deltaX = e.clientX - this.previousMousePosition.x;
            const deltaY = e.clientY - this.previousMousePosition.y;

            if (this.isDragging) {
                this.azimuthAngle -= deltaX * 0.005;
                this.polarAngle = Math.max(0.1, Math.min(Math.PI / 2 - 0.01, this.polarAngle - deltaY * 0.005));
            } else if (this.isPanning) {
                const panSpeed = this.distance * 0.001;
                const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.azimuthAngle);
                const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.azimuthAngle);
                
                this.targetLookAt.addScaledVector(right, -deltaX * panSpeed);
                this.targetLookAt.addScaledVector(forward, deltaY * panSpeed);
            }

            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            // Exponentiellem Zoom für geschmeidiges Heranrauschen
            const zoomFactor = e.deltaY > 0 ? 1.15 : 0.87;
            this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance * zoomFactor));
        }, { passive: false });

        this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    update(dt = 0.016) {
        // Sanftes Interpolieren (Lerp) für geschmeidige Kamerabewegungen
        this.currentLookAt.lerp(this.targetLookAt, 0.1);

        // Berechnung der Kameraposition aus sphärischen Koordinaten
        const x = this.currentLookAt.x + this.distance * Math.sin(this.polarAngle) * Math.sin(this.azimuthAngle);
        const y = this.currentLookAt.y + this.distance * Math.cos(this.polarAngle);
        const z = this.currentLookAt.z + this.distance * Math.sin(this.polarAngle) * Math.cos(this.azimuthAngle);

        this.camera.position.set(x, Math.max(1, y), z);
        this.camera.lookAt(this.currentLookAt);
    }
}
