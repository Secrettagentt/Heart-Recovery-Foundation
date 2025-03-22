const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 3000
const path = require('path')
const multer = require('multer')
const dotenv = require('dotenv');

dotenv.config();
// configure multer
const upload = multer({
  dest: './uploads/',
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|docx|doc|jpg|jpeg|png)$/)) {
      return cb(new Error('Only PDF, DOCX, DOC, JPG, JPEG, and PNG files are allowed!'));
    }
    cb(undefined, true);
  },
  filename(req, file, cb) {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const filename = `${Date.now()}${fileExtension}`;
    cb(null, filename);
  },
});
let db,  
 dbConnectionStr = 'mongodb+srv://Heartrecovfoundation:Heartrecovfoundation@cluster0.9crw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
dbName = 'HRF'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then(client => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db(dbName)
  })

app.set('view engine', 'ejs')
app.use(express.static('theme'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/uploads', express.static('uploads'));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'theme', 'index.html'))
})

app.post('/submit/volunteer', upload.single('cvUpload'), async (request, response) => {
  try {
    
    if (!request.file) {
      throw new Error('No file uploaded!');
    }
    const data = {
      volunteerName: request.body.volunteerName,
      professional: request.body.professional,
      workMobilePhone: request.body.workMobilePhone,
      emailAddress: request.body.emailAddress,
      areaOfInterest: request.body.areaOfInterest,
      howDidYouFindUs: request.body.howDidYouFindUs,
      cvUpload: request.file.filename,
    }
    const collection = db.collection('volunteerform')
    await collection.insertOne(data)
    response.send({ message: 'Volunteer form submitted successfully!' })
  } catch (error) {
    console.error(error)
    response.status(500).send({ message: 'Error inserting data into database' })
  }
})

app.post('/submit/indsponsor', async (request, response) => {
  try {
    const data = {
      name: request.body.name,
      emailAddress: request.body.emailAddress,
      phoneNumber: request.body.phoneNumber,
      message: request.body.message,
    }
    const collection = db.collection('indsponsors')
    await collection.insertOne(data)
    response.send({ message: 'Individual Sponsorship form submitted successfully!' })
  } catch (error) {
    console.error(error)
    response.status(500).send({ message: 'Error inserting data into database' })
  }
})

app.post('/submit/copsponsor', async (request, response) => {
  try {
    const data = {
      companyName: request.body.companyName,
      contactPerson: request.body.contactPerson,
      address: request.body.address,
      phoneNumber: request.body.phoneNumber,
      emailAddress: request.body.emailAddress,
      message: request.body.message,
    }
    const collection = db.collection('corporatesponsors')
    await collection.insertOne(data)
    response.send({ message: 'Corporate Sponsorship form submitted successfully!' })
  } catch (error) {
    console.error(error)
    response.status(500).send({ message: 'Error inserting data into database' })
  }
})

app.post('/submit/patients', async (request, response) => {
  try {
    const data = {
      name: request.body.name,
      emailAddress: request.body.emailAddress,
      professional: request.body.professional,
      patientDob: request.body.patientDob,
      educationLevel: request.body.educationLevel,
      maritalStatus: request.body.maritalStatus,
      religion: request.body.religion,
      sex: request.body.sex,
      mobilePhone: request.body.mobilePhone,
      workPhone: request.body.workPhone,
      referralHospital: request.body.referralHospital,
      referringPhysician: request.body.referringPhysician,
      physicianPhoneNumber: request.body.physicianPhoneNumber,
      estimatedCostOfSurgery: request.body.estimatedCostOfSurgery,
      amountRaised: request.body.amountRaised,
      annualIncome: request.body.annualIncome,
      partyResponsibleForPayment: request.body.partyResponsibleForPayment,
      nameOfHealthInsuranceCompany: request.body.nameOfHealthInsuranceCompany,
      insuranceCompanyPhone: request.body.insuranceCompanyPhone,
      cardiacDiagnosis: request.body.cardiacDiagnosis,
      relevantMedicalHistory: request.body.relevantMedicalHistory,
      pastSurgicalHistory: request.body.pastSurgicalHistory,
      currentMedications: request.body.currentMedications,
    }
    const collection = db.collection('patients')
    await collection.insertOne(data)
    response.send({ message: 'Patient form submitted successfully!' })
  } catch (error) {
    console.error(error)
    response.status(500).send({ message: 'Error inserting data into database' })
  }
})

app.post('/submit/contact', async (request, response) => {
  try {
    const data = {
      fullName: request.body.fullName,
      phone: request.body.phone,
      emailAddress: request.body.emailAddress,
      message: request.body.message,
    }
    const collection = db.collection('contacts')
    await collection.insertOne(data)
    response.send({ message: 'Contact form submitted successfully!' })
  } catch (error) {
    console.error(error)
    response.status(500).send({ message: 'Error inserting data into database' })
  }
})

app.post('/submit/donation', upload.single('ssUpload'), async (request, response) => {
    try {
        const data = {
            donorName: request.body.donorName,
            emailAddress: request.body.emailAddress,
            phoneNumber: request.body.phoneNumber,
            donationAmount: request.body.donationAmount,
            message: request.body.message,
            screenshot: request.file.filename,
        }
        const collection = db.collection('donations')
        await collection.insertOne(data)
        response.send({ message: 'Donation form submitted successfully!' })
    } catch (error) {
        console.error(error)
        response.status(500).send({ message: 'Error inserting data into database' })
    }
})

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'theme', 'index.html'))
})


app.get('/panel', async (req, res) => {
  try {
    const volunteers = await db.collection('volunteerform').find().toArray();
    const individualSponsors = await db.collection('indsponsors').find().toArray();
    const corporateSponsors = await db.collection('corporatesponsors').find().toArray();
    const patients = await db.collection('patients').find().toArray();
    const contacts = await db.collection('contacts').find().toArray();
    const donations = await db.collection('donations').find().toArray();

    

    res.render('index', {
      volunteers: volunteers,
      individualSponsors: individualSponsors,
      corporateSponsors: corporateSponsors,
      patients: patients,
      contacts: contacts,
      donations: donations
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching data from database' });
  }
});

app.get('/volunteers', async (req, res) => {
    try {
        const volunteers = await db.collection('volunteerform').find().toArray();
        res.render('volunteers', { volunteers: volunteers });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});

app.get('/indsponsors', async (req, res) => {
    try {
        const individualSponsors = await db.collection('indsponsors').find().toArray();
        res.render('indsponsors', { individualSponsors: individualSponsors });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});

app.get('/corporatesponsors', async (req, res) => {
    try {
        const corporateSponsors = await db.collection('corporatesponsors').find().toArray();
        res.render('corporatesponsors', { corporateSponsors: corporateSponsors });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});

app.get('/patients', async (req, res) => {
    try {
        const patients = await db.collection('patients').find().toArray();
        res.render('patients', { patients: patients });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});

app.get('/contacts', async (req, res) => {
    try {
        const contacts = await db.collection('contacts').find().toArray();
        res.render('contacts', { contacts: contacts });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});

app.get('/donations', async (req, res) => {
    try {
        const donations = await db.collection('donations').find().toArray();
        res.render('donations', { donations: donations });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${PORT}`)
})