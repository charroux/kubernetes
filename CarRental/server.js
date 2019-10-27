var express = require('express');
var hostname = 'localhost'; 
var port = 8080;

var app = express(); 

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cars = [
    {
        "brand":"Ferrari",
        "plateNumber":"AA11BB",
        "price":2000
    },
    {
        "brand":"Porshe",
        "plateNumber":"CC22DD",
        "price":1500
    }
]

var myRouter = express.Router();

myRouter.route('/')
.get(function(req,res){
    res.send("World");
});

myRouter.route('/hello')
.get(function(req,res){
    res.send("World");
});


myRouter.route('/cars')
.get(function(req,res){
    res.json({message : "Cars to be rented", data: cars});
})
.post(function(req,res){
    cars.push(req.body);
    res.json({message : "Add a car", brand: req.body.brand, plateNumber: req.body.plateNumber, price: req.body.price});
});


myRouter.route('/cars/:plateNumber')
.get(function(req,res){
    var car = cars.find(car => car.plateNumber === req.params.plateNumber);
    if(car == undefined) res.status(404).send('No such a car with plateNumber: ' + req.params.plateNumber);
    else res.json({message : "Info on car " + req.params.plateNumber, data: car});
})
.put(function(req,res){
    if(req.query.rent == "true"){
        res.json({message : "Rent the car: " + req.params.plateNumber, debut : req.body.debut, fin : req.body.fin});
    } else {
        res.json({message : "Get back the car: " + req.params.plateNumber});
    }
});

app.use(myRouter);  

app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port); 
});
