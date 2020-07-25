// 页码
var easyuiTable = {};
(function () {
	function loadPage (opts) {
		opts = $.extend({
			showPageList: false,
			pageList: [10,20,30,50],
			total: 0,
			pageSize: 10
		}, opts);
		var ye = opts.total%opts.pageSize==0?parseInt(opts.total/opts.pageSize):parseInt(opts.total/opts.pageSize)+1;
		opts.$page.pagination({
			showPageList: opts.showPageList,
			pageList: opts.pageList,
			showRefresh: false,
			total: opts.total,
			pageSize: opts.pageSize,
			layout:['first','prev','next','last','sep','links','sep','manual','info'],
			beforePageText:'第',
			afterPageText:'页',
			displayMsg: '共'+ye+'页',
			onSelectPage: function (currentPage) {
				opts.callBackFn(currentPage);
			}
		});
		var node = document.querySelector('.pagination-links'),
			nodeParent = node.parentNode;
		nodeParent.children[0].title = '第一页';
		nodeParent.children[1].title = '上一页';
		nodeParent.children[2].title = '下一页';
		nodeParent.children[3].title = '最后一页';
		nodeParent.insertBefore(node,nodeParent.children[2]);
		setTimeout(function () {
			$('.pagination-num').blur(function () {
				opts.$page.pagination('select', parseInt($('.pagination-num').val()));
			});
		},0)
	}
	easyuiTable = {
		loadPage: loadPage
	}
})()