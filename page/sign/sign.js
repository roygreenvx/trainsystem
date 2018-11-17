layui.use(['form','layer','jquery'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
        $ = layui.jquery;

    //签到按钮
    form.on("submit(sign)",function(data){
        var buttonObject=$(this);
        buttonObject.text("签到中...").attr("disabled","disabled").addClass("layui-disabled");
        if(data.field.verifycode==""){
            alert("请填写验证码！");
            return false;
        }
        $.ajax({
            //url: "../../DataServer/TreeData.aspx?method=LoadEditNew&fdid=" + fdid,
            url:'../../testdata/SignSuccess.json',
            dataType: 'json',
            success: function (result) {
                //console.log(result);
                if(result.code=="0"){
                    alert("签到成功！");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });

        return false;
    })

    $("#sendSMS").on("click",function(){
        var phonenum = $("#phone").val();
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(phonenum))){ 
            alert("手机号码有误，请重填!");
            return false; 
        }
        var time=30;
        var button=$("#sendSMS");
        button.attr("disabled","disabled").addClass("layui-disabled");
        var t=setInterval(function() {
            time--;
            button.text(time+"s");
            if (time==0) {
                clearInterval(t);
                button.text("重新发送").removeAttr("disabled").removeClass("layui-disabled");
            }
        },1000)
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
