//判断访问设备是否是移动设备
function IsMobile() {
	//获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
	var info = navigator.userAgent;
	//通过正则表达式的test方法判断是否包含“Mobile”字符串
	var isPhone = /mobile/i.test(info);
	//如果包含“Mobile”（是手机设备）则返回true
	return isPhone;
}

//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return decodeURI(r[2]);
	return null; //返回参数值
}

function updateUrl(key, value) {
	var newurl = updateQueryStringParameter(key, value)
	//向当前url添加参数，没有历史记录
	window.history.replaceState({
		path: newurl
	}, '', newurl);
}

function updateQueryStringParameter(key, value) {
	var uri = window.location.href
	if (!value) {
		return uri;
	}
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	if (uri.match(re)) {
		return uri.replace(re, '$1' + key + "=" + value + '$2');
	} else {
		return uri + separator + key + "=" + value;
	}
}

//复制到剪贴板
function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}