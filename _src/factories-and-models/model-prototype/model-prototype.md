# Model Prototype
Default instance prototype (`core/factories/modelPrototype.js`) has methods:

#### `.populate( {modelsData} )`

Populates model's properties from object provided in `modelsData`. Before assigning
provided values are validated to match `Property` rules from models declaration.
For example:
```js
//model's property declaration:
properties: {
    id: Property.id(),
    isbn: Property.string().pattern(/^ISBN \d-\d{3}-\d{5}-\d$/)
}

...

//models instance:

book.populate( {isbn: "2000"} ); 
// throws error, because "2000" doesn't match regexp /^ISBN \d-\d{3}-\d{5}-\d$/

// the same applies during direct assignment
book.isbn = "2000"
```  

#### `.validate()`

Validates all model's properties to match `Property` rules from model's properties declaration.


#### `.toJSON()`

Stringifies model before sending it back to client. It applies `Property` rules and output
modifications from model's properties declaration. Can be reloaded if you need to modify 
string representation of model, but recommended way is to extend `Property` 
output modifications.

For example:
```js
//model's property declaration:
properties: {
    id: Property.id(),
    isbn: Property.string().pattern(/^ISBN \d-\d{3}-\d{5}-\d$/),
    creationTime: Property.date().private(),
    modificationTime: Property.date().private()
}

...

//models instance:

book.toJSON(); 
// returns
// {
//    "id": 42,
//    "isbn": "ISBN 4-393-29939-3"
// }
// Note, properties creationTime and modificationTime are missing
// because they are marked as private: Property.date().private()

// The same applies to JSON.stringify() for obvious reasons 
// (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior)
JSON.stringify(book);
```  

#### `.save()`

Saves model instance in DB. Properties validation will be performed before saving.
Returns Promise that will be resolved with model instance, or rejected with 
validation or DB error. This method requires `repository:` to be defined in model declaration.

For example:
```js
 return book.save();
```

#### `.remove()`

Removes model instance from DB. Returns Promise that will be resolved with DB response, 
or rejected with DB error. This method requires `repository:` to be defined in model declaration.

For example:
```js
 return book.remove()
    .then(result => {
        if (result.affectedRows === 1) {
            this.response.status = this.response.statuses._204_NoContent;
        }
    });
```
