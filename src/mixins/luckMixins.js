const debug = false

export default {
  data() {
    return {
      history: [],
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
    }
  },
  computed: {
    TYPE() {
      return { ...this.TYPE1, ...this.TYPE2, ...this.TYPE3 }
    },
    totalCount() {
      return this.history.length // 历史数据期数
    },
    totalDays() {
      return Math.floor(this.totalCount / this.curLottery.timesPerDay) || '-'
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
      return (this.timesArr || []).filter(o => this.typeList.includes(o.type)).sort((a, b) => b.count - a.count)
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