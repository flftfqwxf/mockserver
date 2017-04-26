基于thinkjs开发的WEB MOCK-SERVER(数据模拟)工具 ,其主要目的是在前后端分离开发时,用于模拟后端返回数据

[English](README.md)

## 功能说明

 ```
 支持可视化编辑JSON接口数据及接口文档
 
 支持GET、POST、PUT、DELETE请求类型
 
 支持指定返回状态码，默认200
 
 支持延时返回数据
 
 支持mockjs

 支持跨域调用项目接口

 支持模拟接口与真实接口切换
 
 支持中英文切换
```

## [demo](http://47.93.62.181:8033/)

### demo只作演示作用，并会定期清除数据

欢迎star,并提出改进意见


## Install dependencies

```
npm install
```
## 导入mysql数据库文件

```
需要安装mysql[5.7.14], 并导入最新的mockserver-xx-xx.sql 文件
修改/src/common/config/db.js中的数据库配置
```
## Config 
``
/src/common/config/config.js
``

## Start server

```
npm start
#Server running at http://127.0.0.1:8033/

```

## Examples

### 假设:

Server running at http://127.0.0.1:8033

已创建一个接口 :  /api/demo

### 跨域:

**以 jQuery AJAX 为例:**

```
    $.getJSON('http://127.0.0.1:8033/api/demo').done(function(){
    
    
    }).fail(function(){
    
    })

```

### 同域：

**nginx config:**

```
        server {
            listen 80;
            server_name your.site.com;
            root your/project/path;
    
            gzip_static on;
    
            # 将 /api目录下所有请求代理到 mock-server服务下
            location ^~ /api {
                proxy_pass http://127.0.0.1:8033;
            }
           
    
            # Attempt to load static files, if not found route to @rootfiles
            location ~ (.+)\.(html|json|txt|js|css|jpg|jpeg|gif|png|svg|ico|eot|otf|woff|woff2|ttf)$ {
                add_header Access-Control-Allow-Origin *;
    
                try_files $uri @rootfiles;
            }
    
            # Check for app route "directories" in the request uri and strip "directories"
            # from request, loading paths relative to root.
            location @rootfiles {
                rewrite ^/(?:foo/bar/baz|foo/bar|foo|tacos)/(.*) /$1 redirect;
            }
        }

```
在[your.site.com]下，就可以同域调用接口:

```
    $.getJSON('/api/demo').done(function(){
    
    
    }).fail(function(){
    
    })

```

## 更新日志：


```
2017-4-25

添加国际化，中英文切换

修改jsoneditor 中文输入BUG


2017-4-11 

有更新，需要重新导入数据库文件

支持跨域调用项目接口

添加header 代理白名单和黑名单

允许自定义项目接口前缀

优化交互体验及BUG

 添加返回状态码
 
 添加延迟返回数据
 
 优化部分验证

```





