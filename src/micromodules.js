(function(w){

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

    /**
     * Declares module
     * module HAS to be named
     * declare('id', cb);
     * declare('id', ["dep1", "dep2"], cb);
     */
    declare = function(id, cbOrDepsArr, possibleCb){

        if( (typeof(id) === "string") && (typeof(cbOrDepsArr) === "function") ){ // clean situation, id and cb
            _module[id]=cbOrDepsArr.apply(w);
            return _module[id];//
        }
        else if( w.Object.prototype.toString.call( cbOrDepsArr ) === '[object Array]' ){
            //here we have deps
            var forCbArray = [];
            for(var i=0; i<cbOrDepsArr.length;i++ ){
                forCbArray.push( _module[cbOrDepsArr[i]] );
            }
            _module[id]=possibleCb.apply(w, forCbArray);
            return _module[id];
        }
        else if( 
                (typeof(id)          === "string")   &&
                (typeof(cbOrDepsArr) !== "function") &&
                (w.Object.prototype.toString.call( cbOrDepsArr ) !== '[object Array]')
                ){ //case declare('somelongtextmodule', "LOrem ipsum..................")
                   //or   declare('somelongtextmodule', 525454545)
                   //or   declare('somelongtextmodule', {jsondata...})
            _module[id] = cbOrDepsArr;
            return _module[id];//
        } else {
            throw new Error('Incorrect arguments provided for declare function. Aborting.');
            return false;
        }

    };

    declare._modules = _module;//For debug purposes, may be stripped out

    w.provide = provide;
    w.declare = declare;

})(window);