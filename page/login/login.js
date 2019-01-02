layui.config({
    base: '../../js/' //此处路径请自行处理, 可以使用绝对路径
}).extend({
	"cookie": 'cookie'
});
layui.use(['form','layer','jquery','cookie'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
        $ = layui.jquery;

    //登录按钮
    form.on("submit(login)",function(data){
    	var buttonObject=$(this);
    	buttonObject.text("登录中...").attr("disabled","disabled").addClass("layui-disabled");
        $.ajax({
            url: "../../UserApi/Login",
            type:'post',
            dataType: 'json',
            data:{
            	userID:data.field.userName,
            	pwd:data.field.password
            },
            success: function (result) {
            	if(result){
            		$.cookie('signusername', data.field.userName, { expires: 7 , path: '/QDcms'});
            		$.cookie('signpassword', data.field.password, { expires: 7 , path: '/QDcms'});
            		window.location.href="../../index.html";
            	}
            	else{
            		layer.open({
        			  title: false
        			  ,content: '登录失败，请检查用户名或密码是否输入正确'
        			});
            		buttonObject.text("登录").removeAttr("disabled").removeClass("layui-disabled");
            	}
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
                $(this).text("登录").removeAttr("disabled").removeClass("layui-disabled");
            }
        });
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
