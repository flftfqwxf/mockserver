Mock-server is a Node.js web system for mock data,and switch between mock data and real data.

[中文文档](README-CN.md)
## Feature

 
  
  - Supports  [jsonEditor](http://jsoneditoronline.org/) 
 
  - Supports method types: GET、POST、PUT、DELETE...
 
  - Allow to specify status code，default:200
 
  - Supports delay to return data
 
  - Supports [Mockjs](http://mockjs.com/)

  - Supports json for cross-domain calls  

  - Supports switch between mock data and real data
 
  - Supports switch between Chinese and English
  


## [demo](http://47.93.62.181:8033/)

### This demo is for demonstration purposes only.The System will clear data regularly



## Install dependencies

```
npm install
```
## Import Mysql file

```
mysql[5.7.14]+,
import mysql file [mockserver-xx-xx.sql]
mysql coifnig in [/src/common/config/db.js]
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

### Suppose:

Server running at http://127.0.0.1:8033

Created a API :  /api/demo

### cross-domain:

**With the jQuery AJAX methods:**

```
    $.getJSON('http://127.0.0.1:8033/api/demo').done(function(){
    
    
    }).fail(function(){
    
    })

```

### Same domain：

**nginx config:**

```
        server {
            listen 80;
            server_name your.site.com;
            root your/project/path;
    
            gzip_static on;
    
            # proxy to mock server
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
Ajax in your.site.com:

```
    $.getJSON('/api/demo').done(function(){
    
    
    }).fail(function(){
    
    })

```



