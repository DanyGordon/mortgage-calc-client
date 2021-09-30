<template>
  <div id="chart" ref="chart"></div>
</template>

<script>
import { generate } from 'c3/c3.min';
import { select } from 'd3-selection/dist/d3-selection.min';

import currency from '@/filters/currency.filter';

export default {
  name: 'Chart',
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  data: () => {
    return {
      chart: null,
    }
  },
  mounted() {
    const colors = this.chartData.reduce((res, data) => {
      res[data.label] = data.color;
      return res;
    }, {});
    const chartContainerStyles = getComputedStyle(this.$refs.chart);
    const width = parseInt(chartContainerStyles.width);
    const height = parseInt(chartContainerStyles.height);

    this.chart = generate({
      bindto: '#chart',
      data: {
        columns: [],
        type: 'donut',
        labels: false,
        size: { width, height },
        colors,
      },
      legend: { show: false },
      donut: {
        label: { show: false }
      },
      transition: {
        duration: 1200
      },
      tooltip: {
        format: {
          title: function (x) {
            return x;
          },
          value: function (value) {
            return currency(value);
          }
        }
      }
    });
    this.updateChart();
    this.chart.transform('donut');
    this.updateTitle();
    window.addEventListener('resize', this.onResize);
  },
  methods: {
    updateChart() {
      const columns = this.chartData.map(data => [data.label, data.value]);
      this.chart.load({ columns });
    },

    updateTitle() {
      const total = this.chartData.reduce((acc, data) => acc += data.value, 0);
      select('#chart .c3-chart-arcs-title').node().innerHTML = currency(total);
    },

    onResize() {
      const chartContainerStyles = getComputedStyle(this.$refs.chart);
      const width = parseInt(chartContainerStyles.width);
      const height = parseInt(chartContainerStyles.height);
      this.chart.resize({ height, width });
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize);
    this.chart.destroy();
  }
}
</script>

<style scoped>

</style>