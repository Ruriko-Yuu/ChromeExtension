let doc: any = document;
let hidden = '';
let visibilityChange = '';
if (typeof doc.hidden !== 'undefined') {
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof doc.mozHidden !== 'undefined') {
  hidden = 'mozHidden';
  visibilityChange = 'mozvisibilitychange';
} else if (typeof doc.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof doc.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

document.addEventListener(
  visibilityChange,
  () => {
    if (doc[hidden]) {
      document.title = '(╯‵□′)╯︵┻━┻';
    } else {
      document.title = '欢迎回来';
    }
  },
  false
);
// var origin = {
//   open: XMLHttpRequest.prototype.open,
//   send: XMLHttpRequest.prototype.send,
// };
// window.XMLHttpRequest.prototype.open = function (a, b) {
//   console.log(this);
//   // this.addEventListener('loadend', onReadyStateChangeReplacement);

//   this.addEventListener('load', replaceFn);
//   // this.addEventListener('readystatechange', replaceFn);
//   origin.open.apply(this, arguments);
// };
// console.log(XMLHttpRequest.prototype.open);
// XMLHttpRequest.prototype.send = function (a, b) {
//   origin.send.apply(this, arguments);
// };
// function replaceFn(obj) {
//   console.log(obj);
// }

// TODO: 🚀
function devModeOn() {
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
  let new_element = document.createElement('style');
  new_element.setAttribute('type', 'text/css');
  new_element.setAttribute('id', 'ruriko-mark-dev');
  new_element.innerHTML = `${CSS}`;
  document.body.appendChild(new_element);
}
function devModeOff() {
  let HTMLElement = document.getElementById('ruriko-mark-dev');
  if (HTMLElement !== null) {
    document.body.removeChild(HTMLElement);
  }
}
// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'shell') {
    switch (request.value) {
      case 'devModeOn':
        devModeOn();
        break;
      case 'devModeOff':
        devModeOff();
        break;
      case 'monitor':
        let obj: any = {};
        let win: any = window;
        for (let i in win.performance.memory) {
          obj[i] = win.performance.memory[i];
        }
        console.log(obj);
        sendResponse(obj);
        break;
      default:
        break;
    }
  }
});
(function () {
  let url: any;
  let arr = window.location.href.split('/');
  if (arr[2]) {
    url = arr[2];
  } else {
    url = null;
  }
  let obj = {};
  chrome.storage.sync.get({ dev_mode: {} }, (v) => {
    console.log('扩展插件【Ruriko的工具箱】:storage', v);
    if (v.dev_mode[url] === 1) {
      devModeOn();
    }
  });
  console.log('扩展插件【Ruriko的工具箱】:chrome', chrome);
  const storageDevMode = localStorage.getItem('dev_mode');
  if (storageDevMode !== null) {
    obj = JSON.parse(storageDevMode);
  }
  if (
    'https://www.bilibili.com/'.indexOf(window.location.href.split('?')[0]) !==
    -1
  ) {
    console.log(
      `%c换一换回退模块加载`,
      'color:white;background: #4386FE;padding: 3px 10px;border-radius: 3px'
    );
  }
  chrome.storage.sync.get({ statistics: {} }, (v) => {
    console.log('扩展插件【Ruriko的工具箱】:storage', v);
    // chrome.storage.sync.set({ dev_mode: v.dev_mode }, () => {
    //   console.log('赋值成功');
    // });
  });
})();
