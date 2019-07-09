const gulp = require('gulp')
const fs = require('fs')
const yargs = require('yargs')

const fetch = require('./fetch.js')
const luckyConfig = require('../config/lucky.js')
const lottery_data = luckyConfig.lottery_data

const DATA_DIR = '../src/data'

// fs.access(DATA_DIR, fs.constants.F_OK, error => {
//   console.log(error)
//   fs.mkdirSync(DATA_DIR, { recursive: false })
//   console.log(`创建文件夹${DATA_DIR}成功`);
// })

const name = yargs.argv.n || yargs.argv.name || false
/**
 * 获取数据写入文件
 */
gulp.task('fetchData', async done => {
  for (let _name in lottery_data) {
    if (!!name && _name !== name) {
      continue
    }
    console.log(`开始获取${_name}`)
    let o = lottery_data[_name]
    try {
      let _res = await fetch.post(`/Trend/Histroy`, {
        lid: o.lotteryId,
        num: o.timesPerDay * 30
      })
      _res.openCodeList.forEach((o, i) => {
        delete o.openTime
        delete o.remark
        delete o.sourceCode
      })
      writeFile(`${DATA_DIR}/${_name}`, _res)
    } catch (error) {
      console.log("数据获取异常")
      continue
    }
  }
  done()
})

const writeFile = (name, ctx) => {
  // 写入文件（会覆盖之前的内容）（文件不存在就创建）  utf8参数可以省略
  fs.writeFile(`${name}.js`, "module.exports = " + JSON.stringify(ctx, null, 2), 'utf8', function (error) {
    if (error) {
      console.log(error);
      return false;
    }
    console.log('写入成功');
  })
}