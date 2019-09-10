<template>
  <div :class="`echart-box echart-${classify}`" :style="{width:width+'px',height:height+'px'}"></div>
</template>

<script>
import init from '@/utils/echarts.js';

export default {
  props: {
    classify: { // 应用那个类型的图标
      type: String
    },
    dataArray: {  // 柱状图渲染数据,数据的每一项都是Number
      type: Array
    },
    width: [Number, String],
    height: [Number, String],
  },
  data() {
    return {
      myChart: null
    }
  },
  beforeDestroy() {
    // 销毁图表实例，避免内存溢出
    this.myChart.dispose && this.myChart.dispose();
  },
  mounted() {
    // 调用utils来绘制图形
    this.myChart = init(this.$el, ...Object.values(this.$props))
  }
}
</script>

<style scoped>
.echart-box {
  width: 100%;
  height: 400px;
}
</style>
