const fragmentShader = /*glsl*/`
    precision mediump float;
    uniform vec3 color;

    uniform float diffuse;
    uniform float specular;
    uniform float glossiness;
    
    uniform vec3 ambientLightColor;
    uniform vec3 directionalLightColor;
    uniform vec3 directionalLightDirection;

    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;
    varying vec3 vNormal;

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDirection = normalize(directionalLightDirection);

        float lambert = max(dot(normal, lightDirection), 0.0);
        gl_FragColor = vec4(directionalLightDirection, 1.0);
        
        
    }
`;
export default fragmentShader;