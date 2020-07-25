var indexVariable = {
	/**
	 * 刚进入页面时，dom还没有渲染完成时执行的函数
	 * 用于遮挡作用
	 */
	userName: '',
	userNameCn: '',
	isClickTodo: false,
	isMenu: false,
	addTab: function (title, url) {
		/**
		 * 为主tab添加一个项
		 */
		if ($('#tabs').tabs('exists', title)){
			$('#tabs').tabs('select', title);//选中并刷新
			var currTab = $('#tabs').tabs('getSelected');
			if(url != undefined && currTab.panel('options').title != '首页') {
				$('#tabs').tabs('update',{
					tab:currTab,
					options:{
						content:this.createFrame(url)
					}
				})
			}
			// $('#tabs').tabs('disableTab', title);
		} else {
			var content = this.createFrame(url);
			$('#tabs').tabs('add',{
				title:title,
				content:content,
				closable:true
			});
			// $('#tabs').tabs('disableTab', title);
		}
		this.tabClose();
	},
	createFrame: function (url) { //scrolling="auto"
		/**
		 * 创建iframe标签，根据主菜单data-src的不同，跳转不同的url
		 */
	   if (typeof url == 'string' && url.indexOf('.html')>-1) {
		   // 跳转至新框架
		   var s = '<iframe frameborder="0"  src="'+url+'" style="width:100%;height:100%;"></iframe>';
	   } else {
		   // 跳转至老框架
		   var s = '<iframe frameborder="0"  src="./static/jsp/secframe.html?type='+url+'" style="width:100%;height:100%;"></iframe>';
	   }
		return s;
	},
	tabCloseEven: function () {
		var _this = this;
		//刷新
		$('#mm-tabupdate').click(function(){
			var currTab = $('#tabs').tabs('getSelected');
			var url = $(currTab.panel('options').content).attr('src');
			if(url != undefined && currTab.panel('options').title != '首页') {
				$('#tabs').tabs('update',{
					tab:currTab,
					options:{
						content:_this.createFrame(url)
					}
				})
			}
		})
		//关闭当前
		$('#mm-tabclose').click(function(){
			var currtab_title = $('#mm').data("currtab");
			$('#tabs').tabs('close',currtab_title);
		})
		//全部关闭
		$('#mm-tabcloseall').click(function(){
			$('.tabs-inner span').each(function(i,n){
				var t = $(n).text();
				if(t != '首页') {
					$('#tabs').tabs('close',t);
				}
			});
		});
		//关闭除当前之外的TAB
		$('#mm-tabcloseother').click(function(){
			var prevall = $('.tabs-selected').prevAll();
			var nextall = $('.tabs-selected').nextAll();
			if(prevall.length>0){
				prevall.each(function(i,n){
					var t=$('a:eq(0) span',$(n)).text();
					if(t != '首页') {
						$('#tabs').tabs('close',t);
					}
				});
			}
			if(nextall.length>0) {
				nextall.each(function(i,n){
					var t=$('a:eq(0) span',$(n)).text();
					if(t != '首页') {
						$('#tabs').tabs('close',t);
					}
				});
			}
			return false;
		});
	},
	tabClose: function () {
		/*双击关闭TAB选项卡*/
		$(".tabs-inner").dblclick(function(){
			var subtitle = $(this).children(".tabs-closable").text();
			$('#tabs').tabs('close',subtitle);
		})
		/*为选项卡绑定右键*/
		$(".tabs-inner").on('contextmenu',function(e){
			$('#mm').menu('show', {
				left: e.pageX,
				top: e.pageY
			});
			var subtitle =$(this).children(".tabs-closable").text();
			$('#mm').data("currtab",subtitle);
			$('#tabs').tabs('select',subtitle);
			return false;
		});
		/*为选项卡绑定右键*/
		// $(".tabs-selected").on('click',function(e){
		// 	alert('jk');

		// });
	},
	getArr: function (arr) {
		var html = '';
		for (var i=0;i<arr.length;i++) {
			html += '<div class="jumptomaintab" data-menuid="1'+arr[i].id+'" data-menulocation="'+arr[i].location+'" data-menutype="1'+arr[i].menuType+'" data-flag="'+arr[i].menuFlag+'">'+arr[i].name+'</div>';
		}
		return html;
	},
	fulData: function (arr) {
		var s1 = '';
		for (var i=0;i<arr.length;i++) {
			if (arr[i].children && arr[i].children.length>0) {
				s1 += '<div><span>'+arr[i].name+'</span><div>'+this.getArr(arr[i].children)+'</div></div>';
			} else {
				s1 += '<div class="jumptomaintab" data-menuid="1'+arr[i].id+'" data-menulocation="'+arr[i].location+'" data-menutype="1'+arr[i].menuType+'" data-flag="'+arr[i].menuFlag+'">'+arr[i].name+'</div>';
			}
		}
		return s1;
	},
	loadMenu: function () {
		sessionStorage.setItem('operSheetType','');// 刷新页面时，把operSheetType清空
		var navTree = sessionStorage.getItem('findNavTree'),
		    navArr = [],
			_this = this;
		if (navTree) {
			navArr = JSON.parse(navTree).data;
			this.formatMenu(navArr);
			setTimeout(function () {
				indexVariable.loadWidth(navArr.length);
			},100);
		} else {
			_this.isMenu = true;
			eomsGlobal.ajaxFn('/haeoms/menu/findNavTree',function (res) {
				sessionStorage.setItem('findNavTree',JSON.stringify(res));
				location.reload();
				// navArr = JSON.parse(navTree).data;
				// _this.formatMenu(res.data);
				// setTimeout(function () {
				// 	_this.loadWidth(navArr.length);
				// },100);
			});
		}
	},
	loadOther: function () {
		// 最新公告
		this.loadLastsNews();
		// 留言板
		this.loadMessage();
		// 专家值班
		this.loadDutyList();
		// 获取用户信息
		this.loadUserInfo();
		// 获取运维待办和需求待办信息
		this.loadOperation();
		// 值班作业信息
		this.loadDutySchedule();
		// 获取3个职位列表
		this.loadJobList();
	},
	loadHeaderMenu: function () {
		eomsGlobal.ajaxFn('/haeoms/menu/findNavTree',function (res) {
			sessionStorage.setItem('findNavTree',JSON.stringify(res));
			location.reload();
		});
	},
	loadJobList: function () {
		eomsGlobal.ajaxFn('/haeoms/home/findJobList',function (res) {
			var operProTempArr = [],
			    publicServiceTempArr = [],
				operProValue = '',
				publicServiceValue = '',
				arr = [],
				item = {};
			if (res && res.data) {
				arr = res.data.concat();
				for (var j=0,len=arr.length;j<len;j++) {
					item = arr[j];
				 if (item.TYPE == '0') {
				   if (item.FLAG == '1') {
				     operProValue = item.ID;
				   }
				   operProTempArr.push(item)
				 } else if (item.TYPE == '1') {
				   if (item.FLAG == '1') {
				     publicServiceValue = item.ID;
				   }
				   publicServiceTempArr.push(item)
				 }
				}
			}
			function reloadOperList (arr,val) {
				var type ='';
				for (var i=0;i<arr.length;i++) {
				  if (arr[i].ID == val) {
				    type = arr[i].TYPE;
				    break;
				  }
				}
				var jsonObj = {
				  type: type,
				  jobid: val
				};
				var jsonStr = JSON.stringify(jsonObj);
				eomsGlobal.ajaxFn('/haeoms/home/changeJob',function (res) {
					if (res.responseBody && parseInt(res.responseBody.data) == 0) {
						indexVariable.loadHeaderMenu();
					} else {
						alert('切换失败');
					}
				},'post',jsonStr);
			}
			$('#cc1').combobox({
			    data:operProTempArr,
			    valueField:'ID',
			    textField:'SHORTNAME',
				panelHeight: 'auto',
				value: operProValue,
				onChange: function (val) {
					reloadOperList(operProTempArr,val);
				}
			});
			$('#cc2').combobox({
			    data:publicServiceTempArr,
			    valueField:'ID',
			    textField:'SHORTNAME',
				panelHeight: 'auto',
				value: publicServiceValue,
				onChange: function (val) {
					reloadOperList(publicServiceTempArr,val);
				}
			});
			$('#cc3').combobox({
			    data:publicServiceTempArr,
			    valueField:'ID',
			    textField:'SHORTNAME',
				panelHeight: 'auto',
				value: publicServiceValue,
				onChange: function (val) {
					reloadOperList(publicServiceTempArr,val);
				}
			});
		});
	},
	loadDutySchedule: function () {
		eomsGlobal.ajaxFn('/haeoms/home/findDutySchedule',function (dutyRes) {
			if (dutyRes && dutyRes.data) {
				var len = dutyRes.data.length;
				document.querySelector('.todo-itemvalue1').innerHTML = len;
			   document.querySelector('.todo-content10').innerHTML = len;
			  $('.todo-dayWork').addClass('show-dayWork').removeClass('hidden-dayWork');
			} else {
			  document.querySelector('.todo-content10').innerHTML = 0;
			  $('.todo-dayWork').addClass('hidden-dayWork').removeClass('show-dayWork');
			}
		});
	},
	loadOperation: function () {
		// 运维待办和需求待办信息
		eomsGlobal.ajaxFn('/haeoms/home/findOperation',function (res) {
			var operValue = 0,//运维待办的总值
			    needValue = 0,// 需求待办的总值
				operHtml = '';
			if (res && res.data) {
			  for (var i=0,data=res.data,len=data.length;i<len;i++) {
				  switch(data[i].SHEETTYPE){
					case 'HA-001':
					    needValue += parseInt(data[i].C);
						document.querySelector('.todo-content20').innerHTML = data[i].C;
						break;
					case 'HA-002':
					    needValue += parseInt(data[i].C);
					    document.querySelector('.todo-content21').innerHTML = data[i].C;
					    break;
					case 'HA-003':
					    needValue += parseInt(data[i].C);
					    document.querySelector('.todo-content22').innerHTML = data[i].C;
					    break;
					case 'HA-008':
					    needValue += parseInt(data[i].C);
					    document.querySelector('.todo-content23').innerHTML = data[i].C;
					    break;
					default:
					    operValue += parseInt(data[i].C);
						operHtml += '<p onclick="indexVariable.clickOper(\''+data[i].SHEETTYPE+'\')" class="todo-sublist">'+
										'<span class="todo-listtext">'+data[i].N+'</span>'+
										'<span class="todo-listvalue">'+data[i].C+'</span>'+
									'</p>';
				  }
			  }
			}
			document.querySelector('.todo-itemvalue0').innerHTML = operValue;
			document.querySelector('.todo-itemvalue2').innerHTML = needValue;
			document.querySelector('.todo-bottom-content0').innerHTML = operHtml;
			$('.todo-bottom-content0 .todo-sublist:nth-child(2n)').addClass('todo-sublisteven');
		});
	},
	loadTube: function (userName,tel) {
		eomsGlobal.ajaxFn('/haeoms/home/fastPass',function (turbeRes) {
			var arr = [],
				preUrl = '',
				urlIndexOf = '',
				listData = [],
				html = '';
			if (turbeRes && turbeRes.data) {
				if (turbeRes.data.length<=6) {
					arr = turbeRes.data.concat();
				} else if (turbeRes.data.length>6) {
					arr = turbeRes.data.slice(0,6);
				}
			  $('.fast-nodata').addClass('.hidden-fast').removeClass('.show-fast');
			} else {
			  $('.fast-nodata').addClass('.show-fast').removeClass('.hidden-fast');
			  channelList = [];
			  return;
			}
			for (var i=0,len=arr.length;i<len;i++) {
			  urlIndexOf = '';
			  listData = turbeRes.data[i];
			  if (listData.URL.indexOf('../') == 0) {
			    urlIndexOf = listData.URL.replace('../','/workbench/');
			  } else if (listData.URL.indexOf('./') == 0) {
			    urlIndexOf = listData.URL.replace('./','/workbench/jsp/');
			  } else {
			    urlIndexOf = listData.URL;
			  }
			  if (listData.SUBSYSTEMID==1) { // 新emos+'&_='+this.$store.state.menu.phone
			    if (listData.URL.indexOf('?')>-1) {
			        preUrl = urlIndexOf+'&phoneUser='+userName+'&_='+tel;
			    } else {
			        preUrl = urlIndexOf+'?phoneUser='+userName+'&_='+tel;
			    }
			    arr[i].iframeLocation = listData.MTYPE+'&url='+preUrl.replace(/&/g, '%26')+'&urlName='+encodeURI(listData.NAME)+'&urlCode='+listData.CODE+'&external=false';
			  } else {
			    if (location.host == '10.87.61.43') {
			      if (listData.SUBSYSTEMID==2) { // gpm
			        preUrl = 'http://10.87.61.43/gpm/IntoGpm.gpm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==3) { // 值班作业
			        preUrl = 'http://10.87.61.43/ess/IntoEss.wsm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==4) { // 公共服务
			         preUrl = 'http://10.87.61.43/wrm/Login.do?userName='+userName+'&myaction='+urlIndexOf+'&pass=&flag=portal';
			      } else if (listData.SUBSYSTEMID==5) { // 专家值班
			        preUrl = 'http://10.87.61.43/edm/IntoEdm.wsm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==6) { // 需求管理
			        preUrl = 'http://10.87.61.43/wsc/IntoWsc.wsm?userName='+userName+'&url='+urlIndexOf;
			      }
			    } else {
			      if (listData.SUBSYSTEMID==2) { // gpm
			        preUrl = 'http://10.97.87.8/gpm/IntoGpm.gpm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==3) { // 值班作业
			        preUrl = 'http://192.168.7.39:9080/ess/IntoEss.wsm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==4) { // 公共服务
			         preUrl = 'http://192.168.7.39:9080/wrm/Login.do?userName='+userName+'&myaction='+urlIndexOf+'&pass=&flag=portal';
			      } else if (listData.SUBSYSTEMID==5) { // 专家值班
			        preUrl = 'http://192.168.7.39:9080/edm/IntoEdm.wsm?userName='+userName+'&url='+urlIndexOf;
			      } else if (listData.SUBSYSTEMID==6) { // 需求管理
			        preUrl = 'http://10.217.1.33:9083/wsc/IntoWsc.wsm?userName='+userName+'&url='+urlIndexOf;
			      }
			    }
			    arr[i].iframeLocation = listData.MTYPE+'&'+'url='+preUrl.replace(/&/g, '%26')+'&urlName='+encodeURI(listData.NAME)+'&urlCode='+listData.CODE+'&external=true';
			  }
			  html += '<div onclick="indexVariable.clickFastItem(\''+listData.MAINMENU+'\',\''+listData.iframeLocation+'\')" class="fast-item fast-item'+i+'"  title="'+listData.NAME+'">'+
						  '<p class="fast-item-icon"><img class="fast-img" src="./images/fast/gongdan'+i+'.png" alt=""></p>'+
						  '<p class="fast-item-text">'+
							  '<span class="fast-text-new"></span>'+
							  '<span class="fast-text-name">'+listData.NAME+'</span>'+
						  '</p>'+
					  '</div>'
			}
			document.querySelector('.fast-container').innerHTML = html;
		});
	},
	loadSysCus: function (userName) {
		var faultSheet = [],
		    html = '';
		if (location.host == '10.87.61.43') { // 生产环境不带端口号
		  faultSheet = [{
		          id: 'mainmenu1',
		          name: '故障工单短信',
		          url: 'icon-zhidongxiguzhang',
		          type: '12',
		          iframeUrl: '12&url=http://10.87.61.43/gpm/IntoGpm.gpm?userName='+userName+'%26url=GoInitTthSheetSmsConfigUI.do&urlName='+encodeURI('故障工单短信')+'&urlCode=21203657&external=true#21203657',
		        },{
		          id: 'mainmenu2',
		          name: '非故障工单短信',
		          url: 'icon-tianxiegongdan-kuozhan-hebing',
		          type: '140',
		          iframeUrl: '14&url=http://10.87.61.43/gpm/IntoGpm.gpm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('非故障工单短信')+'&urlCode=21203658&external=true#21203658',
		        },{
		          id: 'mainmenu3',
		          name: '公共服务短信',
		          url: 'icon-fabuxuqiu',
		          type: '10',
		          iframeUrl: '10&url=http://10.87.61.43/wrm/Login.do?user='+userName+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName='+encodeURI('公共服务短信')+'&urlCode=21203660&external=true#21203660',
		        },{
		          id: 'mainmenu4',
		          name: '需求工单短信',
		          url: 'icon-yingyongfuwu',
		          type: '141',
		          iframeUrl: '14&url=http://10.87.61.43/wsc/IntoWsc.wsm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('需求管理短信')+'&urlCode=21203659&external=true#21203659',
		        },{
		          id: 'mainmenu5',
		          name: '值班管理短信',
		          url: 'icon-bangongqujifangshebeijinrushenqingliucheng',
		          type: '15',
		          iframeUrl: '15&url=http://10.87.61.43/ess/IntoEss.wsm?userName='+userName+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName='+encodeURI('值班管理短信定制')+'&urlCode=demo_page10&external=true#demo_page10',
		        },{
		          id: 'mainmenu6',
		          name: '机房管理短信',
		          url: 'icon-zhibanchaxun',
		          type: '700021',
		          iframeUrl: '700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName='+encodeURI('机房管理短信')+'&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
		        }]
		  } else {  // 测试环境带端口号
		    faultSheet = [{  //this.userName
		          id: 'mainmenu1',
		          name: '故障工单短信',
		          url: 'icon-zhidongxiguzhang',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=12&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+userName+'%26url=GoInitTthSheetSmsConfigUI.do&urlName='+encodeURI('故障工单短信')+'&urlCode=21203657&external=true#21203657',
		          type: '12',
		          iframeUrl: '12&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+userName+'%26url=GoInitTthSheetSmsConfigUI.do&urlName='+encodeURI('故障工单短信')+'&urlCode=21203657&external=true#21203657',
		        },{
		          id: 'mainmenu2',
		          name: '非故障工单短信',
		          url: 'icon-tianxiegongdan-kuozhan-hebing',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('非故障工单短信')+'&urlCode=21203658&external=true#21203658',
		          type: '140',
		          iframeUrl: '14&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('非故障工单短信')+'&urlCode=21203658&external=true#21203658',
		        },{
		          id: 'mainmenu3',
		          name: '公共服务短信',
		          url: 'icon-fabuxuqiu',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=10&url=http://10.87.61.48/wrm/Login.do?user='+userName+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName='+encodeURI('公共服务短信')+'&urlCode=21203660&external=true#21203660',
		          type: '10',
		          iframeUrl: '10&url=http://10.87.61.48/wrm/Login.do?user='+userName+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName='+encodeURI('公共服务短信')+'&urlCode=21203660&external=true#21203660',
		        },{
		          id: 'mainmenu4',
		          name: '需求工单短信',
		          url: 'icon-yingyongfuwu',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/wsc/IntoWsc.wsm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('需求管理短信')+'&urlCode=21203659&external=true#21203659',
		          type: '141',
		          iframeUrl: '14&url=http://10.87.61.48/wsc/IntoWsc.wsm?userName='+userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('需求管理短信')+'&urlCode=21203659&external=true#21203659',
		        },{
		          id: 'mainmenu5',
		          name: '值班管理短信',
		          url: 'icon-bangongqujifangshebeijinrushenqingliucheng',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=15&url=http://10.87.61.48/ess/IntoEss.wsm?userName='+userName+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName='+encodeURI('值班管理短信定制')+'&urlCode=demo_page10&external=true#demo_page10',
		          type: '15',
		          iframeUrl: '15&url=http://10.87.61.48/ess/IntoEss.wsm?userName='+userName+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName='+encodeURI('值班管理短信定制')+'&urlCode=demo_page10&external=true#demo_page10',
		        },{
		          id: 'mainmenu6',
		          name: '机房管理短信',
		          url: 'icon-zhibanchaxun',
		          location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName='+encodeURI('机房管理短信')+'&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
		          type: '700021',
		          iframeUrl: '700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName='+encodeURI('机房管理短信')+'&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
		        }]
		}
		for (var i=0,len=faultSheet.length;i<len;i++) {
			var sheet = faultSheet[i];
			html += '<div onclick="indexVariable.clickSms(\''+sheet.name+'\',\''+sheet.iframeUrl+'\')" class="sms-item sms-item'+i+'"  title="'+sheet.name+'">'+
						'<div class="sms-absoute">'+
							'<img src="./images/sms/faultList'+i+'_bg.png" class="sms-bg sms-bg'+i+'"/>'+
							'<p class="sms-text">'+sheet.name+'</p>'+
						'</div>'+
					'</div>';
		}
		document.querySelector('.sms-container').innerHTML = html;
	},
	loadUserInfo: function () {
		var _this = this;
		eomsGlobal.ajaxFn('/haeoms/bsf/user/findByUserName',function (res) {
			var userName = res.data.account,
			    tel = res.data.phone;
			_this.userNameCn = res.data.name;
			_this.userName = userName;
			document.querySelector('.user-name').innerHTML = _this.userNameCn+',欢迎您';
			document.querySelector('.toto-username').innerHTML = '您好,'+userName;
			_this.loadSysCus(userName);
			_this.loadTube(userName,tel);
		});
	},
	loadDutyList: function () {
		eomsGlobal.ajaxFn('/haeoms/home/getExpertDutyList',function (res) {
			var html = '',
			    specialty = '';
			for (var i=0,data=res.data,len=data.length;i<len;i++) {
				specialty = res.data[i].SPECIALTY;
				switch(specialty){
					case 1:
					    document.querySelector('.shiftBossName').innerHTML = data[i].NAME;
						document.querySelector('.shiftBossTel').innerHTML = data[i].MOBILE;
						break;
					case 2:
					    document.querySelector('.dutyAssistantName').innerHTML = data[i].NAME;
						document.querySelector('.dutyAssistantTel').innerHTML = data[i].MOBILE;
						break;
					case 3:
					    document.querySelector('.monitorName').innerHTML = data[i].NAME;
						document.querySelector('.monitorTel').innerHTML = data[i].MOBILE;
						break;
					case 5:
					    document.querySelector('.transportName').innerHTML = data[i].NAME;
						document.querySelector('.transportTel').innerHTML = data[i].MOBILE;
						break;
					case 6:
					    document.querySelector('.exchangeName').innerHTML = data[i].NAME;
						document.querySelector('.exchangeTel').innerHTML = data[i].MOBILE;
						break;
					case 8:
					    document.querySelector('.dataName').innerHTML = data[i].NAME;
						document.querySelector('.dataTel').innerHTML = data[i].MOBILE;
						break;
					case 7:
					    document.querySelector('.webmasterName').innerHTML = data[i].NAME;
						document.querySelector('.webmasterTel').innerHTML = data[i].MOBILE;
						break;
				}
			}
		},'post');
	},
	loadMessage: function () {
		eomsGlobal.ajaxFn('/haeoms/home/getMessageData',function (res) {
			var html = '';
			for (var i=0,data=res.data,len=data.length;i<len;i++) {
				html += '<div class="message-item">'+
							'<p class="text-left" onclick="indexVariable.clickMessage(\''+data[i].ID+'\')">'+
								'<span class="text-name">'+data[i].NAME+'</span>'+
								'<span class="text-content"><i class="message-quot">“</i><i class="text-content-title" title="'+data[i].TITLE+'">'+data[i].TITLE+'</i><i class="message-quot">”</i></span>'+
							'</p>'+
							'<p class="text-right">'+data[i].MESSAGETIME+'</p>'+
						'</div>';
			}
			document.querySelector('.message-container').innerHTML = html;
		},'post');
	},
	loadLastsNews: function () {
		eomsGlobal.ajaxFn('/haeoms/home/getLatestNews',function (res) {
			var data = res.data,
			    size = data.length,
				page = size/5,
				announceObj = {},
				html = '',
				arr = [],
				contentHtml = '';
			for (var i=0;i<page;i++) {
				arr = data.slice(i*5, (i+1)*5);
				contentHtml = '';
				html += '<div class="swiper-slide">';
				for (var j=0,len=arr.length;j<len;j++) {
					var sheet = arr[j];
					contentHtml += '<div class="lastest-item">'+
						  '<p class="text-left">'+
						    '<i class="iconfont icon-jiantoucu"></i>'+
						    '<span>网络变动</span>'+
						  '</p>'+
						  '<p onclick="indexVariable.clickLastest(\''+sheet.ID+'\',\''+sheet.FLAG+'\')" class="text-center lastest-center" title="'+sheet.TITLE+'">'+sheet.TITLE+'</p>'+
						  '<p class="text-right" title="'+sheet.NY+'">'+sheet.NY+'</p>'+
						'</div>';
				}
				html += contentHtml + '</div>';
			}
			document.querySelector('.swiper-wrapper').innerHTML = html;
			var mySwiper = new Swiper('.swiper-container',{
			  loop: true,
			  mode: 'vertical',
			  autoplay: 5000,
			  pagination: '.pagination',
			  paginationClickable: true
			});
			$(".swiper-pagination-switch").hover(function() {
				$(this).click(); //鼠标划上去之后，自动触发点击事件来模仿鼠标划上去的事件
			},function() {
				mySwiper.startAutoplay(); //鼠标移出之后，自动轮播开启
			})
		},'post');
	},
	formatMenu: function (northData) {
		var headerArr = northData;
		var startHtml = '<div id="pp" class="easyui-panel" data-options="border:false" style="padding:5px;">';
		var contentHtml = '';
		var endHtml = '</div>';
		var headerHtml = '';
		var menuHtml = '';
		for (var j=0;j<headerArr.length;j++) {
			contentHtml += '<a href="#" onclick="indexVariable.clickNav(this)" class="easyui-menubutton" data-options="menu:\'#mm'+j+'\'">'+headerArr[j].name+'</a>';
			menuHtml += '<div id="mm'+j+'" data-options="noline:true">'+this.fulData(headerArr[j].children)+'</div>';
		}
		headerHtml = startHtml +  contentHtml + endHtml + menuHtml;
		document.querySelector('.navbar').innerHTML =headerHtml;
	},
	clickNav: function (item) {
		$(item).mouseenter();
	},
	clickLastest: function (id,flag) {
		var urlIframe = '';
		if (location.host == '10.87.61.43') {
		  if (flag == '1') {
		    urlIframe = '010201&url=http://10.87.61.43/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26afficheType=1%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		  } else {
		    urlIframe = '010201&url=http://10.87.61.43/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		  }
		} else {
		  if (flag == '1') {
		    urlIframe = '010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26afficheType=1%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		  } else {
		    urlIframe = '010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		  }
		}
		indexVariable.addTab('信息与公告类', urlIframe);
	},
	clickMessage: function (id) {
		var urlIframe = ''
		if (location.host == '10.87.61.43') {
		  urlIframe = '10&url=http://10.87.61.43/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookMessage.do?id='+id+'%26num=1%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663';  //5344409
		} else {
		  urlIframe = '10&url=http://10.217.1.44:9084/wrm/Login.do?user='+indexVariable.userName+'%26myaction=LookMessage.do?id='+id+'%26num=1%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663';  //5344409
		}
		indexVariable.addTab('公共服务短信', urlIframe);
	},
	clickSms: function (name,iframeUrl) {
		indexVariable.addTab(name, iframeUrl);
	},
	clickFastItem: function (name,iframeUrl) {
		indexVariable.addTab(name, iframeUrl);
	},
	parmOperNeed: function (sheetType) {
		eomsGlobal.ajaxFn('/haeoms/home/findOperUrl/'+sheetType,function (res) {
		  var locationa = '',
		      data = res.data;
		  if (data.SURL.indexOf('../')==0) {
		    locationa = data.TYPE+'&url='+(data.FURL+data.SURL.substr(2)).replace(/&/g, '%26')+'&urlName='+encodeURI(data.NAME)+'&urlCode='+data.CODE+'&external=false#'+data.SHEETTYPE
		  } else {
		    locationa = data.TYPE+'&url='+data.SURL.replace(/&/g, '%26')+'&urlName='+encodeURI(data.NAME)+'&urlCode='+data.CODE+'&external=false#'+data.SHEETTYPE
		  }
		  indexVariable.addTab(data.MAINMENU, locationa);
		})
	},
	clickOper: function (sheetType) {
		this.isClickTodo = true;
		sessionStorage.setItem('operSheetType',sheetType);
		this.parmOperNeed(sheetType);
	},
	clickNeedItem: function (sheetType) {
		this.isClickTodo = true;
		sessionStorage.setItem('operSheetType',sheetType);
		this.parmOperNeed(sheetType);
	},
	clickDayWork: function () {
		var locationa = '';
		if (location.host == '10.87.61.43') {
		  locationa = '0401&url=http://10.87.61.43/ess/IntoEss.wsm?userName='+this.userName+'%26url=/ess/wpm/Plan.do?op=initLogs&urlName='+encodeURI('值班作业待办')+'&urlCode=xqdb&external=true';
		} else {
		  locationa = '0401&url=http://10.217.1.43:9084/ess/IntoEss.wsm?userName='+this.userName+'%26url=/ess/wpm/Plan.do?op=initLogs&urlName='+encodeURI('值班作业待办')+'&urlCode=xqdb&external=true';
		}
		indexVariable.addTab('值班作业', locationa);
	},
	toggleTab: function (title,index) {
		document.getElementById('iframeNewTop').className = 'iframeindex' + index;
		if (title == '首页' && indexVariable.isClickTodo) {
			indexVariable.isClickTodo = false;
			// document.querySelector('#upComlistTable').contentWindow.location.reload();
		}
	},
	loadWidth: function (num) {
		switch (num) {
			case 8:
			  $('.navbar .l-btn').width('12.4%');
			  break;
			case 7:
			  $('.navbar .l-btn').width('14.2%');
			  break;
			case 6:
			  $('.navbar .l-btn').width('16.6%');
			  break;
			case 5:
			  $('.navbar .l-btn').width('19.9%');
			  break;
			case 4:
			  $('.navbar .l-btn').width('24.9%');
			  break;
			case 3:
			  $('.navbar .l-btn').width('33.3%');
			  break;
			case 2:
			  $('.navbar .l-btn').width('49.9%');
			  break;
			case 1:
			  $('.navbar .l-btn').width('99.9%');
			  break;
		}
	},
};
// 本地环境
if (!$.cookie('LtpaToken2')) {
	window.location.href = '/haeoms/toLogin';
}
indexVariable.tabCloseEven();
indexVariable.loadMenu();
eomsGlobal.completeGif();
// 解决在切换职位时,刷新页面,ie8中没有加载待办列表数据
if (window.addEventListener) {
	window.addEventListener('load',function () {
		// document.querySelector('#upComlistTable').contentWindow.location.reload();
	})
} else if (window.attachEvent) {
	window.attachEvent('onload',function () {
		// document.querySelector('#upComlistTable').contentWindow.location.reload();
	})
}
$(function () {
	indexVariable.loadOther();
	if (navigator.userAgent.indexOf("MSIE 8.0") > -1) {
		$('.header-bg-img').show();
	}
	$('.mobile-phone,.two-code').hover(function () {
		$('.two-code').show();
	},function () {
		$('.two-code').hide();
	});
	$('.two-code').click(function () {
		window.open("http://10.217.1.21:9084/eomsapp/Download","_self");
	})
	$('.old-rukou').click(function () {
		if (location.host == '10.87.61.43') {
		  window.location.href='http://10.87.61.43/workbench/';
		} else {
		  window.location.href='http://10.217.1.31:9082/workbench/jsp/frame/frame.jsp';
		}
	})
	$('.exit-home').click(function () {
		var _this = this;
		$.messager.confirm('提示', '确定要退出吗？', function(r){
			if (r) {
				if (document.cookie) {
				  var cookies = document.cookie.split(";");//将所有cookie键值对通过分号分割为数组
				  for (var i=0;i<cookies.length;i++) {
				    document.cookie = cookies[i] + ";path=/;expires=" + (new Date(0)).toUTCString();
				    document.cookie = cookies[i] + ";path=/haeoms/;expires=" + (new Date(0)).toUTCString();
				    document.cookie = cookies[i] + ";path=/;domain=" +document.domain+";expires=" + (new Date(0)).toUTCString();
				    document.cookie = cookies[i] + ";path=/haeoms/;domain=" +document.domain+";expires=" + (new Date(0)).toUTCString();
				  }
				}
				window.location.href = '/haeoms/toLogin';
				eomsGlobal.ajaxFn('/haeoms/logout',function (res) {
					location.reload();
				})
			}
		});
		$('.panel-tool-close').addClass('fa fa-close');
		var okSpans=$(".l-btn-text");
		var len=okSpans.length;
		for(var i=0;i<len;i++){
			var $okSpan=$(okSpans[i]);
			$okSpan.parent().parent().trigger("blur");
		}
	})
	$('.fast-config').click(function () {
		var allUrlIframe = '7&url=/workbench/kjdispose?type=1&urlName='+encodeURI('运维管理')+'&urlCode=demo_page7&external=false#demo_page7';
		indexVariable.addTab('快速通道', allUrlIframe);
	})
	$('.message-all').click(function () {
		var allUrlIframe = ''
		if (location.host == '10.87.61.43') {
		  allUrlIframe = '11&url=http://10.87.61.43/wrm/Login.do?user='+indexVariable.userName+'%26myaction=MessageBoardUI.do%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663';
		} else {
		  allUrlIframe = '11&url=http://10.217.1.44:9084/wrm/Login.do?user='+indexVariable.userName+'%26myaction=MessageBoardUI.do%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663';
		}
		indexVariable.addTab('网管留言板全部', allUrlIframe);
	})
	$('.lastnew-all').click(function () {
		var allUrlIframe = '';
		if (location.host == '10.87.61.43') {
		  allUrlIframe = '010201&url=http://10.87.61.43/wrm/Login.do?user='+indexVariable.userName+'%26myaction=ReceiveAfficheUI.do%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		} else {
		  allUrlIframe = '010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+indexVariable.userName+'%26myaction=ReceiveAfficheUI.do%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571';
		}
		indexVariable.addTab('信息与公告类', allUrlIframe);
	})
	$('.duty-all').click(function () {
		var allUrlIframe = '';
		if (location.host == '10.87.61.43') {
		  allUrlIframe = '110101&url=http://10.87.61.43/edm/IntoEdm.wsm?userName='+indexVariable.userName+'%26url=CurrentShift.do?option=contact&urlName='+encodeURI('专家值班')+'&urlCode=21203603&external=true';
		} else {
		  allUrlIframe = '110101&url=http://10.217.1.44:9085/edm/IntoEdm.wsm?userName='+indexVariable.userName+'%26url=CurrentShift.do?option=contact&urlName='+encodeURI('专家值班')+'&urlCode=21203603&external=true';
		}
		indexVariable.addTab('值班通讯录', allUrlIframe);
	})
	$('.newbuild-list-input').blur(function () {
		if ($('.newbuild-list-input').val() == '') {
			$('.import-newbuildtitle').addClass('show-dayWork').removeClass('hidden-dayWork');
		} else {
			$('.import-newbuildtitle').removeClass('show-dayWork').addClass('hidden-dayWork');
		}
	})
	$('.newbuild-list-area').blur(function () {
		if ($('.newbuild-list-area').val() == '') {
			$('.import-newbuildcontent').addClass('show-dayWork').removeClass('hidden-dayWork');
		} else {
			$('.import-newbuildcontent').removeClass('show-dayWork').addClass('hidden-dayWork');
		}
	})
	$('.newbuild-confirm-btn').click(function () {
		var newBuildObj = {};
		if ($('.newbuild-list-input').val() != '' && $('.newbuild-list-area').val() != '') {
			$('.import-newbuildtitle').removeClass('show-dayWork').addClass('hidden-dayWork');
			$('.import-newbuildcontent').removeClass('show-dayWork').addClass('hidden-dayWork');
			$.messager.confirm('提示', '确定要发布吗？', function(r){
				if (r) {
					newBuildObj = {
						name: indexVariable.userNameCn,
						title: $('.newbuild-list-input').val(),
						content: $('.newbuild-list-area').val(),
						messagetime: (new Date()).format('yyyy-MM-dd hh:mm:ss')
					};
					console.log(newBuildObj);
					newBuildStr = JSON.stringify(newBuildObj);
					eomsGlobal.ajaxFn('/haeoms/bsf/messageboard/addMessage',function (res) {
						console.log(res);
						if (res.code == 0) {
							indexVariable.loadMessage();
							$.messager.alert('提示','发布成功','',function () {
								$('#w').window('close');
								$('.newbuild-list-input').val('');
								$('.newbuild-list-area').val('');
							});
						} else {
							$.messager.alert('提示','发布失败');
						}
					},'post',newBuildStr)
				}
			})
			$('.panel-tool-close').addClass('fa fa-close');
			var okSpans=$(".l-btn-text");
			var len=okSpans.length;
			for(var i=0;i<len;i++){
				var $okSpan=$(okSpans[i]);
				$okSpan.parent().parent().trigger("blur");
			}
		} else {
			if ($('.newbuild-list-input').val() == '' && $('.newbuild-list-area').val() == '') {
				$('.import-newbuildtitle').addClass('show-dayWork').removeClass('hidden-dayWork');
				$('.import-newbuildcontent').addClass('show-dayWork').removeClass('hidden-dayWork');
			} else if ($('.newbuild-list-input').val() == '') {
				$('.import-newbuildtitle').addClass('show-dayWork').removeClass('hidden-dayWork');
				$('.import-newbuildcontent').removeClass('show-dayWork').addClass('hidden-dayWork');
			} else if ($('.newbuild-list-area').val() == '') {
				$('.import-newbuildtitle').removeClass('show-dayWork').addClass('hidden-dayWork');
				$('.import-newbuildcontent').addClass('show-dayWork').removeClass('hidden-dayWork');
			}
		}
	})
	$('.newbuild-close-btn').click(function () {
		$('#w').window('close');
		$('.newbuild-list-input').val('');
		$('.newbuild-list-area').val('');
	})
	$('.message-color').on('click',function () {
		$('#w').window('open');
		$('#w').window('hcenter');
		$('#w').window('vcenter');
	})
	Date.prototype.format = function(fmt) {
	   var o = {
	      "M+" : this.getMonth()+1,                 //月份
	      "d+" : this.getDate(),                    //日
	      "h+" : this.getHours(),                   //小时
	      "m+" : this.getMinutes(),                 //分
	      "s+" : this.getSeconds(),                 //秒
	      "q+" : Math.floor((this.getMonth()+3)/3), //季度
	      "S"  : this.getMilliseconds()             //毫秒
	  };
	  if(/(y+)/.test(fmt)) {
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	  }
	   for(var k in o) {
	      if(new RegExp("("+ k +")").test(fmt)){
	           fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	       }
	   }
	  return fmt;
	}
	function throttle(method, context) {
		 clearTimeout(method.tId);
			 method.tId= setTimeout(function(){
			 method.call(context);
		 }, 100);
	}
	function resizeWindow () {
		$('#w').window('hcenter');
		$('#w').window('vcenter');
	}
	window.onresize = function(){
		throttle(resizeWindow,null);
	}
	var easyuiPanelOnMove = function(left, top) {
	    var l = left;
	    var t = top;
	    if (l < 1) {
	        l = 1;
	    }
	    if (t < 1) {
	        t = 1;
	    }
	    var width = parseInt($(this).parent().css('width')) + 14;
	    var height = parseInt($(this).parent().css('height')) + 14;
	    var right = l + width;
	    var buttom = t + height;
	    var browserWidth = $(window).width();
	    var browserHeight = $(window).height();
	    if (right > browserWidth) {
	        l = browserWidth - width;
	    }
	    if (buttom > browserHeight) {
	        t = browserHeight - height;
	    }
	    $(this).parent().css({/* 修正面板位置 */
	        left : l,
	        top : t
	    });
	};
	$.fn.dialog.defaults.onMove = easyuiPanelOnMove;
	$.fn.window.defaults.onMove = easyuiPanelOnMove;
	$.fn.panel.defaults.onMove = easyuiPanelOnMove;
	$('.todo-bottom-title').on('click',function () {
		var $this = $(this);
		var s = this.className;
		var $next = $this.next();
		if (s.indexOf('todo0') >-1) {
			if ($next.css('display') == 'none') {
				$('.fa-right0').hide();
				$('.fa-down0').show();
			} else if ($next.css('display') == 'block') {
				$('.fa-right0').show();
				$('.fa-down0').hide();
			}
			$next.toggle();
			$('.todo-bottom-content1').hide();
			$('.todo-bottom-content2').hide();
			$('.fa-right1').show();
			$('.fa-down1').hide();
			$('.fa-right2').show();
			$('.fa-down2').hide();
		} else if (s.indexOf('todo1') >-1) {
			if ($next.css('display') == 'none') {
				$('.fa-right1').hide();
				$('.fa-down1').show();
			} else if ($next.css('display') == 'block') {
				$('.fa-right1').show();
				$('.fa-down1').hide();
			}
			$next.toggle();
			$('.todo-bottom-content0').hide();
			$('.todo-bottom-content2').hide();
			$('.fa-right0').show();
			$('.fa-down0').hide();
			$('.fa-right2').show();
			$('.fa-down2').hide();
		} else if (s.indexOf('todo2') >-1) {
			if ($next.css('display') == 'none') {
				$('.fa-right2').hide();
				$('.fa-down2').show();
			} else if ($next.css('display') == 'block') {
				$('.fa-right2').show();
				$('.fa-down2').hide();
			}
			$next.toggle();
			$('.todo-bottom-content0').hide();
			$('.todo-bottom-content1').hide();
			$('.fa-right1').show();
			$('.fa-down1').hide();
			$('.fa-right0').show();
			$('.fa-down0').hide();
		}
	})
	$('.todo-bottom-content').hide();
	$('.fa-angle-downn').hide();
	// $('.fa-angle-down').hide();
	/**
	 * 点击导航菜单中按钮，进行页面跳转
	 */
	function parmPath (type,location,flag) {
		// 根据flag,加载老框架还是展示新框架
		if (type || location) {
			if (flag == '1') {// 新框架
				return '../listPage.html';
			} else if (flag == '0') { // 老框架
				return type;
			}
		}
	}
	$('.jumptomaintab').click(function() {
		var $this = $(this),
			id = $this.data('menuid')+'',
			flag = $this.data('flag'),
			menuType = $this.data('menutype')+'',
			menuLocation = $this.data('menulocation'),
		    title = $this.text();
		menuType = menuType.substr(1);
		id = id.substr(1);
		if (menuType == '0702') {// 知识管理--运维知识
		  window.open(menuLocation+indexVariable.userName,'_blank');
		  return;
		} else if (menuType == '0807') {// 系统管理--集客投诉追踪
		  // window.open(menuLocation+indexVariable.userName,'_blank');
		  return;
		}else if (menuType == '100010502'){// 运维管理--其他--传输门户
		  window.open(menuLocation+'?sessionUserToken='+$.cookie('sessionUserToken'),'_blank');
		  return;
		} else if (menuType == '0813') { // 系统管理--家客上报专题保障  zhaodanping_gpm_24088370
		  window.open('http://10.217.2.41:9081/jt/rd/gotojt?account='+indexVariable.userName,'_blank');
		  return;
		} else if (menuType == '0810') {// 系统管理--自定义故障管理
		  window.open('http://10.87.61.43/eoms_rp/','_blank');
		  return;
		}
		if (flag == '1') { // 跳转新框架，请求接口数据
			indexVariable.addTab(title, './listPage.html?'+id);
		} else if (flag == '0') { // 跳转至嵌套框架
			if (menuType == '0808') { // 系统管理--系统公告
				menuType = '0808&url=/workbench/sysnotice?type=0808&urlName='+encodeURI('系统公告')+'&urlCode=demo_page9&external=false#demo_page9';
				indexVariable.addTab(title, menuType);
				return;
			}
			if (menuType) {
				indexVariable.addTab(title, menuType);
			}
		}
	});
	$('.m-btn-downarrow').each(function () {
		$(this).addClass('fa fa-angle-down');
		$(this).parent().append('<img class="xia-icon" src="./images/xia_icon.png" alt="">');
	})
	$('.menu-rightarrow').each(function () {
		$(this).addClass('fa fa-angle-right');
		$(this).parent().append('<img class="you-icon" src="./images/you_icon.png" alt="">');
	})
})
