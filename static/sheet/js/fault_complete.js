/**
 * 处理完成     js
 */
	//派单是否有效
	function show(){
       var s=$("input[name='pdsfyx']:checked",navTab.getCurrentPanel()).val();
       if(s=="0"){
         $("#p_invilidReason",navTab.getCurrentPanel()).slideUp(1);
       }
       else{
         $("#p_invilidReason",navTab.getCurrentPanel()).slideDown(1);
         $("#invilidReason",navTab.getCurrentPanel()).addClass("required");
       }
    }
	//处理完成初始化
	$(function(){
		$("#p_invilidReason",navTab.getCurrentPanel()).slideDown(1);
	    $("#p_invilidReason",navTab.getCurrentPanel()).slideUp(1);
		var arr = new Array();
		arr[0] = "[故障消除时间]:${gzxcsj}";
		arr[1] = "\n[处理结果]:已解决"
		arr[2] = "\n[故障原因]:";
		arr[3] = "\n[处理过程及采取措施时间点]:";
		$('#clcs',navTab.getCurrentPanel()).val(arr.join(""));
	})