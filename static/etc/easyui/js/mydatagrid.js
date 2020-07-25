/**
 *  jQuery EasyUI DataGrid封装
 *
 *  User: 段方瑞
 *  Date: 2016/10/28-14:33
 *  Email: duanfangrui@live.com
 *
 * @param tableId    table标签的id
 * @param url        请求地址
 * @param paramObj   请求入参 {key:value,...}
 * @parma options    用于覆盖默认参数
 *
 *  调用方式：
 *  createDataGrid(tableId, url); 无入参+单选模式
 *  createDataGrid(tableId, url,paramObj);入参+单选模式
 *  createDataGrid(tableId, url,paramObj,{singleSelect:false,...});入参+多选模式
 *  createDataGrid(tableId, url,null,{pagination:false,...});无入参+不分页
 */
function createDataGrid(tableId, url, paramObj, options) {
    var defaultSettings = {
        url: url,
        method: 'post',
        iconCls: 'icon-search',
        striped: true,				//设置为true将交替显示行背景
        nowrap: true,				//设置为true，当数据长度超出列宽时将会自动截取
        autoRowHeight: false,// 默认true，行高基于单元格内容；IE浏览器下需要设置该属性为false以处理单元格合并css bug，万恶的IE！！！
        rownumbers: true,			//设置为true将显示行数
        singleSelect: true,//单选模式
        showFooter: false, 		//显示行底
        pagination: true,			//设置true将在数据表格底部显示分页工具栏
        pageSize: 15,				//每页记录数 设置分页属性时，初始化每页记录数
        pageList: [10, 15, 20, 50],	//可选择的每页记录数  当设置分页属性时，初始化每页记录数列表
        pageNumber: 1,				//当前页码  当设置分页属性时，初始化分页码。
        remoteSort: false,			//远程排序  定义是否通过远程服务器对数据排序
        queryParams: paramObj,		//查询参数  当请求远程数据时，发送的额外参数
        fitColumns: true,
        fit: true
    };
    if (options) {
        options = $.extend(defaultSettings, options);
        $('#' + tableId).datagrid(options);
    } else {
        $('#' + tableId).datagrid(defaultSettings);
    }
    $(".datagrid-header-rownumber").html("序号");
}

/**
 * @function 获取数据列表复选的field
 * @param tableId    指定table的id
 * @param field        指定的field
 * @returns 返回的field串，形如1:2:3:4
 */
function getSelectedField(tableId, field) {
    var ss = "";
    var rows = $('#' + tableId).datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (i == 0) {
            ss += row[field];
        } else {
            ss += ":" + row[field];
        }
    }
    return ss;
}