# Quick Start

_This is a guide for those who are using Dominion framework 
for the first time. If you already have some experience with it, 
this page probably not going to be very interesting._

OK, if you are still with me, let's begin. Our main goal in
this tutorial is to install and start Node.js API server with a couple
of sample APIs.

To start, create a new folder and run following commands in 
your terminal.
     
```shell script
npm init -y
npm i @dominion-framework/dominion
npx dominion create hello
npm start

```

Message in the terminal should indicate that server is running, 
like in example below. 

<pre class="terminal" onmouseenter="scroll({top: 1e4 ,behavior: 'smooth'})">
<code><span class="hljs-meta">$</span> <span class="hljs-built_in">npm</span> init -y
Wrote to /home/user/dominion-test/package.json:

{
  "name": "dominion-test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}


<span class="hljs-meta">$</span> <span class="hljs-built_in">npm</span> i @dominion-framework/dominion
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN dominion@1.0.0 No description
npm WARN dominion@1.0.0 No repository field.

+ @dominion-framework/dominion@0.2.7
added 1 package from 1 contributor and audited 1 package in 0.455s
found <span class="hljs-meta-string">0</span> vulnerabilities

<span class="hljs-meta">$</span> <span class="hljs-built_in">npx</span> dominion create hello
Component 'Hello' created in /home/user/dominion-test/components/hello.
<span class="hljs-meta">$</span> <span class="hljs-built_in">npm</span> start

> dominion@1.0.0 start /home/user/dominion-test
> node index.js

<span class="hljs-meta-string">Server is running at http://localhost:7042/ in development mode...</span>
<span class="hljs-meta-string">&#9608;</span></code>
</pre>

> If port 7042 is busy on your machine, first tell me _why?_ in
> [Gitter](https://gitter.im/dominion-framework/community). Then 
> you may change it in `./config/config.dev.js`. 

Now as your server is running, open 
http://localhost:7042/hello?offset=70&limit=42 to check results. 
If you can see welcome message, we are done. That's all you need to
start REST API server.

But lets go a bit deeper to what just happened. First two commands
`npm init` and `npm i @dominion-framework/dominion` are obvious, 
initiating npm package and installing Dominion framework. However, 
after opening `./node_modules`, some of you will be pleased to see
that it doesn't contain a backup of npm repository.

Third command `npx dominion create hello` is creating project scaffold.
Actually, it creates scaffold for a single component. You can read
more about it on page [Components](/components). But `hello` is 
a bit special, it also creates default configs, server's index file, 
and adds `start` script to `package.json`. Don't worry, if any of 
those already exists it won't be overwritten.

Finally, `npm start` is executing `node index.js`. Nothing special
here, so lets see what is inside index file.

```js
const Server = require("@dominion-framework/dominion");

Server.addComponent(require("@dominion-framework/dominion/components/cors"));
Server.addComponent(require("@dominion-framework/dominion/components/logging"));

Server.addComponent(require("./components/hello"));

Server.start();

Server.openApiToFile();
``` 

As you may guess from the code above, `./index.js` is used for 
registering components in a project. Yeah, I'm annoyed how verbose
requires are as well, but I assure you it will be fixed as soon as
ES modules will be moved out of a flag in Node.js.

First two are default components. `cors` is adding proper CORS headers
into APIs response. It is not needed, if your APIs won't  be used
from a browser. And `logging` is writing logs into console, you should
already saw it after opening https://localhost:7042/hello.

Then goes component that we created using "npx dominion create". 
And here it starts to be interesting. There are 3 files inside 
folder `./components/hello/` - `index.js`, `controller.js` and
`factory.js`. Index is used for registering parts of a components
(more about it on [Components](/components) page). Controller 
is a file where you write actual API handlers. Lets take 
endpoint that returns welcome message:

```js
GET: [
    //hello?offset=0&limit=10
    function (offset = 0, limit = 10) {
        // @summary: Demo endpoint with optional arguments
        // @description: Open http://localhost:7042/hello?offset=0&limit=10 to see results

        return HelloFactory.new({message: `Welcome to Dominion! Nice to meet you! [${offset}, ${limit}]` });
    },
    ...
]
```  
Callback function (or handler) is inside `GET` array what means it will
be called on HTTP GET request. Function has two optional arguments - 
`offset` and `limit` - this allows to pass those parameters in a query
string. Note, if you will have parameter in URL query string which 
is not among arguments, then handler won't be matched. For example, 
calling http://localhost:7042/hello?foo=bar will return `501 Not Implemented`.

Lines `@summary` and `@description` are handler's annotations. They 
may provide some meta data about handler or extend its functionality.
More about them on [Annotations](/annotations) page.

The final piece of a puzzle is where `/hello?` part of URL comes from.
[Controllers](/controllers) may (but not have to) be linked to a models
factory . If they are, URLs path is taken from model's name. 
In our case, controller is linked to model named `Hello`. 
What brings us to Models.

Models are created by the factory declared in the file `factory.js`.
```js
{
    name: "Hello",
    
    properties: {
        id: Property.id(),
        message: Property.string(),
        guid: Property.string().example("123e4567-e89b-12d3-a456-426655440000"),
        email: Property.string().example("my.name@example.com"),
        state: Property.enum(["open", "close"]),
        parentId: Property.model("Hello").private(),
        creationTime: Property.date().private(),
        modificationTime: Property.date().private()
    },
    
    factory: { },
    
    instance: {
        sendWelcomeEmail() {
            NodeMailer.send({to: this.email})  
        } 
    }
}
```   
In factory declaration you can specify model name and properties (fields).
Properties are defined using `Property` constructor. It works 
similar to [@hapi/joi](https://github.com/hapijs/joi). Besides 
value validation, it allows to add meta data (`.example()`) or 
modify output. For example, if field is `.private()` it will be removed
from API response.

When you need to extend functionality, you can add custom methods to
factory or model (aka. instance) prototypes. In example above, instances 
of model `Hello` will have method `sendWelcomeEmail`. You can use it
like this:
```js
const HelloFactory = Factories("Hello");

HelloFactory.new({
   id: 42,
   email: "my.name@example.com"
})
.then(modelHello => modelHello.sendWelcomeEmail());
```
As you notices, creating new instance of `Hello` model is 
asynchronous operation. Realistically, there is nothing
to do asynchronously when you creating new model instance.
But for majority of other operation there is a lot, e.g. saving 
in database, reading file, communicating with other micro-services, etc.
So, to keep things consistent `.new()` returns Promise.       

And as usual, you can find more about models on [Factories](/factories-and-models) page.


I hope you are still following, we are almost done. 
Lets return back to component index file. We are left with one more
row, really simple one: 
```js
Server.start();
```
It runs all bootstrap functions and starts listening for HTTP requests.

OK, that's it. We just went through all basic features of the framework.
Thank you for reading and I'm wishing you to have a grate time working
with Dominion framework. You can find more in-depth information on this
website and of course (and it is more recommended) in the
 [source code](https://github.com/dominion-framework/dominion) on GitHub.
 

One last thing before you leave. There is a little giveaway for you.
OpenAPI (Swagger) documentation is coming out of the box -
open https://editor.swagger.io/ and copy-paste content from 
file `./openapi.json` into it. This file was created with the last 
line in component index:

```js
Server.openApiToFile();
```  

