/**
 * Form 通用页面调用js函数
 */
function _saveSheet(){
	//校验select是否 
	   if($("a[class=required]",navTab.getCurrentPanel()).length>0){
			  $("a[class='required']",navTab.getCurrentPanel()).each(function(){
				if($(this).text()=="请选择"){
					$(this).css("border","1px solid red");
					return;
				}else{
					$(this).css("border","1px solid #A2BAC0");
				}
			})
	  }
	   checkTitle();
    $("#_formId",navTab.getCurrentPanel()).attr('action',rootPath+'/form/inst/saveDraft');
}
function _sendSheet(){
	//校验select是否 
	   if($("a[class=required]",navTab.getCurrentPanel()).length>0){
			  $("a[class='required']",navTab.getCurrentPanel()).each(function(){
				if($(this).text()=="请选择"){
					$(this).css("border","1px solid red");
					return;
				}else{
					$(this).css("border","1px solid #A2BAC0");
				}
			})
	  }
	   checkTitle();
    $("#_formId",navTab.getCurrentPanel()).attr('action',rootPath+'/form/inst/sendFault');
}
function _goOn(){
	//校验select是否 
	   if($("a[class=required]",navTab.getCurrentPanel()).length>0){
			  $("a[class='required']",navTab.getCurrentPanel()).each(function(){
				if($(this).text()=="请选择"){
					$(this).css("border","1px solid red");
					return;
				}else{
					$(this).css("border","1px solid #A2BAC0");
				}
			})
	  }
    $("#_formId",navTab.getCurrentPanel()).attr('action',rootPath+'/form/inst/saveAcc');
}
function file_clear(obj){
    DWZ.ajaxDone(obj)
    $("#file_"+obj.fileId,navTab.getCurrentPanel()).html('');
    $("#file_"+obj.fileId,navTab.getCurrentPanel()).prev().css('display','inline');
}
//选择故障省份
function faultProvinces() {
    var val = $('#selectProvince',navTab.getCurrentPanel()).find("option:selected").text();
    var key = $('#selectProvince',navTab.getCurrentPanel()).find("option:selected").attr('value');
    if(val=='请选择')return;
    var province = $('#faultProvince1',navTab.getCurrentPanel()).val();
    $('#faultProvince1',navTab.getCurrentPanel()).attr("aa", "a");
    if (province.indexOf(val) >= 0) {  //如果当前选择的省份在已选择中已包括，那么不做任何操作
        return false;
    }
    if (province == null || province == '') {
        $('#faultProvince1',navTab.getCurrentPanel()).val(val);
        $('#faultProvince',navTab.getCurrentPanel()).val(key);
    } else {
        $('#faultProvince1',navTab.getCurrentPanel()).val(province + "," + val);
        $('#faultProvince',navTab.getCurrentPanel()).val($('#faultProvince',navTab.getCurrentPanel()).val() + "," + key);
    }
}
//选择故障地市
function faultCitys() {
    var xx = $('#faultCity1',navTab.getCurrentPanel()).attr("aa");
    if (xx == "a") {
        $('#faultCity1',navTab.getCurrentPanel()).attr("aa", "b");
    } else {
        var val = $('#selectCity',navTab.getCurrentPanel()).find("option:selected").text();
        var key = $('#selectCity',navTab.getCurrentPanel()).find("option:selected").attr('value');
        if(val=='请选择')return;
        var City = $('#faultCity1',navTab.getCurrentPanel()).val();
        if (City.indexOf(val) >= 0) {  //如果当前选择的地市在已选择中已包括，那么不做任何操作
            return false;
        }
        if (City == null || City == '') {
            $('#faultCity1',navTab.getCurrentPanel()).val(val);
            $('#faultCity',navTab.getCurrentPanel()).val(key);
        } else {
            $('#faultCity1',navTab.getCurrentPanel()).val(City + "," + val);
            $('#faultCity',navTab.getCurrentPanel()).val($('#faultCity',navTab.getCurrentPanel()).val() + "," + key);
        }
    }
}
function refreshPage(){
	navTab.reloadFlag("sheet-listUndo");
	navTab.reloadFlag("sheet-list");
	navTab.reloadFlag("sheet-new");
}

function checkTitle(){
	   	
	  var scenetype = $('#scenetype',navTab.getCurrentPanel()).val();
	  var TITLE = $('#TITLE',navTab.getCurrentPanel()).val();
	  if(scenetype==4&&TITLE.indexOf('【风景区】')<0){
		  $('#TITLE',navTab.getCurrentPanel()).val("【风景区】"+TITLE);
	  }
	  
	  if(scenetype!=4&&TITLE.indexOf('【风景区】')>=0){
		  $('#TITLE',navTab.getCurrentPanel()).val(TITLE.replace("【风景区】",""));  
	  }
}

