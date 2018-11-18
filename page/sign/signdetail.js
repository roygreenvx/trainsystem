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

    var phonenum=getUrlParam("phone");
    $("#phone").val(phonenum);

    //签到按钮
    form.on("submit(sign)",function(data){
        var buttonObject=$(this);
        
        buttonObject.text("签到中...").attr("disabled","disabled").addClass("layui-disabled");
        $.ajax({
            //url: "../../DataServer/TreeData.aspx?method=LoadEditNew&fdid=" + fdid,
            url:'../../testdata/SignSuccess.json',
            dataType: 'json',
            success: function (result) {
                console.log(result);
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

})
