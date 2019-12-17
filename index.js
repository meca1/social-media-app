const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('/Users/danielramos/Downloads/socialpe-ac5ad-firebase-adminsdk-b38yv-6005b4e6be.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://socialpe-ac5ad.firebaseio.com'
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello wordl!');
});

exports.getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection('screams')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push(doc.data());
      });
      return res.json(screams);
    })
    .catch(error => console.log(error));
});

exports.createScreams = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: `Method  not allowed` });
  }
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createAt: admin.firestore.Timestamp.fromDate(new Date())
  };
  admin
    .firestore()
    .collection('screams')
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(error => {
      res.status(500).json({ error: `something went wrong` }), console.error(error);
    });
});
