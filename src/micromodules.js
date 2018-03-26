(function(w){

    //simple array iterator
    function _a(array, method){
        //var templ=array.length;
        for(var i=0;i<array.length;i++){
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

        var forCbArray = [], dontRun=false;
        for(var i=0; i<deps.length;i++ ){
            if (typeof( _module[deps[i]] ) !== "undefined")
                forCbArray.push( _module[deps[i]] );
            else dontRun = true;
        }
        if(dontRun) return false;
        return cb.apply(w, forCbArray);
        
    },

    declareQueue = [
        // Example:
        // {args: declare function arguments, unmet_module:'name of unmet module'}
    ],

    processUnmet = function(id){

        var LdeclareQueue = declareQueue;declareQueue=[];

        for(i=0;i<LdeclareQueue.length;i++){
            if(LdeclareQueue[i].unmet_module === id){
                var taj = LdeclareQueue.splice(i,1);
                declare.apply(w, taj[0].args);
            }
        }
        declareQueue = declareQueue.concat(LdeclareQueue);

    },

    /**
     * Declares module
     * module HAS to be named
     * declare('id', cb);
     * declare('id', ["dep1", "dep2"], cb);
     */
    declare = function(id, cbOrDepsArr, possibleCb){
        //Case: declare('id', cb);
        if( (typeof(id) === "string") && (typeof(cbOrDepsArr) === "function") ){
            _module[id]=cbOrDepsArr.apply(w);
            processUnmet(id);
            return _module[id];//
        }
        else if( w.Object.prototype.toString.call( cbOrDepsArr ) === '[object Array]' ){
            //case: declare('id', ['dep1', 'dep2'], cb)
            var forCbArray = [], unmet=false;
            for(var i=0; i<cbOrDepsArr.length; i++ ){
                var modName = cbOrDepsArr[i];
                if(typeof( _module[modName] ) !== "undefined"){
                    forCbArray.push( _module[modName] );
                } else {
                    unmet = true;// (modName === 'five') && log('ovde, za:' , id, ' - ', declare.caller)
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