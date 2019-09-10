<template>
  <div :class="{pageination:device=='mobile'}">
    <el-pagination @size-change="handleSizeChange" :pager-count="5" @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="this.pageSize" :page-sizes="this.pageSizes" :layout="layoutItem" :total="this.total" class="right" background>
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: ['total', 'currentPage', 'pageSize','pageSizes'],
  data() {
    return {
    };
  },
  computed: {
    device(){
      return this.$store.state.app.device
    },
    layoutItem() {
      let layout = 'total,sizes, prev, pager, next, jumper'
      if(this.$store.state.app.device == 'mobile'){
        layout = 'total, prev, next, jumper'
      } else{
        layout = 'total,sizes, prev, pager, next, jumper'
      }
      return layout
    },
  },
  methods: {
    handleSizeChange(pageSize) {
      window.scrollTo(0,0)
      this.$emit('handleSizeChange', pageSize);
    },
    handleCurrentChange(currentPage) {
      // window.scrollTo(0,0)
      this.$emit('handleCurrentChange', currentPage);
    }
  },
  created() {
    // console.log(this.currentPage)
  },
}
</script>

<style scoped>
.pageination{
  display: flex;
  justify-content: center;
}
.right {
  text-align: right;
  margin: 20px 0;
}
</style>
