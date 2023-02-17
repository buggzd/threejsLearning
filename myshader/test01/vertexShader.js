const vertexShader = /*glsl*/ `
    // 由threejs自动传入
    attribute vec3 position;
    attribute vec3 normal;

    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 modelMatrix;
    uniform mat3 normalMatrix;

    // 需要传给片段着色器的变量
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;
    varying vec3 vNormal;

    
    void main() {
        gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vWorldPosition = ( modelMatrix * vec4(position, 1.0)).xyz;
        vWorldNormal = normalMatrix * normal;
        vNormal = normal;
    }
`;

export default vertexShader;

