import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import cors from 'cors';
app.use(cors());

const PORT = 3000;

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const theme = path.join(__dirname, '/../theme');

import multer from 'multer';
const dbName = 'heartrecoveryfoundation';
const upload = multer({ dest: './uploads/' });



import { MongoClient, ServerApiVersion } from 'mongodb';


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.heartdb, {
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run();



    
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());
app.use(express.static(theme));









app.get('/', (req, res) => {
  res.sendFile(path.join(theme, 'index.html'));
});

app.post('/submit/volunteer', upload.single('cvUpload'), async (req, res) => {
  try {
    const { volunteerName, professional, workMobilePhone, emailAddress, areaOfInterest, howDidYouFindUs } = req.body;
    const db = client.db(dbName);
    const collection = db.collection('volunteerform');
    await collection.insertOne({ volunteerName, professional, workMobilePhone, emailAddress, areaOfInterest, howDidYouFindUs, cvUpload: req.file.filename });
    res.send({ message: 'Volunteer form submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error inserting data into database' });
  }
});


app.post('/submit/donation', (req, res) => {
  const formData = req.body;
  console.log(formData);
  res.send('Donation form submitted successfully!');
});

app.post('/submit/contact', (req, res) => {
  const formData = req.body;
  console.log(formData);
  res.send('Contact form submitted successfully!');
});

app.post('/submit/other', (req, res) => {
  const formData = req.body;
  console.log(formData);
  res.send('Other form submitted successfully!');
});

app.post('/submit/copsponsor', (req, res) => {
  const formData = req.body;
  console.log(formData);
  res.send('Sponsorship form submitted successfully!');
});

app.post('/submit/indsponsor', (req, res) => {
  const formData = req.body;
  console.log(formData);
  res.send('Sponsorship form submitted successfully!');
});

app.post('/submit/patients', (req, res) => {
  const formData = req.body;
  console.log(formData);
  res.send('Sponsorship form submitted successfully!');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

await app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})