基于thinkjs开发的WEB MOCK-SERVER(数据模拟)工具 ,其主要目的是在前后端分离开发时,用于模拟后端返回数据

[English](README.md)


## 功能说明

 - 支持可视化编辑JSON接口数据及接口文档
 
 - 支持GET、POST、PUT、DELETE，SEARCH,等所有请求类型
 
 - 支持RESTful格式路径：如: /a/:user/:id
 
 - 支持指定返回状态码，默认200
 
 - 支持延时返回数据
 
 - 支持mockjs

 - 支持跨域调用项目接口

 - 支持模拟接口与真实接口切换,在切换到真实接口时，能够接收POST,GET,COOKIE等在http header请求的参数
 
 - 支持中英文切换
 
 - 支持客户端 'text/plain' 类型的 POST 提交（postman中 `Body` 选择 `raw`）

## [demo](http://47.93.62.181:8033/)

### demo只作演示作用，并会定期清除数据

欢迎star,并提出改进意见


## Install dependencies

```
npm install
```
## 初始化数据库

1. 使用系统自带初始化数据库功能(推荐)
2. 手动导入数据库文件，并修改数据库配置

```
需要安装mysql[5.7.14], 并导入最新的mockserver.sql 文件
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

- mock-server启动地址： http://127.0.0.1:8033
- 已创建一个接口 :  /api/demo

### 跨域:

**以 jQuery AJAX 为例:**

```
    $.getJSON('http://127.0.0.1:8033/api/demo').done(function(){
    
    
    }).fail(function(){
    
    })

```

### 同域，但API接口与nginx server_name不在同一域名下：

### 假设:
- 你的WEB项目启动地址： http://127.0.0.1:8034
- mock-server启动地址： http://127.0.0.1:8033
- 已创建一个接口 :  /api/demo

```
    server {
            listen 80;
            server_name  www.site.com;
            root your/project/path;
            gzip_static on;
             # 将 /api下所有请求代理到 mock-server
            location ^~ /api {
               proxy_pass http://127.0.0.1:8033;
               break;
        
            }
            location  / {
                proxy_pass http://127.0.0.1:8034;
            }
        
        }
```

### 同域且API接口与项目在同一个域名下：


### 假设:
- 你的WEB项目启动地址： http://127.0.0.1:8034
- Mock-server 启动地址 ： http://127.0.0.1:8033
- 已创建一个接口 :  /api/demo
- /api/demo 的二次代理地址为 : http://www.site.com
- nginx server_name:www.site.com

**nginx config:**

```      
        server {
            listen 80;
            server_name  www.site.com;
            root your/project/path;
            gzip_static on;
             
            location ^~ /api {
                set $is_proxy 0;
                # 如果是从mock-server代理到的请求，则会含有$http_is_mock_server_proxy参数
                if ($http_is_mock_server_proxy){
                    # $http_is_mock_server_proxy is mock-server writed header
                    set $is_proxy $http_is_mock_server_proxy;
        
                }
                # 如果不是从mock-server代理过来的请求
                # 则将 /api目录下所有请求代理到 mock-server服务下
                if ($is_proxy = 0 ){
                    proxy_pass http://127.0.0.1:8033;
                    break;
                }
        
                #当二次代理开启并且 二次代理域名与 [server_name]一样时，
                #请求会选代理到mock-server,然后再代理到nginx，出现循环代理，因此
                #在此处判断如果已经是从mock-server代理过来的请求则不再次代理
                if ($is_proxy = 1 ){
                    add_header http_is_mock_server_proxy "$my_header";
                    proxy_pass http://127.0.0.1:8034;
                    break;
        
                }
            }
            location  / {
                proxy_pass http://127.0.0.1:8034;
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





