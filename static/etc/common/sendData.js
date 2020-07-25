/**
 * ajax远程调用
 * @param sendUrl		发送请求的URL
 * @param datas			发送到服务器的数据--入参
 * @param dataType		预期服务器返回的数据类型
 * @param callback		回调方法名
 * @param pageElementId	页面元素id
 */
function sendData(sendUrl,datas,dataType,callback,pageElementId){
	$.ajax({
		type:"POST",			//请求方式
        url:sendUrl,			//发送请求的URL
        data:datas,				//发送到服务器的数据 入参
        dataType:dataType,		//预期服务器返回的数据类型
        async : true,			//请求方式 true:异步，false:同步
        cache: false,			//是否缓存页面  true:缓存，false:不缓存
        success:function(jsons){
        	callback(jsons,pageElementId);
		},
		error:function(){
			alertMsg.info("数据请求异常");
	    }
	});
}