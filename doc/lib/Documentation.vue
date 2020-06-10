
<script>
  import luaDoc from './luaDoc.vue'
  import luaMenu from './luaMenu.vue'
  import luaFooter from './luaFooter.vue'
  import luaToolbar from './luaToolbar.vue'
  import * as comps from './../../../../../public/Components.js'
  
  export default {
    components: { luaDoc, luaMenu, luaToolbar, luaFooter },
    data() {
      return { 
        documentMe: Object.values(comps),
        deviceHeight: ''
        }
    },
    mounted(){
      var screenTop = window.screenTop;
      this.deviceHeight = window.innerHeight - 170 + 'px';
    }
  }
</script>

<template>
  <section id="luadoc">
    <lua-menu :components="documentMe"></lua-menu>
    <div class="lua-doc">
      <lua-toolbar></lua-toolbar>
      <div class="components" :style="{minHeight: deviceHeight}">
        <lua-doc :component="doc" :i="i" v-for="(doc, i ) in documentMe" :key="i" ></lua-doc>
      </div>
      <lua-footer></lua-footer>
    </div>
  </section>
</template>

<style lang="scss">
  #luadoc{
    display: flex;
    
    .lua-doc {
      flex: 1;
      margin-left: 300px;
      
      .components{
        padding: 50px 50px 0;
      }
    }
    .lua-menu{
    }
  }
</style>