<template>
  <div class="system-reload">
    <!-- <el-alert show-icon title="选择种类" type="info" :key="Math.random()"></el-alert> -->
    <div class="box">
      <div class="box-header">
        <span class="box-header-tit">
          <span class="pr10">统计报表</span>
          <el-select class="w140" placeholder="彩种" v-model="nameCode">
            <el-option :key="key" :label="item.lotteryName" :value="key" v-for="(item, key) in lottery_data"></el-option>
          </el-select>
          <el-select class="w80" placeholder="类型" v-model="typeCode">
            <el-option :key="typeCode" :label="name" :value="typeCode" v-for="(name, typeCode) in typeMap"></el-option>
          </el-select>
          <span class="c-info pl10">
            统计
            <strong class="c-warning mlr5">{{totalCount}}</strong> 期数据
          </span>
        </span>
      </div>
      <el-table :data="resultAll[typeCode]" size="mini" stripe>
        <el-table-column align="center" label="连期数" prop="count" width="60">
          <template slot-scope="{row}">{{row.count}}期</template>
        </el-table-column>
        <el-table-column align="left" label="连期数/开出数" width="100">
          <template slot-scope="{row}">
            <div>
              连期
              <span class="c-success">{{row.sumGoon}}</span> 次
            </div>
            <div>
              结束
              <span class="c-warning">{{row.sumOver}}</span> 次
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="概率" width="100">
          <template slot-scope="{row}">
            <div>
              <strong class="c-danger" v-if="Math.abs(row.goOnPercent-50) >= 20">{{row.goOnPercent}}%</strong>
              <strong class="c-warning" v-else-if="Math.abs(row.goOnPercent-50) >= 10">{{row.goOnPercent}}%</strong>
              <strong class="c-info" v-else>{{row.goOnPercent}}%</strong>
              连期
            </div>
            <div>
              连期
              <span class="c-warning">{{row.sumGoon > row.sumOver ? '多' : '少'}}</span> 一点
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="参考建议" min-width="300">
          <template slot-scope="{row}">
            <div>
              <strong v-if="row.goOnPercent < 41">
                <!-- <strong class="c-danger">{{row.goOnPercent}}%</strong> -->
                <strong class="c-danger">小概率连期, 建议买开结束</strong>
              </strong>
              <strong v-else-if="row.goOnPercent < 49">
                <!-- <strong class="c-warning">{{row.goOnPercent}}%</strong> -->
                <strong class="c-warning">考虑买开结束</strong>
              </strong>
              <strong v-else-if="row.goOnPercent < 51">
                <!-- <strong class="c-info">{{row.goOnPercent}}%</strong> -->
                <strong class="c-info">概率居中，可观望。</strong>
              </strong>
              <strong v-else-if="row.goOnPercent < 60">
                <!-- <strong class="c-warning">{{row.goOnPercent}}%</strong> -->
                <strong class="c-warning">考虑顶到{{row.count + 1}}期</strong>
              </strong>
              <strong v-else-if="row.goOnPercent >= 60">
                <!-- <strong class="c-danger">{{row.goOnPercent}}%</strong> -->
                <strong class="c-warning">大概率连期, 建议买顺顶到</strong>
                <strong class="c-success">{{row.count + 1}}期</strong>
              </strong>
            </div>
            <div class="c-info" v-if="row.count < 10">
              如果下面几期有
              <span class="c-warning">较多连期</span>，建议先买顺。
            </div>
            <div class="c-info" v-if="maxGoonNum - row.count < 2">
              <span class="c-warning">{{row.count}}期</span>了，
              一般马上要开了，注意概率变化大，
              <span class="c-warning">可能不准</span>。
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button @click.native="nameCode = 'cqssc'" class="w200" type="primary">刷新</el-button>
    <!-- <div class="line-sigle mt20">echart</div> -->
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import STATIC_DATA from './config'

import allData from './data'
// console.log(data)

