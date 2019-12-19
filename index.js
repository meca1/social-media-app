const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const serviceAccount = require('/Users/danielramos/Downloads/socialpe-ac5ad-firebase-adminsdk-b38yv-6005b4e6be.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://socialpe-ac5ad.firebaseio.com'
});

const db = admin.firestore();
// admin.initializeApp()

const firebaseConfig = {
  apiKey: 'AIzaSyCizLn-_jVI5_2KqGev3qoFCxn7qQy8Eys',
  authDomain: 'socialpe-ac5ad.firebaseapp.com',
  databaseURL: 'https://socialpe-ac5ad.firebaseio.com',
  projectId: 'socialpe-ac5ad',
  storageBucket: 'socialpe-ac5ad.appspot.com',
  messagingSenderId: '868263047082',
  appId: '1:868263047082:web:5d6d767b908d27509bc5d3',
  measurementId: 'G-7MSPL3B29E'
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

app.get('/screams', (req, res) => {
  db.collection('screams')
    .orderBy('createAt', 'desc')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createAt: doc.data().createAt
        });
      });
      return res.json(screams);
    })
    .catch(error => console.log(error));
});

app.post('/scream', (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createAt: new Date().toISOString()
  };
  db.collection('screams')
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(error => {
      res.status(500).json({ error: `something went wrong` }), console.error(error);
    });
});

//  Signup route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  // TODO validate data
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      return doc.exists
        ? res.status(400).json({ handle: `this handle is already taken` })
        : firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createAt: new Date().toISOString(),
        userId
      };
      db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.log(err);
      return err.code === 'auth/email-already-in-use'
        ? res.status(400).json({ email: 'Email is already is use' })
        : res.status(500).json({ error: err.code });
    });
});
exports.api = functions.region('us-east4').https.onRequest(app);
