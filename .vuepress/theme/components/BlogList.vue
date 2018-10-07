<template>
  <ul class="blog-list">
    <li 
      v-for='blog in blogs'
      class="blog-item__card"
      v-if='blog.title'
      :key='blog.path'
    >
      <NavLink :item='{text:blog.title, link: blog.path}'/>
      <Tags :tags='blog.frontmatter.tags'/>
    </li>
  </ul>
</template>
<script>
import Tags from './Tags.vue'
import NavLink from "./NavLink.vue";
export default {
  components: {
    NavLink,
    Tags
  },
  props: {
    blogs: {
      default: []
    }
  }
  
};
</script>

<style lang="stylus" scoped>
.blog-list
  list-style none
  margin 0
  padding 0
.blog-item__card
  padding 20px 10px 20px
  border 1px solid rgba(204,204,204,.45)
  &:not(:first-of-type)
    border-top none
.tags-wrap
  border-top 1px solid rgba(204,204,204,.45)
  padding-top 10px
  margin-top 20px
</style>
