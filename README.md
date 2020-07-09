Examination 2  
1DV527   
Web application as an application plattform   
ym222bs-examination-2  

# RATE-A-MOVIE 

## Movie-Rating-CRUD-Rest-API.

   This CRUD Rest-api makes it possible for users to add, read, update and deletet movies from the Database.
   The Authenticated users get special treatment and also get to add and modify the data as desired. (As long as it 
   is within the restriction of the Database schema and the rest of the API).
   It is possible to register a webhook URL where a user chooses to receive a payload consisting of 
   new Movie data added by a user. 
   
   Pre-req:
 * MongoDB. 
 * POSTMAN.
 
 Hosted Root: https://movie-restapi.herokuapp.com/
  
A Postman collection file is created to test the API.  
This is done by importing the collection file into POSTMAN and running the tests.
The file is located in POSTMAN directory. It should then be imported into Postman and 
an environment variable should be set to the environment that should also be imported.

### Test Rest Api (Locally):
* Port set to: ***8080*** 

1. Run: 
```
 npm install
``` 
to install all the dependencies.

2. Create a .env file in the root directory and name the variables exactly like this:
(the value should be your own)

```
MONGO_URI=mongo://your-username:your-password@some-number.mlab.com
JWT_SECRET=YourSecret
```
3. Now run:
```
npm start
```
to start the server.

4. Locate the file named ***"Rate-A-Movie.postman_collection"*** inside the POSTMAN directory inside the root directory and import it to POSTMAN.

5. Don't forget to import Environment, also localted in POSTMAN directory, named ***"environment local"*** and choose it as the environment.

6. Now run the test.

### Test Rest Api (Hosted):

Do steps [4 - 6] but change the Environsment file to ***"environment hosted"*** , located in the same directory.

*Note: Some tests are meant to fail to show error handeling within the program.*

# Questiones
## 1. HATEOAS.

I have set up a "home" page entry point where all possible routes and description/information is presented to guide a user. It is the root URL to the API. Almost all requests return a related next-URL type, or the URL back to "home page" to make it easy to navigate.


## 2. Multiple representations of the resources?

I would maybe create a separate route for each representation, or possibly reuse the same route but
use a parameter or header (eg. Content-Type).

## 3. Authentication solution.
   * What other authentication solutions could you implement?
   * What pros/cons do this solution have?

I used JWT tokens to let users have access to protected routes. A token was generated and returned to the user when a login was successful. The token is required for every protected route and is also checked at every request to ensure that I am dealing with the owner of the data that is to be added or modified. 

The general idea was that I could have upgraded the HTTP to HTTPS with SSL certs to ensure secure transfer while handling the token, but apparently, when deploying with Heroku, they do this automatically. 

## 4. Webhook.

I implemented a very simple Webhook, which an authenticated user can register by providing a valid URL. The URL is then stored into the Database and whenever a new movie is added, the hook will be triggered and a POST request with the new movie data will be sent to all URL's. There are three routes to the webhook, and methods are GET, POST and DELETE. I used [webhook.site](https://webhook.site/#/eaf58b69-853a-41c8-b7ff-e4abc4e44b32) to test the webhook.



## 5. Alternative solutions.

Error handling could have been better with the messages and cleaner code, I tried to give as much information as I think is relevant for a user (possibly a developer and not a regular user), but still, it could be improved. 

Handling the update (PUT) requests when a user sends incorrent properties or values for updating some existing data. Further validation would be added.

And for the HATEOAS, and my first time thinking about it, I think it is implemented in the right way, the only concern I have is how much information is needed for a user to understand and navigate through, so that is something I will stay humble of in a future scenario.

## 6. Something extra?

I think so, I made it so only the Owner of created data could modify it and _not just any_ authenticated user. This is
made with some extra validation of the current user. Similarly to what would be done with a session, or token earlier in this system.
