<template>
  <div class='pagination-wrap'>
    <div 
      :class='["pager-prev-item" , {"disabled": active === 1}]'
      @click='stepChage(-1)'
    >prev</div>
    <ul class="pager-num-list">
      <li 
      v-for='page in activePagerRenderQueue' 
      @click='switchPage(page)'
      :class="['pager-num-item', active === page ? 'active':'']"
      :key='page'
      >
        {{page}}
      </li>
    </ul>
    <div 
      @click='stepChage(1)'
      :class='["pager-next-item" , {"disabled": active === allPagerCount}]'
    >next</div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      active: 1,
      activePagerRenderQueue: [],
      allPagerRenderQueue: []
    };
  },
  props: {
    total: {
      default: 0
    },
    size: {
      default: 10
    }
  },
  computed:{
    allPagerCount() {
      return this.allPagerRenderQueue.length
    }
  },
  mounted() {
    const arr = [];
    let i = 0;
    let totalPageCount = Math.ceil(this.total / this.size);

    while (i < totalPageCount) {
      i++;
      arr.push(i);
    }
    
    this.allPagerRenderQueue = arr;

    this.activePagerRenderQueue = arr.length > 9 ? arr.slice(0, 9) : arr;
  },
  methods: {
    stepChage(v){
      const active = this.active + v
      if(active > this.allPagerCount || active <= 0) return
      this.switchPage(active)
    },
    switchPage(a) {
      this.$emit("on-pager-change", a)
      this.active = a
      var pages = this.allPagerRenderQueue,
        pagesLen = pages.length
      if (pagesLen <= 9) return
      /**
      * a为页码
      * 最多显示九个页码, 要将点击的这个放到中间,
      * 判断    其前方第4个页码是否大于等与0
      * 且      其后方第4个页码是否小于等与 最大页码数
      * 若正确, 则截取 页码数组中 此页码前四位至后四位,共9位,
      * 否则 ....
      *
      * 注意 页码-数组的索引=1
      */
      this.activePagerRenderQueue =
        a - 5 >= 0 && a + 4 <= pagesLen
          ? pages.slice(a - 5, a + 4)
          : a - 5 < 0
            ? pages.slice(0, 9)
            : pages.slice(pagesLen - 9, pagesLen);
    }
  }
};
</script>

<style lang="stylus" scoped>
@require '../styles/config.styl';

.pagination-wrap {
    overflow: hidden;
    margin: 0 -10px;
}

.pager-num-list {
    margin: 0;
    padding: 0;
}

.pager-next-item, 
.pager-prev-item, 
.pager-num-item {
    float: left;
    padding: 6px;
    line-height: 1;
    border: 1px solid $accentColor;
    color: $accentColor;
    text-align: center;
    margin: 0 10px;
    cursor: pointer;
    user-select none
}
.pager-prev-item,
.pager-next-item {
 &.disabled {
    border-color lighten($accentColor, 60%);
    color lighten($accentColor, 60%);
    cursor not-allowed
  }
  
}
  


.pager-num-item {
    list-style: none;
    min-width: 18px;

    &.active, &:hover {
        background: $accentColor;
        color: #fff;
    }
}
</style>
