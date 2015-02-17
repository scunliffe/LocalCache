/*
	TODOs:
		1.) Cached values are native vs. fetched values are always strings, great
		for performance, bad for consistency
		2.) It would be nice if this could handle both local and session storage
		3.) Trying to decide if this should be re-jigged to be more of a true singleton
		and 'real' private methods		
*/

var localCache = {
	//Properties
	KEY_STORE:'__keys',
	cache:{},
	keys:{},
	
	//Private Methods
	_getNamespacedKey:function(namespace, key){
		return namespace + '_' + key;
	},
	_getNamespaceCache:function(namespace){
		if(typeof(this.cache[namespace]) == 'undefined'){
			this.cache[namespace] = {};
		}
		return this.cache[namespace];
	},
	_getNamespaceKeys:function(namespace){
		if(typeof(this.keys[namespace]) == 'undefined'){
			this.keys[namespace] = this.getKeys(namespace);//fetch keys (if any)
		}
		return this.keys[namespace];
	},
	_addKey:function(namespace, key){
		var keys = this._getNamespaceKeys(namespace);
		//only add key if we don't already have it
		if(keys == null){
			keys = this.getKeys(namespace);
		}
		if(typeof(keys[key]) == 'undefined'){
			keys[key] = 1;
			//re store keys
			var nsKey = this._getNamespacedKey(namespace, this.KEY_STORE);
			localStorage.setItem(nsKey, JSON.stringify(keys));
			this.keys[namespace] = keys;//update cached keys
		}
	},
	_getItem:function(namespace, key, useCache){
		var ns = this._getNamespaceCache(namespace);
		var nsKey = this._getNamespacedKey(namespace, key);
		if(!useCache || (typeof(ns[key]) == 'undefined')){
			ns[key] = localStorage.getItem(nsKey);
		}
		return ns[key];
	},
	_removeItem:function(namespace, key, updateKeyCache){
		var nsKey = this._getNamespacedKey(namespace, key);
		localStorage.removeItem(nsKey);
		if(updateKeyCache && (key != this.KEY_STORE)){
			var ns = this._getNamespaceCache(namespace);
			delete ns[nsKey];
			if(typeof(this.cache[namespace][key]) != 'undefined'){
				delete this.cache[namespace][key];
			}
			//update stored keys
			var keys = this.getKeys(namespace);
			delete keys[key];
			this.keys[namespace] = keys;
			this.setItem(namespace, this.KEY_STORE, JSON.stringify(keys));
		}
	},

	//Public Methods
	getKeys:function(namespace){
		return JSON.parse(this._getItem(namespace, this.KEY_STORE, true)) || {};//return an empty map if no keys	
	},
	getItem:function(namespace, key){
		return this._getItem(namespace, key, true);
	},
	setItem:function(namespace, key, value){
		this._addKey(namespace, key);
		var ns = this._getNamespaceCache(namespace);
		var nsKey = this._getNamespacedKey(namespace, key);
		ns[key] = value;
		localStorage.setItem(nsKey, value);
	},
	removeItem:function(namespace, key){
		this._removeItem(namespace, key, true);
	},
	removeNamespace:function(namespace){
		//get all keys (intentionally skip the cache)
		keys = this.getKeys(namespace);
		for(var key in keys){
			this._removeItem(namespace, key, false);//DO NOT update the key cache
		}
		//delete key store
		this._removeItem(namespace, this.KEY_STORE, false);
		//reset the cache
		delete this.cache[namespace];
		//reset the keys cache
		delete this.keys[namespace];
	}
};
