# Repositories

Repository is a communication layer between models and external 
storage. Basically, there is no limitation what can be treated 
as an external storage. It may be anything: relational databases,
NoSQL databases, flat files databases, cloud storage, microservices, etc.

By default, Dominion framework package doesn't include any repository, 
because type of external storage specifically depends on projects architecture,
so, there is no reason to include something you will never use.

To use repository in your component you will need to install npm package
with a repository you need. For example, for MySQL:

```shell script
npm install @dominion-framework/repository-mysql
```

Then, you need to create repository declaration in your component's folder
and link it with a model. The most basic repository will contain only 
`Repository.create()` function. For example a file `repository.js` may look like:
```js
const Repositories = require('@dominion-framework/repository-mysql');

module.exports = Repositories.create('books_table', { });
```
In a model declaration use `repository:` property to link created repository
to a model:
```js
const Property = require("@dominion-framework/dominion/core/property");

const BooksRepository = require("./repository");

module.exports = {

    name: "Books",

    repository: BooksRepository, 

    properties: {
        id: Property.id(),
        ...
    }
}
``` 

## Repository prototype

Default repositories are coming with three basic functions for 
manipulating a model - `find()`, `save()` and `remove()`. 
If you are creating your own repository, take them as an interface
you need to implement.   


#### `.find( [criteriasObject], [limit], [offset], [order], [totalCountOnly=false] )`

Returns an array with model's data that matches `criteriaObject`.
It is used in `.get()` and `.find()` methods
of default models factories prototype. Basically it executes SELECT
query, if we are talking about SQL databases.
If `totalCountOnly` set to `true`, method should return only a number of records
matching `criteriasObject`, ignoring `limit` and `offset` parameters.


#### `.save( [modelInstance] )`
Creates or updates model data. In case of creation, optionally it 
can return primary key of a new record, which then will be
set in Model instance. It is used in `.save()` method
of default models instance prototype.
Take it as INSERT or UPDATE query, in case of SQL. 


#### `.remove( [modelInstance] )`
Removes model data from external storage. It is used in `.remove()` 
method of default models instance prototype. 
Obviously, it is DELETE query in case of SQL type of repositories. 


## Extending Repository

If you need to add missing features to the repository or overwrite 
default methods, you can define custom methods when creating repository.
In example below, default repository prototype is extended with method
`findByTitle()`.
  
```js
const Repositories = require('@dominion-framework/repository-mysql');

module.exports = Repositories.create('books_table', {

    findByTitle(title, offset, limit) {
        const query = `SELECT * FROM ${this.__table__} 
                       WHERE title LIKE ?
                       LIMIT ?, ?`;
        return this.db.execute(query, [`%${title}%`, offset, limit])
            .then(([rows, columns]) => rows);
    }

}); 
```

Note, custom methods in `Repositories` should return raw data. 
Any data post-processing should be performed in models or factories.
