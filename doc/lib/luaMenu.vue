<template>
  <div class="lua-menu">
    <ul>
      <li>
        <input type="text"
        v-model="filter"
        class="form-control"
        placeholder="Filter by component name" />
      </li>
      <li v-for="component in inputFilter" 
      :key="component.name"
      class="component--item"
      :class="{'is-active': selected == '#'+component.name}"  
      >
      <a :href="'#'+component.name" @click="selected = '#'+component.name">{{component.name}}</a>
    </li>

    
  </ul>
</div>
</template>

<script>
  export default {
    props: ['components'],
    data(){
      return{
        filter: '',
        selected: window.location.hash
      }
    },
    
    computed:{
      
      inputFilter () {
        return (
        (this.filter &&
        this.components.filter(component =>
        component.name.includes(this.filter)
        )) ||
        this.components
        )
      }
    },
    
  }
</script>

<style lang="scss">
  
  @import 'colors';
  
  .lua-menu{
    background-color: #f1f0fb;
    min-height: 100vh;
    position: fixed;
    width: 300px;
    
    ul{
      margin: 0;
      padding: 0;
      
      li{
        list-style: none;
        
        a{
          text-decoration: none;
          padding: 10px 20px 10px 35px;
          color: $darkpurple;
          text-transform: uppercase;
          width: 260px;
          display: block;
          font-weight: 600;
          
          &:before{
            content:'🢒';
            transform:translatey(-8px) translatex(-12px);
            position: absolute;
            font-size: 25px;
          }
        }
        
        &:first-child{
          background-color: #41397529;
          padding: 20px 35px 20px 20px;
          
          input{
            width: 100%;
            height: 20px;
            outline: none;
            border: none;
            transition: all .3s;
            border-radius:2px;
            padding: 5px;
            color: $midpurple;
            
            &:hover{
              box-shadow: 1px 1px 10px rgba(3, 1, 124, 0.233);
            }
          }
        }
        &:not(:first-child){
          &:hover{
            background-color: #13008f12;
            cursor: pointer;
            font-weight: bolder;
          }
        }
      }
      li.is-active{
        background-color: #13008f12;
        cursor: pointer;
        a{
          font-weight: 700;
        }
      }
    }
  }
</style>