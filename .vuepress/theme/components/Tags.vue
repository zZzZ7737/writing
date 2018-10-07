<template>
<div class="tags-wrap">
  <ul class="tags clearfix">
    <li class="tag f-l" v-for='tag in tags'>{{render(tag)}}</li>
  </ul>
</div>
</template>
<script>
export default {
  props: ['tags'],
  methods:{
    render(tag) {
      return typeof tag === 'string' ? tag : `${tag.text} ${tag.count}`
    }
  }
}
</script>
<style lang="stylus" scoped>
@require '../styles/config.styl'

.tag
  padding 4px
  // background $accentColor
  border 1px solid rgba(204,204,204,.3)
  
  color #777
  font-size 14px
  line-height 1
  margin-right 10px



</style>
