# API Request Lifecycle
 
To understand how requests are processed in Dominion framework
lets look on their lifecycle, it's straight forward:

![Request promise lifecycle](/assets/lifecycle.png)

1. On startup framework goes through all registered controllers, 
generates URI based on functions interface and make mappings
between URI's and those functions.

2. Client makes request to API server.

3. Framework's router catches a request and looking 
for matching endpoints from ones registered in controllers.

4. If match was found, router builds __request Promise chain__. A chain contains 
*request interceptors*,  *endpoint function* (function defined in a controller),
*response interceptors* and *request finalisation*.
Afterwards, request promise chain gets executed.
   1. Requests interceptors are taking from `requestInterceptors` array in component's 
   declaration file. They are general purpose functions that may validate
   client's authorization. 
   2. Then `endpoint` gets executed. It defines top level business logic. 
   Usually controller's `endpoints` manipulates models created by `Factories`.
   If needed, factories or model instances call linked `Repository` 
   to create/modify/remove data in DB or other permanent storage.
   `endpoint` may return Promise, serializable Object or primitive. 
   3. Result of `endpoint` execution is passed to response interceptors. They are taking 
   from `responseInterceptors` array in component's declaration file. There are no common use
   for response interceptor, as `endpoint` is responsible to produce response that is
   ready to be send back to client. However, it may be used to perform some general actions 
   that depends on `endpoint`'s response, like set custom header.
   4. Lastly, router handles common exceptions produced by `Repositoy` or `Factories`. If any it will 
    set proper status code (400 - for bad request, 404 - if model not found, 409 - for conflicts, etc). 

5. In the end, response produced by all previous steps gets stringified and returned to a client.  

