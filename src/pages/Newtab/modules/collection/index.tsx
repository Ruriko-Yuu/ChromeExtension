import React, { useState, useEffect, useRef } from 'react';
import StatisticsSpace from './models/statistics/index';
import Sortable from 'sortablejs';

import './index.scss';

const defaultCollectionList = [
  {
    type: 'function',
    icon: '../../../../../public/media/image/icon/z23_2.png',
    title: 'Azurlane',
    value: 'StatisticsSpace',
    href: '',
  },
  {
    type: 'link',
    icon: 'https://fgo.wiki/favicon.ico',
    href: 'https://fgo.wiki/w/%E9%A6%96%E9%A1%B5',
    title: 'fgo-wiki',
    value: 'link-fgo',
  },
  {
    type: 'link',
    icon: 'https://static.hdslb.com/images/favicon.ico',
    href: 'https://wiki.biligame.com/blhx/%E9%A6%96%E9%A1%B5',
    title: 'AL wiki',
    value: 'link-azur',
  },
  {
    type: 'link',
    icon: 'https://github.githubassets.com/favicons/favicon.svg',
    href: 'https://github.com/',
    title: 'Github',
    value: 'link-github',
  },
  {
    type: 'link',
    icon: 'https://threejs.org/files/favicon.ico',
    href: 'https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene',
    title: 'ThreeJs',
    value: 'link-three',
  },
  {
    type: 'link',
    icon: 'https://pixijs.io/guides/static/images/pixijs-logo.svg',
    href: 'https://pixijs.download/release/docs/index.html',
    title: 'PixiJS',
    value: 'link-pixijs',
  },
  {
    type: 'link',
    icon: 'https://antv.vision/favicon-32x32.png?v=9772447a8d07a8fe19894b5176c6cb0d',
    href: 'https://antv.vision/zh/',
    title: 'antV',
    value: 'link-antV',
  },
  {
    type: 'link',
    icon: 'https://es6.ruanyifeng.com/favicon.ico',
    href: 'https://es6.ruanyifeng.com/',
    title: 'ES6',
    value: 'link-es6',
  },
  {
    type: 'link',
    icon: 'https://www.smashingmagazine.com/images/favicon/favicon.svg',
    href: 'https://www.smashingmagazine.com/',
    title: 'S & M',
    value: 'link-sm',
  },
];
class CollectionSpace extends React.Component<any> {
  state = {
    collectionList: defaultCollectionList,
    collectionActive: '',
  };
  removeCollectionActive = () => {
    this.setState({ collectionActive: '' });
  };
  render() {
    return (
      <>
        <ul className="collection-space">
          {this.state.collectionList.map((ele, idx) =>
            ele.type === 'function' ? (
              <li
                key={idx}
                onClick={() => {
                  if (ele.type === 'function') {
                    this.setState({ collectionActive: 'StatisticsSpace' });
                  }
                }}
              >
                <img
                  src={
                    ele.icon || '../../../../../public/media/image/icon/404.jpg'
                  }
                  alt=""
                />
                <p>{ele.title || '🖐🏻🐟ing...'}</p>
              </li>
            ) : (
              <li key={idx}>
                <a href={ele.href}>
                  <img
                    src={
                      ele.icon ||
                      '../../../../../public/media/image/icon/404.jpg'
                    }
                    alt=""
                  />
                  <p>{ele.title || '🖐🏻🐟ing...'}</p>
                </a>
              </li>
            )
          )}
        </ul>
        {this.state.collectionActive === 'StatisticsSpace' ? (
          <StatisticsSpace
            removeCollectionActive={this.removeCollectionActive}
          />
        ) : (
          <></>
          // <StatisticsSpace
          //   removeCollectionActive={this.removeCollectionActive}
          // />
        )}
      </>
    );
  }
  componentDidMount() {
    chrome.storage.sync.get('collectionList', (v) => {
      this.setState({
        collectionList: v['collectionList']
          ? v['collectionList']
          : defaultCollectionList,
      });
    });
    var el = document.getElementsByClassName(
      'collection-space'
    )[0] as HTMLElement;
    let sortable: Sortable;
    //设置配置
    var ops = {
      animation: 300,
      //拖动结束
      onEnd: (evt: any) => {
        let collectionList = this.state.collectionList;
        const obj = collectionList.splice(evt.oldIndex, 1);
        collectionList.splice(evt.newIndex, 0, obj[0]);
        console.log(collectionList);
        chrome.storage.sync.set({ collectionList });
      },
    };
    if (el !== null) {
      sortable = Sortable.create(el, ops);
    }
  }
}
export default CollectionSpace;
