<template>
    <div class="toolbar">
        <h1>
            Documentação de Componentes
        </h1>   
        <div class="flex">
            <a href="#tutorial">Tutorial</a>
            <div class="logo">
                <i>lua</i><span class="doc">do</span><span class="moon">🌙</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss">
    
    @import 'colors';
    
    .toolbar{
        display: flex;
        justify-content: space-between;
        padding: 0 50px;
        background: $softinfo;
        height: 70px;
        color: $darkpurple;
        
        a{
            color: $darkpurple;
            text-decoration: none;
            text-transform:uppercase;
            font-weight: 500;
            padding: 21px 30px 0 0;
        }
        
       
    }
</style>