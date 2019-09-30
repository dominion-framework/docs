# Interceptors

Interceptors is a way to perform common operation for an request. There are two
types of interceptors - request interceptor and response interceptor. 
* Request interceptors will be executed before main endpoint. They will receive 
request payload as function argument. 
* Response interceptors will be executed after main endpoint. As an argument they 
will receive execution result of main endpoint.

Interceptors are executed in [HTTP Message](/controllers/http-message) context,
so you have access to the same data as in main endpoint. This includes access
to endpoint's [annotations](annotations/). In interceptors you can validate if 
endpoint has specific annotation and perform some action based on it.

To add interceptors to the project you need to register them in component
declaration file:
```js
module.exports = {
    factories: [
        __dirname + '/factory'
    ],
    controllers: [
        __dirname + '/controller'
    ],

    requestInterceptors: [
        __dirname + '/requestInterceptor'
    ],
    responseInterceptors: [
        __dirname + '/responseInterceptor'
    ],

    bootstrap: []
};   

```
If you have more than one interceptor, they will be executed in order in
which their components were included in `index.js`.

Interceptors are part of **Request Promise chain**. It allows to 
execute asynchronous operation in interceptors without blocking main thread.
In this case interceptor should return Promise. Result of Promise resolution 
will be passed to following interceptor or to main endpoint.
In the same time this means that unhandled 
exceptions will prevent execution of all consequent interceptors. To prevent
unexpected behaviour you need to handle exceptions gracefully, because,
you know, that's a right way to write a code.

### Interceptors are global! 
This means that no matter in what 
component they are declared, they will be executed for *every* request.
I know it feels counter-intuitive and smells like a bad design, but it's not. 
Or, at least I think it is not.

The point here is that you should never need to decorate API endpoint 
on component level or on single `endpoint`. Such functionality should be 
implemented in factories, models or services.

Interceptors should be used for actual global things like extracting 
cookies from header, parsing multipart/form-data, logging, converting response
from JSON to XML, etc.

## Code examples
Adding server name header.
```js
// file requestInterceptor.js

module.exports = function addServerName(body) {
    this.response.headers["Server"] = "Dominion Server";
    return body;
};
```

Wrap response in JSON envelop.
```js
// file responseInterceptor.js

module.exports = function wrap(result) {
    return {
        time: new Date(),
        url: this.request.url,
        payload: result
    };
};
```

