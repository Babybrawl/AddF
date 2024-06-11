const express = require('express');
const path = require('path');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000; // Utilisez le port de l'environnement si disponible

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON data
app.use(express.json());

const mongoURI = "mongodb+srv://nicolasbabybrawl:QDRGrf8sq2OMtCKH@babybrawl.aod6irz.mongodb.net/Films_dataBase?retryWrites=true&w=majority&appName=Babybrawl";
const client = new MongoClient(mongoURI);

// Connect to the MongoDB database
async function connectMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB database");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
connectMongoDB();

// Endpoint to add a new film
app.post('/api/ajouterFilm', async (req, res) => {
    try {
        const { titre, image, link, description, tag } = req.body;
        console.log('Request received with data:', req.body);

        if (!titre || !image || !link || !description || !tag) {
            res.status(400).send("Title, image, link, description, and tag fields are required");
            return;
        }

        const db = client.db();
        const filmsCollection = db.collection('Films');
        const document = { type: 'film', titre, image, link, description, tag };

        const result = await filmsCollection.insertOne(document);
        console.log('Insertion result:', result);

        res.send("New film added successfully!");
    } catch (error) {
        console.error("Error adding film:", error);
        res.status(500).send("Error adding film");
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
