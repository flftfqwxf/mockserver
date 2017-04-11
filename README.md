基于thinkjs开发的WEB MOCK-SERVER(数据模拟)工具 ,其主要目的是在前后端分离开发时,用于模拟后端返回数据

欢迎star,并提出改进意见


## 更新日志：


```
2017-4-11 有更新，需要重新导入数据库文件
```
## Install dependencies

```
npm install
```
##导入mysql数据库文件

```
需要安装mysql[5.7.14], 并导入最新的mockserver-xx-xx.sql 文件
修改/src/common/config/db.js中的数据库配置
```
## Start server

```
npm start
```
## 功能说明

 ```
 支持可视化编辑JSON接口数据及接口文档
 
 支持GET、POST、PUT、DELETE请求类型
 
 支持指定返回状态码，默认200
 
 支持延时返回数据
 
 支持mockjs

 支持跨域调用项目接口

 支持单个接口代理到真实服务器(开发过程中某个接口使用模拟数据,当此接口已开发完成后,可将指定接口,通过此服务指向到真实接口上)
```

## 常见问题

[如何模拟及二次代理带有登录验证的数据](question.md)

## 开发中功能：

```
 
 支持类似【postman】接口测试功能
```

## 更新日志：

 ```
添加返回状态码

添加延迟返回数据

优化部分验证
 ```
 
 <img src="http://upload-images.jianshu.io/upload_images/1347474-c11919590cc6c1a8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" >


# 如图所示，大致包含了以下功能：

## 选择项目、接口名称、接口地址：

 <img src="http://upload-images.jianshu.io/upload_images/1347474-a5c23d82ff208684.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-a5c23d82ff208684.png?imageMogr2/auto-orient/strip" data-image-slug="a5c23d82ff208684" data-width="1064" data-height="243" class="imagebubble-image">



 ```
 （注意：所以接口都强制了[API]前缀，这个是为了规范接口，后期如有需要可以改为可配置）

 接口请求类型：PUT、POST、GET、DELETE
```

## 匹配方式：分为全地址匹配和部分匹配


<img src="http://upload-images.jianshu.io/upload_images/1347474-6d75a15f17eb648e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-6d75a15f17eb648e.png?imageMogr2/auto-orient/strip" data-image-slug="6d75a15f17eb648e" data-width="1073" data-height="87" class="imagebubble-image">



 ```
 有些时候，你的请求地址的参数是动态的，比如分页【http:192.168.0.2/a?page=1】,
 这个时候的路径匹配就不能全路径匹配，而是只需要匹配【？】前部分
 ```

## 请求参数及请求参数说明：

<img src="http://upload-images.jianshu.io/upload_images/1347474-ff953ef1964c7d84.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-ff953ef1964c7d84.png?imageMogr2/auto-orient/strip" data-image-slug="ff953ef1964c7d84" data-width="997" data-height="552" class="imagebubble-image">

 ```
 添加了可视化的JSON编辑器，方便查看，也可验证数据格式正确性
```

## 二次代理设置

 <img src="http://upload-images.jianshu.io/upload_images/1347474-3342a3771d0c2a40.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-3342a3771d0c2a40.png?imageMogr2/auto-orient/strip" data-image-slug="3342a3771d0c2a40" data-width="1152" data-height="215" class="imagebubble-image">


**在实际开发中，我们常常会遇到这种情况，在开发的前期，数据接口的数据是模拟的，
 但是开发到了中后期，部分真实的接口已经开发好，就需要以真实的数据来测试，
 在以前只能将整个mock-server服务切换到真实的接口服务上，但是这样存在一个问题，
 就是如果在项目中期，部分接口完成了，部分接口没完成，就比较麻烦，
 此功能就是指定某个接口去访问真实的接口的方法。**
 
 ```
 二次代理是指将本来代理到mock-server系统的接口，再次代理到其他的服务上

 二次代理前缀：是指将此接口的域名指向到你想指向的地址
```
 **举例说明**

 ```
 开发中:

 1)某个AJAX服务,需要模拟,通过NGINX或其他方法将 [http://127.0.0.1/api]下所有请求,全部指向到本系统,

 并假定本系统启动后的地址为【http://127.0.0.1:8083】.

 2)当访问[http://127.0.0.1/api/a.json]时,实际会代理到【http://127.0.0.1:8083/api/a.json】

 3)当访问时,系统会在数据库查询到该接口,并返回模拟数据

 某个接口的真实完成后:

 同样是第三步,可以通过开启二次代理,将请求再次代理到真实的接口上,以此达到更灵活在模拟数据和真实数据切换目的

 如:

 原本被代理到【http://127.0.0.1:8083/api/a.json】返回的数据,

 通过设置二次代理为【http://192.168.0.1:8083】,则会返回

 【http://192.168.0.1:8083/api/a.json】

 而为了更灵活的设置二次代理:

 分别开发了,全站级二次代理、项目级二次代理、单个接口的二次代理

 权重为全站级二次代理 <项目级二次代理 <单个接口的二次代理
 
```

```
 注意：如果开启了二次代理，在返回接口的最后一个字段将为[proxyDataSource],
 值为你实际请求的接口完整地址，以方便实际使用中，知道自己是访问的模拟数据，还是真实数据
```

