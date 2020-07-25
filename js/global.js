var eomsGlobal = {};
(function () {
	var baseUrl = '/haeoms';
	// 	var clearTime = null;
		var envir = 'production';  // 生产环境
		// var envir = 'develop';  // 开发环境
	// 请求接口
	function ajaxFn (url,fn,type,data,contentType) {
		var token = $.cookie('sessionUserToken');
		var tokenFlag = $.cookie('LtpaToken2');
		if (!tokenFlag || !token) {
			window.location.href = '/haeoms/toLogin';
			return;
		}
		var request = $.ajax({
			url: url+'?v='+(Math.random()+'').substr(2),
			type: type?type:'get',
			data: data?data:null,
			dataType: 'json',
			headers: {
				'sessionUserToken':token
			},
			contentType: contentType?contentType:'application/json;charset=UTF-8',
			// beforeSend: function (XMLHttpRequest) { // 请求之前，验证cookie,拦截器
			// 	if (tokenFlag) {
			// 		// XMLHttpRequest.setRequestHeader("sessionUserToken", token);
			// 	} else {
			// 		window.location.href = '/haeoms/toLogin';
			// 		// window.open('http://www.zhaojiao.net/','_blank');
			// 		// 让后端处理没有带cookie的情况，让接口不能调用成功
			// 		// 即使没有cookie，也会发送请求，但是这个请求没有带cookie,headers
			// 		// location.href = 'http://www.zhaojiao.net/';
			// 	}
			// },
			success: function (res) {
				fn(res);
			},
			error: function () {
				// alert('接口调取失败');
			},
		})
	}
	function closeGif () {
		$("#Loading").show("normal",function(){
			$(this).remove();
		});
	}
	// 加载动图
	function completeGif () {
		var clearTime;
		$.parser.onComplete = function(){
			if(clearTime) clearTimeout(clearTime);
			clearTime = setTimeout(closeGif, 100);
		}
	}
	// 修改easyui框架按钮样式
	function modifyBtn (arr) {
		var item;
		for (var i=0,len=arr.length;i<len;i++) {
			item = arr[i];
			$('.eoms-btns .icon-'+item.oldIcon).addClass('fa fa-'+(item.newIcon?item.newIcon:'calendar'));
		}	
	}
	// 给全局变量赋值
	eomsGlobal = {
		ajaxFn: ajaxFn,
		completeGif: completeGif,
		modifyBtn: modifyBtn,
		envir: envir
	};
})()
