var mobilelayer=layer;
layui.use(['form','layer','jquery'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
        $ = layui.jquery;

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    var pxid=getUrlParam("id");
    var verifycode=getUrlParam("code");
    var phonenum=getUrlParam("phone");
    $("#phone").val(phonenum);
    
    $(document).ready(function(){
    	$.ajax({
            url: "../../SignWeb/Departments",
            //url:'../../testdata/SignSuccess.json',
            dataType: 'json',
            success: function (result) {
            	if(result){
            		var dept = $("#dept");
                    //删除节点
                    $("#dept option").remove();
                    dept.append("<option value=''>请选择单位(必填)</option>");
                    //重新添加
                    $.each(result, function (i, n) {
                        var opt = $("<option></option>").text(result[i].fdDepartmentName).val(result[i].fdDepartmentID);
                        dept.append(opt);
                    });
                    //重新渲染控件
                    form.render('select');
            	}
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    	
    	$.ajax({
            url: "../../SignWeb/Duties",
            //url:'../../testdata/SignSuccess.json',
            dataType: 'json',
            success: function (result) {
            	if(result){
            		var duty = $("#duty");
                    //删除节点
                    $("#duty option").remove();
                    duty.append("<option value=''>请选择职位(必填)</option>");
                    //重新添加
                    $.each(result, function (i, n) {
                        var opt = $("<option></option>").text(result[i].fdDutyName).val(result[i].fdDutyID);
                        duty.append(opt);
                    });
                    //重新渲染控件
                    form.render('select');
            	}
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });
    })

    //签到按钮
    form.on("submit(sign)",function(data){
        var buttonObject=$(this);
        
        buttonObject.text("提交中...").attr("disabled","disabled").addClass("layui-disabled");
        $.ajax({
            url: "../../SignWeb/Student/SetStudent",
            //url:'../../testdata/SignSuccess.json',
            type:"post",
            dataType: 'json',
            data:{
            	"fdPhoneNum":data.field.phone,
            	"fdStudentName":data.field.username,
            	"fdDepartmentID":data.field.dept,
            	"fdDutyID":data.field.duty,
            	"fdSex":data.field.sex,
            	"pxID":pxid,
            	"sVerityCode":verifycode
            },
            success: function (result) {
                console.log(result);
                if(result){
                    //alert("信息已录入，签到成功！");
                    //location.href="signsuccess.html";
                	mobilelayer.open({
        			  content: '信息已录入，签到成功！',
        			  btn: '确定',
        			  shadeClose: false,
        			  yes: function(){
        				window.location.href="signsuccess.html";
        			  }
        			});
                }
                else{
                	//alert("添加不成功，请重新填写")
                	mobilelayer.open({
          			  content: '添加不成功，请重新填写',
          			  btn: '我知道了',
          			  shadeClose: false,
          			  yes: function(index){
	      				  mobilelayer.close(index);
	      			  }
          			});
                	buttonObject.text("完成").removeAttr("disabled").removeClass("layui-disabled");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });

        return false;
    })

})
