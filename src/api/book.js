import request from '@/utils/request'
import { ApiPrefix } from '@/utils/setting'

// 改变书籍阅读信息
export function readingInfoUpdate(data) {
  return request({
    url: `${ApiPrefix}/book/readingInfoUpdate`,
    method: 'post',
    data
  })
}

// 获取书籍阅读信息
export function readingInfo(data) {
  return request({
    url: `${ApiPrefix}/book/readingInfo`,
    method: 'post',
    data
  })
}
