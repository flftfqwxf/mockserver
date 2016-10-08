基于thinkjs开发的WEB MOCK-SERVER(数据模拟)工具 ,其主要目的是在前后端分离开发时,用于模拟后端返回数据

[English](README.md)

##功能说明:

 支持可视化编辑JSON接口数据
 
 目前只有GET和POST经过测试,其他请求类型开发中

 支持局部二次代理(开发过程中某个接口使用模拟数据,当此接口已开发完成后,可将指定接口,通过此服务指向到指定接口上)
 
 **如代理接口未创建,则会默认代理地址为:项目代理前缀+接口地址**
 
 
如有问题,欢迎提issue

##未来功能:
 
 支持mockjs(开发中)
 
 数据结构模板
 
 复制等功能



## Install dependencies

```
npm install
```

## Start server

```
npm start
```

#### 需要安装mysql数据,并导入最新的mockserver-xx-xx.sql 文件

