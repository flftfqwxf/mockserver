$(window).load(function(){
    var msg = $.cookie('message');
    if(msg) {
        $.cookie('message', null,{path:'/'});
        var msgs = msg.split('_');
        $.commonTips(msgs[1].replace(/^(\"|\')|(\"|\')$/g, ""), msgs[0].replace(/^(\"|\')|(\"|\')$/g, "")==='true');
    }
});