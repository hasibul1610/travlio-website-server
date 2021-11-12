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


});

app.listen(port, () => {
    console.log('Travlio Backend Server Running on Port:', port);
})