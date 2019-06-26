export default {
  data() {
    return {
      pageList: [],
      pageModel: {
        pageIndex: 1,
        pageSize: 20,
        pageSizes: [5, 10, 20],
        pageTotal: 0
      }
    }
  },
  async created() {
    await this._initPage()
  },
  methods: {
    async _initPage() {
      if (this.loadPageList && typeof this.loadPageList === 'function') {
        let pageData = await this.loadPageList(this._applyQuery())
        this.pageList = pageData.list
        this.pageModel.pageTotal = Number(pageData.total) || 0
        this.$refs.multipleTable.clearSelection()
      }
    },
    _onSizeChange(size) {
      this.pageModel.pageSize = size
      this._initPage()
    },
    onCurrentChange(index) {
      this.pageModel.pageIndex = index
      this._initPage()
    },
    _applyQuery() {
      let query = Object.assign(
        {
          page: this.pageModel.pageIndex.toString(),
          size: this.pageModel.pageSize.toString()
        },
        this.query
      )

      Object.keys(query).forEach(key => {
        !query[key] && delete query[key]
      })

      return query
    }
  }
}
