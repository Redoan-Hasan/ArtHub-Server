const express = require("express");
const cors = require("cors")
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;




app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qhz4s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    }
});

async function run() {
    try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const craftCollection = client.db("ArtHub_DB").collection("Crafts")

    app.get('/matchingSubCategory/:subcategory', async(req,res)=>{
        const subcategory = req.params.subcategory;
        console.log('route hit', subcategory);
        const query = {subcategory_name : subcategory}
        const result = await craftCollection.find(query).toArray();
        console.log(result);
        res.send(result)
    })

    app.get('/craftsCards', async(req,res)=>{
        const cursor = craftCollection.find()
        const result = await cursor.toArray();
        // console.log(result);
        res.send(result)
    })

    app.get('/myCraftList/:email',async(req,res)=>{
        const email = req.params.email;
        const query = {email : email}
        const result = await craftCollection.find(query).toArray();
        // console.log(result);
        res.send(result)
    })

    app.get('/updateExistingCraft/:id' , async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await craftCollection.findOne(query)
        // res.send(result)
    })

    app.put('/updateExistingCraft/:id', async(req,res)=>{
        const id = req.params.id;
        const updatedCraft = req.body;
        const filter = {_id : new ObjectId(id)};
        const options = { upsert: true }
        const uCraft = {
            $set : {
                itemName : updatedCraft.itemName,
                subcategory_name : updatedCraft.subcategory_name ,
                price : updatedCraft.price,
                processing_time : updatedCraft.processing_time,
                rating : updatedCraft.rating,
                description : updatedCraft.description,
                photo : updatedCraft.photo,
                email : updatedCraft.email,
                customization : updatedCraft.customization,
                stockStatus : updatedCraft.stockStatus,
            }
        }
        const result = await craftCollection.updateOne(filter,uCraft,options)
        res.send(result)
    })

    app.delete('/updateExistingCraft/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await craftCollection.deleteOne(query)
        res.send(result)
    })

    app.get('/viewDetails/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await craftCollection.findOne(query)
        // console.log(result);
        res.send(result)
    })

    app.post('/crafts',async(req,res)=>{
        const newCraft = req.body;
        console.log(newCraft);
        const result = await craftCollection.insertOne(newCraft)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Data's are on the way")
})

app.listen(port, ()=>{
    console.log(`The server is running on port:${port}`);
})