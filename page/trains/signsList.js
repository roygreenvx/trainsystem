layui.config({
    base: '../../js/' //此处路径请自行处理, 可以使用绝对路径
}).extend({
    "cookie": 'cookie'
});
layui.use(['form', 'layer', 'laydate', 'table','cookie'], function () {
   var form = layui.form,
       //layer = parent.layer === undefined ? layui.layer : top.layer,
       layer = layui.layer,
       $ = layui.jquery,
       laydate = layui.laydate,
       table = layui.table;

   
//    if((!$.cookie('signusername'))||(!$.cookie('signpassword'))){
//        alert("请登录！");
//        window.top.location.href="../../page/login/login.html";
//    }


   //培训列表
   var tableIns = table.render({
       elem: '#newsList',
       cellMinWidth: 95,
       page : true,
       height : "full-80",
       limit : 20,
       limits: [10, 15, 20, 25],
       loading:true,
       id : "newsListTable",
       //url:'../../Pxinfo/GetPxList',
       url:'../../testdata/LoadSigns.json',
    //    where:{
    //        sSortField: "fdSignStartTime",
    //        bIsDec:true,
    //    },
       request: {
           pageName: 'iStartNum', //页码的参数名称，默认：page
           limitName: 'iPageSize' //每页数据量的参数名，默认：limit
       },
       cols : [[
           {field: 'fdID', title: 'ID', width:60, align:"center"},
           {field: 'fdPXID', title: '培训', width:200},
           { field: 'fdStudentID', title: '学员', align: 'center' },
           {field: 'fdState', title: '签到状态',  align:'center' ,templet:function(d){
               var flag="";
               if(d.fdPXType==1){
                   flag="正常";
               }else if(d.fdPXType==3){
                   flag="审核删除";
               }else {
                   flag="正常";
               }
               return flag;
           }},
           {field: 'fdUpdateTime', title: '签到结束时间', align:'center', minWidth:120},
       ]]
   });

})