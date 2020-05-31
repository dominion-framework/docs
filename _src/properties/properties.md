# Properties

Properties is a way how you define validation rules and extra feature 
to Model's fields. By default Dominion framework comes with the most
common data types and validation rules. But you can extend them 
with project specific functionality.

**Validation rules** applies every time you are assigning a value to
 Model's property. For example:
 ```js
// model's properties declaration:
properties: {
    id: Property.number().integer()
}

// value assigment:
ModelsFactory.new({id: 'stringValue'});
model.populate({id: 'stringValue'});
model.id = 'stringValue';

// All three rows above will throw an exception:
// Error: In Hello model property id should be a number, given 'stringValue'.
```

If during assigment validation passed successfully, **input modifications**
will be applied. The most simple example of input modification is in
`.date()` property: if value is ISO 8601 string representation of a date
it will be automatically converted to JavaScript `Date` type.

**Output modification** are taking action before sending models back
to a requester. They allow to change value of a property in JSON
response or remove it all. For example, you probably wouldn't want
to send password hash to a client, setting property to `.private()`
will remove this field from the output.  

Every property has default prototype that contains features that 
are common for all variable types, e.g. `.primaryKey()` or `.private()`
make sense no matter if it is a String or Date.
 
## Property Default Prototype

| Method | Description |
|:---|:---|
| `.required()`  | Marks that property value can not be set to `null` or `undefined`. Also it cannot be omitted before saving model to external storage. 
| `.private()`   | Marks that property should be removed from model before sending it in response.
| `.immutable()` | Marks that property should be immutable.
| `.primaryKey()`| Marks property as primary key of the model. This property will be set to a value returned from external storage (e.g. database) after new record has been inserted.
| `.example(string)`   | Adding example of property value, e.g. "978-3-16-148410-0" for ISBN. It is used only during generating OpenAPI (Swagger) documentation. It is also useful as inline documentation.

## Number Property <a name="number"></a>   
| Method | Description |
|:---|:---|
| `.number()`       | Marks that property should be a number. Setting this allows to use other methods in this table.
| `.integer()`      | Marks that property should be an integer.  
| `.min(number)`    | Marks that properties value should be equal or bigger than `number`.   
| `.max(numver)`    | Marks that properties value should be equal or smaller than `number`.

## String Property <a name="string"></a>   
| Method | Description |
|:---|:---|
| `.string()`       | Marks that property should be a string. Setting this allows to use other methods in this table.
| `.min(number)`    | Marks that length of properties value should be equal or bigger than `number`.
| `.max(number)`    | Marks that length of properties value should be equal or smaller than `number`.
| `.pattern(regexp)`| Marks that properties value should match regular expression `regexp`.

## Object Property <a name="object"></a>   
| Method | Description |
|:---|:---|
| `.object()`       | Marks that property should be an object. Setting this allows to use other methods in this table.
| `.withProperties(array)`       | Marks that object assigned to a property should contain all properties passed in `array`.

## Date Property <a name="date"></a>   
| Method | Description |
|:---|:---|
| `.date()`       | Marks that property should be a date. It also adds input modification that converts assigning value to javascript `Date` object.

There are couple additional rules used during date conversion, if property assigned with:
 * `Date` object - it will be set unchanged.
 * integer - it will be treated as UNIX epoch time.
 * ISO 8601 string without timezone - UTC±00:00 timezone will be used
 * any other string - it will be parsed with native [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)

## Enum Property <a name="enum"></a>   
| Method | Description |
|:---|:---|
| `.enum(array)`  | Marks that properties value should one of values passed in `array`.

## Set Property <a name="set"></a>   
| Method | Description |
|:---|:---|
| `.set(array)`  | Marks that property should be an array and all elements in that array should be present in passed `array`.

## Model Property <a name="model"></a>   
| Method | Description |
|:---|:---|
| `.model(modelName)`  | Marks that property should be a reference to a model named `modelName`.

Setting property to a `model()` will perform following:
 * Validate if model `modelName` exists in a project.
 * Validate if assigning value is either (i) Model instance, (ii) Model reference or (iii) value of model's primary key (integer and string applies).
 * Apply input modification that will convert assigned Model instance or Model reference to a value of model's primary key.
 * Apply output modification converting Model instance into Model reference.   
 
 _Model reference_ is an object containing model's primary key, 
 name of a model and URI of that model. Note, you have to implement 
 endpoint that returns model by this URI in your project. For example:
 
```js
{
    id: 42,
    model: "Books",
    link: "/api/v2/books/42"
}
```

## .id() and .uuid() <a name="id-uuid"></a>

As primary keys are present in majority of models you use in your 
project, Dominion framework has shortcuts for you.
   
| Method | Shortcut for |
|:---|:---|
| `.id()`    | .number().integer().min(1).primaryKey()
| `.uuid()`  | .string().pattern(/^[ uuid-regexp ]$/).primaryKey()
