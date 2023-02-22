// GUI
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import * as THREE from 'three';

class HolographyGUI{

    constructor(HolographyMaterial){
        const shaderControl = new function() {
            // shader属性
            this.color = 0x141f4d;
            this.enableFresnel = true;
            this.fresnelPower = 5.38;
            this.fresnelRange = 0.194;
            this.fresnelColor = 0x00fffb;
        
            this.enableWave = true;
            this.WavePower = 0.58;
            this.WaveRange = 0.243;
            this.WaveColor = 0x1affc6;
            this.WaveSpeed = 1.0;
        
            this.enableTransparent = true;
            this.Opacity = 1.0;
        }

        this.gui = new GUI({ 
            width: 180,
            hideable: true,
            closed:true
            });
        this.gui.domElement.style.left = '0px';
        let folder = this.gui.addFolder('Holography');
        
        folder.addColor(shaderControl, 'color').onChange(function(value){
            shaderControl.color = value;
            HolographyMaterial.material.uniforms.BaseColor.value = new THREE.Color(shaderControl.color);
        });

        folder.add(shaderControl, 'enableFresnel').onChange(function(value){
            shaderControl.enableFresnel = value;
            HolographyMaterial.material.uniforms.enableFresnel.value = shaderControl.enableFresnel;
        });

        folder.add(shaderControl, 'fresnelPower', 0, 10).onChange(function(value){
            shaderControl.fresnelPower = value;
            HolographyMaterial.material.uniforms.FresnelPower.value = shaderControl.fresnelPower;
        });

        folder.add(shaderControl, 'fresnelRange', 0, 1).onChange(function(value){
            shaderControl.fresnelRange = value;
            HolographyMaterial.material.uniforms.FresnelRange.value = shaderControl.fresnelRange;
        });

        folder.addColor(shaderControl, 'fresnelColor').onChange(function(value){
            shaderControl.fresnelColor = value;
            HolographyMaterial.material.uniforms.FresnelColor.value = new THREE.Color(shaderControl.fresnelColor);
        });

        folder.add(shaderControl, 'enableWave').onChange(function(value){
            shaderControl.enableWave = value;
            HolographyMaterial.material.uniforms.enableWave.value = shaderControl.enableWave;
        });

        folder.add(shaderControl, 'WavePower', 0, 10).onChange(function(value){
            shaderControl.WavePower = value;
            HolographyMaterial.material.uniforms.WavePower.value = shaderControl.WavePower;
        });

        folder.add(shaderControl, 'WaveRange', 0, 1).onChange(function(value){
            shaderControl.WaveRange = value;
            HolographyMaterial.material.uniforms.WaveRange.value = shaderControl.WaveRange;
        });

        folder.addColor(shaderControl, 'WaveColor').onChange(function(value){
            shaderControl.WaveColor = value;
            HolographyMaterial.material.uniforms.WaveColor.value = new THREE.Color(shaderControl.WaveColor);
        });

        folder.add(shaderControl, 'WaveSpeed', 0, 10).onChange(function(value){
            shaderControl.WaveSpeed = value;
            HolographyMaterial.material.uniforms.WaveSpeed.value = shaderControl.WaveSpeed;
        });

        folder.add(shaderControl, 'enableTransparent').onChange(function(value){
            shaderControl.enableTransparent = value;
            HolographyMaterial.material.transparent = shaderControl.enableTransparent;
        });

        folder.add(shaderControl, 'Opacity', 0, 1).onChange(function(value){
            shaderControl.Opacity = value;
            HolographyMaterial.material.uniforms.Opacity.value = shaderControl.Opacity;
        });
    }
   
}
export default HolographyGUI;