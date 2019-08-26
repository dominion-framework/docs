# Components
You can take _component_ as 1:1 representation of restfull resource (or business domain). 
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

 
If you are starting new project you can create `hello` components,
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
This declarations is used only for requiring components on the fly independent from 
order of requires in file.

There are 3 default entities:
1. Controllers
2. Factories
3. Repositories

`Controller` is a place where you define API's endpoints, basically mappings 
between URL's and actions you need to produce response. Optionally controllers
may be linked to factory.

`Factories` is where you describe model structure and its methods. Optionally factories 
may be linked to a repository.

`Repository` is playing role of ORM (Object-relational mapping) with external data storage.
By default repositories are not included in the framework package. To use repositories, 
you need to install additional package with repository of a type you need.   

Commonly you'll need one set of controller/factory/repository in a component, 
but it's possible to have multiple ones if needed.
