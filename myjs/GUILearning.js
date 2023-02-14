import * as THREE from 'three';
// 相机控制
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 加载obj
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
// GUI
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

let object;
// 初始化GUI控制器
const indexControl = new function() {
    this.speed = 0.01;
    this.moveRange = 0.1;
    this.color = 0xffffff;

}
// 初始化GUI
const gui = new GUI();
// 初始化场景
const scene=new THREE.Scene();
// 初始化相机
const camera=new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// 初始化渲染器
const renderer=new THREE.WebGLRenderer({antialias:true});
// 初始化控制器
const controls = new OrbitControls( camera, renderer.domElement );
// 使用加载管理器管理模型加载
const manager = new THREE.LoadingManager( loadModel );
// 初始化OBJLoader
const objLoader = new OBJLoader(manager);

const time=new THREE.Clock();

let upSpeed=0;

init();
loadModels();
animate();


function init(){
    initCamera();
    initRenderer();
    loadSkyBox();
    initGUI();
}
function modelUpdate(){
    object.traverse( function ( child ) {
        if ( child.isMesh ) child.material.color.setHex(indexControl.color);
    } );
    upSpeed += indexControl.speed;
    object.position.y = indexControl.moveRange*Math.sin(upSpeed);
	
}

function loadModel() {

    object.traverse( function ( child ) {

        if ( child.isMesh ) child.material=new THREE.MeshPhongMaterial();
      
    } );

    object.position.x = 0;
    scene.add( object );

}

function loadModels(){
    var remainingModelsCount=1;
   // bunny
    objLoader.load(
        // resource URL
        './models/bunny.obj',
        // called when resource is loaded
        function ( obj ) {
            object=obj;
            
        },
        // called when loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
    
        }
    );
    
}

function modelsLoaded(remainingModelsCount){
    remainingModelsCount--;
    if(remainingModelsCount == 0){

    }
}

function animate() {
	requestAnimationFrame( animate );
    modelUpdate();
    renderer.render(scene,camera);
}
// 初始化GUI
function initGUI(){
    // 添加控制参数
    gui.add(indexControl, 'speed', 0, 0.1);
    gui.add(indexControl, 'speed', { Slow: 0.01, Normal: 0.05, Fast: 0.1 } );
    gui.add(indexControl, 'moveRange', 0, 1);
    gui.addColor(indexControl, 'color');
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
// 添加天光
const dirLight=new THREE.DirectionalLight(0xffffff,1);
dirLight.position.set(1,1,1);
scene.add(dirLight);
}


