// Import required libraries
const { MongoClient } = require('mongodb');

const { google } = require('googleapis');

// MongoDB connection settings
const mongoUri = 'mongodb+srv://Heartrecovfoundation:Heartrecovfoundation@cluster0.9crw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'HRF';
collectionNames = [
  'volunteerform',
  'indsponsors',
  'corporatesponsors',
  'patients',
  'contacts',
  'donations',
];

// Google Sheets API settings
const spreadsheetId = 'your_spreadsheet_id';
const sheetName = 'your_sheet_name';
const auth = new google.auth.GoogleAuth({
  // Your Google Sheets API credentials
  client_email: 'your_client_email',
  private_key: 'your_private_key',
});

// Connect to MongoDB
MongoClient.connect(mongoUri, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }

  // Retrieve data from MongoDB
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  collection.find().toArray((err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Write data to Google Sheets
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`, // Update from cell A1
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: data.map((row) => Object.values(row)),
      },
    }, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log('Data written to Google Sheets!');
    });
  });
});
