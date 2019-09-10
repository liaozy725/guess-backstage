import echarts from 'echarts'
const colorList = ['#6481F1', '#4CDA99', '#F0CA00', '#FF7362', '#A689EC', '#12BCE4'];
const labelColor = '#999'; // 坐标标记颜色

const allOptions = {
  barAndLineOptions(dataArray, type, unit, innerText) {
    return {
      color: colorList,
      legend: {
        data: ["目标金额", "实际完成", "上月环比增长率"],
        bottom: "0%",
        left: '10%'
      },
      yAxis: [{
        type: "value",
        name: "销售额",
        nameTextStyle: {
          color: labelColor
        },
        splitLine: {
          show: false
        },
        splitNumber:10,
        splitLine: {
          show: true,
          lineStyle:{
            type:'dashed'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true
        },
        axisLabel: {
          show: true,
          color: labelColor
        }
      }, {
        type: "value",
        name: "上月环比增长率",
        position: "right",
        min: -100,
        max: 100,
        splitNumber:10,
        splitLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: labelColor,
          formatter: "{value} %", //右侧Y轴文字显示
        }
      }],
      xAxis: {
        data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        axisLine: {
          show: true //隐藏X轴轴线
        },
        nameTextStyle: {
          color: labelColor,
          align: 'right',
          verticalAlign: 'middle'
        },
        axisTick: {
          show: true, //隐藏X轴刻度
          alignWithLabel: true
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: labelColor //X轴文字颜色
          }
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      series: dataArray
    };
  }
}

export default (el, classify, ...arg) => {
  
  const instance = echarts.init(el);
  instance.setOption(allOptions[`${classify}Options`](...arg));
  return instance;
}