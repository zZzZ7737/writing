<template>
  <div class="tags-view">
    <Tags :tags='tags'/>
  </div>
</template>
<script>
import Tags from '../components/Tags.vue'

export default {
  components: {
    Tags,
  },
  computed: {
    tags(){
      const pages = this.$site.pages
      const tags = []
      const tagsMap = {}
      pages.forEach(item=>{
        let itemTags = item.frontmatter.tags
        if(typeof itemTags === 'string') itemTags = [itemTags]
        if(!itemTags || !itemTags.length) return
        itemTags.forEach(item=> {
          if(tagsMap[item] || tagsMap[item] === 0) {
            tags[tagsMap[item]].count ++
          }else {
            tagsMap[item] = tags.length
            tags.push({
              text: item,
              count: 1
            })

          }

        })
      })
      return tags
    }
  }
}
</script>
<style lang="stylus" scoped>
.tags-view
  padding 30px
</style>
