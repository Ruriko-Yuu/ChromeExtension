function devModeOn () {
  const CSS = `
    * {
      outline: 1px solid #6cf;
    }
    p,
    span,
    b,
    i {
      outline: 1px solid #c6f;
    }
    svg,
    path,
    img,
    canvas,
    ::before,
    ::after {
      outline: 1px solid #6fc;
    }
    *:hover {
      outline: 2px solid #fc6;
    }
  `;
  new_element = document.createElement("style");
  new_element.setAttribute("type", "text/css");
  new_element.setAttribute("id", "ruriko-mark-dev");
  new_element.innerHTML = `${CSS}`;
  document.body.appendChild(new_element);
}
function devModeOff () {
  document.body.removeChild(document.getElementById('ruriko-mark-dev'))
}
// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
  // console.log(
  //   request, sender
  // )
  if (request.type === 'shell') {
    switch (request.value) {
      case 'devModeOn':
        devModeOn()
        break;
      case 'devModeOff':
        devModeOff()
        break;
      case 'monitor':
        let obj = {}
        for (let i in window.performance.memory) {
          obj[i] = window.performance.memory[i]
        }
        console.log(obj)
        sendResponse(obj)
        break;
      default:
        break;
    }
  }
});
(function() {
  let url
  let arr = window.location.href.split('/')
  if (arr[2]) {
    url = arr[2]
  } else {
    url = null
  }
  let obj = {}
  chrome.storage.sync.get({dev_mode: {}}, (v) => {
    console.log(v)
    if (v.dev_mode[url] === 1) {
      devModeOn()
    }
    
  })
  if (localStorage.getItem("dev_mode") !== null) {
    obj = JSON.parse(localStorage.getItem("dev_mode"))
  }
  console.log(window.location.href)
})();  