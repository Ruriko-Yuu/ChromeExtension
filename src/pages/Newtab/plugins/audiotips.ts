import axios from 'axios';
const characterList = [
  { key: 'Kawakazekai', value: '' }, // 江风
  { key: 'YamakazeKai', value: '' }, // 山风
  { key: 'Yuudachi', value: '' }, // 夕立
  { key: 'Akatsuki', value: '' }, // 晓
  { key: 'Верный', value: '' }, // 响
  { key: 'Ayanami', value: '' }, // 凌波
  { key: 'AsakazeKai', value: '' }, // 朝风
  { key: 'Libecciokai', value: '' }, // 西南风
  { key: 'Maestralekai', value: '' }, // 西北风
  { key: 'Jervis', value: '' }, // 杰维斯
  { key: 'GangutKai', value: '' }, // 甘古特
  { key: 'Mizuhokai', value: '' }, // 瑞穗
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
  { key: 'YamakazeKai', value: '' },
];
export default class AudioTips {
  static delIframe() {
    const RBQ = document.getElementsByTagName('body')[0]; // 找一个受害者
    for (
      let i = 0;
      i < document.getElementsByClassName('iframe-del').length;
      i++
    ) {
      RBQ.removeChild(document.getElementsByClassName('iframe-del')[i]);
    }
    console.log('delIframe');
    return document.getElementsByClassName('auto-del').length !== 0;
  }

  static createIframe(obj: { [ket: string]: string }) {
    this.delIframe();
    const iframe = document.createElement('iframe');
    iframe.src = obj.src;
    iframe.id = obj.id;
    iframe.className = obj.root === 'root' ? 'auto-del' : 'iframe-del';
    iframe.setAttribute('style', 'display:none');
    document.body.appendChild(iframe);
  }

  static speechInteraction(r: string) {
    let secretary = characterList[new Date().getDate() - 1].key; // 设置本次角色
    secretary = 'Maestralekai';
    let format = 'mp3';

    const ahhh = () => {
      if (sessionStorage.getItem('firstOpen') !== 'false') {
        // 首次打开页面提示
        setTimeout(() => {
          this.createIframe({
            src: `../../../../public/media/audio/FirstOpen/${secretary}.${format}`,
            id: `${secretary}-first-open`,
          });
        }, 3e3);
      }
      sessionStorage.setItem('firstOpen', 'false'); // 离开当前标签
      document.onmouseleave = () => {
        this.createIframe({
          src: `../../../../public/media/audio/Leave/${secretary}.${format}`,
          id: `${secretary}-leave`,
        });
      };
      if (r === 'meetAgain') {
        // 再次切换到该标签页
        this.createIframe({
          src: `../../../../public/media/audio/MeetAgain/${secretary}.${format}`,
          id: `${secretary}-meet-again`,
        });
      }
      if (r === 'OnTimeAlarm') {
        // 整点报时
        setInterval(() => {
          if (new Date().getMinutes() === 0 && new Date().getSeconds() === 0) {
            const hours =
              (new Date().getHours() > 9 ? '' : '0') + new Date().getHours();
            this.createIframe({
              src: `../../../../public/media/audio/OnTimeAlarm/${secretary}/${secretary}${hours}.${format}`,
              id: `${secretary}-ontime-alarm_${hours}`,
              root: 'root',
            });
          }
        }, 1e3);
      }
    };
    // secretary = 'YamakazeKai'
    axios
      .get(`../../../../public/media/audio/FirstOpen/${secretary}.${format}`)
      .then((res) => {
        ahhh();
      })
      .catch((err) => {
        axios
          .get(`../../../../public/media/audio/FirstOpen/${secretary}.oga`)
          .then((res) => {
            format = 'oga';
            ahhh();
          })
          .catch((err) => {
            secretary = 'YamakazeKai';
            ahhh();
          });
      });
    // 鼠标移动触发====================================================================
    function mousePosition(ev: any) {
      if (ev.pageX || ev.pageY) {
        return { x: ev.pageX, y: ev.pageY };
      }
      return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop,
      };
    }
    function mouseMove(ev: any) {
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
