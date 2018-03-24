(function(w){

    //simple array iterator
    function _a(array, method){
        var templ=array.length;
        for(var i=0;i<templ;i++){
          method.call(this, i, array[i] );
        }
    }





    var

    _module = {},

    /**
     * Pulls module:
     *  provide(['de1', 'de2'], function(de1, de2){
     *      
     *  });
     * 
     */
    provide = function(deps, cb){

        var forCbArray = [];
        for(var i=0; i<deps.length;i++ ){
            forCbArray.push( _module[deps[i]] );
        }
        return cb.apply(w, forCbArray);
        
    },

    declareQueue = [
        // Example:
        // {args: declare function arguments, unmet_module:'name of unmet module'}
    ],

    processUnmet = function(id){
        _a(declareQueue, function(index,elem){
            if(elem.unmet_module === id){
                declare.apply(w, elem.args)
                delete(declareQueue[index]);                
            }
        });
    },

    /**
     * Declares module
     * module HAS to be named
     * declare('id', cb);
     * declare('id', ["dep1", "dep2"], cb);
     */
    declare = function(id, cbOrDepsArr, possibleCb){

        if( (typeof(id) === "string") && (typeof(cbOrDepsArr) === "function") ){ // clean situation, id and cb
            _module[id]=cbOrDepsArr.apply(w);
            processUnmet(id);
            return _module[id];//
        }
        else if( w.Object.prototype.toString.call( cbOrDepsArr ) === '[object Array]' ){
            //here we have deps
            var forCbArray = [], unmet=false;
            for(var i=0; i<cbOrDepsArr.length; i++ ){
                var modName = cbOrDepsArr[i];
                if(typeof( _module[modName] ) !== "undefined"){
                    forCbArray.push( _module[modName] );
                } else {
                    unmet = true;
                    declareQueue.push({
                        args: arguments,
                        unmet_module: modName
                    });
                }
            }
            if(!unmet){
                _module[id]=possibleCb.apply(w, forCbArray);
                _a(forCbArray, function(ind,el){
                    processUnmet(el);
                })
                return _module[id];
            } else{
                return false;
            }
        }
        else if( 
                (typeof(id)          === "string")   &&
                (typeof(cbOrDepsArr) !== "function") &&
                (w.Object.prototype.toString.call( cbOrDepsArr ) !== '[object Array]')
                ){ //case declare('somelongtextmodule', "LOrem ipsum..................")
                   //or   declare('somelongtextmodule', 525454545)
                   //or   declare('somelongtextmodule', {jsondata...})
            _module[id] = cbOrDepsArr;
            processUnmet(id);
            return _module[id];//
        } else {
            throw new Error('Incorrect arguments provided for declare function. Aborting.');
            return false;
        }

    };

    //For debug purposes, may be stripped out:
    declare._modules = _module;
    declare._unmet   = declareQueue

    w.provide = provide;
    w.declare = declare;

})(window);