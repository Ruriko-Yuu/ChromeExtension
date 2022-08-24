const characterList = [
  { key: "Kawakazekai", value: "" }, // 江风
  { key: "YamakazeKai", value: "" }, // 山风
  { key: "Yuudachi", value: "" }, // 夕立
  { key: "Akatsuki", value: "" }, // 晓
  { key: "Верный", value: "" }, // 响
  { key: "Ayanami", value: "" }, // 凌波
  { key: "AsakazeKai", value: "" }, // 朝风
  { key: "Libecciokai", value: "" }, // 西南风
  { key: "Maestralekai", value: "" }, // 西北风
  { key: "Jervis", value: "" }, // 杰维斯
  { key: "GangutKai", value: "" }, // 甘古特
  { key: "Mizuhokai", value: "" }, // 瑞穗
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
  { key: "YamakazeKai", value: "" },
];
class AudioTips {

  static delIframe() {
    const RBQ = document.getElementsByTagName("body")[0]; // 找一个受害者
    for (
      let i = 0;
      i < document.getElementsByClassName("iframe-del").length;
      i++
    ) {
      RBQ.removeChild(document.getElementsByClassName("iframe-del")[i]);
    }
    console.log('delIframe');
    return document.getElementsByClassName("auto-del").length !== 0;
  }

  static createIframe(obj) {
    this.delIframe();
    const iframe = document.createElement("iframe");
    iframe.src = obj.src;
    iframe.id = obj.id;
    iframe.className = obj.root === "root" ? "auto-del" : "iframe-del";
    iframe.setAttribute("style", "display:none");
    document.body.appendChild(iframe);
  }

  static speechInteraction(r) {
    let secretary = characterList[new Date().getDate() - 1].key; // 设置本次角色
    secretary = 'Maestralekai'
    let format = 'mp3'
    $.ajax({url:`/media/audio/FirstOpen/${secretary}.${format}`,success:function(result){
      console.log('success')
      ahhh()
    }, error:function(){
      $.ajax({url:`/media/audio/FirstOpen/${secretary}.oga`,success:function(result){
        format = 'oga'
        ahhh()
      }, error:function(){
        secretary = 'YamakazeKai'
        ahhh()
      }});
    }});
    const ahhh = () => {
      if (sessionStorage.getItem("firstOpen") !== "false") {
        // 首次打开页面提示
        setTimeout(() => {
          this.createIframe({
            src: `/media/audio/FirstOpen/${secretary}.${format}`,
            id: `${secretary}-first-open`,
          });
        }, 3e3);
      }
      sessionStorage.setItem("firstOpen", "false"); // 离开当前标签
      document.onmouseleave = () => {
        this.createIframe({
          src: `/media/audio/Leave/${secretary}.${format}`,
          id: `${secretary}-leave`,
        });
      };
      if (r === "meetAgain") {
        // 再次切换到该标签页
        this.createIframe({
          src: `/media/audio/MeetAgain/${secretary}.${format}`,
          id: `${secretary}-meet-again`,
        });
      }
      if (r === "OnTimeAlarm") {
        // 整点报时
        setInterval(() => {
          if (new Date().getMinutes() === 0 && new Date().getSeconds() === 0) {
            const hours =
              (new Date().getHours() > 9 ? "" : "0") + new Date().getHours();
              this.createIframe({
              src: `/media/audio/OnTimeAlarm/${secretary}/${secretary}${hours}.${format}`,
              id: `${secretary}-ontime-alarm_${hours}`,
              root: "root",
            });
          }
        }, 1e3);
      }
    }
    // 鼠标移动触发====================================================================
    function mousePosition(ev) {
      if (ev.pageX || ev.pageY) {
        return { x: ev.pageX, y: ev.pageY };
      }
      return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop,
      };
    }
    function mouseMove(ev) {
      ev = ev || window.event;
      // const mousePos = mousePosition(ev);
      mousePosition(ev);
      // console.warn(mousePosition(ev))
      // if (mousePos.x === mousePos.y) {
      // }
    }
    document.onmousemove = mouseMove;
  }
}
let workflow = new AudioTips();
workflow.constructor.speechInteraction()
workflow.constructor.speechInteraction("OnTimeAlarm")

