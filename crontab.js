
crontab=require('node-crontab')
let fn = () => {
    //定时任务具体逻辑
    //调用一个 Action
    console.log('this is task');
    // think.http('/home/image/spider', true); //模拟访问 /home/image/spier
}
// 1 小时执行一次
let jobId = crontab.scheduleJob('* * * * *', fn);
//开发环境下立即执行一次看效果
// if(think.env === 'development'){
//     fn();
// }