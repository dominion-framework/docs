# Interceptors
**Interceptors are global!** This means that no matter in what 
component they are declared, they will be executed for *every* request.
I know it feels counter-intuitive and smells like a bad design, but it's not. 
Or, at least I think it is not.

The point here you should never need to decorate API endpoint on component level
or on single `handler` level. Such functionality should be moved to factories, models 
or services.

Interceptors should be used for actual global things like extracting 
cookies from header, parsing multipart/form-data, logging, converting response
from JSON to XML, etc.

