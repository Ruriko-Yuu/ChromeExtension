// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.sendMessage(tabId, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}
let url
function backTabUrl() {
  getCurrentTabId((tabId) => {
    chrome.tabs.get(tabId, (e) => {
      let arr = e.url.split('/')
      if (arr[2]) {
        url = arr[2]
      } else {
        url = null
      }
    })
  });
}
backTabUrl()
window.onload = () => {
  chrome.storage.sync.get({dev_mode: {}}, (v) => {
    console.log(v.dev_mode[url])
    if (v.dev_mode[url] === 1) {
      $("#dev-mode")[0].className="switch on"
      newDevWin()
    }
  })
}
function newDevWin () {
  chrome.storage.sync.get({devWinId: {}}, (v) => {
    console.log(v.devWinId)
    chrome.tabs.query({ active: true, currentWindow: false }, function (tabs) {
      if (!tabs.some(ele => ele.windowId === v.devWinId)) {
        chrome.windows.create({url: "/html/dev.html", height: 400, width: 500, type: "popup"}, (win) => {
          chrome.storage.sync.set({devWinId: win.id}, () => {
            console.log('赋值成功')
          })
        })
      }
    });
  })
}
$("#dev-mode").click((e) => {
  if (e.currentTarget.className === "switch") {
    e.currentTarget.className = "switch on";
    let obj = {}
    chrome.storage.sync.get({dev_mode: {}}, (v) => {
      v.dev_mode[url] = 1
      chrome.storage.sync.set({dev_mode: v.dev_mode}, () => {
        console.log('赋值成功')
      })
    })
    if (localStorage.getItem("dev_mode") !== null) {
      obj = JSON.parse(localStorage.getItem("dev_mode"))
    }
    obj[url] = 1
    localStorage.setItem("dev_mode", JSON.stringify(obj))
    sendMessageToContentScript({
      type: 'shell',
      value: 'devModeOn',
    }, (response) => {
      console.log(response)
    });
    newDevWin()
  } else {
    sessionStorage.setItem("dev_mode", "0");
    e.currentTarget.className = "switch";
    let obj = {}
    if (localStorage.getItem("dev_mode") !== null) {
      obj = JSON.parse(localStorage.getItem("dev_mode"))
    }
    delete obj[url]
    localStorage.setItem("dev_mode", JSON.stringify(obj))
    chrome.storage.sync.get({dev_mode: {}}, (v) => {
      v.dev_mode[url] = 0
      chrome.storage.sync.set({dev_mode: v.dev_mode}, () => {
        console.log('赋值成功')
      })
    })
    sendMessageToContentScript({
      type: 'shell',
      value: 'devModeOff',
    }, (response) => {
      console.log(response)
    });
  }
});


