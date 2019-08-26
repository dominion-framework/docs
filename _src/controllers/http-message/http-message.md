# HTTP Message

HTTP Message is an object containing information about HTTP request 
and response. Endpoints from controller are executed in context of
HTTP Message (in other words you can access it using `this` inside 
endpoint). You may use it to access additional information about 
request or modify data in response. For example: 
```js
GET: [
    function() {
        // get cookies values
        const basketId = this.request.cookies['basketId'];

        // add header in response
        this.response.headers['Access-Control-Expose-Headers'] = 'X-Items-Total';

        // set response status code
        this.response.status = this.response.STATUSES._204_NoContent;
    }
]
```

## Message.request

__Message.request__ has information about request URL, request data, 
like headers, cookies, payload (body) and endpoint's meta data.
Below is a full list of available properties.  

|Name   |Description   |
|:---|:---|
|_\_\_request\_\__| Reference to Node.Js `IncommingMessage`. 
|method     | Request HTTP method, e.g. GET, POST, PUT, DELETE. Always uppercase. 
|protocol   | Request protocol. Returns `https` is connections is encrypted, `http` otherwise.   
|host       | Host part of an URL including port, e.g. `localhost:7042`.
|port       | Request port, e.g. `7042`.
|path       | Path part of URL including query string. e.g. `books?limit=12`.
|url        | Full request URL.
|ip         | Client's IP address.
|headers    | Object containing request headers. Header name will be lowercased, e.g. `this.request.headers["user-agent"]`.
|cookies    | Object containing request cookies, e.g. `this.request.cookies['basketId']`.
|body       | Object containing request payload. JSON passed in request body will be automatically converted to JS object, e.g. `this.request.body.firstName`.
|handler    | Object containing information about endpoint handler, including annotations list, e.g. `this.request.handler.annotations.summary`.

## Message.response

__Message.response__ collects response information like response status code
headers and payload. Below is a full list of available properties.  

|Name   |Description   |
|:---|:---|
|_\_\_response\_\__| Reference to Node.Js `ServerResponse`.
|status     | Object representing status of HTTP response. It is helpful to use `this.response.STATUSES` constant to set proper response status.
|status.code| HTTP response status code, e.g. `201`
|status.message| HTTP response status message, e.g. `Created`
|headers    | Object containing response headers. By default, it has <br /> `{'Content-Type': 'application/json; charset=utf-8'}`
|body       | Object containing HTTP response payload. Can be any serializable JS object or primitive type.
 

