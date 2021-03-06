// layui.config({
//     base: '../../js/' //此处路径请自行处理, 可以使用绝对路径
// }).extend({
//     formSelects: 'formSelects-v4'
// });
layui.use(['form','layer','table','layedit','laydate','upload'],function(){
    var form = layui.form
        layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        table = layui.table,
        $ = layui.jquery;
    

    var fdID=$("#fdID").val();//文章id

    //编辑时初始化赋值
    if (fdID != "") {
        $.ajax({
            url: "../../Pxinfo/GetPxInfo/" + fdID,
            //url:'../../testdata/OneTrains.json',
            dataType: 'json',
            success: function (result) {
                //console.log(result);
                form.val("form-trains", {
                    "fdPXName": result.data.fdPXName
                    //, "fdTeacherID": result.fdTeacherID
                    , "fdClassHours": result.data.fdClassHours
                    , "fdPXType": result.data.fdPXType
                    , "fdNote": result.data.fdNote
                    //, "fdStartTime": result.fdStartTime
                    //, "fdEndTime": result.fdEndTime
                    , "fdSignStartTime": result.data.fdSignStartTime
                    , "fdSignEndTime": result.data.fdSignEndTime
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    } 

    laydate.render({
        elem: '#fdStartTime',
        type: 'datetime'
    });
    laydate.render({
        elem: '#fdEndTime',
        type: 'datetime'
    });
    laydate.render({
        elem: '#fdSignStartTime',
        type: 'datetime'
    });
    laydate.render({
        elem: '#fdSignEndTime',
        type: 'datetime'
    });



    form.on("submit(addTrains)",function(data){
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});

        if(fdID!=""){//编辑
            var newsData=data.field;
            
            alert(JSON.stringify(newsData));
	         $.ajax({
	        	 url: "../../Pxinfo/EditPx",
	        	 //url: "../../DataServer/TreeData.aspx?method=UpdateArticle",
	             type: 'post',
	             dataType: 'json',
	             data: JSON.stringify(newsData),
	             success: function (result) {
	                 //console.log(text);
	            	 if(result.code=="0"){
	            		 top.layer.close(index);
		                 top.layer.msg("培训修改成功！");
		                 parent.layer.closeAll("iframe");
		                 //刷新父页面
		                 parent.layui.table.reload('newsListTable');
	            	 }else{
	            		 //top.layer.close(index);
		                 layer.msg("修改失败，请重试！");
		                 //parent.layer.closeAll("iframe");
		                 //刷新父页面
		                 //parent.layui.table.reload('newsListTable');
	            	 }
	                 
	             },
	             error: function (jqXHR, textStatus, errorThrown) {
	                 top.layer.close(index);
	                 alert(jqXHR.responseText);
	                 layer.closeAll("iframe");
	             }
	         });
        }
        else{

            var trainsData={};
            trainsData["fdID"]=data.field.fdID;
            trainsData["fdPXName"]=data.field.fdPXName;
            trainsData["fdTeacherID"]=data.field.fdTeacherID;
            trainsData["fdClassHours"]=data.field.fdClassHours;
            trainsData["fdPXType"]=data.field.fdPXType;
            trainsData["fdNote"]=data.field.fdNote;
            trainsData["fdStartTime"]=data.field.fdStartTime;
            trainsData["fdEndTime"]=data.field.fdEndTime;
            trainsData["fdSignStartTime"]=data.field.fdSignStartTime;
            trainsData["fdSignEndTime"]=data.field.fdSignEndTime;

            alert(JSON.stringify(trainsData));
            // $.ajax({
            //     url: "../../DataServer/TreeData.aspx?method=SaveArticle",
            //     type: 'post',
            //     data: trainsData,
            //     success: function (text) {
            //         //console.log(text);
            //         top.layer.close(index);
            //         top.layer.msg("文章添加成功！");
            //         parent.layer.closeAll("iframe");
            //         //刷新父页面
            //         parent.layui.table.reload('newsListTable');
            //     },
            //     error: function (jqXHR, textStatus, errorThrown) {
            //         top.layer.close(index);
            //         alert(jqXHR.responseText);
            //         layer.closeAll("iframe");
            //     }
            // });
        }
        
        return false;
    })


})