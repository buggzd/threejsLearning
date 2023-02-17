const fragmentShader = /*glsl*/`

    // 需要设置精度，否则会报错
    precision mediump float;

    // 由threejs自动传入
    uniform vec3 color;

    uniform float diffuse;
    uniform float specular;
    uniform float glossiness;

    uniform vec3 cameraPosition;
    
    uniform vec3 ambientLightColor;

   
    struct DirectionalLight {
        vec3 direction;
        vec3 color;
     };
    
    uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
    
     // 顶点着色器传入的变量
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;
    varying vec3 vNormal;

    void main() {
        vec3 normal = normalize(vWorldNormal);
        vec3 lightDirection = normalize(directionalLights[0].direction);

        float lambert = max(dot(normal, lightDirection), 0.0);

        float specularStrength = 0.5;
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

        vec3 halfDirection = normalize(lightDirection + viewDirection);
        float specularFactor = pow(max(dot(normal, halfDirection), 0.0), glossiness);

        vec3 specularColor = specularStrength * specularFactor * directionalLights[0].color;

        vec3 diffuseColor = color * lambert;
        vec3 ambientColor = ambientLightColor * 0.1;
        vec3 finalColor = (diffuseColor + ambientColor + specularColor) ;

        gl_FragColor = vec4(finalColor, 1.0);
        
    }
`;
export default fragmentShader;