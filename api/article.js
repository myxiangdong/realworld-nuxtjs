import { request } from '@/plugins/request'

// 获取公共文章列表
export const getArticles = params => {
  return request({
    url: '/api/articles',
    method: 'GET',
    params
  })
}

// 获取关注文章列表
export const getYourFeedArticles = params => {
  return request({
    url: '/api/articles/feed',
    method: 'GET',
    params
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'POST'
  })
}

// 取消点赞
export const deleteFavorite = slug => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'DELETE'
  })
}

// 获取文章详情
export const getArticle = slug => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'GET'
  })
}

// 获取文章评论列表
export const getComments = slug => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: 'GET'
  })
}
