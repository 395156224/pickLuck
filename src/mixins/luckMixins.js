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
        },
        isPrime: {
          code: 12,
          name: '质',
          fn: v => {
            return [1, 2, 3, 5, 7].includes(+v)
          }
        },
        isNotPrime: {
          code: 13,
          name: '合',
          fn: v => [0, 4, 6, 8, 9].includes(+v)
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
    currentExpect() {
      return this.cutHistory[this.cutHistory.length - 2]
    },
    timesArr() {
      // 统计所有连期数
      let _res = []
      Object.keys(this.TYPE).forEach((t, i) => {
        let _tmp = this._sumTimes(t, this.cutHistory)
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
    _sumTimes(t, sumData = this.cutHistory) {
      let _timesArr = [],
        _curTime = [] // 0-4记录单球， 5-11记录总和龙虎

      const otype = this.TYPE[t]
      this.log(`==== 开始统计 ${otype.name} ====`)
      sumData.forEach((a, i, oa) => {
        let _codeArr = a.openCode.split(',')

        if (this.TYPE1[t]) {
          // 大小单双质合
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
                _curTime[ballNum].endExpect = a.expect
                _curTime[ballNum].openCode = a.openCode
                _curTime[ballNum].expectArr.push(a.expect)

                if (this.currentExpect.expect === a.expect) {
                  _curTime[ballNum].isLastExpect = true
                }
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
                let _timeTip = this._getTimeTip(_curTime[ballNum].endExpect)
                _timesArr.push({ timeTip: _timeTip, ..._curTime[ballNum] })
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
                valArr: [a.openCode],
                endExpect: a.expect
                // timeTip: '上午'
                // date: '20190610'
                // today: true,
                // at: '001' //　第几期
              }
            } else {
              _curTime[ballNum].count++
              _curTime[ballNum].valArr.push(a.openCode)
              _curTime[ballNum].endExpect = a.expect
              _curTime[ballNum].openCode = a.openCode
              _curTime[ballNum].expectArr.push(a.expect)

              if (this.currentExpect.expect === a.expect) {
                _curTime[ballNum].isLastExpect = true
              }
            }
            this.log(
              `${a.expect}期, ${otype.name}-连期${_curTime[ballNum].count}`
            )
          } else if (!!_curTime[ballNum]) {
            this.log(`${a.expect}期, ${otype.name}-不符合`)

            //　结束连期，记录连期信息
            if (otype.code === 11 || _curTime[ballNum].count >= 2) {
              let  _timeTip = this._getTimeTip(_curTime[ballNum].endExpect)
              _timesArr.push({ timeTip: _timeTip, ..._curTime[ballNum] })
            }
            delete _curTime[ballNum]
          }
        }
      })
      return _timesArr
    },
    _getTimeTip(endExpect, expectArr=[]) {
      let _y = endExpect.substring(0, 4)
      let _m = endExpect.substring(4, 6)
      let _d = endExpect.substring(6, 8)
      let _exp = Number(endExpect.substring(8))
      let _mins = _exp * 20 + 10 + 2  // 基于零点的分钟, 封盘时间-3，开奖时间+2

      if (_mins > (3 * 60 + 10)) { // 大于3:10
        _mins += 4 * 60
      }

      let _h = Math.floor(_mins / 60)
      let _min = _mins % 60
      return `${_y} ${_m}/${_d} ${_h}:${_min}` //new Date(`${_y} ${_m} ${_d} ${_h}:${_min}`).toLocaleString()
    },
    testTimeTip() {
      var res = []
      for (var i = 1; i< 60; i++) {
        let _exp = i.toString().padStart(3, 0)
        let _m = (new Date().getMonth()+1).toString().padStart(2, 0)
        let _d = (new Date().getDate()).toString().padStart(2, 0)
        let _exps = `2019${_m}${_d}${_exp}`
        res.push({
          i: _exp,
          time: this._getTimeTip(_exps)
        })
      }
      console.table(res)
    },
    log(msg) {
      debug && console.log(msg)
    }
  }
}