import * as THREE from 'three';
// 自定义shader
import vertexShader from '../../myshader/holography/vertex.js';
import fragmentShader from '../../myshader/holography/fragment.js';

class HolographyMaterial{
    constructor(){
        this.material = new THREE.RawShaderMaterial(
            {
                uniforms: THREE.UniformsUtils.merge([
                           
                    // 引用光照uniforms
                    THREE.UniformsLib.lights,
                    {
                        // 自定义uniforms
                        // 基础颜色
                        BaseColor: { value: new THREE.Color(0x141f4d) },
        
                        // 是否开启菲涅尔描边
                        enableFresnel: { value: true },
                        // 菲涅尔描边颜色
                        FresnelColor: { value: new THREE.Color(0x00fffb) },
                        // 菲涅尔描边强度
                        FresnelPower: { value: 5.38 },
                        // 菲涅尔描边范围
                        FresnelRange: { value: 0.194 },
        
                        // 是否开启扫光
                        enableWave: { value: true },
                        // 扫光颜色
                        WaveColor: { value: new THREE.Color(0x1affc6) },
                        // 扫光强度
                        WavePower: { value: 0.58 },
                        // 扫光范围
                        WaveRange: { value: 0.243 },
                        // 扫光速度
                        WaveSpeed: { value: 1.0 },
        
                        time: { value: 0 },
        
                        Opacity: { value: 0.5 },
        
                        noiseTexture: { value: new THREE.TextureLoader().load('./textures/noise/Perlin 23 - 128x128.png') }
        
                    }
                ]),
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                lights: true,
                // 透明度
                transparent: true
            });
    }
}




export default HolographyMaterial ;