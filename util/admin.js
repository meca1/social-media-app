const admin = require('firebase-admin');

const serviceAccount = require('/Users/danielramos/Downloads/socialpe-ac5ad-firebase-adminsdk-b38yv-6005b4e6be.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://socialpe-ac5ad.firebaseio.com'
});

const db = admin.firestore();
// admin.initializeApp()

module.exports = { admin, db }
