import * as THREE from 'three';
// 相机控制
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 加载obj
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
// GUI
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
// shader
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';


import {HolographyMaterial} from './shaderTest/Holography.js';

let object;

const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

// 初始化GUI控制器
const indexControl = new function() {
    // object属性
    this.speed = 0.01;
    this.moveRange = 0.1;
    // shader属性
    this.color = 0xffffff;
    this.enableFresnel = true;
    this.fresnelPower = 2.0;
    this.fresnelRange = 1;
    this.fresnelColor = 0x0000ff;

    this.enableWave = true;
    this.WavePower = 2.0;
    this.WaveRange = 1;
    this.WaveColor = 0x00ff00;
    this.WaveSpeed = 1.0;

    this.Opacity = 1.0;


    // 场景属性
    this.ambientLightColor = 0xffffff;
    this.directionalLightColor = 0xffffff;
    this.directionalLightAnglexy = 45;
    this.directionalLightAngleyz = 45;
}
// 初始化GUI
const gui = new GUI();
// 初始化场景
const scene=new THREE.Scene();
// 初始化相机
const camera=new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// 初始化渲染器
const renderer=new THREE.WebGLRenderer({
    antialias:true, 
    gammaFactor: 2.2, // 设置伽马因子为2.2（sRGB标准）
    outputEncoding: THREE.LinearEncoding // 输出颜色空间为sRGB
});

// 初始化effectComposer
const composer = new EffectComposer( renderer );
// 光照
var ambientLight;
var directionalLight;

var dirLightColor ;
var dirLightDirection = new THREE.Vector3();

setRenderPass();
// 初始化控制器
const controls = new OrbitControls( camera, renderer.domElement );
// 使用加载管理器管理模型加载
const manager = new THREE.LoadingManager( loadModel );
// 初始化OBJLoader
const objLoader = new OBJLoader(manager);
var modelsIsLoaded = false;

const time=new THREE.Clock();

let upSpeed=0;

init();
loadModels();
animate();


function init(){
    initCamera();
    initRenderer();
    loadSkyBox();
    initLight()
    initGUI();
}

function modelUpdate(){
    
    if(modelsIsLoaded){
        upSpeed += indexControl.speed;
        object.position.y = indexControl.moveRange*Math.sin(upSpeed);
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.time.value = time.getElapsedTime();
        } );
    }
}

// 加载模型
function loadModel() {
    

    object.traverse( function ( child ) {

        if ( child.isMesh ) {
            child.material =  HolographyMaterial;
            console.log(child);
        }
    } );

    object.position.x = 0;
    scene.add( object );

   

}

function loadModels(){
    const cube=new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({color:0xff0000})
    );
    cube.position.x = -3;
    scene.add(cube);
   // bunny
    objLoader.load(
        // resource URL
        './models/bunny.obj',
        // called when resource is loaded
        function ( obj ) {
            console.log('loaded successfully')
            object=obj;
            modelsIsLoaded = true;
        },
        // called when loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'Loading bunny An error happened' );
        }
    );
    
}

