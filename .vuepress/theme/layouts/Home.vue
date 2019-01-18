<template>
  <div class="home">
    

    <BlogList :blogs='blogs' />

    <Pagination :size='pageSize' :total='$site.pages.length' @on-pager-change='onPagerChange'/>
  </div>
</template>

<script>
import NavLink from '../components/NavLink.vue'
import BlogList from '../components/BlogList.vue'
import Pagination from '../components/Pagination.vue'

const pageSize = 15

export default {
  created() {
      // 根据创建时间对博客进行排序
    const pages = this.$site.pages.filter(page=>!page.frontmatter.layout)
    this.pages = pages.sort((c,n)=> {
        const cTime = c.frontmatter.createTime || '1999-01-01'
        const nTime = n.frontmatter.createTime || '1999-01-01'
        return new Date(...nTime.split('-')).getTime() - new Date(...cTime.split('-')).getTime()
      })
  },
 
  components: {
    NavLink,
    BlogList,
    Pagination
  },
  computed: {
    blogs() {
      return this.pages.slice(pageSize*(this.activePageNum-1), pageSize*this.activePageNum)
    },
  },
  data() {
    return {
      activePageNum: 1,
      pageSize: pageSize
    }
  },
  methods: {
    onPagerChange(v){
      this.activePageNum = v
    }
  }
}
</script>

<style lang="stylus">
@import '../styles/config.styl'

.home
  padding $navbarHeight 2rem 0
  max-width 960px
  margin 0px auto

.pagination-wrap
  margin-top 10px !important

</style>
