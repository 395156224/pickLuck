<template>
  <div class="system-reload">
    <!-- <el-alert show-icon title="选择种类" type="info" :key="Math.random()"></el-alert> -->
    <div class="box">
      <div class="box-header">
        <span class="box-header-tit">
          <el-select class="w140" placeholder="彩种" v-model="nameCode">
            <el-option :key="key" :label="item.lotteryName" :value="key" v-for="(item, key) in lottery_data"></el-option>
          </el-select>最近
          <el-select class="w80" placeholder="请选择" v-model="days">
            <el-option :key="day" :label="day" :value="day" v-for="day in 50"></el-option>
          </el-select>天(存有<strong class="c-warning">{{totalDays}}</strong>天数据)
          <span class="c-info pl10">
            <strong class="c-warning mlr5">{{this.cutHistory.length}}</strong>期
          </span>
        </span>
      </div>
      <div>
        <el-checkbox-group v-model="typeList">
          <el-checkbox-button :key="key" :label="type.name" v-for="(type, key) in TYPE1"></el-checkbox-button>
        </el-checkbox-group>
        <el-checkbox-group class="mtb10" v-model="typeList">
          <el-checkbox-button :key="key" :label="type.name" v-for="(type, key) in TYPE2"></el-checkbox-button>
        </el-checkbox-group>
        <el-checkbox-group v-model="typeList">
          <el-checkbox-button :key="key" :label="type.name" v-for="(type, key) in TYPE3"></el-checkbox-button>
        </el-checkbox-group>
      </div>
      <el-table :data="analysisData" size="mini" stripe>
        <el-table-column align="center" label="连期数" width="60">
          <template slot-scope="{row}">
            <span :class="{'c-danger': row.time > 4}">{{row.time}}期</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="连期/结束" width="80">
          <template slot-scope="{row}">
            <div>
              连期
              <span class="c-success">{{row.goonNum}}</span> 次
            </div>
            <div>
              结束
              <span class="c-warning">{{row.overNum}}</span> 次
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="概率" width="100">
          <template slot-scope="{row}">
            <div>
              <strong class="c-danger" v-if="Math.abs(row.goonPercent-50) >= 20">{{row.goonPercent}}%</strong>
              <strong class="c-warning" v-else-if="Math.abs(row.goonPercent-50) >= 10">{{row.goonPercent}}%</strong>
              <strong class="c-info" v-else>{{row.goonPercent}}%</strong>
              连期
            </div>
            <div>
              连期
              <span class="c-warning">{{row.goonNum > row.overNum ? '多' : '少'}}</span> 一点
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="详细" width="100">
          <template slot-scope="{row}">
            <details :timesDetails="row.details"></details>
          </template>
        </el-table-column>
        <el-table-column align="left" label="参考建议" min-width="300">
          <template slot-scope="{row}">
            <div>
              <strong v-if="row.goonPercent < 41">
                <!-- <strong class="c-danger">{{row.goonPercent}}%</strong> -->
                <strong class="c-danger">小概率连期, 建议买开结束</strong>
              </strong>
              <strong v-else-if="row.goonPercent < 49">
                <!-- <strong class="c-warning">{{row.goonPercent}}%</strong> -->
                <strong class="c-warning">考虑买开结束</strong>
              </strong>
              <strong v-else-if="row.goonPercent < 51">
                <!-- <strong class="c-info">{{row.goonPercent}}%</strong> -->
                <strong class="c-info">概率居中，可观望。</strong>
              </strong>
              <strong v-else-if="row.goonPercent < 60">
                <!-- <strong class="c-warning">{{row.goonPercent}}%</strong> -->
                <strong class="c-warning">考虑顶到{{row.time + 1}}期</strong>
              </strong>
              <strong v-else-if="row.goonPercent >= 60">
                <!-- <strong class="c-danger">{{row.goonPercent}}%</strong> -->
                <strong class="c-warning">大概率连期, 建议买顺顶到</strong>
                <strong class="c-success">{{row.time + 1}}期</strong>
              </strong>
            </div>
            <div class="c-info" v-if="row.time < 10">
              如果下面几期有
              <span class="c-warning">较多连期</span>，建议先买顺。
            </div>
            <div class="c-info" v-if="maxGoonNum - row.time < 2">
              <span class="c-warning">{{row.time}}期</span>了，
              一般马上要开了，注意概率变化大，
              <span class="c-warning">可能不准</span>。
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="box" v-if="0">
      <div class="box-header">
        <span class="box-header-tit">
          <span class="pr10">期数列表</span>
          <span class="c-info pl10">
            共有
            <strong class="c-warning mlr5">{{timesFilter.length}}</strong> 条数据
          </span>
        </span>
      </div>
      <el-table :data="timesFilter" :default-sort="{prop: 'count', order: 'descending'}" size="mini" stripe>
        <el-table-column align="center" label="球号" prop="count" sortable width="90">
          <template slot-scope="{row}">
            <span v-if="row.ballNum !== '12345'">第 {{"一二三四五".split("")[row.ballNum]}} 球 -</span>
            <strong class="c-warning">{{row.type}}</strong>
          </template>
        </el-table-column>
        <el-table-column align="center" label="连期" prop="count" sortable width="80">
          <template slot-scope="{row}">
            <strong :class="{'c-danger': row.time > 4}">{{row.count}}期</strong>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束期数" prop="endExpect" sortable width="110">
          <template slot-scope="{row}">
            <span class="c-success">{{row.endExpect}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开奖号" prop="openCode" width="90"></el-table-column>
        <el-table-column align="left" label="时间">
          <template slot-scope="{row}">{{row.timeTip}}</template>
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
import details from './components/details'

import STATIC_DATA from './config'
import allData from './data'
const debug = false

export default {
  name: 'SystemReload',
  data() {
    return {
      MOCK_NUM: 10,
      lottery_data: STATIC_DATA.lottery_data,
      history: [],
      days: 1,
      typeList: ['大'],
      TYPE1: {
        isBig: {
          code: 1,
          name: '大',
          fn: v => v > 4
        },
        isSmall: {
          code: 2,
          name: '小',
          fn: v => v < 5
        },
        isSingle: {
          code: 3,
          name: '单',
          fn: v => v % 2 === 1
        },
        isDouble: {
          code: 4,
          name: '双',
          fn: v => v % 2 === 0
        }
      },
      TYPE2: {
        isTotalBig: {
          code: 5,
          name: '总大',
          fn: arr => arr.reduce((a, b) => +a + +b) >= 23
        },
        isTotalSmall: {
          code: 6,
          name: '总小',
          fn: arr => arr.reduce((a, b) => +a + +b) <= 22
        },
        isTotalSingle: {
          code: 7,
          name: '总单',
          fn: arr => arr.reduce((a, b) => +a + +b) % 2 === 1
        },
        isTotalDouble: {
          code: 8,
          name: '总双',
          fn: arr => arr.reduce((a, b) => +a + +b) % 2 === 0
        }
      },
      TYPE3: {
        isLong: {
          code: 9,
          name: '龙',
          fn: arr => +arr[0] > +arr[arr.length - 1]
        },
        isTiger: {
          code: 10,
          name: '虎',
          fn: arr => +arr[0] < +arr[arr.length - 1]
        },
        isEqueal: {
          code: 11,
          name: '龙虎和',
          fn: arr => arr[0] === arr[arr.length - 1]
        }
      },
      type: {},
      nameCode: 'ademo'
    }
  },
  components: {
    details
  },
  watch: {
    nameCode(v, ov) {
      let _name = this.lottery_data[v].lotteryName || '模拟数据'

      if (v === 'mock') {
        // 模拟数据
        this.history = Array.from({ length: this.MOCK_NUM }).map((_, i) => {
          return {
            expect: `20190610_${i}`,
            openCode: Math.floor(Math.random() * 100000)
              .toString()
              .padLeft(5, '0')
              .split('')
              .join(',')
          }
        })
      } else {
        let _data = allData[v]
        if (!_data || !_data.openCodeList) {
          return this.$message.error('无相关数据！')
        }
        this.history = [
          {
            expect: '本期未开',
            openCode: '?,?,?,?,?'
          },
          ..._data.openCodeList
        ].reverse()
      }
      this.$message.info(
        `加载【${_name}】最近${this.totalDays}天数据，共计 ${this.totalCount} 期，`
      )
    }
  },
  computed: {
    curLottery() {
      return this.lottery_data[this.nameCode] || {}
    },
    TYPE() {
      return { ...this.TYPE1, ...this.TYPE2, ...this.TYPE3 }
    },
    totalCount() {
      return this.history.length // 历史数据期数
    },
    totalDays() {
      return Math.floor(this.totalCount / this.curLottery.timesPerDay)
    },
    maxGoonNum() {
      return Math.max(Object.keys(this.sumTimes))
    },
    cutHistory() {
      return this.history.slice(-1 - this.curLottery.timesPerDay * this.days)
    },
    timesArr() {
      // 统计所有连期数
      let _res = []
      Object.keys(this.TYPE).forEach((t, i) => {
        const _ot = this.TYPE[t]
        this.log(`==== 开始统计 ${_ot.name} ====`)
        let _tmp = this._sumTimes(_ot, this.cutHistory)
        _res = _res.concat(_tmp)
      })
      return _res
    },
    timesFilter() {
      return (this.timesArr || []).filter(o => this.typeList.includes(o.type))
    },
    sumTimes() {
      let _sum = {}
      this.timesFilter.forEach(o => {
        if (!_sum[o.count]) {
          return (_sum[o.count] = {
            time: o.count, // 连期数
            count: 1, // 连期数个数
            details: [o]
          })
        }
        _sum[o.count].count++
        _sum[o.count].details.push(o)
      })
      return _sum
    },
    analysisData() {
      let _arr = []
      for (let i in this.sumTimes) {
        _arr.push(this.sumTimes[i])
      }
      let _sortArr = _arr.sort((a, b) => b.time - a.time)
      // 期数从高到低统计
      _sortArr.forEach((time, i, arr) => {
        // 最高期
        if (i === 0) {
          Object.assign(time, {
            // 总个数（就是最高期个数）
            total: time.count,
            // 结束数
            overNum: time.count,
            // 连期数
            goonNum: 0,
            goonPercent: 0
          })
        }
        if (i + 1 < arr.length) {
          const _nextTime = arr[i + 1]
          // 计算“上一期”的数据
          Object.assign(_nextTime, {
            // 总个数（本期总数 + 上一期个数）
            total: time.total + _nextTime.count,
            // 结束数 (上一期个数)
            overNum: _nextTime.count,
            // 连期数 （本期总数）
            goonNum: time.total,
            // 上一期 详细数据
            details: _nextTime.details.concat(time.details)
          })
          _nextTime.goonPercent = Number(
            ((_nextTime.goonNum / _nextTime.total) * 100).toFixed(2)
          )
        }
        delete time.count
      })
      return _sortArr.sort((a, b) => a.time - b.time) //　从小到大期数排序
    }
  },
  created() {},
  mounted() {
    // this.chart = echarts.init(this.$el.lastElementChild)
  },
  methods: {
    _sumTimes(otype, sumData = this.cutHistory) {
      let _timesArr = [],
        _curTime = [] // 0-4记录单球， 5-11记录总和龙虎

      sumData.forEach((a, i, oa) => {
        let _codeArr = a.openCode.split(',')

        if (otype.code < 5) {
          // 大小单双
          _codeArr.forEach((strVal, ballNum) => {
            let v = +strVal

            if (strVal != '?' && otype.fn(v)) {
              if (!_curTime[ballNum]) {
                _curTime[ballNum] = {
                  count: 1, // 连期数
                  ballNum: ballNum, // 第几球
                  type: otype.name, // 连期类型
                  expectArr: [a.expect],
                  valArr: [v]
                  // timeTip: '上午'
                  // date: '20190610'
                  // today: true,
                  // at: '001' //　第几期
                }
              } else {
                _curTime[ballNum].count++
                _curTime[ballNum].valArr.push(v)
                // _curTime[ballNum].endExpect = a.expect
                _curTime[ballNum].openCode = a.openCode
                _curTime[ballNum].expectArr.push(a.expect)
              }
              this.log(
                `${a.expect}期-第${ballNum + 1}球-${strVal}, ${
                  otype.name
                }-连期${_curTime[ballNum].count}`
              )
            } else if (!!_curTime[ballNum]) {
              this.log(
                `${a.expect}期-第${ballNum + 1}球-${strVal}, ${
                  otype.name
                }-不符合`
              )
              //　结束连期，记录连期信息
              if (_curTime[ballNum].count >= 2) {
                _timesArr.push({ endExpect: a.expect, ..._curTime[ballNum] })
              }
              delete _curTime[ballNum]
            }
          })
        } else {
          // 总和龙虎
          let v = _codeArr,
            ballNum = otype.code

          if (!v.includes('?') && otype.fn(v)) {
            if (!_curTime[ballNum]) {
              _curTime[ballNum] = {
                count: 1, // 连期数
                ballNum: '12345', // 第几球
                type: otype.name, // 连期类型
                expectArr: [a.expect],
                valArr: [a.openCode]
                // timeTip: '上午'
                // date: '20190610'
                // today: true,
                // at: '001' //　第几期
              }
            } else {
              _curTime[ballNum].count++
              _curTime[ballNum].valArr.push(a.openCode)
              // _curTime[ballNum].endExpect = a.expect
              _curTime[ballNum].openCode = a.openCode
              _curTime[ballNum].expectArr.push(a.expect)
            }
            this.log(
              `${a.expect}期, ${otype.name}-连期${_curTime[ballNum].count}`
            )
          } else if (!!_curTime[ballNum]) {
            this.log(`${a.expect}期, ${otype.name}-不符合`)
            //　结束连期，记录连期信息
            if (otype.code === 11 || _curTime[ballNum].count >= 2) {
              _timesArr.push({ endExpect: a.expect, ..._curTime[ballNum] })
            }
            delete _curTime[ballNum]
          }
        }
      })
      return _timesArr
    },
    log(msg) {
      debug && console.log(msg)
    }
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
