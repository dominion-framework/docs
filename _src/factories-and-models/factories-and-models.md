# Factories and Models

Files containing factory declaration should export object with model's properties and 
prototypes for models factories and models instances.

Models declaration object has following properties:

`name` - model's name. Good practice is to keep model's name always in plural to avoid ambiguity.

`repository` - optional, link to model's `Repository`.

`properties` - object containing model's properties. Object keys will be properties' names, values - properties validators.

`factory` - object containing functions that will be used as model's factory prototype. 

`instance` - object containing functions that will be used as model's instance prototype.

```js
const Property                  = use("core/property");
const Errors                    = use("core/errors");

const UsersRepository           = require("./repository");


module.exports = {

    name: "Users",

    repository: UsersRepository, 

    properties: {
        id: Property.id(),
        phoneNumber: Property.number().min(100000000000).max(999999999999),
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
