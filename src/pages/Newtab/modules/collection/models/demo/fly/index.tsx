import React, { createRef, useState, useEffect, useRef } from 'react';

import './index.scss';

class FLYFun extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      drawSpace: createRef(),
      canvasObj: {
        width: 0,
        height: 0,
      },
      objList: [
        {
          r: 100,
          angularV: 1,
          initialAngular: 0,
          angular: 0,
          pointList: [],
          offsetList: [],
        },
        {
          r: 50,
          angularV: 2,
          initialAngular: 45,
          angular: 45,
          pointList: [],
          offsetList: [],
        },
        {
          r: 20,
          angularV: 3,
          initialAngular: 0,
          angular: 0,
          pointList: [],
          offsetList: [],
        },
        {
          r: 10,
          angularV: 8,
          initialAngular: 30,
          angular: 30,
          pointList: [],
          offsetList: [],
        },
        {
          r: 5,
          angularV: 12,
          initialAngular: 0,
          angular: 0,
          pointList: [],
          offsetList: [],
        },
      ],
    };
  }
  render() {
    return (
      <div className="fly-fun-space">
        <div className="canvas-space">
          <canvas id="fly-fun" ref={this.state.drawSpace}></canvas>
        </div>
        <div className="options-space">
          <ul>
            {this.state.objList.map((ele: any, index: any) => (
              <li key={index}>
                <p>
                  r:
                  <input
                    value={ele.r}
                    onChange={(e) => {
                      ele.r = e.target.value;
                    }}
                  />
                </p>
                <p>
                  v:
                  <input
                    value={ele.angularV}
                    onChange={(e) => {
                      ele.angularV = e.target.value;
                    }}
                  />
                </p>
                {/* <p>
                  i:
                  <input
                    value={ele.initialAngular}
                    onChange={(e) => {
                      ele.initialAngular = e.target.value;
                    }}
                  />
                </p> */}
                <br />
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              this.state.objList.push({
                r: 5,
                angularV: 1,
                initialAngular: 0,
                angular: 0,
                pointList: [],
                offsetList: [],
              });
            }}
          >
            +
          </button>
        </div>
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
  calculate = () => {
    let lastPoint = [
      this.state.canvasObj.width / 2,
      this.state.canvasObj.height / 2,
    ];
    const objList = this.state.objList.map((_ele: any, idx: number) => {
      let obj = _ele;
      obj.centerPoint = [...lastPoint];
      lastPoint[0] =
        lastPoint[0] + Math.cos(obj.angular * (Math.PI / 180)) * obj.r;
      lastPoint[1] =
        lastPoint[1] + Math.sin(obj.angular * (Math.PI / 180)) * obj.r;
      if (idx === this.state.objList.length - 1) {
        if (obj.offsetList.length > 180) {
          obj.offsetList = obj.offsetList.slice(1);
        }
        obj.offsetList.push([
          lastPoint[0] -
            this.state.canvasObj.width / 2 +
            this.state.canvasObj.height / 2,
          lastPoint[1],
        ]);
      }
      if (obj.pointList.length > 3600) {
        obj.pointList = obj.pointList.slice(1);
      }
      obj.pointList.push([...lastPoint]);
      obj.angular = (obj.angular + obj.angularV * 0.1) % 360;
      return obj;
    });
    this.setState({ objList }, this.draw);
  };
  /** 绘制 */
  draw = () => {
    var cvs: HTMLCanvasElement = this.state.drawSpace.current;
    var ctx = cvs.getContext('2d');
    [cvs.width, cvs.height] = [
      this.state.canvasObj.width,
      this.state.canvasObj.height,
    ];
    if (ctx !== null) {
      ctx.clearRect(0, 0, 2000, 2000);
      ctx.beginPath();
      this.state.objList.forEach(
        (
          element: {
            [x: string]: number[];
            centerPoint: number[];
            r: any;
            pointList: any[];
            offsetList: any;
          },
          index: any
        ) => {
          if (ctx !== null) {
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 1;
            ctx.arc(
              element.centerPoint[0],
              element.centerPoint[1],
              element.r,
              0,
              2 * Math.PI
            );
            ctx.stroke();
          }
          if (index === this.state.objList.length - 1) {
            element.offsetList.forEach((ele: number[], idx: number) => {
              if (element.offsetList[idx + 1] !== undefined) {
                if (ctx !== null) {
                  ctx.beginPath();
                  ctx.strokeStyle = 'white';
                  ctx.lineWidth = 1;
                  ctx.moveTo(idx, element.offsetList[idx][0]);
                  ctx.lineTo(idx, element.offsetList[idx + 1][0]);
                  ctx.stroke();
                  ctx.beginPath();
                  ctx.strokeStyle = 'orange';
                  ctx.lineWidth = 1;
                  ctx.moveTo(idx, element.offsetList[idx][1]);
                  ctx.lineTo(idx, element.offsetList[idx + 1][1]);
                  ctx.stroke();
                }
              }
            });
          }
          if (index === this.state.objList.length - 1) {
            element.pointList.forEach((ele, idx) => {
              if (element.pointList[idx + 1] !== undefined) {
                if (ctx !== null) {
                  ctx.beginPath();
                  ctx.strokeStyle = 'green';
                  ctx.lineWidth = 1;
                  ctx.moveTo(ele[0], ele[1]);
                  ctx.lineTo(
                    element.pointList[idx + 1][0],
                    element.pointList[idx + 1][1]
                  );
                  ctx.stroke();
                }
              }
            });
          }
        }
      );
    }
  };
  /** 初始化 */
  initialize = () => {
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
    const start = () => {
      win.requestAnimFrame(() => {
        this.calculate();
        start();
      });
    };
    start();
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
export default FLYFun;
