module.exports = {
	"message": "获取数据成功",
    "openCodeList": [],
    "sign": true
}
// $.ajax({
//     type: "POST",
//     url: "/Trend/Histroy",
//     data: {
//         lid: 2,
//         num: 20000
//     },
//     datatype: "json",
//     success: function(n) {
// 		console.log('ok')
//         n.openCodeList.forEach((o, i) => {
// 			delete o.openTime
// 			delete o.remark
//  			delete o.sourceCode
// 		})
// 		console.log(n.openCodeList.length, JSON.stringify(n.openCodeList))
// // 		console.log(n.openCodeList.map(o => ({expect: o.expect, openCode: o.openCode}))
//     }
// })