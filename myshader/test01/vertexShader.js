const vertexShader = /*glsl*/ `
    attribute vec3 position;
    attribute vec3 normal;


    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat3 normalMatrix;

    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;
    varying vec3 vNormal;

    void main() {
        
        gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vWorldPosition = ( modelViewMatrix * vec4(position, 1.0)).xyz;
        vWorldNormal = normalMatrix * normal;
        vNormal = normal;
    }
`;

export default vertexShader;

