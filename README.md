##### 使用[https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite) 模板创建

> 之前工作中遇到使用统一的授权平台，然后使用该平台的token去请求其他平台的接口，但是每次都需要手动修改cookie中的domain位localhost，这样就很麻烦，所以就想着能不能写一个插件，然后每次需要获取登录态的时候，就手动点击一下，直接批量修改当前页面的cookie的domain为localhost，然后再去请求其他平台的接口，这样就可以大大提高开发效率。

使用方式：

```shell
pnpm i
```

```shell
pnpm run build
```

然后在chrome浏览器中加载dist目录下的插件即可。注意，插件需要在开发模式下才能加载。

在使用插件的时候，需要在授权页面手动右键呼出菜单点击一下插件的按钮，然后再去请求其他平台的接口。然后就可以启动本地开发服务了。

> 后面陆续会在边学习chrome插件的功能同时添加更多的功能。  不过就是学着玩了。
