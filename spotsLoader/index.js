require('dotenv').config();
const csv = require('csv-parser');
const fs = require('fs');
const admin = require('firebase-admin');
const geofirestore = require('geofirestore');

process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:6001';
process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';

process.env.DATABASE_URL = 'https://menakin-dev-default-rtdb.firebaseio.com';
process.env.PROJECT_ID = 'menakin-dev';
process.env.FILE_PATH = '/home/omri/Documents/dev/menakim/spotsLoader/spots.csv';
const filePath = process.env.FILE_PATH;

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
});

const geoFirestore = geofirestore.initializeApp(admin.firestore());

const db = admin.firestore();

const usersCollection = 'users';
const placesCollection = 'protests';
const rowMapping = {
  'Submission Date': 'date',
  'מרחב בארץ שבו נמצא מוקד הנקיון שלך': 'area',
  'שם המקום': 'placeName',
  'מקום הנקיון שלך - אפשר לגרור את הסימון במפה כדי לבחור מקום': 'location',
  'סוג המקום': 'placeType',
  'שם פרטי': 'firstName',
  'שם משפחה': 'lastName',
  'כתובת אימייל': 'email',
  'מספר טלפון': 'phone',
  'קישור לקבוצת Whatsapp שפתחת': 'whatsAppLink',
};

async function getOrCreateUser(email, firstName, lastName, phone) {
  const userRef = await db.collection(usersCollection).where('email', '==', email).get();
  if (userRef.empty) {
    try {
      const newUser = await admin.auth().createUser({
        // createdAt: admin.database.ServerValue.TIMESTAMP,
        displayName: `${firstName} ${lastName}`,
        email,
        emailVerified: false,
        password: '123456',
      });

      await db
        .collection(usersCollection)
        .doc(newUser.uid)
        .set({
          displayName: `${firstName} ${lastName}`,
          email,
          firstName,
          lastName,
          phone,
        });

      return newUser.uid;
    } catch (err) {
      throw new Error('error creating user: ' + err.message);
    }
  }

  return userRef.docs[0].id;
}

async function isPlaceExist(placeName) {
  const placeRef = await db.collection(placesCollection).where('name', '==', placeName).get();
  return !placeRef.empty;
}

async function processRow(row) {
  const pairs = Object.entries(row).map(([key, value]) => [rowMapping[key] || key, value]);
  const parsed = Object.fromEntries(pairs);
  try {
    const isExist = await isPlaceExist(parsed.placeName);
    if (!isExist) {
      const userId = await getOrCreateUser(parsed.email, parsed.firstName, parsed.lastName, parsed.phone);
      const place = {
        area: parsed.area,
        created_at: admin.firestore.Timestamp.fromDate(new Date(parsed.date)),
        displayName: parsed.placeName,
        placeType: parsed.placeType,
        roles: {
          leader: [userId],
        },
        whatsAppLink: parsed.whatsAppLink,
        coordinates: new admin.firestore.GeoPoint(Number(parsed.Latitude), Number(parsed.Longitude)),
      };

      await geoFirestore.collection(placesCollection).add(place);
      // await db.collection(placesCollection).doc(uuidv1()).set(place);
    }
  } catch (err) {
    console.log(err, 'skipping row');
  }
}

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => processRow(row))
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
