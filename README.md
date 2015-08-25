# sandbox
CNJ Sandbox

# Pre-requirements #
This project is based on [Node.js](https://nodejs.org/), [Gulp](http://gulpjs.com/) for building and [jspm.io](http://jspm.io/) for frontend dependencies. 

So you need to:

* [download](https://nodejs.org/download/) and install Node.js
* install global dependencies:
```
npm install jspm -g
```
```
npm install gulp -g
```

# How to build #

This project is composed by tow parts:

* **frontend**
* **backend**

## Frontend: dependencies and build ##

From root folder, type:
```
cd frontend
```
```
npm install
```
```
jspm install
```
```
gulp build
```


## Backend: dependencies and run ##

From root folder, type:
```
cd backend
```
```
npm install
```
```
sudo chmod u+x server.js
```
```
node server.js
```

Enjoy on http://localhost:8080

# API details #

API entrypoint is 

```
http://git-map.com/api/v1/users
```

that contains links to furthers APIs' endpoints.
The main information provided by this service is "*usersInLocations*": represents the number of users per Italian region. 
Each entry provides two extra navigable links:
 
* *usersDetails*: users details per region, i.e.
    
    ```
    http://git-map.com/api/v1/users/toscana
    ```
    
    This endpoint provides detailed information on github users, including location details and coordinates.

* *languages*: languages details per region, i.e.

    ```
    http://git-map.com/api/v1/languages/toscana
    ```
    
    This endpoint provides information on programming languages, ranked by users who know that languages in that region.
    
API entrypoint provides a *links* object for accessing further more APIs:

* *languages*: 
    
    ```
    http://git-map.com/api/v1/languages
    ```
    
    Provides all programming languages ranked by users in Italy.
    This service provides two more links:
    
    * *languagesPerDistrict*: provides languages grouped by italian regions
    
        ```
        http://git-map.com/api/v1/languages/per-district
        ```

    * *singleDistrict*: provides languages in a single italian region (same endpoint as *languages* in *usersInLocations* seen above)
    
* *locationsDetails*:

    ```
    http://git-map.com/api/v1/locations
    ```
    
    Provides all Italian regions with geolocation details. This service can be useful to point clustered markers on each Italian region.
    Geolocation information delimits a region area by providing two opposites corner coordinates (i.e. 'northeast', 'southwest').