//micromodules | Milos Djakonovic | MIT | github.com/milosdjakonovic
(function(win){
    var
    /**
     * modules internal object
     */
    $modules = {},

    /**
     * issue warning when needed
     * @param txt - warning text
     */
    warn = function(txt){
        try{
            console.warn(txt);
        } catch(e){}
    },

    ComplexMod = function(fn){
        this.fn = fn;
    },

    onDeclared = {}// { exampModule: [cb1, cb2] }
    ,

    declared = function(nm){
        if(nm in onDeclared)
            if(length in onDeclared[nm]){
                for(var i=0;i<onDeclared[nm].length;i++){
                    var singleCb = onDeclared[nm][i];
                    var arg1;
                    if($modules[nm] instanceof ComplexMod && !$modules[nm]['fnval'])
                        arg1 = fninclude(nm);
                    else arg1 = $modules[nm];
                    singleCb.apply(win, [ arg1, fninclude]);//cleanup needed
                    onDeclared[nm].splice(i, 1);
                }
            }
    },

    /**
     * return the value of the module
     * @param name - the name of the module
     */
    fninclude = function(){
        var name = arguments[0], thatScr;
        var on = name.match(/^\s*?on\s*\:\s*(.+)$/m); var cb = false;
        if(
            on &&
            typeof arguments[1] === 'function'
        ){
            name = on[1];
            cb   = arguments[1];
        }
        if( name in $modules ){
            var toInclude = $modules[name];
            if(typeof toInclude === "object" && toInclude instanceof ComplexMod && !("fnval" in toInclude)){
                toInclude.fnval = toInclude.fn.apply(win, [fninclude]);
                if(cb) cb.apply(win, [toInclude.fnval, fninclude]);
                return toInclude.fnval;
            } else if(
                typeof toInclude === "object" &&
                toInclude instanceof ComplexMod &&
                  "fnval" in toInclude ){
                if(cb) cb.apply(win, [toInclude['fnval'], fninclude]);
                return toInclude['fnval'];
            } else{
                if(cb) cb.apply(win, [$modules[ name ], fninclude]);
                return $modules[ name ];
            }
                
        } else if(
           thatScr = win.document.querySelector( 'script[type="text/n"][data-md="' + name + '"]' )
        ){
            var ret = Function(thatScr.innerHTML)(win);
            $modules[name] = ret;
            thatScr.parentNode.removeChild(thatScr);
            if(cb) cb.apply(win, [$modules[ name ], fninclude]);
            return ret;
        } else if ( !cb && name.slice(0,-1) in win && /*deep include*/ name.match(/\+$/) ){
            name = name.slice(0,-1);
            $modules[name] = win[name];
            return win[name]
        }
        else if(cb){
            onDeclared[name] = onDeclared[name] || [];
            onDeclared[name].push(cb);
        }
        else {
            warn("Failed: module [" + name + "] does not exist.");
            return undefined;
        }
    },

    fndeclare = function(){
        var name = arguments[0], value = arguments[1];
        if(typeof($modules[name])==="undefined"){
            if(typeof value === "function"){
                $modules[name] = new ComplexMod(value);
            }
            else 
                $modules[name] = value;
            declared(name);
            return true;
        } else {
            //mod already defined
            warn("Declaring failed: module [" + name + "] already declared.");
            return false;
        }
    };

    fndeclare.remove = function(key){
        if(typeof($modules[key])==="undefined")
            return false;
        delete $modules[key];
        return true;
    }

    win.declare = fndeclare;
    win.include = fninclude;
})(window);