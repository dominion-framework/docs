# Factory Prototype

Default factory prototype (`core/factories/modelFactoryPrototype.js`) has methods:
 
#### `.new( [modelData] )` 
 
 Creates new instance of model. Object with initial model's data can be passed as argument.   
 
 
#### `.get( [criteriasObject] )` 
 
 Fetches one record from DB using `criteriasObject` and returns model's instance 
 containing it. This method requires `repository:` to be defined in model declaration.
 
 For example:
```js
UsersFactory.get({id: 42})
```    
    
 
#### `.find( [criteriasObject], [limit], [offset], [order] )` 
 
 Fetch collection with `limit` records using `criteriasObject`  starting from `offset` 
 in `order`, where order is a string equals to one of model's properties name and 
 prefixed by "+" or "-" for ascend or descend sorting. Returns array with model's instance.
 This method requires `repository:` to be defined in model declaration.
 
 For example: 
```js
UsersFactory.find({name: "Alice", status: "active"}, 10, 20, "+last_name")
```
