import * as THREE from 'three';
// 相机控制
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 加载HDR贴图的时候需要使用RGBE加载器
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
// 加载帧率显示工具
import Stats from 'three/addons/libs/stats.module.js';

// 初始化场景
const scene=new THREE.Scene();
// 初始化相机
const camera=new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// 初始化渲染器
const renderer=new THREE.WebGLRenderer({antialias:true});
// 初始化控制器
const controls = new OrbitControls( camera, renderer.domElement );

// 创建性能监视器
const stats = new Stats()

init();
animate();


function init(){
    initCamera();
    initRenderer();
    loadSkyBox();
    initMesh();
    initLight();
    intiStats();
}

function animate() {
	requestAnimationFrame( animate );
    stats.update();
	renderer.render(scene,camera);
}

// 初始化渲染器
function initRenderer(){
    renderer.render(scene,camera);
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled=true;
    document.body.appendChild(renderer.domElement);
}

// 初始化相机
function initCamera(){
    camera.position.set(0,15,5);
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

function initMesh(){
    var planeGeometry=new THREE.PlaneGeometry(60,20);
    var planeMaterial=new THREE.MeshLambertMaterial({
        color: 0xAAAAAA
    });

    var plane=new THREE.Mesh(planeGeometry,planeMaterial);
    plane.rotation.x=-0.5*Math.PI;
    plane.receiveShadow=true;
    scene.add(plane);


    var sphereGeometry=new THREE.SphereGeometry(5);

    var sphere=new THREE.Mesh(sphereGeometry,planeMaterial);
    sphere.position.set(10,5,0)
    sphere.castShadow=true;
    scene.add(sphere);
}
function initLight(){
    // 环境光
    var spotLight=new THREE.SpotLight(0xFFFFFF);
    // 设置光源位置
    spotLight.position.set(-40,40,15);
    
    spotLight.castShadow = true;
    spotLight.shadow.mapSize= new THREE.Vector2(1024,1024);
    spotLight.shadow.camera.far=130;
    spotLight.shadow.camera.near=40;
    scene.add(spotLight);
}

function intiStats(type){
// 设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
stats.setMode(0)

// 设置监视器位置
stats.domElement.style.position = 'absolute'
stats.domElement.style.left = '0px'
stats.domElement.style.top = '0px'

// 将监视器添加到页面中
document.body.appendChild(stats.domElement)
}