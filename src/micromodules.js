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
        (console ? (console.warn || console.log) : function (m) { return m; })(txt);
    },

    /**
     * return the value of the module
     * @param name - the name of the module
     */
    fninclude = function(){
        var name = arguments[0];
        //if( typeof($modules[ name ])!== 'undefined')
        if( name in $modules ){ 
            if(typeof $modules[name] === "object" && "_bindeD_fn_$" in $modules[name] &&   ! ("fnval" in $modules[name])    ){
                $modules[name].fnval = $modules[name].fn.apply(win, [fninclude]);
                return $modules[name].fnval;
            } else if(
                typeof $modules[name] === "object" &&
                 "_bindeD_fn_$" in $modules[name] &&
                  "fnval" in $modules[name] ){
                return $modules[name]['fnval']
            } else
                return $modules[ name ]
        } else if(
           // <script data-md="somename" type="text/n"> </script>           
            win.document.querySelector( 'script[type="text/n"][data-md=' + name + ']' )
        ){
            var thatScr = win.document.querySelector( 'script[type="text/n"][data-md=' + name + ']' ),
            ret = Function(thatScr.innerHTML)(win);
            $modules[name] = ret;
            thatScr.parentNode.removeChild(thatScr);
            return ret;
        } else if ( name in win ){
            $modules[name] = win[name];
            return win[name]
        } else {
            warn("Failed: module [" + name + "] does not exist.");
            return false;
        }
    },

    fndeclare = function(){
        var name = arguments[0], value = arguments[1];
        if(typeof($modules[name])==="undefined"){
            if(typeof value === "function"){
                //$modules[name] = value.apply(window, [fninclude]);
                $modules[name] = {
                    _bindeD_fn_$ : true,
                    fn          : value//,
                    //fnval: undefined
                }
            }
            else 
                $modules[name] = value;
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

