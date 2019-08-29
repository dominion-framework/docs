# Components
You can take _component_ as 1:1 representation of RESTful resource 
(or business domain). Component is designed to implement business 
logic around resource, connect it with permanent storage and expose
API endpoints to manipulate it. 
 
It's useful to organize components having each in separate folder. 
Lets take `Users` model for example. Recommended file organization is: 
```
project/
├── config/
├── components/
│   ├── users/ 
│   │   ├── index.js
│   │   ├── controller.js
│   │   ├── factory.js
│   │   └── repository.js
│   └── products/
├── index.js
├── package.json
└── package-lock.json
```

## Creating Component from CLI

You can use build-in script for scaffolding component:
```shell script
npx dominion create [repository type] [component name]
``` 
Where `[component name]` is name of your resource and
`[repository type]` is one of available repositories, e.g. mysql.
If you don't need repository `[repository type]` argument may be omitted. 
For example:
```shell script
npx dominion create mysql users
```
 
If you are starting new project you can create **`hello`** components,
which will create default configurations and project's index file:

```shell script
npx dominion create hello
```

## Component Declaration File

Component dependencies are declared in `index.js` file:
```js
module.exports = {
    factories: [
        __dirname + '/factory',      // <-- reference to factory.js
    ],
    controllers: [
        __dirname + '/controller',   // <-- reference to controller.js
    ],
    requestInterceptors: [ ],        // <-- list of references to request interceptors

    responseInterceptors: [ ],       // <-- list of references to response interceptors

    bootstrap: [ ]                   // <-- list of references to files that will run on startup
};
```
This declarations is used for requiring components on the fly independently from 
order of requires in file.

There are 5 entries types: Factories, Controllers, Request Interceptors, 
Response Interceptors and Bootstrap.

[Controllers](/controllers) is a place where you define APIs endpoints, basically mappings 
between URL's and actions you need to produce response. One controller should
have endpoints that covers manipulation with single resource. If you have really
a lot of endpoints that are related to single resource, you may split them 
 by http method into multiple files.  

[Factories](/factories-and-models) is where you describe model structure and 
its methods. Typically one component will work with single model.
However, for more complex structures you can have multiple models in
one component. But make sure that models you want to create in a component 
are indeed representing single resource, or
may it is better to move some of them to another component.

[Request and Response Interceptors](/interceptors) allows you to add callbacks
that will be called before and after main endpoint. You can use it to 
decorate request functionality, modify request payload or response results.
Common use cases for interceptors may be logging, data validation, 
user authorizations, ect.  

Bootstrap array in component declaration allows you to register services 
that are related to component resource, but not taking actions during 
specific request. This services will be executed after all models and
controllers are ready to use. You can use such services for some recurring
tasks, heartbeat pings, cache warm up, etc.  

In general, components should represent atomic entry of you business model.
Ideally, controller should have up to 4 endpoints - 4 CRUD operations. As
in real world it is rarely the case, try to keep number of endpoints in 
one controller less than 10, otherwise consider splitting it to 
different controllers or different components.
