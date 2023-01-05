const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt =  require('jsonwebtoken');

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASSWORD}@cluster0.p8qnexq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const allCoffees = client.db('coffeeShop').collection('coffeeCategory')
        const allPackets = client.db('coffeeShop').collection('packets')
        const allOrders = client.db('coffeeShop').collection('orders')
        const allUsers = client.db('coffeeShop').collection('users')
        const fullOrders = client.db('coffeeShop').collection('fullOrder')
        const allPersonalItem = client.db('coffeeShop').collection('personalItem')

        app.get('/allCoffee', async (req, res) => {
            const query = {};
            const result = await allCoffees.find(query).toArray();
            res.send(result)
        })

        app.get('/allPacket', async (req, res) => {
            const query = {};
            const result = await allPackets.find(query).toArray();
            res.send(result);
        })

        app.get('/coffeeDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allCoffees.findOne(query);
            res.send(result)
        })


        app.get('/bagDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allPackets.findOne(query);
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const product = req.body;
            const result = await allOrders.insertOne(product);
            res.send(result)
        })

        app.get('/myCarts', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await allOrders.find(query).toArray();
            res.send(result);
        })

        app.delete('/orderDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allOrders.deleteOne(query);
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await allUsers.insertOne(users);
            res.send(result);
        })

        app.get('/allUser', async (req, res) => {
            const query = {};
            const result = await allUsers.find(query).toArray();
            res.send(result)
        })

        app.delete('/userDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allUsers.deleteOne(query);
            res.send(result);
        })

        app.put('/makeAdmin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    role: 'Admin'
                }
            }
            const result = await allUsers.updateOne(filter, updateDoc, options)
            res.send(result)
        })


        app.put('/removeAdmin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    role: ''
                }
            }
            const result = await allUsers.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.get('/allProducts', async (req, res) => {
            const query = {};
            const result = await allOrders.find(query).toArray();
            res.send(result)
        })

        app.post('/fullOrder', async (req, res) => {
            const orders = req.body;
            const result = await fullOrders.insertOne(orders);
            res.send(result);
        })


        app.get('/fullProducts', async (req, res) => {
            const query = {};
            const result = await fullOrders.find(query).toArray();
            res.send(result);
        })


        app.get('/fullProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await fullOrders.findOne(query);
            res.send(result);
        })

        app.put('/singlePayment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    payment: 'OK'
                }
            }
            const result = await allOrders.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.post('/coffeeBrand', async (req, res) => {
            const coffee = req.body;
            const result = await allCoffees.insertOne(coffee)

            const currentCatagory = await allCoffees.findOne({ category_name: req.body.category_name })
            const updatedDoc = {
                $set: {
                    products: []
                }
            }
            const update = await allCoffees.updateOne({ category_name: req.body.category_name }, updatedDoc)

            res.send(result)
        })

        app.post('/addNewCoffee', async (req, res) => {
            const coffee = req.body
            const result = await allPersonalItem.insertOne(coffee)

            const name = req.body.name
            const img = req.body.img
            const price = req.body.price
            const ratting = req.body.ratting
            const email = req.body.email
            const currentCatagory = await allCoffees.findOne({ category_name: req.body.category_name })
            const newProducts = [...currentCatagory.products, { name, img, price, ratting, email }]
            const updatedDoc = {
                $set: {
                    products: newProducts
                }
            }
            const result2 = await allCoffees.updateOne({ category_name: req.body.category_name }, updatedDoc)
            res.send(result2);
        })

        app.post('/addNewPacket', async (req, res) => {
            const packet = req.body;
            const result = await allPackets.insertOne(packet);
            res.send(result);
        })


        app.get('/personCoffee', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const coffee = await allCoffees.find(query).toArray();
            res.send(coffee)
        })

        app.get('/personPacket', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const coffee = await allPackets.find(query).toArray();
            res.send(coffee)
        })

        app.get('/packetName', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const coffee = await allPersonalItem.find(query).toArray();
            res.send(coffee)
        })

        app.delete('/brandDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allCoffees.deleteOne(query);
            res.send(result);
        })

        app.delete('/packet/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allPackets.deleteOne(query);
            res.send(result);
        })

        app.delete('/packetNameDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            console.log(query);
            const result = await allPersonalItem.deleteOne(query);
            res.send(result);
        })

        app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await allUsers.findOne(query);
            res.send({ isAdmin: user?.role == 'Admin' });
        })

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await allUsers.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN) //, {expiresIn: '1h'}
                // console.log(token);
                return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: '' })
        })

    }
    finally {

    }
}

run().catch(console.log)


app.get('/', (req, res) => {
    res.send('Coffee Shop Server Running')
})

app.listen(port, () => {
    console.log(`Coffee Shop start on port ${port}`)
})