import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './index.scss';

class SearchSpace extends React.Component<any> {
  state = {
    engine: 'bd',
    word: '',
    searchList: [],
    searchActive: -1,
    storage: {},
  };

  wordChange = (e: { target: { value: string } }) => {
    this.setState({ searchActive: -1 });
    this.setState({ word: e.target.value }, this.getSearchList);
  };

  changeEngine = () => {};

  getSearchList = () => {
    if (this.state.word === '') {
      this.setState({ searchList: [] }, this.htmlsearchList);
    } else {
      const storage: { [key: string]: [string] } = this.state.storage;
      if (storage[this.state.word]) {
        const searchList = storage[this.state.word];
        this.setState({ searchList });
      } else {
        axios
          .get('https://suggestion.baidu.com/su', {
            params: {
              pre: 1,
              p: 3,
              ie: 'utf-8',
              cb: '',
              prod: 'pc',
              from: 'pc_web',
              wd: this.state.word,
              req: 2,
              csor: this.state.word.length,
              sugsid:
                '36554,36624,36726,36455,36413,34812,36691,36167,36679,36774,36745,36762,36771,36766,26350,36864,36649',
            },
          })
          .then((res) => {
            if (res.status === 200) {
              const data = res.data;
              let a = data
                .slice(1, data.length - 2)
                .replace(/\{q:/, `{"q":`)
                .replace(/,s:/, `,"s":`)
                .replace(/,p:/, `,"p":`)
                .replace(/\}/, `}`);
              const searchList = JSON.parse(a).s.slice(0, 9);
              storage[this.state.word] = searchList;
              this.setState({ searchList, storage });
            }
          });
      }
    }
  };

  searchEnter = (e: any) => {
    switch (e.code) {
      case 'Enter':
        if (e.keyCode === 13) {
          if (this.state.searchActive === -1) {
            window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${this.state.word}`;
          } else {
            window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${
              this.state.searchList[this.state.searchActive]
            }`;
          }
        }
        break;
      case 'ArrowDown':
        var num = (this.state.searchActive + 1) % this.state.searchList.length;
        this.setState({ searchActive: num });
        console.log(this.state.searchActive);
        break;
      case 'ArrowUp':
        if (this.state.searchActive <= 0) {
          num = this.state.searchList.length - 1;
        } else {
          num = (this.state.searchActive - 1) % this.state.searchList.length;
        }
        this.setState({ searchActive: num });
        console.log(this.state.searchActive);
        break;
      default:
        // console.log(e.code);
        break;
    }
    // console.log(e);
  };

  htmlsearchList = () => {
    const backRedFont = (str: string): any => {
      const arr = str.split(this.state.word);
      if (arr.length === 1) {
        return <>{str}</>;
      } else {
        return (
          <>
            {arr[0]}
            <span style={{ color: 'red' }}>{this.state.word}</span>
            {arr.slice(1).join(this.state.word)}
          </>
        );
      }
    };
    return this.state.searchList.length === 0 ? (
      ''
    ) : (
      <ul className="search-list">
        {this.state.searchList.map((ele: string, idx: number) => (
          <li
            className={this.state.searchActive === idx ? 'is-active' : ''}
            onClick={() =>
              (window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${ele}`)
            }
            key={idx}
          >
            {backRedFont(ele)}
          </li>
        ))}
      </ul>
    );
  };

  render() {
    return (
      <div className="search-space">
        <div className="engine-select" onClick={this.changeEngine}>
          <i>
            <img
              src="../../../../../public/media/image/icon/baidu.webp"
              alt=""
            />
          </i>
          <span className="ream">▼</span>
        </div>
        <input
          placeholder="搜索网页"
          type="text"
          autoComplete="off"
          value={this.state.word}
          onKeyDown={this.searchEnter}
          onChange={this.wordChange}
          onFocus={() => {
            this.state.word !== '' && this.getSearchList();
          }}
          onBlur={() =>
            setTimeout(() => {
              this.setState({ searchList: [] });
            }, 2e2)
          }
        />
        {this.state.word === '' ? (
          ''
        ) : (
          <i
            className="clear"
            onClick={() => {
              this.setState({ word: '', searchList: [] });
            }}
          >
            ✖
          </i>
        )}
        {this.htmlsearchList()}
      </div>
    );
  }
  componentDidMount() {
    // const color = 'red';
    // function cge(backgroundColor: string) {
    //   document.body.style.backgroundColor = backgroundColor;
    // }
    // chrome.tabs.query({ active: false, currentWindow: true }, function (tabs) {
    //   if (tabs[0].id !== void 0) {
    //     chrome.scripting.executeScript({
    //       target: { tabId: tabs[0].id },
    //       func: cge,
    //       args: [color],
    //     });
    //   }
    // });
  }
}

export default SearchSpace;
