Qmsg.config({
	showClose: false,
	timeout: 1500,
	html: true
})

scrolled = false
if (IsMobile()) {
	// phone端适用
	$("#main").delegate('p', 'touchstart', function(event) {
		startTime = new Date().getTime();
		selected = this
		timeout = setTimeout(function() { // 长按
			if (!scrolled) {
				copyToClipboard($(selected).text())
				Qmsg.success("已复制 <span class='keyword'>" + $(selected).text() + "</span> 到剪贴板")
			}
		}, 400);
		scrolled = false
	});
	$("#main").delegate('p', 'touchend', function(event) {
		endTime = new Date().getTime();
		clearTimeout(timeout);
		if ((endTime - startTime) < 400) { // 单击
			if (!scrolled) {
				copyToClipboard($(this).text().match("[0-9]+"))
				Qmsg.success("已复制 <span class='keyword'>" + $(this).text().match("[0-9]+") + "</span> 到剪贴板")
			}
		}
	});
} else { //非移动设备
	var cssFileUrl = './css/scrollbar.css';
	$("head").append(`
<style>
/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  border-radius: 6px;
  background-color: rgba(232, 245, 233, .1);
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  box-shadow: inset 0 0 0px rgba(232, 245, 233, .5);
  background-color: rgba(0, 230, 118, .5);
}
</style>`);

	// web端适用
	$("#main").delegate('p', 'mousedown', function(event) {
		startTime = new Date().getTime();
		timeout = setTimeout(function() { // 长按
			copyToClipboard($(selected).text())
			Qmsg.success("已复制 <span class='keyword'>" + $(selected).text() + "</span> 到剪贴板")
		}, 400);
		scrolled = false
	});
	$("#main").delegate('p', 'mouseup', function(event) {
		endTime = new Date().getTime();
		clearTimeout(timeout);
		selected = this
		if ((endTime - startTime) < 400) { // 单击
			copyToClipboard($(this).text().match("[0-9]+"))
			Qmsg.success("已复制 <span class='keyword'>" + $(this).text().match("[0-9]+") + "</span> 到剪贴板")
		}

	});
}
var info = JSON.parse(localStorage.getItem("Tools.1.info"))
if (info == null) {
	info = {}
	localStorage.setItem("Tools.1.info", JSON.stringify(info))
	loading = Qmsg.loading("正在加载数据中...")
}

function run() {
	var idType = $("#types").children("[group='Item']")
	$("#types").on("click", ".types-item", function() {
		$(idType).css("color", "")
		idType = this
		$(this).css("color", "#69F0AE")
		ids = []
		var str = ""
		localStorage.getItem("Tools.1.id." + $(this).attr("group")).trim().split('\n').forEach(function(v, i) {
			ids.push(v)
			str = str + `<p>${v}</p>`
		})
		$("#left").empty()
		$("#left").append(str)
	});
	$(idType).click()

	$("#search-input").submit(function(e) {
		keyword = $("#search-input").children().val()
		if (keyword != "" & keyword != " " & keyword != "-") {
			str = ""
			for (i in ids) {
				if (ids[i].indexOf(keyword) != -1) {
					str = str + `<p>${ids[i]}</p>`
				}
			}
			$("#right").empty()
			$("#right").append(str)
		}
		return false
	});
	var timeout = undefined;
	var startTime = 0;
	var endTime = 0;
	var selected = null
	$("#left").scroll(function(event) {
		scrolled = true
	});
	$("#right").scroll(function(event) {
		scrolled = true
	});
}

$.getJSON("./info.json", function(data) {
	var Info = data
	var keys = Object.keys(data)
	var length = keys.length
	var count = 0
	for (i in keys) {
		if (typeof(info[keys[i]]) != "undefined") {
			if (info[keys[i]].version != data[keys[i]].version) {
				let a = i
				jQuery.get("./" + keys[a] + ".txt", function(data) {
					$("#types").append(`<div class="types-item" group="${keys[a]}">${Info[keys[a]].name}</div>`)
					localStorage.setItem("Tools.1.id." + keys[a], data)
					info[keys[a]] = Info[keys[a]]
					localStorage.setItem("Tools.1.info", JSON.stringify(info))
					count++
					if (length == count) {
						if (typeof(loading) != "undefined") {
							loading.close()
						}
						Qmsg.success("加载完成")
						run()
					}
				});
			} else {
				$("#types").append(`<div class="types-item" group="${keys[i]}">${Info[keys[i]].name}</div>`)
				count++
				if (length == count) {
					run()
				}
			}
		} else {
			let a = i
			jQuery.get("./" + keys[a] + ".txt", function(data) {
				$("#types").append(`<div class="types-item" group="${keys[a]}">${Info[keys[a]].name}</div>`)
				localStorage.setItem("Tools.1.id." + keys[a], data)
				info[keys[a]] = Info[keys[a]]
				localStorage.setItem("Tools.1.info", JSON.stringify(info))
				count++
				if (length == count) {
					if (typeof(loading) != "undefined") {
						loading.close()
					}
					Qmsg.success("加载完成")
					run()
				}
			});
		}
	}


})