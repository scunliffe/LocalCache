# LocalCache
Enhancing the LocalStorage API for Real-World Scenarios

HTML5 LocalStorage / SessionStorage provides the basics for storing permanant or temporary arbitrary data in a key:value store in the browser.

However when you're looking to implement something "real" with it you soon realize that there are a few things you wish were available in the API/implementation.

* Namespacing to ensure that the various projects / applications you deploy on a domain don't collide with each other and potentially munge each other's data
* Some mechanism to track the arbitrary keys used to store values (e.g. so that you can inspect and/or clean up values no longer needed)
* Some option to "cache" the values being stored in the storage so that you don't need to re-fetch (and re-parse) them
* Especially during development, provide an easy way to blow away a namespace... but not anything else stored by the current domain
* A method to "encrypt" and "decrypt" the data being stored [1]



[1] Still on the TODO list.  This will of course not be "real" encryption, but rather plugable obfuscation
