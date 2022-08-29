import React, { createRef, useState, useEffect, useRef } from 'react';
const echarts = require("echarts");
import './index.scss';
import { cannon } from './data.json'
class AzurlaneChart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      option: {
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    };
  }
  render() {
    return (
      <div className="azurlane-chart">
        {/* {cannon.map(ele => (<img src={ele.img}></img>))} */}
        <div id="azurlane-chart-main" style={{ width: 910, height: 400 }}></div>
      </div>
    );
  }
  componentDidMount() {
    const MyChart = echarts.init(document.getElementById("azurlane-chart-main")); // 绘制图表
    let option = {
      title: {
        text: "",
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          console.log(params)
          const data = cannon.filter(ele => ele.name === params.name)[0]
          return `
            <img style="width: 64px;height: 64px;display: block" src="${data.img}"/>
            <b style="color:${['', 'orange', '#C66DAE', '#3A93EF'][data.rare]}">${data.name}</b>
            <p><b>${params.seriesName}DPS:</b> ${params.value}</p>
            <p><b>射速:</b><span>${data.time}</span><span>${data.fireTime}</span></p>
          `;
        }
        // formatter: "<img src='https://static.hdslb.com/images/favicon.ico'/><br/>{a} {b} : {c}"
      },
      grid: {
        left: 230,
      },
      legend: {
        data: ["轻甲", "中甲", "重甲", "弹幕"],
        textStyle: {
          color: '#FFFFFF'
        }
      },
      xAxis: {

      },
      yAxis: {
        data: cannon.map(ele => ele.name),
        axisLabel: {
          textStyle: {
            color: (value: string, index: number) => {
              return ['', 'orange', '#C66DAE', '#3A93EF'][cannon[index].rare]
            }
          }
        }
      },
      series: [
        {
          name: "轻甲",
          type: "bar",
          stack: 'Total',
          data: cannon.map(ele => (
            Number(ele.demage.split('×')[0]) * Number(ele.demage.split('×')[1])
            * (1 / (ele.time + ele.fireTime))
            * Number(ele.restrained.split('-')[0]) / 3 * 0.01
            * ele.efficiency / 100
            * (ele.type === 'chee-a' ? 1.25 :1)
            * (1 - ele.diffusion / 100 / 2)
          ).toFixed(0)
          ),
          color: '#FEE082'
        },
        {
          name: "中甲",
          type: "bar",
          stack: 'Total',
          data: cannon.map(ele => (
            Number(ele.demage.split('×')[0]) * Number(ele.demage.split('×')[1])
            * (1 / (ele.time + ele.fireTime))
            * Number(ele.restrained.split('-')[1]) / 3 * 0.01
            * ele.efficiency / 100
            * (ele.type === 'chee-a' ? 1.25 :1)
            * (1 - ele.diffusion / 100 / 2)
          ).toFixed(0)
          ),
          color: '#E73C18'
        },
        {
          name: "重甲",
          type: "bar",
          stack: 'Total',
          data: cannon.map(ele => (
            Number(ele.demage.split('×')[0]) * Number(ele.demage.split('×')[1])
            * (1 / (ele.time + ele.fireTime))
            * Number(ele.restrained.split('-')[2]) / 3 * 0.01
            * ele.efficiency / 100
            * (ele.type === 'chee-a' ? 1.25 :1)
            * (1 - ele.diffusion / 100 / 2)
          ).toFixed(0)
          ),
          color: '#007FFF'
        },
        {
          name: "弹幕",
          type: "bar",
          stack: 'Total',
          data: cannon.map(ele => (
            300
            * (1 / (ele.time + ele.fireTime))
            / 10
            * (100 + 100 + 100) / 3 * 0.01
            * 0.3
          ).toFixed(0)
          ),
          color: '#FFFFFF'
        },
      ],
    };
    MyChart.setOption(option);
  }
}
export default AzurlaneChart;
