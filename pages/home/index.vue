<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">丁向东的测试1</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link exact class="nav-link" :class="{ active: tab === 'your_feed' }" 
                  :to="{ name: 'home', query: {tab: 'your_feed'} }">
                  Your Feed
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link exact class="nav-link" :class="{ active: tab === 'global_feed' }" :to="{name: 'home', query: {tab: 'global_feed'}}">
                  Global Feed
                </nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link exact class="nav-link" :class="{ active: tab === 'tag' }" :to="{name: 'home', query: {tab: 'tag', tag: tag}}">
                 # {{tag}}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <!-- 文章列表 -->
          <div v-for="article in articles" :key="article.slug" class="article-preview">
            <div class="article-meta">
              <nuxt-link :to="{ name: 'profile', params: { username: article.author.username }}">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <a href="" class="author">Eric Simons</a>
                <nuxt-link :to="{ name: 'profile', params: { username: article.author.username }}" class="author">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button @click="onFavorites(article)" class="btn btn-outline-primary btn-sm pull-xs-right" 
                :class="{active: article.favorited}" :disabled="article.favoriteDisabled">
                <i class="ion-heart"></i> {{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link :to="{name: 'article', params: { slug: article.slug }}" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- /文章列表 -->
          <div v-show="articles.length<1" class="article-preview">
            No articles are here... yet.
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === page
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab: tab
                    }
                  }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link v-for="tag in tags" :key="tag" class="tag-pill tag-default" 
                :to="{ name: 'home', query: { tag: tag, tab: 'tag' }}">
                {{tag}}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getYourFeedArticles, addFavorite, deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
export default {
  name: "HomeIndex",
  watchQuery: ['tab', 'page', 'tag'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  async asyncData ({ query }) {
    const page = Number.parseFloat(query.page || 1)
    const limit = 20
    const tab = query.tab || 'global_feed'
    const tag = query.tag

    const loadArticles = tab === 'your_feed' ? getYourFeedArticles : getArticles

    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])

    const { tags } = tagRes.data
    const { articles, articlesCount } = articleRes.data

    articles.forEach(item => item.favoriteDisabled = false)

    return {
      articles, // 文章列表
      articlesCount, // 文章总数
      tags: tags, // 标签列表
      limit, // 每页大小
      page, // 页码
      tab, // 选项卡
      tag // 数据标签
    }
  },
  methods: {
    async onFavorites (article) {
      if( !this.user) {
        this.$router.push('/login')
      } else {
        article.favoriteDisabled = true
        if (article.favorited) {
          // 取消点赞
          await deleteFavorite(article.slug)
          article.favoritesCount += -1
          article.favorited = false
        } else {
          // 添加点赞
          await addFavorite(article.slug)
          article.favoritesCount += 1
          article.favorited = true
        }
        article.favoriteDisabled = false
      }
    }
  }
};
</script>

<style>
</style>