doc = document;
if (typeof doc.hidden !== "undefined") {
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof doc.mozHidden !== "undefined") {
  hidden = "mozHidden";
  visibilityChange = "mozvisibilitychange";
} else if (typeof doc.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof doc.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}
document.addEventListener(
  visibilityChange,
  () => {
    if (doc[hidden]) {
      document.title = '(╯‵□′)╯︵┻━┻';
    } else {
      document.title = '欢迎回来';
      workflow.constructor.speechInteraction("meetAgain");
      setTimeout(() => {
        document.title = '新标签页';
      }, 3e3);
    }
  },
  false
);
function getStyle(ele, key) {
  if (typeof ele.currentStyle === "undefined") {
    return ele.ownerDocument.defaultView.getComputedStyle(ele, null)[key];
  } else {
    return ele.currentStyle[key];
  }
}
function videoAuto() {
  if (
    window.innerWidth / window.innerHeight >
    parseFloat(getStyle(document.getElementsByTagName("video")[0], "width")) /
      parseFloat(getStyle(document.getElementsByTagName("video")[0], "height"))
  ) {
    document.getElementsByTagName("video")[0].style.width = "100%";
    document.getElementsByTagName("video")[0].style.height = "auto";
  } else {
    document.getElementsByTagName("video")[0].style.width = "auto";
    document.getElementsByTagName("video")[0].style.height = "100%";
  }
}
function analyseBookMark (data, bookmarkArray, path) {
  for (var children in data) {
      if (data[children].length > 0 && typeof(data[children]) == "object") {
          if (data && data.title && data.title !== '') {
              path = path + data.title + '/';
          }
          analyseBookMark(data[children], bookmarkArray, path);
      } else {
          if (typeof(data[children]) == "object") {
              for(var childKey in data[children]) {
                  if (typeof(data[children][childKey]) == "object") {
                      if (data && data[children].title && data[children].title !== '') {
                          path = path + data[children].title + '/';
                      }
                      analyseBookMark(data[children][childKey], bookmarkArray, path);
                  } else {
                      if (childKey === "url") {
                          var url = data[children][childKey];
                          var title = data[children].title;
                          var path = path;
                          var jsonData = {
                              title: title,
                              url: url,
                              path: path
                          };
                          bookmarkArray.push(jsonData);
                      }
                  }
              }
          } else {
              if (children === "url") {
                  var url = data[children];
                  var title = data.title;
                  var path = path;
                  var jsonData = {
                      title: title,
                      url: url,
                      path: path
                  };
                  bookmarkArray.push(jsonData);
              }
          }
      }
  }
};
window.onload = () => {
  videoAuto()
  chrome.bookmarks.getTree(function(bookmarkArray){
    console.log(bookmarkArray)
    let a = [];
    analyseBookMark(bookmarkArray, a, '')
    let innerHTML = ''
    a.forEach(ele => {
      let str = ele.url.split('?')[0].split('/')
      innerHTML += `
        <li>
          <a href="${ele.url}" target="_blank">
            <img style="display: block;width: 30px;height: 30px;margin: 0 auto" src="${'chrome://favicon/size/32@2x/'+ele.url}" />
            <p style="text-align: center;">${ele.title.slice(0, 4)}</p>
          </a>
        </li>
      `
    })
    document.getElementsByTagName('ul')[0].innerHTML = innerHTML
  });
}
window.addEventListener("resize", videoAuto)

//
var el = document.getElementById('sort');
//设置配置
var ops = {
  animation: 300,
  //拖动结束
  onEnd: function (evt) {
      // console.log(evt);
      //获取拖动后的排序
      var arr = sortable.toArray();
      // alert(JSON.stringify(arr));
  },};
//初始化
var sortable = Sortable.create(el, ops);

