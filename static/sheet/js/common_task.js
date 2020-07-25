  /**
 * 生成任务工单js
 */
function _task_saveSheet(){
//	alert($('#nextJob').val())
	$("#sheetState",navTab.getCurrentPanel()).val("18");
//	var v=$("input[@type=radio][name=isSubmitOnTime][checked]").val();
	//if(v=="2"){
		//alert("定时派发不能选是");
		//$("form").attr('action',rootPath+'/form/inst/page?actionName=task_draft&sheetType=HA-508&_rel=HA-508');
		//return;
	//	alert(111);
	//	$("#_formId").attr('action',rootPath+'/form/inst/saveDraft');
	//}
	
		$("#triggertime",navTab.getCurrentPanel()).removeAttr("class");
		var createTime=$("#createTime",navTab.getCurrentPanel()).val();
		var overTime=$("#overTime",navTab.getCurrentPanel()).val();
		if(createTime!=null&&createTime!=""&&overTime!=null&&overTime!=""){
			createTime=createTime.replace(/-/g,"/");
			overTime=overTime.replace(/-/g,"/");
			var createTime_getTime=new Date(Date.parse(createTime)).getTime();
			var overTime_getTime=new Date(Date.parse(overTime)).getTime();
			if((overTime_getTime-createTime_getTime)>4*60*60*1000){
				
				$("#urgencyflag",navTab.getCurrentPanel()).val("0");
			}else{
				$("#urgencyflag",navTab.getCurrentPanel()).val("1");
				
			}
		}
		$("#_rel",navTab.getCurrentPanel()).val("sheet-draft");
		$("#route",navTab.getCurrentPanel()).attr("value",$("input[name='isAuditFlag']:checked",navTab.getCurrentPanel()).val());
		$("#_formId",navTab.getCurrentPanel()).attr('action',rootPath+'/form/inst/saveDraft');
}

function _task_sendSheet(){

	$("#sheetState",navTab.getCurrentPanel()).val("01");
	var v=$("input[@type=radio][name=timerFlag][checked]",navTab.getCurrentPanel()).val();
	if(v=="2"){
		//alert("定时派发选择是时，不能点派单按钮，请点保存按钮。");
		alertMsg.error("定时派发选择是时，不能点派单按钮，请点保存按钮。");
		return false;
	}
	
	else{
		$("#triggertime",navTab.getCurrentPanel()).removeAttr("class");
		var createTime=$("#createTime",navTab.getCurrentPanel()).val();
		var overTime=$("#overTime",navTab.getCurrentPanel()).val();
		if(createTime!=null&&createTime!=""&&overTime!=null&&overTime!=""){
			createTime=createTime.replace(/-/g,"/");
			overTime=overTime.replace(/-/g,"/");
			var createTime_getTime=new Date(Date.parse(createTime)).getTime();
			var overTime_getTime=new Date(Date.parse(overTime)).getTime();
			if((overTime_getTime-createTime_getTime)>4*60*60*1000){
				
				$("#urgencyflag",navTab.getCurrentPanel()).val("0");
			}else{
				$("#urgencyflag",navTab.getCurrentPanel()).val("1");
			}
		}
	}
    
	//var createTime=$("#createTime").val();
	var createTime_=$("#createTime",navTab.getCurrentPanel()).val();
	var overTime_=$("#overTime",navTab.getCurrentPanel()).val();  
	createTime_=createTime_.replace(/-/g,"/");
	overTime_=overTime_.replace(/-/g,"/");
	var createTime_getTime_=new Date(Date.parse(createTime_)).getTime();
	var overTime_getTime_=new Date(Date.parse(overTime_)).getTime();	
	if((overTime_getTime_-createTime_getTime_)<0){	
        //alert("规定完成时限不能小于派单时间。");
        alertMsg.error("规定完成时限不能小于派单时间。");
        return false;
    }
    
   	//提交表單
   	$("#route",navTab.getCurrentPanel()).attr("value",$("input[name='isAuditFlag']:checked").val());
   	$("#_rel",navTab.getCurrentPanel()).val("sheet-draft");
   	$("#_formId",navTab.getCurrentPanel()).attr('action',rootPath+'/form/inst/send');
   	//$("#_formId").submit;
   	return true;
}

function _task_isSubmitOnTime(){
    var val =$("input[name='timerFlag']:checked",navTab.getCurrentPanel()).val()
	if(val=="1"){
		$("#p_triggertime",navTab.getCurrentPanel()).css({"display":"block"});
		$("#triggertime",navTab.getCurrentPanel()).addClass("required");
	}else{
        $("#p_triggertime",navTab.getCurrentPanel()).css({"display":"none"});
        $("#triggertime",navTab.getCurrentPanel()).removeClass("required");
    }
}
//绑定生产任务工单是否提交审核操作来选择不同的树结构
$("[name=isAuditFlag]",navTab.getCurrentPanel()).on("click",function(){
	if($("[name=isAuditFlag]:checked",navTab.getCurrentPanel()).val()==1){
		$('#selJobID',navTab.getCurrentPanel()).val('8151,8150');
		$('#activeDefId',navTab.getCurrentPanel()).val('P.YIELDTASK.T0_0');
		$("form[id=_formId] a[target=dialog]",navTab.getCurrentPanel()).attr("href",rootPath+"/sheet/task/assistTree.jsp");
	}
	if($("[name=isAuditFlag]:checked",navTab.getCurrentPanel()).val()==0){
		$('#selJobID',navTab.getCurrentPanel()).val('8150');
		$('#activeDefId',navTab.getCurrentPanel()).val('P.YIELDTASK.T0');
		$("form[id=_formId] a[target=dialog]",navTab.getCurrentPanel()).attr("href",rootPath+"/sheet/task/tasksheetTree.jsp");
	}
	
});

$(document).ready(function() {
    _task_isSubmitOnTime();

});
  