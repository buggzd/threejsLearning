import * as THREE from 'three';
// 相机控制
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 加载obj
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
// GUI
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
// shader
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { MaskPass } from "three/addons/postprocessing/MaskPass.js";
// copyshader
import { CopyShader } from "three/addons/shaders/CopyShader.js";

// filmshader
import { FilmShader } from "three/addons/shaders/FilmShader.js";
// filmpass
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
// 自定义shader
import vertexShader from '../myshader/test01/vertexShader.js';
import fragmentShader from '../myshader/test01/fragmentShader.js';

let object;
// 初始化GUI控制器
const indexControl = new function() {
    // object属性
    this.speed = 0.01;
    this.moveRange = 0.1;
    // shader属性
    this.color = 0xffffff;
    // 场景属性
    this.ambientLightColor = 0xffffff;

}
// 初始化GUI
const gui = new GUI();
// 初始化场景
const scene=new THREE.Scene();
// 初始化相机
const camera=new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// 初始化渲染器
const renderer=new THREE.WebGLRenderer({antialias:true});
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
    }
}

// 加载模型
function loadModel() {
    

    object.traverse( function ( child ) {

        if ( child.isMesh ) {
            child.material=new THREE.RawShaderMaterial(
            {
                // 设置uniforms变量，因为需要引用光照uniforms，所以需要使用merge合并
                uniforms: THREE.UniformsUtils.merge([
                   
                    // 引用光照uniforms
                    THREE.UniformsLib.lights,
                    {
                        // 自定义uniforms
                        // 基础颜色
                        color: { value: new THREE.Color(0xff0000) },
                        
                        diffuse: { value: 0.5 },
                        specular: { value: 0.5 },
                        glossiness: { value: 100 },
                    }
                ]),
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                lights: true,
            }
        );
            console.log(child);
        }
    } );

    object.position.x = 0;
    scene.add( object );

}

function loadModels(){
    const cube=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshPhongMaterial({color:0xffffff}));
    cube.position.y=-1;
    scene.add(cube);

    console.log(THREE.UniformsLib);
    var remainingModelsCount=1;
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
    modelControllerFloder.add(indexControl, 'speed', { Slow: 0.01, Normal: 0.05, Fast: 0.1 } );
    modelControllerFloder.add(indexControl, 'moveRange', 0, 1);
    modelControllerFloder.addColor(indexControl, 'color').onChange(function(value){
        indexControl.color = value;

        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.uniforms.color.value=new THREE.Color(indexControl.color);
        } );
    });

    const sceneControllerFloder = gui.addFolder('SceneController');
    sceneControllerFloder.addColor(indexControl, 'ambientLightColor').onChange(function(value){
        indexControl.ambientLightColor = value;
        ambientLight.color = new THREE.Color(indexControl.ambientLightColor);
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
    // 初始化filmPass
    // const filmPass = new FilmPass( 0.35, 0.025, 648, false );
    // filmPass.renderToScreen = true;
    // composer.addPass( filmPass );
}

function initLight(){
// 添加天光
directionalLight=new THREE.DirectionalLight(0xffffff,1);
directionalLight.position.set(1,1,1);
scene.add(directionalLight);
ambientLight = new THREE.AmbientLight( 0xff00ff, 0.5 );
scene.add( ambientLight );


dirLightColor = directionalLight.color;
 
directionalLight.getWorldDirection(dirLightDirection);

}

