import express from 'express';
import multer from 'multer';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 2000;
const dbName = 'HRF';

const dbConnectionSr = 'mongodb+srv://Heartrecovfoundation:Heartrecovfoundation@cluster0.9crw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(dbConnectionSr, { useUnifiedTopology: true });

let db;

client.connect().then(() => {
  db = client.db(dbName);
  console.log(`Connected to ${dbName} Database`);
}).catch((err) => {
  console.error(err);
});

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|docx|doc|jpg|jpeg|png)$/)) {
      return cb(new Error('Only PDF, DOCX, DOC, JPG, JPEG, and PNG files are allowed!'));
    }
    cb(undefined, true);
  },
});

app.use(express.static(path.join(__dirname, 'theme')));
app.use(express.static('assets'));
app.use(express.static('views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/upload', express.static('uploads'));

// API Endpoints
app.post('/submit/volunteer', upload.single('cvUpload'), async (req, res) => {
  try {
    const { volunteerName, professional, workMobilePhone, emailAddress, areaOfInterest, howDidYouFindUs } = req.body;
    const collection = db.collection('volunteerform');
    await collection.insertOne({
      volunteerName,
      professional,
      workMobilePhone,
      emailAddress,
      areaOfInterest,
      howDidYouFindUs,
      cvUpload: req.file.filename,
    });
    res.send({ message: 'Volunteer form submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error inserting data into database' });
  }
});

app.post('/submit/donation', async (req, res) => {
  try {
    const { donorName, emailAddress, phoneNumber, donationAmount, message } = req.body;
    const collection = db.collection('donations');
    await collection.insertOne({
      donorName,
      emailAddress,
      phoneNumber,
      donationAmount,
      message,
    });
    res.send({ message: 'Donation form submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error inserting data into database' });
  }
});

app.post('/submit/contact', async (req, res) => {
  try {
    const { fullName, phone, emailAddress, message } = req.body;
    const collection = db.collection('contacts');
    await collection.insertOne({
      fullName,
      phone,
      emailAddress,
      message,
    });
    res.send({ message: 'Contact form submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error inserting data into database' });
  }
});

app.post('/submit/copsponsor', async (req, res) => {
  try {
    const { companyName, contactPerson, address, phoneNumber, emailAddress, message } = req.body;
    const collection = db.collection('corporatesponsors');
    await collection.insertOne({
      companyName,
      contactPerson,
      address,
      phoneNumber,
      emailAddress,
      message,
    });
    res.send({ message: 'Corporate Sponsor form submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error inserting data into database' });
  }
});

app.post('/submit/indsponsor', async (req, res) => {
  try {
    const { name, emailAddress, phoneNumber, message } = req.body;
    const collection = db.collection('indsponsors');
    await collection.insertOne({
      name,
      emailAddress,
      phoneNumber,
      message,
    });
    res.send({ message: 'Individual Sponsor form submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error inserting data into database' });
  }
});

app.post('/submit/patients', async (req, res) => {
  try {
    const {
      name,
      emailAddress,
      professional,
      patientDob,
      educationLevel,
      maritalStatus,
      religion,
      sex,
      mobilePhone,
      workPhone,
      referralHospital,
      referringPhysician,
      physicianPhoneNumber,
      estimatedCostOfSurgery,
      amountRaised,
      annualIncome,
      partyResponsibleForPayment,
      nameOfHealthInsuranceCompany,
      insuranceCompanyPhone,
      cardiacDiagnosis,
      relevantMedicalHistory,
      pastSurgicalHistory,
      currentMedications,
    } = req.body;
    const collection = db.collection('patients');
    await collection.insertOne({
      name,
      emailAddress,
      professional,
      patientDob,
      educationLevel,
      maritalStatus,
      religion,
      sex,
      mobilePhone,
      workPhone,
      referralHospital,
      referringPhysician,
      physicianPhoneNumber,
      estimatedCostOfSurgery,
      amountRaised,
      annualIncome,
      partyResponsibleForPayment,
      nameOfHealthInsuranceCompany,
      insuranceCompanyPhone,
      cardiacDiagnosis,
      relevantMedicalHistory,
      pastSurgicalHistory,
      currentMedications,
    });
    res.send({ message: 'Patient form submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error inserting data into database' });
  }
});

app.get('/', async (req, res) => {
  try {
    res.sendFile('index.html', { root: __dirname });
  } catch (err) {
    res.status(500).send({ message: 'Error fetching data from database' });
  }
});

app.get('/volunteers', async (req, res) => {
  try {
    res.sendFile('volunteers.html', { root: __dirname });
  } catch (err) {
    res.status(500).send({ message: 'Error fetching data from database' });
  }
});

app.get('/api/indsponsors', async (req, res) => {
  try {
    const indsponsors = await db.collection('indsponsors').find().toArray();
    res.json(indsponsors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching indsponsors' });
  }
});

app.get('/indsponsors', async (req, res) => {
  try {
    res.sendFile('indsponsors.html', { root: __dirname });
  } catch (err) {
    res.status(500).send({ message: 'Error fetching data from database' });
  }
});

app.get('/api/corporatesponsors', async (req, res) => {
  try {
    const corporatesponsors = await db.collection('corporatesponsors').find().toArray();
    res.json(corporatesponsors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching corporatesponsors' });
  }
});

app.get('/corporatesponsors', async (req, res) => {
  try {
    res.sendFile('corporatesponsors.html', { root: __dirname });
  } catch (err) {
    res.status(500).send({ message: 'Error fetching data from database' });
  }
});

app.get('/api/patients', async (req, res) => {
  try {
    const patients = await db.collection('patients').find().toArray();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

app.get('/patients', async (req, res) => {
  try {
    res.sendFile('patients.html', { root: __dirname });
  } catch (err) {
    res.status(500).send({ message: 'Error fetching data from database' });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await db.collection('contacts').find().toArray();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

app.get('/contacts', async (req, res) => {
  try {
    res.sendFile('contacts.html', { root: __dirname });
  } catch (err) {
    res.status(500).send({ message: 'Error fetching data from database' });
  }
});

app.get('/donations', async (req, res) => {
  try {
    res.sendFile('donations.html', { root: __dirname });
  } catch (err) {
    res.status(500).send({ message: 'Error fetching data from database' });
  }
});

app.get('/api/donations', async (req, res) => {
  try {
    const donations = await db.collection('donations').find().toArray();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching donations' });
  }
});

app.get('/api/volunteers', async (req, res) => {
    try {
    const volunteers = await db.collection('volunteerform').find().toArray();
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching volunteers' });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const volunteers = await db.collection('volunteerform').find().toArray();
    const indsponsors = await db.collection('indsponsors').find().toArray();
    const corporatesponsors = await db.collection('corporatesponsors').find().toArray();
    const patients = await db.collection('patients').find().toArray();
    const contacts = await db.collection('contacts').find().toArray();
    const donations = await db.collection('donations').find().toArray();
    const data = {
      volunteers,
      indsponsors,
      corporatesponsors,
      patients,
      contacts,
      donations,
    };
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

