import Vue from 'vue'
import Router from 'vue-router'

const Lucky = () => import( /* webpackChunkName: "group-myluck" */ '@/views/Lucky')
// import config from '../config'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: '',
    component: Lucky
  },
  {
    path: '/lucky',
    name: 'lucky',
    component: Lucky
  }
]
// let luckys = config.lottery_data
// for (let k in luckys) {
//   let lucky = luckys[k]
//   // console.log(lucky)
//   routes.push({
//     path: `/${k}`,
//     name: k,
//     component: Cqssc
//   })
// }

export default new Router({
  routes
})
