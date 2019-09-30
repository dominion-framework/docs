<div style="text-align: center">
    <div class="homepage-logo">
        <img src="/assets/logo.svg" alt="Dominion Node.js RESTful API framework logo" />
    </div>
    <strong>Dominion is declarative Promise based Node.js framework for RESTful API</strong>
</div>


<div class="out-of-the-box">   
<a href="#clear-declaration" class="sp">Clear endpoints declaration</a>
<a href="#correct-restful-urls" class="sp">Automatic <br/> RESTful URLs</a>
<a href="#models-schema-validation" class="sp">Models schema validation</a>    
<a href="#annotations" class="sp">Annotations</a>    
<a href="#openapi-documentation" class="sp">OpenAPI documentation</a>    
<a href="#zero-dependencies" class="sp">Zero dependencies</a>  
</div>

  
  
<div id="clear-declaration">

## Clear Endpoints Declaration
<div style="text-align: right"> 

[Read More &xrarr;](/controllers/)
</div>

```js
module.exports = {

    factory: BooksFactory,

    GET: [
        // books?genre=western
        function (genre = null) {
            return BooksFactory.find({genre});
        }
    ],

    POST: [
        // books/
        function () {
            return BooksFactory.new(this.request.body)
                .then(book => book.save());
        }
    ]
}
```
</div>

<div id="correct-restful-urls">

## Automatic RESTful URLs
<div style="text-align: right"> 

[Read More &xrarr;](/controllers/uri-creation/)
</div>

```js
// Endpoint URLs is build based on function arguments:

function (limit = 10, offset = 0) { }
// https://api.example.com/books?limit=42&offset=21


function (libraryShelvesId, favoriteBooksId, orderBy = "") { }
// https://api.example.com/library-shelves/42/favorite-books/84?orderBy=+author

```
</div>


<div id="models-schema-validation">

## Models Schema Validation
<div style="text-align: right"> 

[Read More &xrarr;](/properties/)
</div>

```js
{
    name: "Book",
    
    properties: {
        id: Property.id(),
        name: Property.string().min(1).required(),
        isbn: Property.string().pattern(/^\d-\d{3}-\d{5}-\d$/).example("0-330-25864-8"),
        authorId: Property.model("Author"),
        genre: Property.set(["Fantasy", "Science fiction", "Western", "Romance"]),
        creationTime: Property.date().private(),
        modificationTime: Property.date().private()
    }
    ...
}
```
</div>

<div id="annotations">

## Annotations
<div style="text-align: right"> 

[Read More &xrarr;](/annotations/)
</div>

```js
function(isbn) {
    // @path: books/isbn/(\d{1,5}[- ]\d{1,7}[- ]\d{1,6}[- ](?:\d|X))
    // @model: Books    
    // @summary: Get book by ISBN number
    
    return BooksFactory.get({isbn})
}
```
</div>

<div id="openapi-documentation">

## OpenAPI (Swagger) documentation

Automatic OpenAPI documentation based on source code.

![OpenAPI (Swagger) documentation](/assets/openapі.png)
</div>

<div id="zero-dependencies">

## Zero Dependencies

100Kb footprint Node.js framework with __no__ npm dependencies. If you also think, that
you don't need npm to [left-pad](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/) a string. 

_<small style="font-size:.6rem">Credits: [The node_modules problem](https://dev.to/leoat12/the-nodemodules-problem-29dc)</small>_
![OpenAPI (Swagger) documentation](/assets/node_modules.png)
</div>
