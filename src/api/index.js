import fetch from '@/api/http'
import { baseUrl } from '@/api/url.js'

// 经纪人 - 获取车辆列表
export const getSellListCars = (query) => {
  return fetch.post(baseUrl + '/api/car/sell/listCars', query)
}