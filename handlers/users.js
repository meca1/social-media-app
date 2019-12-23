const { db } = require('../util/admin');
const firebaseConfig = require('../util/config');
const firebase = require('firebase');
const { validateSignUpData, validateLoginDta} = require('../util/validators')

firebase.initializeApp(firebaseConfig);

exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  const {valid, errors} = validateSignUpData(newUser) 

  if (!valid) return res.status(400).json(errors)
  // // TODO validate data
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
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  
  const {valid, errors} = validateLoginUpData(newUser) 
  
  if (!valid) return res.status(400).json(errors)
  
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        return res.status(403).json({ general: 'Wrong credentials, please try again' });
      } else return res.status(500).json({ error: err.code });
    });
};
