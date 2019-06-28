import { getHistory } from '@/api/api'
let fs = require("fs")

console.log(fs)

// getHistory({
//   lid: 2,
//   num: 10
// }).then(res => {
//   res.openCodeList
//     .forEach((o, i) => {
//       delete o.openTime
//       delete o.remark
//       delete o.sourceCode
//     })
//   // writeFile('test', res)
// }).catch(e => {
//   console.log('获取失败！')
// })

let ctx = fs.readFile("index.js")
console.log(ctx)
export const writeFile = (name, ctx) => {
  // 写入文件（会覆盖之前的内容）（文件不存在就创建）  utf8参数可以省略
  fs.writeFile(`${name}.js`, JSON.stringify(ctx), 'utf8', function (error) {
    if (error) {
      console.log(error);
      return false;
    }
    console.log('写入成功');
  })
}



