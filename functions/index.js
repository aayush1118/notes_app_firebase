const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
const methodOverride = require("method-override");
// const bodyParser     = require("body-parser");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-1-a8cdf.firebaseio.com"
});

const db = admin.firestore();

// app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));

app.get('/' ,(req,res)=>{
    res.redirect('./notes');
});

// create
app.post('/notes', (req, res) => {
    (async () => {
        try {
            // let content = req.body.content;
            // let author = req.body.author;
            await db.collection('notes').doc()
                .create({note: req.body.content , author : req.body.author});
            return res.redirect('./notes');
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    })();
});


// read all
app.get('/notes', (req, res) => {
    (async () => {
        try {
            let query = db.collection('notes');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        content: doc.data().note,
                        author: doc.data().author
                    }
                    response.push(selectedItem);
                }    return null;
                });
            return res.render('index' ,{notes :response});
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    })();
});

// update
app.put('/notes/update/:note_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('notes').doc(req.params.note_id);
        await document.update({
            note: req.body.note
        });
        return res.redirect('/test-1-a8cdf/us-central1/app/notes');
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
    })();
});

// delete
app.delete('/notes/delete/:note_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('notes').doc(req.params.note_id);
        await document.delete();
        return res.redirect('back');
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
    })();
});

exports.app = functions.https.onRequest(app);