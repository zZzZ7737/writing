<template>
  <div class="home">
    

    <BlogList :blogs='blogs' />

    <Pagination :size='pageSize' :total='blogs.length' @on-pager-change='onPagerChange'/>
  </div>
</template>

<script>
import NavLink from '../components/NavLink.vue'
import BlogList from '../components/BlogList.vue'
import Pagination from '../components/Pagination.vue'

const pageSize = 15

export default {
  created() {
    // console.log(this.$site)
  },
  components: {
    NavLink,
    BlogList,
    Pagination
  },
  computed: {
    blogs() {
      const pages = this.$site.pages.filter(page=>!page.frontmatter.layout)
      return pages.slice(pageSize*(this.activePageNum-1), pageSize*this.activePageNum)
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
