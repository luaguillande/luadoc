<template>
  <article class="luadoc-content" v-if="merged && merged.name" :id="merged.name">
    <div class="use">
      <div>
        <h2 class="title">{{ merged.name }}</h2>
      </div>
      <div class="token" v-if="merged.token"><pre><code class="code">{{ merged.token }}</code></pre>
        <div class="tooltip">
          <button class="copy-btn" @click="copyFunc(i)">
            <span class="tooltiptext" :id="'myTooltip'+i">Copiar</span>
            <img src="./assets/copy.png" alt="">
          </button>
        </div>
      </div>
    </div>
    <div class="description" v-html="merged.description" v-if="merged.description"></div>
    
    <div class="content">
      <div v-if="merged.img" class="preview">
        <p>Preview</p>
        <img :src="merged.img" v-if="merged.img"><div v-else>sem preview</div>
      </div>
      <div>
        <div class="tabs" >
          <ul>
            <li @click="activeTab = 'props'" :class="activeTab == 'props'? 'active' : ''">PROPS</li>
            <li @click="activeTab = 'slots'" :class="activeTab == 'slots'? 'active' : ''">SLOTS</li>
            <li @click="activeTab = 'usage'" :class="activeTab == 'usage'? 'active' : ''">USAGE</li>
          </ul>
        </div>
        <section class="props" v-if="merged.props" v-show="activeTab == 'props'">
          <div class="proprow labels">
            <div class="propcol type">name</div>
            <div class="propcol type">type</div>
            <div class="propcol default">default</div>
            <div class="propcol notes">notes</div>
          </div>
          <div class="proprow" v-for="(propinfo, propname, i) in merged.props" :key="i">
            <div class="propcol name"><span>{{ propname }}</span></div>
            <div class="propcol type">{{ propinfo.type }}</div>
            <div class="propcol default">{{ propinfo.default }}</div>
            <div class="propcol notes" v-html="marked(propinfo.note)"></div>
          </div>
        </section>
        <section v-else v-show="activeTab == 'props'" class="nothing-to-show" v-html="marked('No `props` to show')"></section>
        <section class="props" v-if="merged.slots" v-show="activeTab == 'slots'">
          <div class="proprow labels">
            <div class="propcol type">type</div>
            <div class="propcol notes">notes</div>
          </div>
          <div class="proprow" v-for="(propinfo, i) in merged.slots" :key="i">
            <div class="propcol name"><span>{{ propinfo.name }}</span></div>
            <div class="propcol notes" v-html="marked(propinfo.note)"></div>
          </div>
        </section>
        <section v-else v-show="activeTab == 'slots'" class="nothing-to-show" v-html="marked('No `slots` to show')"></section>
        <section class="props" v-if="merged.usage" v-show="activeTab == 'usage'">
          <div class="proprow labels">
            <div class="propcol type">url</div>
            <div class="propcol notes">called by</div>
          </div>
          <div class="proprow" v-for="(propinfo, i) in merged.usage" :key="i">
            <div class="propcol name"><a :href="propinfo.url" target="_blank">{{ propinfo.url }}</a></div>
            <div class="propcol notes">{{ propinfo.calledBy.join(", ") }}</div>
          </div>
        </section>
        <section v-else v-show="activeTab == 'usage'" class="nothing-to-show" v-html="marked('No `usage` to show')"></section>
      </div>
    </div>
  </article>
