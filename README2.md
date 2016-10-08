基于thinkjs开发的WEB MOCK-SERVER(数据模拟)工具 ,其主要目的是在前后端分离开发时,用于模拟后端返回数据

[English](README.md)

##功能说明:

 支持可视化编辑JSON接口数据
 
 目前只有GET和POST经过测试,其他请求类型开发中

 支持局部二次代理(开发过程中某个接口使用模拟数据,当此接口已开发完成后,可将指定接口,通过此服务指向到指定接口上)
 
 
 
 
 ##重点说明:
 
  由于添加的项目作为区分,在请求的接口,强烈建议在所以的AJAX请求中,添加全局的header信息,mock_project_id=【项目ID】,通过此ID来查找对应的全局二次代理的地址,这样,即使mock-server中没有创建某个接口,此服务也会根据项目的【全局二次代理前缀】去访问接口,这样就避免了部分接口事先写好了,但还必须在服务中去创建该接口的麻烦(后缀会添加cookie,query等方式传递mock_project_id),
  **如代理接口未创建,则会默认代理地址为:全局二次代理前缀+接口地址**
 
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

