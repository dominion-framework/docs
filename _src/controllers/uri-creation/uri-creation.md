# URI Creation

Dominion framework automatically create URIs according to RESTful APIs best 
practices. You only need to specify what data you expect to have as an
input to your endpoint. Or, in other words, list arguments in endpoint's 
function. Lets take a look on some quick examples.

```js
    // https://api.example.com/books/42
    function (booksId) { }
```

```js
    // https://api.example.com/books?limit=X&offset=Y
    function (limit = 10, offset = 0) { }
```

```js
    // https://api.example.com/library/42/books/42?limit=X    
    function (library, booksId, limit = 10) { }
```

```js
    // https://api.example.com/library/42/shelves/42/books/42?limit=X&authorName=Y    
    function (libraryId, shelvesId, booksId, authorName = null, limit = 10) { }
```
  
## Creation Rules

1. Name of a models factory that controller is linked to with `factory:`
property or value of controller's `path:` property will always 
be the last section of URI.
```js
{
    factory: BooksFactory, // assuming BooksFactory name is "books"
    ...
    GET: [
        function () { }

        // produces URI: 
        // https://api.example.com/books    
    ]
}
```

```js
{
    path: "books",
    ...
    GET: [
        function () { }

        // produces URI: 
        // https://api.example.com/books    
    ]
}
```
2. Required arguments of a function will become segments of URI path. 
Value of arguments will be set to string coming after segments. 
If argument name ends with "Id" suffix, it will be ignored. 
```js
{
    path: "books",
    ...
    GET: [
        function (shelvesId, booksId) { }

        // produces URI: 
        // https://api.example.com/shelves/42/books/21
        // shelvesId == 42, booksId == 21    
    ]
}
```

3. Optional arguments of a function are treated as query parameters
 (section of URI going after "?"). Value of arguments will be set to
 the value of passed query parameters. Key-value pairs can be in any order
 in a query string or be omitted at all.
```js
{
    path: "books",
    ...
    GET: [
        function (limit = 6, offset = 0) { }

        // produces URI: 
        // https://api.example.com/books?limit=12&offset=0
        // limit == 12, offset == 0
    ]
}
```
4. If `path:` property consist with more than one segment, function
argument need to be camelCased to receive value from URL.
```js
{
    path: "books/publisher",
    ...
    GET: [
        function (booksPublisherId) { }

        // produces URI: 
        // https://api.example.com/books/publisher/42
        // booksPublisherId == 42
    ]
}
```



If requested URI will not match any of existing handlers, server will respond `501 Not Implemented`.      

> Note, all values extracted from URI are strings, consequently arguments passed into functions are also always `String` type.
