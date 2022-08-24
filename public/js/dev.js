// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: false }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.sendMessage(tabId, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}
var myChart = echarts.init(document.getElementById('main'));
let listA = []
let listB = []
let listC = []
setInterval(() => {
  sendMessageToContentScript({
    type: 'shell',
    value: 'monitor',
  }, (response) => {
    if (response !== void 0) {
      listA.push(response.jsHeapSizeLimit)
      listB.push(response.totalJSHeapSize)
      listC.push(response.usedJSHeapSize)
    }
  });
  // 指定图表的配置项和数据
  var option = {
    title: {
      text: 'Stacked Line'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: listA
    },
    yAxis: {
      type: 'value'
    },
    series: [
      // {
      //   name: 'Email',
      //   type: 'line',
      //   stack: 'Total1',
      //   data: listA
      // },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total2',
        data: listB
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total3',
        data: listC
      }
    ]
  };
  myChart.setOption(option);
}, 1e3);