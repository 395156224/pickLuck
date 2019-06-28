let gulp = require('gulp')
let fs = require('fs')
let fetch = require('./fetch.js')

const luckyConfig = require('../config/lucky.js')
const lottery_data = luckyConfig.lottery_data

const DATA_DIR = '../src/data'

// fs.access(DATA_DIR, fs.constants.F_OK, error => {
//   console.log(error)
//   fs.mkdirSync(DATA_DIR, { recursive: false })
//   console.log(`创建文件夹${DATA_DIR}成功`);
// })

/**
 * 获取数据写入文件
 */
gulp.task('fetchData', async done => {
  for (let name in lottery_data) {
    console.log(name)
    let o = lottery_data[name]
    let _res = await fetch.post(`/Trend/Histroy`, {
      lid: o.lotteryId,
      num: o.timesPerDay * 30
    })
    _res.openCodeList.forEach((o, i) => {
      delete o.openTime
      delete o.remark
      delete o.sourceCode
    })
    writeFile(`${DATA_DIR}/${name}`, _res)
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