function animate() {
	requestAnimationFrame( animate );
    modelUpdate();
    composer.render();
}
// 初始化GUI
function initGUI(){
    // 添加控制参数
    const modelControllerFloder = gui.addFolder('ModelController');

    modelControllerFloder.add(indexControl, 'speed', 0, 0.1);
    modelControllerFloder.add(indexControl, 'moveRange', 0, 1);
    modelControllerFloder.addColor(indexControl, 'color').onChange(function(value){
        indexControl.color = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.BaseColor.value=new THREE.Color(indexControl.color);
        } );
    });

    modelControllerFloder.add(indexControl, 'enableFresnel').onChange(function(value){
        indexControl.enableFresnel = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.enableFresnel.value=indexControl.enableFresnel;
        } );
    });

    modelControllerFloder.add(indexControl, 'fresnelPower', 0, 10).onChange(function(value){
        indexControl.fresnelPower = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.FresnelPower.value=indexControl.fresnelPower;
        } );
    });

    modelControllerFloder.add(indexControl, 'fresnelRange', 0, 1).onChange(function(value){
        indexControl.fresnelRange = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.FresnelRange.value=indexControl.fresnelRange;
        } );
    });

    modelControllerFloder.addColor(indexControl, 'fresnelColor').onChange(function(value){
        indexControl.fresnelColor = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.FresnelColor.value=new THREE.Color(indexControl.fresnelColor);
        } );
    });

    modelControllerFloder.add(indexControl, 'enableWave').onChange(function(value){
        indexControl.enablewave = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.EnableWave.value=indexControl.enablewave;
        } );
    });

    modelControllerFloder.add(indexControl, 'WavePower', 0, 10).onChange(function(value){
        indexControl.wavePower = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.WavePower.value=indexControl.wavePower;
        } );
    });

    modelControllerFloder.add(indexControl, 'WaveRange', 0, 1).onChange(function(value){
        indexControl.waveRange = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.WaveRange.value=indexControl.waveRange;
        } );
    });

    modelControllerFloder.addColor(indexControl, 'WaveColor').onChange(function(value){
        indexControl.waveColor = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.WaveColor.value=new THREE.Color(indexControl.waveColor);
        } );
    });

    modelControllerFloder.add(indexControl, 'WaveSpeed', 0, 10).onChange(function(value){
        indexControl.waveSpeed = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.WaveSpeed.value=indexControl.waveSpeed;
        } );
    });

    modelControllerFloder.add(indexControl, 'Opacity', 0, 1).onChange(function(value){
        indexControl.opacity = value;
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.Opacity.value=indexControl.opacity;
        } );
    });

    // 场景控制
    const sceneControllerFloder = gui.addFolder('SceneController');
    sceneControllerFloder.addColor(indexControl, 'ambientLightColor').onChange(function(value){
        indexControl.ambientLightColor = value;
        ambientLight.color = new THREE.Color(indexControl.ambientLightColor);
    });

  

    sceneControllerFloder.add(indexControl, 'directionalLightAnglexy', -180, 180).onChange(function(value){
        indexControl.directionalLightAnglexy = value;
        // 通过角度计算单位球坐标
        dirLightDirection.x = Math.cos(indexControl.directionalLightAnglexy*Math.PI/180)*Math.cos(indexControl.directionalLightAngleyz*Math.PI/180);
        dirLightDirection.y = Math.sin(indexControl.directionalLightAnglexy*Math.PI/180)*Math.cos(indexControl.directionalLightAngleyz*Math.PI/180);
        dirLightDirection.z = Math.sin(indexControl.directionalLightAngleyz*Math.PI/180);
        directionalLight.position.copy(dirLightDirection);
    });

    sceneControllerFloder.add(indexControl, 'directionalLightAngleyz', -180, 180).onChange(function(value){
        indexControl.directionalLightAngleyz = value;
        // 通过角度计算单位球坐标
        dirLightDirection.x = Math.cos(indexControl.directionalLightAnglexy*Math.PI/180)*Math.cos(indexControl.directionalLightAngleyz*Math.PI/180);
        dirLightDirection.y = Math.sin(indexControl.directionalLightAnglexy*Math.PI/180)*Math.cos(indexControl.directionalLightAngleyz*Math.PI/180);
        dirLightDirection.z = Math.sin(indexControl.directionalLightAngleyz*Math.PI/180);
        directionalLight.position.copy(dirLightDirection);
    });
  
}

// 初始化渲染器
function initRenderer(){
    renderer.render(scene,camera);
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

}

// 初始化相机
function initCamera(){
    camera.position.set(0,0,5);
}

// 加载天空盒
function loadSkyBox(){
// 使用六面贴图
//cubemap，需要在这个文件夹下放切割好的6个贴图
const path = './textures/SkyBox/Sky01/';
const format = '.png';
const urls = [
	path + 'px' + format, path + 'nx' + format,
	path + 'py' + format, path + 'ny' + format,
	path + 'pz' + format, path + 'nz' + format
];
// 创建一个反射cubeTexture
const reflectionCube = new THREE.CubeTextureLoader().load( urls );
// 把这个天空盒设置为背景
scene.background = reflectionCube;
}

function setRenderPass(){
    // 初始化渲染pass
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );

    // TODO: 修复bloomPass 糊屏问题
    // TODO: 添加SelectiveBloomPass
    
    // 初始化后期处理pass
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    // composer.addPass( bloomPass );
}

function initLight(){
// 添加天光
directionalLight=new THREE.DirectionalLight(0xffffff,1);
directionalLight.position.set(1,1,1);
scene.add(directionalLight);

const directionalLightHelper = new THREE.PointLightHelper( directionalLight, 0.5 );
scene.add( directionalLightHelper );

const axisHelper = new THREE.AxesHelper( 5 );
scene.add( axisHelper );

ambientLight = new THREE.AmbientLight( 0xff00ff, 0.5 );
scene.add( ambientLight );


dirLightColor = directionalLight.color;
 
directionalLight.getWorldDirection(dirLightDirection);



}

