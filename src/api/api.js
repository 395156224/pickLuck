import {get, post} from '@/api/fetch'
/**
 * 获取历史接口
 */
export const getHistory = ( params) => {
  return post(`/Trend/Histroy`, params)
}

