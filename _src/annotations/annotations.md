# Annotations
Annotation comments are free form key-value declaration inside endpoint functions.
They can be used to add some meta information to an endpoint or add 
additional functionality to request procession.

Dominion framework has several predefined annotation, however you can write
any annotation you want and use it as meta endpoint data in interceptor.

Let's start with annotation out of the box. They can be used to define
custom URI for endpoint and add information for OpenAPI (Swagger) documentation.

## @path <a name="path"></a>
Sets custom URI for an endpoint. Value of annotation is a
regular expression that will be used to match URI. If it contains
capture groups, values of capture groups will be passes as arguments 
into endpoint function. For example:
  
```js
GET: [
    function(isbn) {
        // @path: books/isbn/(\d{1,5}[- ]\d{1,7}[- ]\d{1,6}[- ](?:\d|X))
        
        return BooksFactory.get({isbn})
    } 
]
```
The endpoint above will be called for URI: https://api.example.com/books/isbn/4-393-29939-X .
Value of function's argument `isbn` will be set to "4-393-29939-X".

## @summary <a name="summary"></a>
Sets short description of an endpoint. Used only for OpenAPI (Swagger) documentation.
```js
    function(isbn) {
        // @summary: Get book by ISBN number
        
        return BooksFactory.get({isbn})
    }
```

## @description <a name="description"></a>
Sets detailed description of an endpoint. Used only for OpenAPI (Swagger) documentation.
```js
    function(isbn) {
        // @description: ISBN number should be in format 4-393-29939-X.
        
        return BooksFactory.get({isbn})
    }
```

## @model <a name="model"></a>
Sets type of model to be returned by an endpoint. This annotation makes sense only when
controller is not linked to a model with `factory:` property. Used only for OpenAPI (Swagger) documentation.
```js
    function(booksId) {
        // @model: Books
        
        return BooksFactory.get({id: booksId})
            .then(book => book.populate(this.request.body))
            .then(book => book.save());
    }
```

## @deprecated <a name="deprecated"></a>
Marks endpoint as deprecated. Used only for OpenAPI (Swagger) documentation.
```js
    function(isbn) {
        // @deprecated: true
        
        return BooksFactory.get({isbn})
    }
```
