// layui.config({
//     base: '../../js/' //此处路径请自行处理, 可以使用绝对路径
// }).extend({
//     tableSelect: 'tableSelect',
//     formSelects: 'formSelects-v4',
//     cascader: 'cascader'
// });
layui.use(['form', 'layer', 'laydate', 'table'], function () {
    var form = layui.form,
        //layer = parent.layer === undefined ? layui.layer : top.layer,
        layer = layui.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;

    $(document).ready(function(){
        //AreaCity_load();//加载地区选项
        //BackUserload();//加载编辑人员选项
    })

    var qrcodeinit = new QRCode("qrcodepic");

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
        url:'../../testdata/LoadTrains.json',
        cols : [[
            // {type: "checkbox", fixed:"left", width:50},
            {title: '操作',width:130, templet:'#newsListBar',fixed:"left",align:"center"},
            {field: 'fdid', title: 'ID', width:60, align:"center"},
            {field: 'fdPXName', title: '名称', width:200},
            { field: 'fdClassHours', title: '学时', align: 'center' },
            {field: 'fdStartTime', title: '开始时间', align:'center', minWidth:110},
            {field: 'fdEndTime', title: '结束时间', align:'center', minWidth:110},
            {field: 'fdSignStartTime', title: '签到开始时间', align:'center', minWidth:120},
            {field: 'fdSignEndTime', title: '签到结束时间', align:'center', minWidth:120},
            {field: 'fdPXType', title: '培训类型',  align:'center' ,templet:function(d){
                var flag="";
                if(d.fdPXType=='1'){
                    flag="普通培训";
                }else if(d.fdPXType=='2'){
                    flag="委外培训";
                }else {
                    flag="未设置";
                }
                return flag;
            }},
            {field: 'fdApproveFlag', title: '审核',  align:'center',templet:function(d){
                var flag="";
                if(d.fdapproveflag=='1'){
                    flag="未审核";
                }else if(d.fdapproveflag=='2'){
                    flag="审核通过";
                }else if(d.fdapproveflag=='3'){
                    flag="审核未通过";
                }else {
                    flag="未审核";
                }
                return flag;
            }},
            {field: 'fdState', title: '状态',  align:'center',templet:function(d){
                var flag="";
                if(d.fdState=='1'){
                    flag="正常";
                }else if(d.fdState=='2'){
                    flag="删除";
                }else if(d.fdState=='3'){
                    flag="删除";
                }else {
                    flag="正常";
                }
                return flag;
            }},
            { field: 'fdNote', title: '备注', align: 'center'},
        ]]
    });

     //列表操作
     table.on('tool(newsList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            addNews(data);
        } else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此文章？',{icon:3, title:'提示信息'},function(index){
                // $.get("删除文章接口",{
                //     newsId : data.newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                    tableIns.reload();
                    layer.close(index);
                // })
            });
        } else if(layEvent === 'look'){ //预览
            qrcodeinit.makeCode("https://www.baidu.com/s?wd="+data.fdid);

            layui.layer.open({
                type: 1,
                title: false,
                content: $("#div-qrcode")
            });
        }
    });
    
    laydate.render({
        elem: '#select-fdStartTime'
    });

    laydate.render({
        elem: '#select-fdEndTime'
    });

    //搜索
    $(".search_btn").on("click",function(){
        // if($(".searchVal").val() != ''){
        
        //地区选项
        var CityCode = '';
        var codesheng = $(".select-sheng").val();
        var codeshi = $(".select-shi").val();
        var codequxian = $(".select-quxian").val();
        if (codequxian != null && codequxian != "") {
            CityCode = codequxian;
        }
        else {
            if (codeshi != null && codeshi != "") {
                if(codeshi=="0")
                {
                    CityCode=codesheng+"|0";
                }
                else
                {
                    CityCode = codeshi;
                }
            }
            else {
                if (codesheng != null && codesheng != "") {
                    CityCode = codesheng;
                }
            }
        }

        table.reload("newsListTable",{
            //url: '../../DataServer/TreeData.aspx?method=SearchNews',
            loading: true,
            url:'../../testdata/LoadTrains.json',
            where:{
                //fdnodeid: 'f729396dac5a48e9bf289d4d1a85eab3',
                key: $(".searchVal").val(),
                fdnodeid:$("#select-tree").attr('fdnodeid'),
                CityCode:CityCode,
                ZHongYao:$(".select-zhengfumian").val(),
                fdaproveflag_slt:$(".select-fdapproveflag").val(),
                selectInChannel:$(".select-inchannel").val(),
                SelectInSubProject:$(".select-insubproject").val(),
                SelectType:$(".select-type").val(),
                infosource:$("#select-infosource").val(),
                editor:$(".select-editor").val(),
                approver: $(".select-approver").val(),
                timetype: $(".select-timetype").val(),
                tfdpublishtimebegin:$("#select-tfdpublishtimebegin").val(),
                tfdpublishtimeend:$("#select-tfdpublishtimeend").val(),
                sortOrder:'',
                isPriorityQueryInfoSources:true,
            },
            page: {
                curr: 1 //重新从第 1 页开始
            },
        })
        // }else{
        //     layer.msg("请输入搜索的内容");
        // }
    });


    //添加文章
    function addNews(edit) {
        var index = layer.open({
            title: "添加培训",
            type: 2,
            content: "trainsAdd.html",
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                if (edit) {
                    body.find("#fdid").val(edit.fdid);
                    // body.find(".newsName").val(edit.newsName);
                    // body.find(".abstract").val(edit.abstract);
                    // body.find(".thumbImg").attr("src",edit.newsImg);
                    // body.find("#news_content").val(edit.content);
                    // body.find(".newsStatus select").val(edit.newsStatus);
                    // body.find(".openness input[name='openness'][title='"+edit.newsLook+"']").prop("checked","checked");
                    // body.find(".newsTop input[name='newsTop']").prop("checked",edit.newsTop);
                    // form.render();
                }
                setTimeout(function () {
                    layer.tips('点击此处返回培训列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            },

        })
        layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layer.full(index);
        })
    }
    $(".addNews_btn").click(function () {
        addNews();
    })

    
    

    

   

})