## 接口返回值及参数说明:

<img src="http://upload-images.jianshu.io/upload_images/1347474-299c062b72462c64.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-299c062b72462c64.png?imageMogr2/auto-orient/strip" data-image-slug="299c062b72462c64" data-width="1072" data-height="581" class="imagebubble-image">

<img src="http://upload-images.jianshu.io/upload_images/1347474-b940b977fbfb2d12.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-b940b977fbfb2d12.png?imageMogr2/auto-orient/strip" data-image-slug="b940b977fbfb2d12" data-width="1052" data-height="590" class="imagebubble-image">


 ```
 你可以通过点击从【从二次代理中获取数据,并填充,保存后生效】从你设置的二次代理中获取到真实数据，
 达到类似postman验证数据接口正确性的功能
 ```
## 开启mockjs:

<img src="http://upload-images.jianshu.io/upload_images/1347474-8e72fad775f67b5b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-8e72fad775f67b5b.png?imageMogr2/auto-orient/strip" data-image-slug="8e72fad775f67b5b" data-width="1164" data-height="78" class="imagebubble-image">

```
 同时，为了更好的模拟数据，整合了mockjs，mockjs官网
```

## header头信息返回数据：

<img src="http://upload-images.jianshu.io/upload_images/1347474-08217d0d4e58f0a7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-08217d0d4e58f0a7.png?imageMogr2/auto-orient/strip" data-image-slug="08217d0d4e58f0a7" data-width="1122" data-height="582" class="imagebubble-image">

```
 除了返回json外，有些时候还需要返回一些特定的header信息，如登录的token验证
 如此一个模拟数据基本成型.
```

## 接口列表：

<img src="http://upload-images.jianshu.io/upload_images/1347474-479bc64316bc03cd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-479bc64316bc03cd.png?imageMogr2/auto-orient/strip" data-image-slug="479bc64316bc03cd" data-width="1200" data-height="557" class="imagebubble-image">


 ```
 提供搜索、复制、快速开启关闭二次代理功能，点击接口可以直接查看接口返回内容
 ```



## 全局设置：




 全局二次代理前缀：


 <img src="http://upload-images.jianshu.io/upload_images/1347474-878a55a81a6c1253.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-878a55a81a6c1253.png?imageMogr2/auto-orient/strip" data-image-slug="878a55a81a6c1253" data-width="1121" data-height="85" class="imagebubble-image">

```
 前面已讲过作用，此处是设置一个全局二次代理，当你在项目或添加接口时没有二次代理时，就会使用此二次
 代理（强烈建议设置，因为当你访问一个在本系统中根本没有定义的接口时，如果设置了此项，系统依然会将
 你访问的接口代理到此处设置的服务上，这对于一些老接口非常有用，不用在此系统上，将老接口在此系统上
 再定义一遍，当然从文档记录上讲，再定义一遍，作为接口的文档记录是可取的）
 ```

## header头信息设置：

<img src="http://upload-images.jianshu.io/upload_images/1347474-f85cc043e9dba29f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-f85cc043e9dba29f.png?imageMogr2/auto-orient/strip" data-image-slug="f85cc043e9dba29f" data-width="1103" data-height="312" class="imagebubble-image">

```
 在某些时候，AJAX请求的头信息中需要传递一些特殊字段，如：当发起一个AJAX请求，请求的header中带有【Authorization】字段，用于验证用户权限，此处就是用于设置当存在这些header字段时，需要传递到真实的server端，主要是二次代理开启后使用：

 举例说明：

 1）从客户端发起请求【http://192.168.1.2/a.json】,header信息中带有【Authorization】字段，用于在服务端验证用户权限

 2）代理到本系统，并该接口开启了二次代理，为了正确的获取到数据，本系统就会将全局header设置里去查找是否有【Authorization】字段，当存在该字段并且客户端传过来的header信息中有值时，就会传给二次代理的接口，并返回数据，如果不传此header信息，从真实的接口处，由于无法验证用户权限就无法返回正确数据

 为什么不把所有头信息都完整复制后传过去？

 这确实是一种方案，这样就不用去单独去设置，但是在此前的实践中，发现完全把客户端的头信息传递给二次代理，有时候会发现服务端无法返回正确数据，查了相关资料，原因可能是:http信息的传递是有顺序的，当通过循环将HEADER信息传递给 真实服务时，可能服务端无法返回正确数据，如果哪位有解决方案，可以告之，谢谢。
 ```

# 项目管理：


## 添加/修改项目

<img src="http://upload-images.jianshu.io/upload_images/1347474-79e30cef7dc25873.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-79e30cef7dc25873.png?imageMogr2/auto-orient/strip" data-image-slug="79e30cef7dc25873" data-width="1167" data-height="284" class="imagebubble-image">

```
 主要用于在不同项目中作区分管理
 ```
## 项目列表：

<img src="http://upload-images.jianshu.io/upload_images/1347474-7ab45e9703e10cfd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" data-original-src="http://upload-images.jianshu.io/upload_images/1347474-7ab45e9703e10cfd.png?imageMogr2/auto-orient/strip" data-image-slug="7ab45e9703e10cfd" data-width="1196" data-height="306" class="imagebubble-image">


 
 

 





