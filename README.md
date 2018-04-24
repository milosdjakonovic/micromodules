[![build status][travis-img]][travis] [![GitHub issues](https://img.shields.io/github/issues/milosdjakonovic/micromodules.svg)](https://github.com/milosdjakonovic/micromodules/issues) [![GitHub license](https://img.shields.io/github/license/milosdjakonovic/micromodules.svg)](https://github.com/milosdjakonovic/micromodules/blob/master/license)

# micromodules

Minimalistic JavaScript module system for browsers.

**micromodules** is a good way to organize browser code when using mastodon-like libraries and/or tooling is less desirable option. It does not load JS files for you but rather helps you to keep your code into meaningfull and reusable modules. 
**micromodules** weights only ~900B compressed and is suitable for placing into document's head or anywhere else.

### Usage

Place the code anywhere before first usage. Even that is not strictly required, which will be explained soon.


#### 1. Declaring a module
A module is declared with `declare` function call.
```javascript
declare('name', 'John Doe');
```
Any data type is allowed
```javascript
declare('num', 111);
declare('bool', false);
declare('Sysprops', {key:'value'});
```
Any number of modules may be declared in single file.
Modules that need *setup functions* may be declared like following: *(AMD style)*
```javascript
  declare('MoreComplexModule', function(include){
    //doing some computation
    //and
    return 'some value';
  });
```
It is good time to say more about declaring module with *setup function*. Setup function in the example above is not called until first time `include`d and never again. That means:

**1.** If you need reusable function from declared module defining inside setup function and returning it is the way to go:
```javascript
  declare('ComplexMethod', function(include){
    //doing some computation
    //and
    return function(){
        
    };
  });
```

**2.** If you pass function as an argument to `declare` it will be executed and return value will be used as module value. So, for example, things like `jQuery`, which are actually functions, would have to be declared like this:

```javascript
  declare('jQuery', function(include){
    return jQuery
  });
```
(this is by no means niether only nor the best way yo store jQuery and friends as modules).

##### 1.1 Declaring 'inline' (or 'lazy') module
If your prefer to declare modules immidiately (for example) in document's head and to include **micromodule** library code after that, you have an option of using 'inline' modules declaration, like following:

```html
  <script type="text/n" data-md="inline1">
    // regular JS code
    // and return statement as if we are inside function's body
    return "A value of some 'inline module'";
  </script>
```

Requirements are that `script`'s attribute `type` is set to ignorable value (antyhing other than `"module"` (ES6) or `"text/javascript"`) and `data-md` attribute is set to module's id. This way, module will be registered whenever **micromodule** library code occurs.


##### 1.2 Deleting module
Module may be deleted with `declare.remove` function call:
```javascript
  declare.remove('modname');
```



---



#### 2. Using modules
Module is used with `include` function call:

```javascript
var name = include('name');
```

A module has to be declared previously, of course:

```javascript
var nonExistingMod = include('nonExistingMod'); // undefined
```

`include` is available as first argument in `declare` setup function:

```javascript
declare('mod_name', function(include){
    var name = include('name');
    // note: this === window in setup functions
})
```

##### 2.1 Deep include
There is a useful option of storing a global variable into **micromodules** module system and subsequent including:

```javascript
var Raf = include('requestAnimationFrame',1);
var jQuery = include('jQuery',1);
```
This option is triggered with second argument set to `true` or `1`, which means, if there is no requested module name, before giving up, try to search global variables and import them if founded.

This way we will have globals as local vars pulled from module system.



[travis]: https://travis-ci.org/milosdjakonovic/micromodules
[travis-img]: https://travis-ci.org/milosdjakonovic/micromodules.svg?branch=master