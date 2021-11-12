const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ernke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.send("Travlio Server is Running")
})

client.connect(err => {
    const packagesCollection = client.db('travlioDb').collection('packages');
    const bookingsCollection = client.db('travlioDb').collection('bookings');

    //Add Packages
    app.post('/addPackages', async (req, res) => {
        const result = await packagesCollection.insertOne(req.body);
        // console.log(result);
        res.send(result);
    })

    //get all packages to display 
    app.get('/allPackages', async (req, res) => {
        const result = await packagesCollection.find({}).toArray();
        res.send(result);
    })

    //get single product
    app.get('/singlePackage/:id', async (req, res) => {
        // console.log(req.params.id);
        const result = await packagesCollection.
            find({ _id: ObjectId(req.params.id) })
            .toArray();
        // console.log(result);
        res.send(result[0]);
    })

    //Confirm Booking
    app.post('/confirmBooking', async (req, res) => {
        const result = await bookingsCollection.insertOne(req.body);
        // console.log(result);
        res.send(result);
    })

    //my Booked order
    app.get('/myBookings/:email', async (req, res) => {
        // console.log(req.params.email);
        const result = await bookingsCollection.find({ email: req.params.email }).toArray();
        console.log(result);
        res.send(result);
    })

    // delete package from booked
    app.delete('/deleteBooking/:id', async (req, res) => {
        const result = await bookingsCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        // console.log(result);
        res.send(result);
    })

    //get all services for admin
    app.get('/packages', async (req, res) => {
        const result = await packagesCollection.find({}).toArray();
        res.send(result);
    })

    // delete any package by admin
    app.delete('/deletePackage/:id', async (req, res) => {
        const result = await packagesCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        // console.log(result);
        res.send(result);
    })


});

app.listen(port, () => {
    console.log('Travlio Backend Server Running on Port:', port);
})