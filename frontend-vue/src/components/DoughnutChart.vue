<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent])

export default {
  components: {
    VChart
  },
  props: {
    totalCollected: {
      type: Number,
      required: true
    },
    totalBilled: {
      type: Number,
      required: true
    },
    totalOverdue: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      option: {
        color: ['#0d6efd', '#ffc107', '#dc3545'],
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            radius: ['90%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            data: [
              { value: this.totalCollected, name: 'Total Encaissé TTC' },
              { value: this.totalBilled, name: 'Total Facturé TTC' },
              { value: this.totalOverdue, name: "Dû à plus d'un mois TTC" }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.chart {
  height: 200px;
  width: 200px;
}
</style>
