import Sortable from 'sortablejs';

function analyseBookMark(
  data: { [key: string]: any },
  bookmarkArray: any[],
  path: string
) {
  for (var children in data) {
    if (data[children].length > 0 && typeof data[children] == 'object') {
      if (data && data.title && data.title !== '') {
        path = path + data.title + '/';
      }
      analyseBookMark(data[children], bookmarkArray, path);
    } else {
      if (typeof data[children] == 'object') {
        for (var childKey in data[children]) {
          if (typeof data[children][childKey] == 'object') {
            if (data && data[children].title && data[children].title !== '') {
              path = path + data[children].title + '/';
            }
            analyseBookMark(data[children][childKey], bookmarkArray, path);
          } else {
            if (childKey === 'url') {
              var url = data[children][childKey];
              var title = data[children].title;
              var path = path;
              var jsonData = {
                title: title,
                url: url,
                path: path,
              };
              bookmarkArray.push(jsonData);
            }
          }
        }
      } else {
        if (children === 'url') {
          var url = data[children];
          var title = data.title;
          var path = path;
          var jsonData = {
            title: title,
            url: url,
            path: path,
          };
          bookmarkArray.push(jsonData);
        }
      }
    }
  }
}

const bookmarkList = () => {
  chrome.bookmarks.getTree(function (bookmarkArray) {
    console.log(bookmarkArray);
    let a: any[] = [];
    analyseBookMark(bookmarkArray, a, '');
    let innerHTML = '';
    a.forEach((ele) => {
      let str = ele.url.split('?')[0].split('/');
      innerHTML += `
        <li>
          <a href="${ele.url}" target="_blank">
            <!--<img style="display: block;width: 30px;height: 30px;margin: 0 auto" src="${
              'chrome://favicon/' + ele.url
            }" />-->
            <p style="text-align: center;">${ele.title.slice(0, 4)}</p>
          </a>
        </li>
      `;
    });
    document.getElementsByTagName('ul')[0].innerHTML = innerHTML;
  });
  // //
  var el = document.getElementById('sort');
  //设置配置
  var ops = {
    animation: 300,
    //拖动结束
    onEnd: function (evt: any) {
      // console.log(evt);
      //获取拖动后的排序
      // const arr = sortable.toArray();
      // alert(JSON.stringify(arr));
    },
  };
  //初始化
  if (el !== null) {
    const sortable = Sortable.create(el, ops);
  }
};

export default bookmarkList;
