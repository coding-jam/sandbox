# sandbox
CNJ Sandbox

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
    
    Provides all programming languages ranked by users in Italy
    
* *locationsDetails*:

    ```
    http://git-map.com/api/v1/locations
    ```
    
    Provides all Italian regions with geolocation details. This service can be useful to point clustered markers on each Italian region.
    Geolocation information delimits a region area by providing two opposites corner coordinates (i.e. 'northeast', 'southwest').