var mobilelayer=layer;
layui.use(['form','jquery'],function(){
    var form = layui.form,
        //layer = parent.layer === undefined ? layui.layer : top.layer
        $ = layui.jquery;

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    var pxid=getUrlParam("id");
    
    if(!pxid){
    	mobilelayer.open({
		  content: '课程信息读取失败，请重试',
		  btn: '我知道了',
		  shadeClose: false,
		  yes: function(){
			  window.location.href="signtime.html";
		  }
		});
    	//alert("课程信息读取失败，请重试");
		//window.location.href="signtime.html";
    }else{
    	$(document).ready(function(){
        	$.ajax({
                url: "../../SignWeb/SignValid/" + pxid,
                //url:'../../testdata/SignSuccess.json',
                dataType: 'json',
                success: function (result) {
                	if(!result){
                		mobilelayer.open({
            			  content: '当前时间不在该课程签到时间内，不可签到',
            			  btn: '我知道了',
            			  shadeClose: false,
            			  yes: function(){
            				  window.location.href="signtime.html";
            			  }
            			});
                		//alert("当前时间不在该课程签到时间内，不可签到");
                		//window.location.href="signtime.html";
                	}
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText);
                }
            });
        })
    }
    
    
    $("#sendSMS").on("click",function(){
        var phonenum = $("#phone").val();
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(phonenum))){ 
            //alert("手机号码有误，请重填!");
        	mobilelayer.open({
  			  content: '手机号码有误，请重填!',
  			  btn: '我知道了',
  			  shadeClose: false,
  			  yes: function(index){
				  mobilelayer.close(index);
			  }
  			});
            return false; 
        }
        var time=30;
        var button=$("#sendSMS");
        button.attr("disabled","disabled").addClass("layui-disabled");
        $.ajax({
            url: "../../SignWeb/MessageSend/" + phonenum,
            //url:'../../testdata/SignSuccess.json',
            //dataType: 'json',
            success: function (result) {
            	result=decodeURI(result);
            	if(result=="OK"){
            		var t=setInterval(function() {
                        time--;
                        button.text(time+"s");
                        if (time==0) {
                            clearInterval(t);
                            button.text("重新发送").removeAttr("disabled").removeClass("layui-disabled");
                        }
                    },1000)
            	}
            	else if(result=="验证码超出同模板同号码天发送上限"){
            		mobilelayer.open({
            			  content: '该号码超出当天发送上限',
            			  btn: '我知道了',
            			  shadeClose: false,
            			  yes: function(index){
          				  mobilelayer.close(index);
          			  }
            		});
            		button.text("重新发送").removeAttr("disabled").removeClass("layui-disabled");
            	}
            	else{
            		mobilelayer.open({
          			  content: '发生错误，请重试',
          			  btn: '我知道了',
          			  shadeClose: false,
          			  yes: function(index){
        				  mobilelayer.close(index);
        			  }
	          		});
	          		button.text("重新发送").removeAttr("disabled").removeClass("layui-disabled");
            	}
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
                button.text("重新发送").removeAttr("disabled").removeClass("layui-disabled");
            }
        });
    })
    
    
    //签到按钮
    form.on("submit(sign)",function(data){
        var buttonObject=$(this);
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(data.field.phone))){ 
            //alert("手机号码有误，请重填!");
        	mobilelayer.open({
			  content: '手机号码有误，请重填!',
			  btn: '我知道了',
			  shadeClose: false,
			  yes: function(index){
				  mobilelayer.close(index);
			  }
			});
            return false; 
        }
        if(data.field.verifycode==""){
            //alert("请填写验证码！");
        	mobilelayer.open({
  			  content: '请填写验证码！',
  			  btn: '我知道了',
  			  shadeClose: false,
  			  yes: function(index){
				  mobilelayer.close(index);
			  }
  			});
            return false;
        }
        buttonObject.text("签到中...").attr("disabled","disabled").addClass("layui-disabled");
        $.ajax({
            url: "../../SignWeb/Login",
            //url:'../../testdata/SignSuccess.json',
            type:'post',
            dataType: 'json',
            data:{
            	"phoneNum":data.field.phone,
            	"pxID":pxid,
            	"sVerityCode":data.field.verifycode
            },
            success: function (result) {
                //console.log(result);
                if(result.code=="0"){
                    //alert("签到成功！");
                    //window.location.href="signsuccess.html";
                	mobilelayer.open({
          			  content: '签到成功！',
          			  btn: '确定',
          			  shadeClose: false,
          			  yes: function(){
          				window.location.href="signsuccess.html";
          			  }
          			});
                }
                else if (result.code=="3"){
                	//alert("信息不完整，请填写详细信息后即可完成签到")
                	//window.location.href="signdetail.html?id="+pxid+"&phone="+data.field.phone+"&code="+data.field.verifycode;
                	mobilelayer.open({
        			  content: '信息不完整，请填写详细信息后即可完成签到',
        			  btn: '确定',
        			  shadeClose: false,
        			  yes: function(){
        				  window.location.href="signdetail.html?id="+pxid+"&phone="+data.field.phone+"&code="+data.field.verifycode;
        			  }
        			});
                }
                else if (result.code=="2"){
                	//alert("已签到过，不可重复签到")
                	//window.location.reload();
                	mobilelayer.open({
          			  content: '已签到过，不可重复签到',
          			  btn: '确定',
          			  shadeClose: false,
          			  yes: function(){
          				window.location.reload();
          			  }
          			});
                }
                else if (result.code=="1"){
                	//alert("验证码不正确，请重新填写")
                	mobilelayer.open({
        			  content: '验证码不正确，请重新填写',
        			  btn: '我知道了',
        			  shadeClose: false,
        			  yes: function(index){
        				  mobilelayer.close(index);
        			  }
        			});
                	buttonObject.text("签到").removeAttr("disabled").removeClass("layui-disabled");
                }
                else{
                	//alert("验证码验证出错，请选择重新发送")
                	mobilelayer.open({
          			  content: '验证码验证出错，请选择重新发送',
          			  btn: '我知道了',
          			  shadeClose: false,
          			  yes: function(index){
	      				  mobilelayer.close(index);
	      			  }
          			});
                	buttonObject.text("签到").removeAttr("disabled").removeClass("layui-disabled");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });

        return false;
    })

    //表单输入效果
    $(".loginBody .input-item").click(function(e){
        e.stopPropagation();
        $(this).addClass("layui-input-focus").find(".layui-input").focus();
    })
    $(".loginBody .layui-form-item .layui-input").focus(function(){
        $(this).parent().addClass("layui-input-focus");
    })
    $(".loginBody .layui-form-item .layui-input").blur(function(){
        $(this).parent().removeClass("layui-input-focus");
        if($(this).val() != ''){
            $(this).parent().addClass("layui-input-active");
        }else{
            $(this).parent().removeClass("layui-input-active");
        }
    })
})