export default {
  name: 'SystemReload',
  data() {
    return {
      MOCK_NUM: 100000,
      totalCount: 0,
      lottery_data: STATIC_DATA.lottery_data,
      historyData: [],
      typeCode: 0, // 单双
      typeMap: ['单双', '大小', '总和', '龙虎'],
      nameCode: 'aaaa',
      resultAll: {
        0: [], // 单双
        1: [], // 大小
        2: [] // 总和
      }
    }
  },
  mounted() {
    // this.chart = echarts.init(this.$el.lastElementChild)
  },
  computed: {
    maxGoonNum() {
      return this.resultAll[this.typeCode].length
    },
    name() {
      return this.lottery_data[this.nameCode].lotteryName
    },
    serialArr() {
      // 序列化数据
      let _serialArr = []
      this.historyData.forEach((r, i, a) => {
        r.forEach((v, j) => {
          if (!_serialArr[j]) {
            _serialArr[j] = [v]
          } else {
            _serialArr[j].push(v)
          }
        })
      })
      return _serialArr
    },
    // 五球汇总序列
    allSerialArr() {
      return this.serialArr.reduce((a, b) => a.concat(b))
    }
  },
  watch: {
    nameCode(v, ov) {
      let _name = this.lottery_data[v].lotteryName || '模拟数据'

      if (v === 'mock') {
        // 模拟数据
        this.historyData = Array.from({ length: this.MOCK_NUM }).map((_, i) => {
          return Math.floor(Math.random() * 100000)
            .toString()
            .padLeft(5, '0')
            .split('')
        })
      } else {
        let _data = allData[v]
        if (!_data || !_data.openCodeList) {
          return this.$message.error('无相关数据！')
        }
        this.historyData = [..._data.openCodeList].reverse().map(o =>
          o.openCode.split(/\s*,\s*/g).map(strNum => +strNum) // +strNum转成数字
        )
      }
      // 统计数
      this.totalCount = this.historyData.length
      this.$message.info(`加载 【${_name}】 共计 ${this.totalCount} 条！`)

      setTimeout(_ => {
        this.typeCode = (this.typeCode + 1) % 2 // 触发改变
      }, 500)
    },
    typeCode(v, ov) {
      // 单双 Single Double
      let _sumSD = this._sumData(v => v % 2 === 1, this.allSerialArr)

      // 大小 Big Small
      let _sumBS = this._sumData(v => v < 5, this.allSerialArr)

      // 统计
      let _resSD = this._analysisData(_sumSD)
      let _resBS = this._analysisData(_sumBS)

      this.resultAll = [_resSD, _resBS]
      // this._setChart(_sumSD, _sumBS)
    }
  },
  methods: {
    // 单双
    sumDS() {
      this.serialArr.forEach((rowArr, i) => {
        // console.log(`第 ${i+1} 球`)

      })
      let _dsArr = this.serialArr[0]  // 第一球
      let _times = this._sumData(v => v % 2 === 1, _dsArr)
      return this._analysisData(_times)
    },
    // 大小
    sumDX() {
      let _dxArr = this.serialArr[1]  // 第二球
      let _times = this._sumData(v => v < 5, _dxArr)
      return this._analysisData(_times)
    },
    // 总和
    sumTotal() {
      let _totalArr = this.historyData.map((row, i, a) => {
        return row.reduce((a, b) => a + b)
      })
      let _times = this._sumData(v => v < 24, _totalArr)
      return this._analysisData(_times)
    },
    // 龙虎
    sumLH() {
      let _lhArr = this.historyData.map((row, i, a) => {
        return row[0] - row[4]
      })
      let _times = this._sumData(v => v < 0, _lhArr)
      return this._analysisData(_times)
    },
    // data: 要分析的数据
    _analysisData(data) {
      let _resData = []
      Object.keys(data).forEach((count, i, countArr) => {
        let _tmp = { count: Number(count), sumOver: data[count], sumGoon: 0 }

        countArr.forEach((nextCount, j) => {
          if (+nextCount > count) {
            // 累加大期数
            _tmp.sumGoon += data[nextCount]
          }
        })
        _tmp.sumCount = _tmp.sumOver + _tmp.sumGoon
        _tmp.overPercent = Number(
          ((_tmp.sumOver / _tmp.sumCount) * 100).toFixed(2)
        )
        _tmp.goOnPercent = Number(
          ((_tmp.sumGoon / _tmp.sumCount) * 100).toFixed(2)
        )

        _resData.push(_tmp)
      })
      console.table(`${this.name} - ${this.typeMap[this.typeCode]}`, _resData)
      return _resData
    },
    _sumData(fn, souceArr = this.serialArr[0]) {
      let _sumRes = {}
      const _record = times => {
        if (_sumRes[times] === undefined) {
          return (_sumRes[times] = 1)
        }
        _sumRes[times]++
      }
      // souceArr = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 7] // test data
      // console.log(`样本数${souceArr.length}: ${souceArr.toString()}`)
      let _flag,
        _count = 1
      souceArr.forEach((v, i, a) => {
        if (i === 0) {
          // 第一个不统计
          return (_flag = fn(v))
        }

        let _preFlag = _flag
        _flag = fn(v)

        if (_flag === _preFlag) {
          // 连续号
          _count++
          // console.log(`统计到第${i + 1}个数字${v}, 累加${_count}`)
        } else {
          // console.log(`统计到第${i + 1}个数字${v}, 连续${_count}个结束`)
          _record(_count)
          _count = 1
        }
        if (i === a.length - 1) {
          // 最后一个统计
          _record(_count)
        }
      })
      return _sumRes
    }
    /* _setChart(_sumSD, _sumBS) {
      this.chart.setOption({
        title: {
          text: '单双图',
          subtext: '123'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['单双', '大小']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: Object.keys(_sumSD), //['1期', '2期', '3期', '4期', '5期'...]
            axisLabel: {
              formatter: function(v) {
                return `${v}期`
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '单双',
            type: 'bar',
            data: Object.values(_sumSD),
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: '平均值' }]
            }
          },
          {
            name: '大小',
            type: 'bar',
            data: Object.values(_sumBS), //[2.6, 5.9, 9.0, 26.4, 28.7],
            markPoint: {
              data: [
                {
                  name: '年最高',
                  value: 182.2,
                  xAxis: 7,
                  yAxis: 183,
                  symbolSize: 18
                },
                { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: '平均值' }]
            }
          }
        ]
      })
    } */
  }
}
</script>
<style lang="scss" scoped>
.line-sigle {
  width: 100%;
  height: 400px;
  border: solid 1px #ccc;
}
</style>
