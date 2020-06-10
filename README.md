
# LuaDoc Document

A tool to improve your Vuejs project documentation.

<br>
<br>
  

## Demo

### Map the props
<img src="lib/assets/demo1.png">
<br>
<br>

### Map the slots
  
<img src="lib/assets/demo2.png">
<br>
<br>

### Map the usage
  
<img src="lib/assets/demo3.png">

<br>
<br>

## Quick start guide
  

## 1. Instalation

### 1.1. Install LuaDoc

  ```bash
      $ npm install @luaguillande/luadoc
  ```

### 1.2. Install the library Marker to render the markdown notations

  ```bash
      $ npm i marker
  ```


## 2. Create the route to access the documentation. I suggest the `/doc` route. 

Exemple to create a local route (doesn't work in production) in Laravel.

```bash
    if (App::environment('local')) {
      Route::get('doc', function () {
        View::addNamespace('Folder', '../node_modules/@luaguillande/luadoc');
        return View::make('Folder::doc');
      });
    }
```

## 3. Add the `luadoc.js` to your compiler

Exemplo using webpack:

```js
mix.js('node_modules/@luaguillande/luadoc/doc/luadoc.js', 'public/js')
```

## 4. Set the components to be documented

### 4.1. Copy the `Components.js` file to `public`

```bash
  cp node_modules/@luaguillande/luadoc/doc/Components.js public
```

### 4.2. Edit the `public/Component.js` file to map your own components

```js
  import CompA from '../resources/js/components/CompA.vue';
  import CompB from '../resources/js/components/CompB.vue';

  export {
      CompA,
      CompB
  }
```

## 5. Adicionar metadados aos componentes que deseja documentar. 

### 5.1. Metadata obrigatórios:

```vue
  export default{
      name: 'comp-a',
      description: `This \`comp-a\` is amazing, you should _check_ it out.`,
      token: `<comp-a label='foo'></comp-a>`,
  }
```
 ### 5.2. Metadata adicionais:

```vue
    img: "imgs/doc/compa.png",
    slots:[
      {
        name: 'lol',
        note: "a label to be appended after the checkbox"
      }
    ],
    usage:[
      {
        url: '/',
        calledBy:['welcome.blade.php', 'App.vue']
      },
    ],
    props: {
      label: {
        type: String,
        default: '',
        note: "a label to be appended after the checkbox"
      },
      color: {
        type: String,
        default: 'blue',
        note: "a color for checkbox"
      }
    }
```

 ## Enjoy.

  @luaguillande - 31solutions.com

