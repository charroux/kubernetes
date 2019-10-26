# RentACar

## Install Node.js

https://nodejs.org/en/download/

Create a project directory

npm init

npm install express

Add 

"start": "node server.js"

to

"scripts" in the fake package.json, like: 

  "scripts": {
  
    "test": "echo \"Error: no test specified\" && exit 1",
    
    "start": "node server.js"
    
  }
  
start the server with: npm start

## Send request to the server

Get the list of cars to be rented:

curl -X GET -H 'Content-Type: application/json' -i http://localhost:8080/cars

Add a new car:

curl -X POST -H 'Content-Type: application/json' -i http://localhost:8080/cars --data '{ "plateNumber" : "DD33EE" , "brand" : "Maserati", "price" : 100 }'

Get a car to be rented: 

curl -X GET -H 'Content-Type: application/json' -i http://localhost:8080/cars/AA11BB

Rent a car with: 

curl -X PUT -H 'Content-Type: application/json' -i 'http://localhost:8080/cars/AA11BB?rent=true' --data '{"debut":"10/10/2020", "fin":"20/10/2020"}'

Get back a car with:

curl -X PUT -H 'Content-Type: application/json' -i 'http://localhost:8080/cars/AA11BB?rent=false'


