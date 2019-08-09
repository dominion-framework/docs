# Controllers

In RESTful API you have to define interface for accessing and 
manipulating your model and/or models collection (or resources,
to be precise with RESTful specs). In Dominion 
framework controllers are specifically designed for this, but 
still they provide flexibility for API endpoints that do not
fit well in RESTful structure.

Two main advantage of Dominion's controllers are:
* **validating output** - controller linked to a factory won't allow
an endpoint to return model that was not created by that factory.
* **URI creation** - controller will automatically set
proper URI for endpoints based on what they do and with what resource.

It is a good practice not to have business logic in endpoints
functions and keep them reasonably small. Business logic should
be implemented in methods of factories and model instances, or 
in separated services.  

## Writing a controller

A file containing controller should export an object with a list of 
endpoint callback functions and meta info describing what type of resources 
this controller will operate. 
This object may have properties:

|Name   |Description   |
|:---|:---|
|_factory_  | Object, optional. Models factory object. This object will define resource name, that will be used in endpoints URI. It also will obligate all endpoints defined in a controller to return models or collections of this type.    |
|_path_     | String, optional. Resource name or custom path, that will be used in endpoints URI. It may be used when there is no appropriate model for endpoints functionality. Note, you can set only one either `path` or `factory` property. 
|_OPTIONS[], GET[], POST[], PUT[], DELETE[]_  | Array, optional. Arrays containing functions that will be called on HTTP request with appropriate verb and URI matching function's arguments. 


## Code example
```js
const Factories = require("@dominion-framework/dominion/core/factories");

const UsersFactory = Factories("Users");

module.exports = {

    factory: UsersFactory,

    GET: [
        // users/?limit=6&offset=12
        function (limit = 6, offset = 12) {
            // @summary: Get all user with pagination
            return UsersFactory.find({}, limit, offset);
        },

        // users/42
        function (usersId) {
            // @permission: Users.Read
            // @summary: Get user instance by id
            return UsersFactory.get({id: usersId});
        }
    ],

    POST: [
        // users/
        function () {
            // @summary: Create new user
            return UsersFactory.new(this.request.body)
                .then(user => user.save())
                .then(user => user.sendInvitationEmail())
                .then(user => UsersFactory.get({id: user.id}));
        }
    ],

    PUT: [
        // users/42
        function (usersId) {
            // @summary: Update new user profile
            return UsersFactory.get({id: usersId})
                .then(user => user.populate(this.request.body))
                .then(user => user.save());
        }
    ],

    DELETE: [
        // users/1
        function (usersId) {
            // @summary: Remove user by id
            return UsersFactory.get({id: usersId})
                .then(user => user.remove())
                .then(result => {
                    if (result.affectedRows) {
                        this.response.status = this.response.statuses._204_NoContent;
                    }
                });
        }
    ]
};
```
