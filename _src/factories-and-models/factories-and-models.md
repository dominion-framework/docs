# Factories and Models

Model is representing a single resource in terms of RESTful APIs.
It lists properties associated with business model and contains 
methods that may manipulate model's state. Commonly Models structure 
has 1:1 mapping with persistent storage.   

Collection of models is managed by Factories. Basically, two main 
functions of a factory is to create a new Model instance or retrieve
collection of models from some storage. 

Cool thing in models declaration in Dominion framework is
ability to specify extra features for each Model's property.
It includes: data validation, input modification, output modification
and documentation info. More about this you can read 
on [Properties](/properties) page.

By default [Factories prototype](/factories-and-models/factory-prototype)
and [Models prototype](/factories-and-models/model-prototype) 
contain the most common manipulations you will need in a project.
And of course, you can extend or overwrite it using `factory:` and `instance:`
properties in a Factory declaration.    

 
## Writing a factory

Files containing factory declaration should export an object with 
model's properties and prototypes for models factories and 
models instances.

Factory declaration object has following properties:

|Name   |Description   |
|:---|:---|
|_name_ | String, required. Model's name. Good practice is to keep model's name always in plural to avoid ambiguity. 
|_repository_ | Object, optional. Repository object the model is linked to.
|_properties_ | Object, required. Object containing model's properties. Object keys will be properties' names, values - properties validators.
|_factory_ | Object, optional. Object containing functions that will be used to extend model's factory prototype. 
|_instance_ | Object, optional. Object containing functions that will be used to extend model's prototype.


## Code example

```js
const Errors = require("@dominion-framework/dominion/core/errors");
const Property = require("@dominion-framework/dominion/core/property");

const UsersRepository = require("./repository");


module.exports = {

    name: "Users",

    repository: UsersRepository, 

    properties: {
        id: Property.id(),
        phoneNumber: Property.number().min(1e11).max(1e12-1),
        email: Property.string().pattern(/\S+@\S\(.\S)+/).max(100),
        passwordHash: Property.string().max(255).private(),
        passwordSalt: Property.string().max(255).private(),
        creationTime: Property.date().private(),
        modificationTime: Property.date().private()
    },

    factory: {

        getActiveUsers(limit = 6, offset = 0) {
            return this.repo.getActiveUsers(limit, offset)
                .then(users => Promise.all(users.map(mix => this.new(mix, false))));
        }

    },

    instance: {

        checkPassword(password) {
            if (this.passwordHash === createHash(password, this.passwordSalt)) {
                return this;
            } else {
                throw new Errors.Unauthorized("Incorrect credentials");
            }
        },

        setPassword(password) {
            let [passwordHash, passwordSalt] = hash(password);
            this.populate({passwordHash, passwordSalt});
            return this;
        }

    }
};
``` 
