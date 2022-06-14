const express=require('express');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
 
const cors=require('cors');
const { response } = require('express');
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xq8ej.mongodb.net/?retryWrites=true&w=majority`;
 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const database = client.db("onlineKenakata");
        const servicesCollection = database.collection("services");
        const bookingsCollection=client.db("onlineKenakata").collection("booking");

        // GET All Services API 

        app.get('/allServices',async(req,res)=>{
            const cursor=servicesCollection.find({});
            const services=await cursor.toArray();
            res.send(services);
        })

         // GET SINGLE Product

        app.get('/singleProduct/:id', async(req,res)=>{
   
            const id=req.params.id;
            console.log('getting specific id',id);
            const query={_id:ObjectId(id)}; 
            const service=await servicesCollection.findOne(query); 
            res.json(service);
        })

             

             




  
        // //POST API Add Services

        app.post('/addServices',async (req,res)=>{
            const service=req.body;
            console.log('hit the post api',service);
            
            const result=await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        
        // confirm order

        app.post("/confirmOrder",async(req,res)=>{
            const result=await bookingsCollection.insertOne(req.body);
            res.send(result);
        });

        // All orders get

        app.get('/allOrders',async(req,res)=>{
            const cursor=bookingsCollection.find({});
            const services=await cursor.toArray();
            res.send(services);
        })

        

        // my confirm order

        app.get("/myOrders/:email",async(req,res)=>{
            const result=await bookingsCollection.find({email:req.params.email}).toArray();
            res.send(result);
        })

        // Update Status

        app.put("/updateStatus/:id",async(req,res)=>{
            const id=req.params.id;
            const updatedStatus=req.body.status;
            const filter={_id:ObjectId(id)};
            console.log(updatedStatus);
            const result=await bookingsCollection.updateOne(filter,{
                $set:{status:updatedStatus}
            })
            res.send(result);
        })




        // DELETE ORDER

        app.delete('/deleteorder/:id', async(req,res) =>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await bookingsCollection.deleteOne(query);
            res.json(result);
        })

        // DELETE PRODUCTS
        app.delete('/allServices/:id', async(req,res) =>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await servicesCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally{
        // await client.close();
    }
}
    run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send("Running Genius Server")
});

app.listen(port, ()=>{
    console.log('Running Genisu Server on port',port);
})