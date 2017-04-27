Mock-server is a Node.js web system for mock data,and switch between mock data and real data.

[中文文档](README-CN.md)
## Features

 
  
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

- Server running at http://127.0.0.1:8033
- Created a API :  /api/demo

### cross-domain:

**With the jQuery AJAX methods:**

```
    $.getJSON('http://127.0.0.1:8033/api/demo').done(function(){
    
    
    }).fail(function(){
    
    })

```

### Same domain and mock-server proxy URL different with nginx server_name：

### Suppose:

- Server running at http://127.0.0.1:8033
- Created a API :  /api/demo

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


### Same domain and mock-server proxy URL equals nginx server_name：

### Suppose:

- Your Web Server running at http://127.0.0.1:8034
- Mock Server running at http://127.0.0.1:8033
- Created a API :  /api/demo
- Proxy URL value : http://www.site.com
- Nginx server_name : www.site.com

**nginx config:**

```
        server {
                   listen 80;
                   server_name  www.site.com;
                   root your/project/path;
                   gzip_static on;
                    
                   location ^~ /api {
                       set $is_proxy 0;
                       # $http_is_mock_server_proxy comes from mock-server when mock-server's proxy is opened
                       if ($http_is_mock_server_proxy){
                           # $http_is_mock_server_proxy is mock-server writed header
                           set $is_proxy $http_is_mock_server_proxy;
               
                       }
                       # $is_proxy
                       # nginx proxy to mock-server
                       if ($is_proxy = 0 ){
                           proxy_pass http://127.0.0.1:8033;
                           break;
                       }
               
                       #Avoid circular proxy
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

 **Ajax in your.site.com:**

```
    $.getJSON('/api/demo').done(function(){
    
    
    }).fail(function(){
    
    })

```



