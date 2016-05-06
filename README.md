##URL Shortening microservice

This is a simple proof-of-concept microservice that will take a URL in the 
format of http://www.example.com on /new, save it to a MongoDB with a shortened
redirect and then return a JSON object with a short URL link.

Requests on / that include the ID will redirect to the saved URL.

Handling for / and new/ without passing information is not included, but
it will check for a previously known URL and for the validity of input,
including sanitizing text before it is passed to MongoDB.