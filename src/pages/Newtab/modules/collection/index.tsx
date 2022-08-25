import React, { useState, useEffect, useRef } from 'react';
import StatisticsSpace from './models/statistics/index';
import Sortable from 'sortablejs';

import './index.scss';

const defaultCollectionLinkList = [
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
    collectionList: [
      {
        type: 'function',
        icon: '../../../../../public/media/image/icon/baidu.webp',
        title: 'Demo',
        value: 'StatisticsSpace',
        href: '',
      },
    ],
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
        {this.state.collectionActive}
        {this.state.collectionActive === 'StatisticsSpace' ? (
          <StatisticsSpace
            removeCollectionActive={this.removeCollectionActive}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
  componentDidMount() {
    chrome.storage.sync.get('collectionLinkList', (v) => {
      this.setState({
        collectionList: [
          ...this.state.collectionList,
          ...(v['collectionLinkList']
            ? v['collectionLinkList']
            : defaultCollectionLinkList),
        ],
      });
    });
    var el = document.getElementsByClassName(
      'collection-space'
    )[0] as HTMLElement;
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
  }
}
export default CollectionSpace;