</template>
<script>
  import marked from 'marked';
  
  export default {
    name: 'propDoc',
    props: {
      component: {
        type: Object,
        required: true
      },
      documentation: {
        type: Object
      },
      ignoreMixins: {
        type: Boolean,
        default: false
      },
      i:{
        type: Number
      }
    },
    data() {
      return { 
        merged: this.process(this.component, this.documentation),
        activeTab: 'props',
        marked
      }
    },
    getDoc(component, documentation, ignoreMixins) {
      return this.methods.process(component,documentation,ignoreMixins)
    },
    
    methods: {
      copyFunc(i) {
        var codeElement =
        document.getElementsByClassName("code") &&
        document.getElementsByClassName("code").length ?
        document.getElementsByClassName("code")[i] :
        "";
        
        if (codeElement != "") {
          var e = document.createRange();
          e.selectNodeContents(codeElement);
          var selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(e);
          document.execCommand("Copy");
          selection.removeAllRanges();
          document.getElementById(`myTooltip${i}`).innerText = 'Copiado';
          setTimeout(() => {
            document.getElementById(`myTooltip${i}`).style.opacity = 0;
          }, 1500);
          
          setTimeout(() => {
            document.getElementById(`myTooltip${i}`).style.opacity = 1;
            document.getElementById(`myTooltip${i}`).innerText = 'Copiar';
          }, 2500);
        }
      },
      process(component, documentation,ignoreMixins) {
        let m = this.merge(component, documentation)
        if (m.token) m.token = this.sanitize(m.token)
        if (m.description) m.description = marked(m.description)
        if (! (ignoreMixins || this.ignoreMixins)) {
          if (m.mixins) m.props = this.merge(this.getPropsFromMixins(m.mixins), m.props)
        }
        if (m.props) m.props = this.processProps(m.props)
        return m
      },
      sanitize(text) {
        text = text.trim()
        const match = text.match(/^[ \t]*(?=\S)/gm)
        if (!match) return text
        const indent = Math.min.apply(Math, match.map(x => x.length))
        const re = new RegExp(`^[ \\t]{${indent}}`, 'gm')
        return indent > 0 ? text.replace(re, '') : text
      },
      getPropsFromMixins(mixins) {
        return mixins.reduce((map, mixin) => {
          Object.assign(map, mixin.props)
          return map
        }, {})
      },
      processProps(props) {
        let keys = Array.isArray(props) ? props : Object.keys(props)
        return keys.reduce((map, k) => {
          let v = new Proxy(props[k] || {}, this.basicArrayProxy)
          map[k] = {
            type: this.getType(v.type),
            required: v.required || false,
            default: this.getDefault(v.default),
            note: v.note || ""
          }
          return map
        }, {})
      },
      basicArrayProxy(target, name) {
        return name in target ? target[name] : undefined
      },
      getDefault(d) {
        if (typeof(d) !== 'undefined') {
          if (typeof(d) === 'function') return JSON.stringify(d())
          return JSON.stringify(d)
        }
        return 'undefined'
      },
      isTypeArray(t) {
        return ( typeof(t()) === 'object' && Array.isArray(t()) )
      },
      getType(t) {
        if (typeof(t) === 'undefined') return 'any'
        if (Array.isArray(t)) {
          return t.map(type => (this.isTypeArray(type) ? 'array' : typeof(type()))).join('|')
        }
        let type = typeof(t())
        if (this.isTypeArray(t)) return 'array'
        return type
      },
      merge(a, b) {
        return Object.assign({}, a, b)
      },
      hasMixins(component) {
        return typeof(component.mixins) !== 'undefined'
      }
    },
    mounted(){
      var w = window;
      setTimeout(() => {
        var vue = w.app;
      }, 1000);
    }
  }
</script>

<style lang="scss">
  @import 'colors';
  
  .code{
    padding-right: 40px;
  }
  
  .copy-btn{
    background: transparent;
    border: none;
    position: absolute;
    margin-top: -49px;
    margin-left: -32px;
    line-height: 1;
    padding: 6px 3px;
    border-radius: 4px;
    outline: none;
    
    &:hover{
      filter: brightness(115%);
      cursor: pointer;
    }
  }
  .preview{
    border: 1px solid #f1f1f1;
    padding: 20px;
    margin: 0 10px;
    width: 300px;
    text-align: center;
    color: $midpurple;
    flex: 0 0 auto !important;
    
    @media (max-width:620px) {
      margin:  10px 0;
      
    }
    img{
      max-width: 100%;
    }
  }
  .tabs{
    background: $softinfo;
    .active{
      background-color: transparentize(rgb(29, 5, 97), .9);
      font-weight: bolder;
    }
    ul{
      display: flex;
      margin: 0;
      padding: 0;
      
      li{
        color: $darkpurple;
        padding: 15px;
        list-style: none;
        &:hover{
          cursor: pointer;
        }
        
      }
    }
  }
  
  .nothing-to-show{
    margin-top: 20px;
    margin-left: 20px;
    color: chocolate;
    
    
    code {
      background-color: #f5ede6;
      color: chocolate;
    }
  }
  
  .token{
    text-align: right
  }
  
  .luadoc-content{
    padding-top:30px;
  }
  
  .tooltip {
    position: relative;
    display: inline-block;
  }
  
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 76px;
    background-color: #796a9c;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 127%;
    left: 50%;
    margin-left: -41px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #796a9c transparent transparent transparent;
  }
  
  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
</style>