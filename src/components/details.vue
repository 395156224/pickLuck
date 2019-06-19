<template>
  <div class="ap-list-popover" style="display:inline-block">
    <el-popover ref="searchPopover" v-model="showSearch" placement="bottom-end" width="400" trigger="click">
      <el-table :data="timesDetails" :default-sort="{prop: 'count', order: 'descending'}" size="mini" stripe>
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
        <!-- <el-table-column align="center" label="开奖号" prop="openCode" width="90"></el-table-column> -->
        <el-table-column align="center" label="连期号" prop="valArr" width="90">
          <template slot-scope="{row}">
            <span class="c-success">{{row.valArr.join(", ")}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="时间">
          <template slot-scope="{row}">{{row.timeTip}}</template>
        </el-table-column>
      </el-table>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'details',
  props: {
    timesDetails: {
      default: [],
      type: Array
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    onSearchAplist() {
      this.showSearch = false
      this.$emit('search', this.query)
    }
  }
}
</script>
<style lang="scss">
</style>
