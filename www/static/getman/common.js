// $.ajaxSetup({
//     headers: {
//         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//     }
// });

 //Baidu tongji
 var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?5355caba3fc9511e407d548c7c066f64";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();

//Baidu Push
// (function(){
//     var bp = document.createElement('script');
//     var curProtocol = window.location.protocol.split(':')[0];
//     if (curProtocol === 'https') {
//         bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
//     }
//     else {
//         bp.src = 'http://push.zhanzhang.baidu.com/push.js';
//     }
//     var s = document.getElementsByTagName("script")[0];
//     s.parentNode.insertBefore(bp, s);
// })();

 $("#feedback").click(function () {
     msg = prompt("反馈意见", "");
     if (msg && msg.length > 0) {
         $.get("/feedback", {msg: msg}, function () {});
         _track('feedback', 'msg', msg);
         alert('Thanks!');
     }
 });

//Google
// (function(i, s, o, g, r, a, m) {
    //     i['GoogleAnalyticsObject'] = r;
    //     i[r] = i[r] || function() {
    //         (i[r].q = i[r].q || []).push(arguments)
    //     }, i[r].l = 1 * new Date();
    //     a = s.createElement(o),
    //         m = s.getElementsByTagName(o)[0];
    //     a.async = 1;
    //     a.src = g;
    //     m.parentNode.insertBefore(a, m)
    // })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    // ga('create', 'UA-90623101-1', 'auto');
    // ga('send', 'pageview');