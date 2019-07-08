<template>
  <div class="view-wrap">
    <el-menu
      @select="handleSelect"
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-demo"
      default-active="cqssc"
      mode="horizontal"
      text-color="#fff"
    >
      <el-menu-item :index="k" :key="k" v-for="(o, k) in lottery_data" v-loading.fullscreen.lock="isLoading">{{o.lotteryName}}</el-menu-item>
    </el-menu>

    <div class="box">
      <div class="box-header">
        <span class="box-header-tit">
          存有
          <strong class="c-warning">{{totalDays}}</strong>
          天数据(每天
          <strong class="c-warning">{{curLottery.timesPerDay || "-" }}</strong>
          期)，查看最近
          <el-select class="w80" placeholder="请选择" size="small" v-model="days">
            <el-option :key="day" :label="day" :value="day" v-for="day in 31"></el-option>
          </el-select>
          天数据（
          <strong class="c-warning">{{cutHistory.length}}期</strong>
          )，数据更新到
          <strong class="c-warning">{{currentExpect ? currentExpect.expect : "-"}}</strong>
          期。
        </span>
      </div>
      <div class="mb5">
        <el-checkbox-group class="vm" v-model="typeList">
          <el-checkbox-button :key="key" :label="type.name" v-for="(type, key) in TYPE1"></el-checkbox-button>
        </el-checkbox-group>
        <el-checkbox-group class="vm mtb5" v-model="typeList">
          <el-checkbox-button :key="key" :label="type.name" v-for="(type, key) in TYPE2"></el-checkbox-button>
        </el-checkbox-group>
        <el-checkbox-group class="vm" v-model="typeList">
          <el-checkbox-button :key="key" :label="type.name" v-for="(type, key) in TYPE3"></el-checkbox-button>
        </el-checkbox-group>
      </div>
      <el-table :data="analysisData" size="mini" stripe>
        <el-table-column align="center" label="连期数" width="60">
          <template slot-scope="{row}">
            <span :class="{'c-danger': row.time > 4}">{{row.time}}期</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="连期/结束" width="100">
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
        <!-- <el-table-column align="left" label="详细" width="100">
          <template slot-scope="{row}">
            <details :timesDetails="row.details"></details>
          </template>
        </el-table-column>-->
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
    <div class="box" v-if="1">
      <div class="box-header">
        <span class="box-header-tit">
          <span class="pr10">期数列表</span>
          <span class="c-info pl10">
            共有
            <strong class="c-warning mlr5">{{timesFilter.length}}</strong> 条数据
          </span>
        </span>
      </div>
      <el-table :data="pageList" :default-sort="{prop: 'count', order: 'descending'}" size="mini" stripe>
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
            <span :class="row.isLastExpect ? 'c-danger' : 'c-success'">{{row.endExpect}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开奖号" prop="openCode" width="90"></el-table-column>
        <el-table-column align="left" label="开奖时间">
          <template slot-scope="{row}">{{row.timeTip}}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="pageModel.pageIndex"
        :page-size="pageModel.pageSize"
        :page-sizes="pageModel.pageSizes"
        :total="pageTotal"
        @current-change="onCurrentChange"
        @size-change="_onSizeChange"
        background
        class="mt20"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- <div class="line-sigle mt20">echart</div> -->
  </div>
</template>
<script>
// import echarts from 'echarts/lib/echarts'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/legendScroll'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/title'
// import Details from '@/components/Details'

import luckMixins from '@/mixins/luckMixins'
import pageMixins from '@/mixins/pageMixins'
import STATIC_DATA from '../../config/lucky'
import allData from '@/data/index'
import { getHistory } from '@/api/api'

export default {
  name: 'Lucky',
  data() {
    return {
      isLoading: false,
      fetchByNet: false,
      MOCK_NUM: 10,
      lottery_data: STATIC_DATA.lottery_data,
      days: 1,
      typeList: ['大'],
      curLottery: {}
    }
  },
  mixins: [luckMixins, pageMixins],
  // components: {
  //   Details
  // },
  created() {},
  mounted() {
    // this.chart = echarts.init(this.$el.lastElementChild)
  },
  watch: {
    timesFilter() {
      //　更新期数列表
      this._initPage()
    }
  },
  methods: {
    _loadList() {
      return this.timesFilter || []
    },
    async handleSelect(v, path) {
      // this.$router.push({ name: index, query: { day: 3, type: [1,2,3] } })
      if (v === 'mock') {
        // 模拟数据
        this.history = {
          message: '获取数据成功',
          openCodeList: Array.from({ length: _num }).map((_, i) => {
            return {
              expect: `20190610_${i}`,
              openCode: Math.floor(Math.random() * 100000)
                .toString()
                .padLeft(5, '0')
                .split('')
                .join(',')
            }
          }),
          sign: true
        }
      } else {
        const _curLottery = this.lottery_data[v] || {}
        this.curLottery = _curLottery
        let _num = _curLottery.timesPerDay * this.days

        if (this.fetchByNet) {
          this.isLoading = true
          try {
            var _res = await getHistory({
              lid: _curLottery.lotteryId,
              num: _num
            })
            _res.openCodeList.forEach((o, i) => {
              delete o.openTime
              delete o.remark
              delete o.sourceCode
            })
          } catch (error) {
            console.log('获取失败！')
          } finally {
            this.isLoading = false
          }
          this.$message.info({
            message: `加载【${this.curLottery.lotteryName || '模拟数据'}】最近${
              this.days //this.totalDays
            }天数据，共计 ${_num} 期`, //this.totalCount} 期`,
            duration: 1000
          })
        } else {
          // 从本地数据库data中读取
          _res = allData[v]
        }
      }
      let _data = _res
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
