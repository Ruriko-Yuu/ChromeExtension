import React, { createRef, useState, useEffect, useRef } from 'react';

import './index.scss';

class BlackHole extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      drawSpace: createRef(),
      canvasObj: {
        width: 0,
        height: 0,
      },
      asteroidList: [],
      blackholeList: [],
    };
  }
  render() {
    return (
      <div className="blackhole-space">
        <canvas
          id="black-hole"
          ref={this.state.drawSpace}
          onClick={this.addblackHole}
        ></canvas>
      </div>
    );
  }
  getStyle = (ele: any, key: string) => {
    if (typeof ele.currentStyle === 'undefined') {
      return ele.ownerDocument.defaultView.getComputedStyle(ele, null)[key];
    } else {
      return ele.currentStyle[key];
    }
  };
  /** 添加重力井 */
  addblackHole = (e: any) => {
    console.log(e.nativeEvent);
    const blackholeList = this.state.blackholeList;
    const obj = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      m: 1e5,
    };
    blackholeList.push(obj);
    this.setState({ blackholeList });
  };
  /** 绘制 */
  draw = () => {
    var cvs: HTMLCanvasElement = this.state.drawSpace.current;
    var ctx = cvs.getContext('2d');
    [cvs.width, cvs.height] = [
      this.state.canvasObj.width,
      this.state.canvasObj.height,
    ];
    this.state.asteroidList.forEach((ele: { [key: string]: any }) => {
      if (ctx !== null) {
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = ele.color;
        ctx.arc(ele.x, ele.y, 2, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
    this.state.blackholeList.forEach((ele: { [key: string]: number }) => {
      if (ctx !== null) {
        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.strokeStyle = `rgba(0,0,0,1)`;
        ctx.arc(ele.x, ele.y, 4, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  };
  /** */
  attract = (obj: { [key: string]: number }) => {
    let aSumX = 0;
    let aSumY = 0;
    this.state.blackholeList.forEach((ele: { [key: string]: number }) => {
      let aXArrow: 1 | 0 | -1 = 0;
      let aYArrow: 1 | 0 | -1 = 0;
      if (ele.x > obj.x) {
        aXArrow = 1;
      } else if (ele.x < obj.x) {
        aXArrow = -1;
      }
      if (ele.y > obj.y) {
        aYArrow = 1;
      } else if (ele.y < obj.y) {
        aYArrow = -1;
      }
      const distance = Math.sqrt(
        (obj.x - ele.x) * (obj.x - ele.x) + (obj.y - ele.y) * (obj.y - ele.y)
      );
      const F = (6.672 * (ele.m * obj.m)) / (distance * distance);
      const a = F / ele.m;
      aSumX += (Math.abs(obj.x - ele.x) / distance) * aXArrow * a;
      aSumY += (Math.abs(obj.y - ele.y) / distance) * aYArrow * a;
    });
    const ksum = 0.4;
    if (aSumX > 0 && aSumX < ksum) {
      aSumX = ksum;
    }
    if (aSumX < 0 && aSumX > -ksum) {
      aSumX = -ksum;
    }
    if (aSumY > 0 && aSumY < ksum) {
      aSumY = ksum;
    }
    if (aSumY < 0 && aSumY > -ksum) {
      aSumY = -ksum;
    }
    obj.vX = obj.vX + aSumX / 2;
    obj.vY = obj.vY + aSumY / 2;
    return obj;
  };
  /** 初始化 */
  initialize = () => {
    const asteroidList = [];
    // 初始添加100条随机数据
    while (asteroidList.length < 100) {
      asteroidList.push({
        x: Math.random() * this.state.canvasObj.width,
        y: Math.random() * this.state.canvasObj.height,
        // vX: (Math.random() - 0.5) * 10,
        // vY: (Math.random() - 0.5) * 10,
        vX: (Math.random() - 0.5) * 0,
        vY: (Math.random() - 0.5) * 0,
        m: 1,
        color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)})`,
      });
    }
    this.setState({ asteroidList }, () => {
      this.draw();
      const win: any = window;
      win.requestAnimFrame =
        win.requestAnimationFrame ||
        win.webkitRequestAnimationFrame ||
        win.mozRequestAnimationFrame ||
        win.oRequestAnimationFrame ||
        win.msRequestAnimationFrame ||
        function (callback: void) {
          win.setTimeout(callback, 1000 / 60);
        };
      const move = () => {
        // TODO: 组件移除终止
        win.requestAnimFrame(() => {
          const asteroidList = this.state.asteroidList.map(
            (ele: { [key: string]: number }) => {
              let obj: { [key: string]: number } = {
                x: ele.x + ele.vX,
                y: ele.y + ele.vY,
                vX: ele.vX,
                vY: ele.vY,
                m: 1,
                color: ele.color,
              };
              obj = this.attract(obj);
              // if (
              //   !(
              //     obj.x < this.state.canvasObj.width &&
              //     obj.y < this.state.canvasObj.height &&
              //     obj.x > 0 &&
              //     obj.y > 0
              //   )
              // ) {
              //   const x = Math.floor(Math.random() * 4);
              //   switch (x) {
              //     case 0:
              //       obj.x = Math.random() * this.state.canvasObj.width;
              //       obj.y = 0;
              //       obj.vX = (Math.random() - 0.5) * 10;
              //       obj.vY = Math.random() * 5;
              //       break;
              //     case 1:
              //       obj.x = this.state.canvasObj.width;
              //       obj.y = Math.random() * this.state.canvasObj.height;
              //       obj.vX = -Math.random() * 5;
              //       obj.vY = (Math.random() - 0.5) * 10;
              //       break;
              //     case 2:
              //       obj.x = Math.random() * this.state.canvasObj.width;
              //       obj.y = this.state.canvasObj.width;
              //       obj.vX = (Math.random() - 0.5) * 10;
              //       obj.vY = -Math.random() * 5;
              //       break;
              //     case 3:
              //       obj.x = 0;
              //       obj.y = Math.random() * this.state.canvasObj.height;
              //       obj.vX = Math.random() * 5;
              //       obj.vY = (Math.random() - 0.5) * 10;
              //       break;
              //   }
              // }
              return obj;
            }
          );
          this.setState({ asteroidList }, this.draw);
          // console.log('requestAnimFrame');
          move();
        });
      };
      move();
    });
  };
  componentDidMount() {
    // TODO: 改非零不变时停止获取
    setTimeout(() => {
      this.setState(
        {
          canvasObj: {
            width: parseFloat(
              this.getStyle(this.state.drawSpace.current.parentNode, 'width')
            ),
            height: parseFloat(
              this.getStyle(this.state.drawSpace.current.parentNode, 'height')
            ),
          },
        },
        this.initialize
      );
    }, 500);
  }
}
export default BlackHole;
