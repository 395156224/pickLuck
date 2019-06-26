export default {
  data() {
    return {
      pageModel: {
        pageIndex: 1,
        pageSize: 10,
        allItem: [],
        pageSizes: [5, 10, 20, 30, 50],
        // searchValue: '',
        // searchKey: '',
        query: {}
      }
    }
  },
  async created() {
    await this._initPage()
  },
  computed: {
    // pageSearchList() {
    //   if (!this.pageModel.searchKey) {
    //     return this.pageModel.allItem
    //   }
    //   return this.pageModel.allItem.filter(item => {
    //     return item[this.pageModel.searchKey].indexOf(this.pageModel.searchValue) > -1
    //   })
    // },
    pageSearchList() {
      if (Object.keys(this.pageModel.query).length === 0) {
        return this.pageModel.allItem
      }
      return this.pageModel.allItem.filter(item => {
        let _flag = true
        Object.keys(this.pageModel.query).forEach(key => {
          if (_flag && item[key]) {
            _flag = _flag && item[key].includes(this.pageModel.query[key])
          }
        })
        return _flag
      })
    },
    pageTotal() {
      return this.pageSearchList.length
    },
    pageList() {
      return this.pageSearchList.slice(
        (this.pageModel.pageIndex - 1) * this.pageModel.pageSize,
        this.pageModel.pageIndex * this.pageModel.pageSize
      )
    }
  },
  methods: {
    async _initPage(toFirstPage = true) {
      if (this._loadList && typeof this._loadList === 'function') {
        this.pageModel.allItem = await this._loadList()
        toFirstPage && this.onCurrentChange(1)
      }
    },
    _onSizeChange(size) {
      this.pageModel.pageSize = size
      this.pageModel.pageIndex = 1
    },
    onCurrentChange(index) {
      this.pageModel.pageIndex = index
    },
    removeList(idx) {
      if (!Number.isInteger(idx)) {
        return
      }
      let _index = this.getRealIndex(idx)
      this.pageModel.allItem.splice(_index, 1)
    },
    editList(idx, item) {
      let _index = this.getRealIndex(idx)
      this.pageModel.allItem.splice(_index, 1, item)
    },
    addList(item) {
      this.pageModel.allItem.push(item)
    },
    searchListFuzzy(word, key) {
      // this.pageModel.searchValue = word
      // this.pageModel.searchKey = key
      let _query = {}
      _query[key] = word
      this.pageModel.query = _query
      this.onCurrentChange(1)
    },
    getItem(idx) {
      let _index = this.getRealIndex(idx)
      return Object.assign({}, this.pageModel.allItem[_index])
    },
    getRealIndex(idx) {
      return (this.pageModel.pageIndex - 1) * this.pageModel.pageSize + idx
    },
    searchList(query) {
      this.pageModel.query = {...query}
      this.onCurrentChange(1)
    },
  }
}
