
本篇尽可能用简要的文字说明初始化和使用该组件的一个基本流程.

按本篇所属教程操作, 可以快速启动一个可供预览的例子.

在线实例
---

[这里](http://mcr.tool.budblack.me/)运行有一个组件预览的实例, 我们通过它来入门.


引入组件
---

>//mcr.tool.budblack.me/[编译时间戳]/msign.js

现阶段开发期间, 组件不具有稳定版本号. 故而所有部署环境都通过开发版本时间戳发布.

网页中引入指定资源即可.

```html
<script type="text/javascript" src="//mcr.tool.budblack.me/201801282214/msign.js"></script>
```

引入脚本后, 组件会自行在`window`节点下挂载名为`msign`的节点实例. 并将本组件挂载为`msign.mcr`
之后的所有API操作均通过该实例对象`mcr`进行.

准备容器
---

实例化图形组件需要指定一个挂载的dom节点, 该节点在用于初始化图形组件后将会被替换. 

出于排版上的便捷性考虑, 外部功能最好定义两层div, 便于外部工程对初始化完成后的图形组件进行排版.

```html
<div class="fram">
    <div id="mcr"></div>
</div>
```

```css
.fram {
    margin: 64px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    /*border-style: dashed;*/
    /*border-width: 1px;*/
    /*border-color: #0d8ddb;*/
    box-shadow: 0 0 2px #777;
    min-width: 400px;
    min-height: 300px;
    width: calc(100% - 128px);
    height: calc(100% - 128px);
    background: #f0f0f0;
}
```

初始化组件实例
---

上述两个步骤准备完全后, 即可通过一个函数初始化图形组件. 

>在图形实例被创建之前, `mcr`对象仅导出成员方法`create()`.

```javascript
const TIME_SECONDS=5*1000;
window.onload = function () {
if (window.msign && window.msign.mcr) {
let mcr = window.msign.mcr;
  mcr.create('#mcr')
     .then(function (_mcr) {
            window.msign.mcr = mcr = _mcr;
           }
     );
  }
};
```

注意, 这里的例子中把初始化过程放在了`window.onload`的回调当中. 实际项目中视情况自行选择初始化组件的时机.

`mcr.create()`函数返回一个Promise对象. 其回调携带一个引用类型的参数, 指向组件实例. 例子中将实例赋值给全局对象`mcr`, 以备后续使用.

首次载入一些东西
---

外部工程使用图形组件的时候可以通过沙盒模型管理三维场景中的绝大部分元素.

当然, 组件内部是存在各种控制器以及消息传递机制的. 只是, 对于一般项目来说 __简单沙盒模型下的管理能力足够应付大多数业务需求__.

```javascript

// 绘制线条
mcr.sandbox.lines.push(
    {
      title   : 'line_1',
      vertices: [
        { x: 100, z: 200, y: 300 },
        { x: 100, z: 500, y: 400 },
        { x: 200, z: 100, y: 500 },
        { x: 300, z: 100, y: 500 },
        { x: 400, z: 200, y: 300 },
        { x: 400, z: 300, y: 100 }
      ]
    }
);
mcr.sandbox.lines.push(
    {
      title   : 'line_2',
      vertices: [
        { x: 700, z: 400, y: 100 },
        { x: 700, z: 600, y: 200 },
        { x: 700, z: 700, y: 300 },
        { x: 800, z: 700, y: 300 },
        { x: 900, z: 600, y: 200 }
      ]
    }
);


mcr.sandbox.models.push(
      {
        type   : 'gltf',
        urlGltf: '/testModels/gltf_json/test0804.json?_i=' + i,
        option : {
          position: {
            x: 0,
            y: -2200,
            z: 0
          }
        }
      }
  );
```

我们暂时不急着解释`sandbox`这个对象的详细结构. 

现在我们只需要知道它有一个名为`models`的成员, 该成员指代的是场景中 __3D模型元素的集合__ 的映射.

至此我们将可以看到如下效果:

![](https://ws4.sinaimg.cn/large/006tNc79ly1fnxefzgh3tj31kw0wtdr7.jpg)

先这么试试, 应该可以一次性成功.

更多细节, 请参考详尽的[API文档](/guide).
