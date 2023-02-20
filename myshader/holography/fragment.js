const fragmentShader = /*glsl*/`

    // 需要设置精度，否则会报错
    precision mediump float;

    // 由threejs自动传入

    uniform vec3 cameraPosition;
    uniform vec3 ambientLightColor;

    // 基础颜色
    uniform vec3 BaseColor;
    // 是否开启菲涅尔描边
    uniform bool enableFresnel;
    // 菲涅尔
    uniform float FresnelPower;
    uniform float FresnelRange;
    uniform vec3 FresnelColor;

    // 是否开启扫光
    uniform bool enableWave;
    // 扫光
    uniform float WavePower;
    uniform float WaveRange;
    uniform vec3 WaveColor;
    uniform float WaveSpeed;

    uniform sampler2D noiseTexture;
   
    uniform float time;

    uniform float Opacity;
   
    struct DirectionalLight {
        vec3 direction;
        vec3 color;
     };
    
    uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
    
     // 顶点着色器传入的变量
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;
    varying vec3 vNormal;
    varying vec2 vUv;

    float saturate(float x) {
        return clamp(x, 0.0, 1.0);
    }

    float random(float x) {
        return fract(sin(x) * 43758.5453123);
    }

    
    void main() {
        
        vec3 color = vec3(0.0, 0.0, 0.0);

        
        // 菲涅尔描边效果
        if (enableFresnel) {
            
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);
            float fresnel = (1.0 - FresnelRange) + FresnelRange * dot(viewDir, vNormal);
            fresnel = 1.0 - pow(fresnel, FresnelPower);
            color = FresnelColor * fresnel;
        }

        // 扫光效果,从下往上扫
        if (enableWave) {
            
            float noise=texture2D(noiseTexture,vec2(vWorldPosition.y,vWorldPosition.y)).r;
            float wave = mod(vWorldPosition.y-time*WaveSpeed +noise , WaveRange);
            
            // 取小数
            wave = wave - floor(wave);

            wave = sin(wave * 3.1415926/2.0 )*WavePower;

            color += WaveColor * wave ;
        }

        
        gl_FragColor = vec4(BaseColor+color, Opacity);
    }

   
`;
export default fragmentShader;