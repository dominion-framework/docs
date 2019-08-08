![Dominion node rest api framework logo](./assets/logo.svg)

Dominion is declarative Promise based Node.js framework for REST API

### API Request Lifecycle 
To understand how requests are processed lets look on their lifecycle, it's straight forward:
1. On startup framework goes through all registered controllers (`core/controllers/index.js`), generates URL based 
on functions interface and make mappings between URL's and those functions.

2. Client makes request to API server.

3. Framework's router (`core/router/index.js`) catches the request and looking 
for matching callback from ones registered in controllers.

4. If match was founded router builds request Promise chain. A chain contains 
*request interceptors*,  *handler* (function defined in controller), *response interceptors*
and *request finalisation*. Then request promise chain gets executed:
   1. Requests interceptors are taking from `requestInterceptors` array in component's 
   declaration file (`index.js`). They are general purpose functions that may validate
   client's authorization. 
   2. Then `handler` gets executed. It defines top level business logic. 
   Usually controller's `handler` manipulates models created by `Factories`.
   If needed, factories or model instances call linked `Repository` 
   to create/modify/remove data in DB.
   3. Result of `handler` execution is passed to response interceptors. They are taking 
   from `responseInterceptors` array in component's declaration file. There are no common use
   for response interceptor, as `handler` is responsible to produce response that is
   ready to be send back to client. However, it may be used to perform some general actions 
   that depends on `handler`'s response, like set custom header.
   4. Lastly, router handles common exceptions produced by `Repositoy` or `Factories` and sets 
   proper status code (400 - for bad request, 404 - if model not found, 409 - for conflicts, etc). 

5. And finally, response produced by all previous steps gets stringified and returned to a client.  



#### API Handlers
`Handler` function is executing with HTTP message context (`core/messages/index.js`). 
In other word, `this` point to object containing information about HTTP request and response.
```js
function(booksId) {
    console.log(this.request.body);
    
    this.response.headers["X-Items-Length"] = 42;
}
```
#### Annotations
Annotation comments are declared inside `handler` functions. They can be used to add
some meta information to an endpoint.

For example, `@path:` annotation can be used to change auto-generated URL of an endpoint:
```js
function() {
    // @path: /auth/token
    
    return UsersFactory.get({email: this.request.body.email})
        .then(user => user.validatePassword(this.request.body.password))
        .then(user => user.createAuthToken())
}
```


### Repositories
Files containing repository declaration should export instance 
of Repository (`core/repositories/repositoryPrototype.js`) 
representing external storage (e.g. database) related to specific model.

Repository can be created using default `Repositories.create()` method 
or by custom implementation of repository interface.

Default repository can be extended with methods that makes
direct calls to external storage, e.g. `findByTitle()`.   
```js
const Repositories              = use('core/repositories');

module.exports = Repositories.create('books_table', {

    findByTitle(title, offset, limit){
        const query = `SELECT * FROM ${this.__table__} 
                       WHERE title LIKE ?
                       LIMIT ?, ?`;
        return this.db.execute(query, [`%${title}%`, offset, limit])
            .then(([rows, columns]) => rows);
    }

}); 
```
Custom methods in `Repositories` should return raw data. 
Any data post-processing should be performed in models or factories.

Default `Repositories` prototype has methods:

`.find( [criteriasObject], [limit], [offset], [order] )`

Executes SELECT query in DB. Used by `.get()` and `.find()` methods
in default models factories prototype.


`.save( [modelInstance] )`
Executes INSERT or UPDATE query in DB. Used by `.save()` method
in default models instance prototype.

`.remove( [modelInstance] )`
Executes DELETE query in DB. Used by `.remove()` method
in default models instance prototype.
   
There are very few good reasons you would need to overload this methods 
or call them directly. So, take it as an interface you need to 
implement in case of writing custom `Repository`. 



### Interceptors
**Interceptors are global!** This means that no matter in what 
component they are declared, they will be executed for *every* request.
I know it feels counter-intuitive and smells like a bad design, but it's not. 
Or, at least I think it is not.

The point here you should never need to decorate API endpoint on component level
or on single `handler` level. Such functionality should be moved to factories, models 
or services.

Interceptors should be used for actual global things like extracting 
cookies from header, parsing multipart/form-data, logging, converting response
from JSON to XML, etc.

 

   
