import React, { useState, useEffect, useRef } from 'react';

import './index.scss';

class DevModeSpace extends React.Component<any> {
  state = {
    url: null,
  };
  render() {
    return (
      <>
        <div className="switch" id="dev-mode" onClick={this.changeMode}>
          <p>on</p>
          <p>off</p>
        </div>
      </>
    );
  }
  // 获取当前选项卡ID
  getCurrentTabId(callback: any) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (callback) callback(tabs.length ? tabs[0].id : null);
    });
  }
  // 向content-script主动发送消息
  sendMessageToContentScript(message: any, callback: any) {
    this.getCurrentTabId((tabId: number) => {
      chrome.tabs.sendMessage(tabId, message, function (response) {
        if (callback) callback(response);
      });
    });
  }
  // 获取当前标签url
  backTabUrl = () => {
    this.getCurrentTabId((tabId: number) => {
      chrome.tabs.get(tabId, (e: { [key: string]: any }) => {
        let arr = e.url.split('/');
        if (arr[2]) {
          this.setState({ url: arr[2] }, () => {
            chrome.storage.sync.get({ dev_mode: {} }, (v) => {
              console.log(this.state.url);
              if (this.state.url !== null) {
                if (v.dev_mode[this.state.url] === 1) {
                  const space = document.getElementById('dev-mode');
                  space !== null && (space.className = 'switch on');
                }
              }
            });
          });
        } else {
          this.setState({ url: null });
          // url = null;
        }
      });
    });
  };
  newDevWin() {
    chrome.storage.sync.get({ devWinId: {} }, (v) => {
      console.log(v.devWinId);
      chrome.tabs.query(
        { active: true, currentWindow: false },
        function (tabs) {
          if (!tabs.some((ele) => ele.windowId === v.devWinId)) {
            chrome.windows.create(
              { url: '/html/dev.html', height: 400, width: 500, type: 'popup' },
              (win: any) => {
                chrome.storage.sync.set({ devWinId: win.id }, () => {
                  console.log('赋值成功');
                });
              }
            );
          }
        }
      );
    });
  }
  changeMode = (e: any) => {
    console.log(e);
    const space = document.getElementById('dev-mode');
    if (space !== null) {
      if (space.className === 'switch') {
        space.className = 'switch on';
        let obj: any = {};
        chrome.storage.sync.get({ dev_mode: {} }, (v) => {
          if (this.state.url !== null) {
            v.dev_mode[this.state.url] = 1;
            chrome.storage.sync.set({ dev_mode: v.dev_mode }, () => {
              console.log('赋值成功');
            });
          }
        });
        if (localStorage.getItem('dev_mode') !== null) {
          obj = JSON.parse(localStorage.getItem('dev_mode') || '{}');
        }
        if (this.state.url !== null) {
          obj[this.state.url] = 1;
        }
        localStorage.setItem('dev_mode', JSON.stringify(obj));
        this.sendMessageToContentScript(
          {
            type: 'shell',
            value: 'devModeOn',
          },
          (response: any) => {
            console.log(response);
          }
        );
        // newDevWin()
      } else if (space.className === 'switch on') {
        sessionStorage.setItem('dev_mode', '0');
        space.className = 'switch';
        let obj = {};
        if (localStorage.getItem('dev_mode') !== null) {
          obj = JSON.parse(localStorage.getItem('dev_mode') || '{}');
        }
        if (this.state.url !== null) {
          delete obj[this.state.url];
        }
        localStorage.setItem('dev_mode', JSON.stringify(obj));
        chrome.storage.sync.get({ dev_mode: {} }, (v) => {
          if (this.state.url !== null) {
            v.dev_mode[this.state.url] = 0;
          }
          chrome.storage.sync.set({ dev_mode: v.dev_mode }, () => {
            console.log('赋值成功');
          });
        });
        this.sendMessageToContentScript(
          {
            type: 'shell',
            value: 'devModeOff',
          },
          (response: any) => {
            console.log(response);
          }
        );
      }
    }
  };
  componentDidMount() {
    this.backTabUrl();
  }
}
export default DevModeSpace;
