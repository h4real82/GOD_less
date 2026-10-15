import * as THREE from 'three';

/**
 * AdvancedEnvironmentShaders: Verwaltet prozedurale Custom GLSL Shaders
 * für dynamische Wolkenschatten, Wind-Animationen und organisches Terrain-Blending.
 */
export class AdvancedEnvironmentShaders {
    constructor() {
        // Wind-Uniform für Vegetation und Bäume
        this.windUniform = { value: 0.0 };
    }

    /**
     * Erstellt ein ShaderMaterial für prozedurale, bewegte Wolkenschatten / Terrain.
     */
    createTerrainShaderMaterial(baseTexture) {
        return new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: baseTexture },
                windTime: this.windUniform,
                colorTint: { value: new THREE.Color(0x387834) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vWorldPosition;
                uniform float windTime;

                void main() {
                    vUv = uv;
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    
                    // Leichter Vertex-Warping (Wind-Effekt) auf dem Terrain/Vegetation
                    float windWarp = sin(worldPosition.x * 0.1 + windTime * 2.0) * cos(worldPosition.z * 0.1 + windTime * 1.5) * 0.2;
                    vec3 modifiedPosition = position + vec3(0.0, windWarp, 0.0);

                    vWorldPosition = (modelMatrix * vec4(modifiedPosition, 1.0)).xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(modifiedPosition, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                varying vec3 vWorldPosition;
                uniform float windTime;
                uniform vec3 colorTint;

                void main() {
                    // Prozedurale Wolkenschatten-Simulation über Weltkoordinaten
                    float cloudShadow = sin(vWorldPosition.x * 0.02 + windTime * 0.5) * cos(vWorldPosition.z * 0.02 + windTime * 0.3);
                    cloudShadow = smoothstep(-0.5, 0.5, cloudShadow) * 0.35 + 0.65; // Abdunklung zwischen 65% und 100%

                    vec3 finalColor = colorTint * cloudShadow;
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            lights: false
        });
    }

    update(dt) {
        // Wind-Zeit für Shader kontinuierlich fortschreiben
        this.windUniform.value += dt * 1.2;
    }
}
