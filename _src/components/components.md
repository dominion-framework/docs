# Components
You can take "components" as 1:1 representation of restfull (or business) domains. 
It's useful to organize components having each in separate folder. 
Lets take `Users` model for example. Recommended file organization will be: 
```
| - components/
| | - users/             <-- `Users` component 
| | | - index.js
| | | - controller.js
| | | - factory.js
| | | - repository.js
| | - products/
| - index.js
| - package.json
| - package-lock.json
```

## Creating component from cli
```shell script
npx dominion create users
```
Third command `npx dominion create hello` is creating project scaffold.
Actually, it is creating scaffold for a single component. You can read
more about it on page [Components](/components). 


## Component declaration file

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
between URL's and actions you need to produce response.

`Factories` is where you describe model structure and its methods. Optionally factories 
may be linked to a repository.

`Repository` is playing role of ORM (Object-relational mapping) with external data storage. 
By default framework uses MySQL, but should work with any DB that has compatible SQL dialect. 
Alternative, repository prototype may be redefined to work with any type of 
storage (NoSQL, cloud storage, flat file, etc).

Commonly you'll need one set of controller/factory/repository in a component, 
but it's possible to have multiple ones if needed.
