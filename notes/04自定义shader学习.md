# 创建材质时使用自定义shader
threejs中使用shader比较繁琐。
首先需要创建一个RawShaderMaterial
```js
const material=new THREE.RawShaderMaterial(
    {
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib.common,
            {
                color: { value: new THREE.Color(0xff0000) },
            }
        ]),
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    }
```
依次解释：

首先我们看vertexShader和fragmentShader。

这两就是我们主要写shader的地方，可以直接通过字符串的方式传给vertexShader，但是那样shader文件就和js脚本混在一起了，所以我希望通过引用的方式使用shader。

uniforms是传入shader的参数，因为需要使用例如color,Obj2WorldMatrix,等参数，我们需要使用uniforms传参。这个类似unity shaderlab的`vertexPos:postion`。

# 创建vertex和fragment文件
为了方便编写shader，把vertexshader和fragmentshader分别放到一个文件夹中,并且我们需要创建的是`.js`格式文件而不是`.glsl`，这是因为需要把写好的shader文件作为一个const常量导出，这样可以在其他js脚本中直接import。

vertexShader.js
```js
const vertexShader = /*glsl*/ `
    attribute vec3 position;

   
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    void main() {
        gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export default vertexShader;

```
fragmentshader和vertexShader同理。

## 代码高亮
因为创建的是`.js`文件而不是`.glsl`文件，所以只会有js的代码高亮，为了引用glsl的代码高亮，我们需要使用`Comment target templates`插件帮助我们代码高亮。

在`vertexShader`的=后面` /*glsl*/`就是标明后面的语句是glsl语句，就可以正确显示代码高亮了。

# threejs shader说明
## 参数

### attribute变量
首先是在vertexShader里会用到的各种变量，例如 `position`,`normal`,`uv`这些变量，在threejs中是可以自动帮我们传给shader的，但是名称必须要一致。

attribute变量是传给vertexShader的，只能在vertexShader中使用。

在Three.js中，如果你创建一个Geometry或BufferGeometry，并将其添加到Mesh对象中，那么Three.js会自动将这些几何体属性绑定到相应的着色器变量中。

具体来说，当你在vertexShader中声明了一个attribute变量，比如在vertexShader代码中的`attribute vec3 position;`，如果你使用BufferGeometry对象来存储顶点属性数据并将其添加到Mesh中，Three.js会自动将BufferGeometry对象中的'position'属性绑定到着色器中的attribute变量'position'上。

我们随意创建一个Mesh然后`console.log`出来看一下。
```js
const cube=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xff0000}));
scene.add(cube);
console.log(cube);
```

![image.png](https://s2.loli.net/2023/02/16/jpkMdfZUyhcqmYF.png)
可以看到这里mesh下的geometry属性下有attribute属性，Threejs就会自动把这些attribute属性赋值给shader里定义的**同名attribute变量**。

### uniforms变量
这个是对于vertexShader和fragmentShader的全局变量，但是需要手动定义。

threejs也提供一些内置的uniform变量。

- modelViewMatrix：用于将顶点从模型空间转换到摄像机空间。
- projectionMatrix：用于将摄像机空间的顶点转换为裁剪空间中的坐标。

具体内置的变量在官方文档： https://threejs.org/docs/index.html#api/zh/renderers/webgl/WebGLProgram



## 使用GUI调参
对于一些shader参数我们希望在运行的时候动态修改，所以需要使用GUI动态修改。

```js
// 使用GUI库
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
// 初始化参数控制器
const indexControl = new function() {
    this.color = 0xffffff;
}
//
// 初始化GUI
const gui = new GUI();

const modelControllerFloder = gui.addFolder('ModelController');

//添加color到GUI同时在值变动的时候修改shader里的color参数
modelControllerFloder.addColor(indexControl, 'color').onChange(function(value){
    indexControl.color = value;
    material.uniforms.color.value=new THREE.Color(indexControl.color);
});
```

# 参考
Three.js着色器——矩阵变换： < http://www.yanhuangxueyuan.com/Three.js_course/advanced/shader2.html >

自定义shader：< https://csantosbh.wordpress.com/2014/01/09/custom-shaders-with-three-js-uniforms-textures-and-lighting/ >
