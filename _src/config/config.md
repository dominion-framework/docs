# Configurations

Dominion framework is using small configuration set covering server 
address, API's URL prefix and CORS settings. You are also free to use
configuration file for project specific settings. Configurations file 
should export object as following:
 
```js
module.exports = {
    server: {
        protocol: "http",
        host: "localhost",
        port: 7042,        
        url: "http://localhost:7042"
    },

    router: {        
        urlPrefix: "", 
        primaryKeyPattern: "\\d+" 
        // e.g. "[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}"
    },

    cors: {
        origin: ["http://localhost:7042"],
        methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
        headers: ["Content-Type", "Set-Cookies", "Authorization"],
        credentials: false,
        maxAge: 5 /* seconds */
    }
};

```
|Name   |Description   |
|:---|:---|
|server.protocol  | Protocol to be used by Node server: `https` or `http` (default).
|server.host  | Server host, e.g. `localhost`.    
|server.port  | Server port, e.g. `7042`.
|server.url   | Server external URL. Is used only for OpenAPI documentation. Also, maybe used in the code, for example for links in emails.
|router.urlPrefix | URI prefix, that will be prepended to all endpoints, e.g. `api/v2/`.
|router.primaryKeyPattern| RegExp pattern for identifiers, e.g. `\\d+`. You'll need to change it if you are using hash or uuid keys in models.
|cors.origin| Origin which is allowed to make API calls. May be <br /> (i) `*` for any origin, use it only if you really need it, <br /> (ii) `[url array]` - list of allowed origins, <br /> (iii) `() => {}` function that returns dynamic array of allowed origins.
|cors.methods| List of allowed HTTP methods, e.g. `["GET", "POST", "PUT", "DELETE"]`.
|cors.headers| List of allowed HTTP headers, e.g. `["Content-Type", "X-Items-Total"]`.
|cors.maxAge| TTL of CORS response.  
  
## Config resolution

Configuration from above is used by default in Dominion framework.
To overwrite them you can create folder `config` in project root
directory containing `index.js` file. Framework is expecting this file
to return JS object with configuration. Consequently, you 
can take advantage of it to implement additional logic in configuration.
For example, you can load some props from environment variables:
```js
module.exports = {
    server: {
        host: process.env.APPLICATION_HOST,
        port: process.env.APPLICATION_PORT
    }
}
```

Also you can make different config files for different environments
and implement their resolution in `index.js`. For example:

```js
// File config/index.js

switch (process.env.NODE_ENV) {
    case ("production"):
        config = require("./config.prod");
        break;
    case ("test"):
        config = require("./config.test");
        break;
    default:
        config = require("./config.dev");
}

module.exports = config;
```
