threejs对比Unity添加天空盒要明显费劲许多。

因为天空盒一般有两种，第一种是六面体组成的天空盒，另一种是经纬映射贴图，两种的导入方法不太一致。

# 六面体天空盒
案例中的写法是这样的，需要准备6张单独的贴图。

px：x轴正向，nx：x轴负向 以此类推。

如果想用全景贴图转换六面体贴图可以使用这个网站：<https://matheowis.github.io/HDRI-to-CubeMap/>

```js
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
```
# 经纬映射贴图
```js
// 加载HDR贴图的时候需要使用RGBE加载器
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
// 加载HDR贴图
const rgbeLoader = new RGBELoader();
// 异步加载，不用异步会出错
rgbeLoader.loadAsync("./textures/SkyBox/indoor/SkyCube.hdr").then((HDRtexture) => {
    // 等距圆柱投影的环境贴图，也被叫做经纬线映射贴图
    HDRtexture.mapping = THREE.EquirectangularReflectionMapping
    // 设置背景图
    scene.background = HDRtexture
    // 设置默认环境
    scene.environment = HDRtexture
});
// 因为使用了hdr在不支持hdr的显示器上需要使用toneMapping
// 色调映射属性.toneMapping用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围(HDR)效果
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 色调映射的曝光级别。默认是1,曝光度值越大，图像亮度越高
// 可以尝试不同值去测试显示效果 比如0:看不到  0.1:很暗  200:过于亮，轮廓感不清楚
renderer.toneMappingExposure = 2;
//是否乘以gamma输出，默认值false
renderer.gammaOutput = true;
```
