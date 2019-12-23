const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllScreams, postOneScreams } = require('./handlers/screams');
const { signUp, login } = require('./handlers/users');

//Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScreams);

//  Users routes
app.post('/signup', signUp);
app.post('/login', login);

exports.api = functions.region('us-east4').https.onRequest(app);
