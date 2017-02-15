## 常见问题

###如何模拟及二次代理带有登录验证的数据

**在实际开发中，许多数据接口是需要权限验证的(比如登录用户访问用户中心)，在mock-server中，设置说明：**

以用户登录后为例：通常情况下：比如用户登录。用户登录后，会在客户端记录COOKIE，以后所有请求，都会通过HEADER头信息发磅到服务端，服务端通过COOKIE来验证用户登录。

而我们需要作的就是在请求头信息上加上此COOKIE信息，并传递到服务端：

###客户端：

1.你登录后，服务端一般会返回一个COOKIE，假如为:

```
    cookieAuthorization：xxxx1
```

2.在进入页面时，将cookie缓存起来，并在AJAX请求时，自定义header字段：adminAuthorization：cookieAuthorization，比如jquery，全局设置所有的AJAX请求都将这个header字段传递给后端(此处应该是mock-server服务)。

```
    $.ajaxSetup({
        beforeSend: function(xhr) {
            if (adminAuthorization) {
                xhr.setRequestHeader('AdminAuthorization', adminAuthorization);
            }
        }
    });

```
###mock-server 系统设置：

1.开启二次代理功能（完整使用说明请查看）

2..在系统设置中（推荐），设置二次代理中，被传递到真实服务端的HEADER字段名，此处为AdminAuthorization，设置后，mock-server将会在请求API时，检查HEADER信息中是否有该字段，如果存在就会被再次传递给二次代理的接口

###服务端：

让后端通过这个AdminAuthorization字段来验证是否是登录