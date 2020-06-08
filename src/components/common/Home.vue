<template>
  <div class="wrapper">
    <div class="cc">
      <div class="c">
        <div class="sider">
          <sider-bar></sider-bar>
        </div>
        <div class="content">
          <Header></Header>
          <div class="view">
            <!-- <keep-alive> -->
            <router-view></router-view>
            <!-- </keep-alive> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from './Header'
  import SiderBar from './SiderBar'
  export default {
    data(){
      return {}
    },
    methods: {
      
    },
    created() {
    },
    components: {
      Header,
      SiderBar
    }
  }

</script>
<style scoped>
  .cc {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0
  }

  .c {
    display: flex;
    height: 100%;
  }

  .sider {
    width: auto;
    height: 100%;
    flex: 0 0 65px;
  }

  .content {
    flex: 1;
    background-color: #f1f1f1
  }

  .view {
    padding-top: 10px;
    padding-left: 20px;
  }

</style>
