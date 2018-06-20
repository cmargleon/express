import express from "express";
import bodyParser from "body-parser";
import path from "path";
import morgan from "morgan";
//import { registerGraduate } from './network/network.js' // ES modules
//var network = require('./network/network.js');
/*
const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//declate namespace
const namespace = 'org.degree.ucsd';

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'degree';
let factory;
*/
const app = express();
const router = express.Router();
const DEBUG = process.env.NODE_ENV !== 'production';
const PORT = DEBUG ? '3000' : process.env.PORT;
//var network = require('./network/network.js');

app.use(express.static(__dirname + '/../../public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/test', function(req, res) {
    res.sendStatus(200);
});

app.get('/test2', function(req, res) {
    res.send("funciona");
});

//post call to register graduate on the network
app.post('/api/registerGraduate', function(req, res) {
    console.log("Creando cuenta graduado");
    console.log(req.body);
    var graduateRut = req.body.graduaterut;
    var cardId = req.body.cardid;
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var email = req.body.email;
    var phoneNumber = req.body.phonenumber;

    console.log("pasó");
    /*
    network.registerGraduate(cardId, graduateRut, firstName, lastName, email, phoneNumber)
                .then((response) => {
                    //return error if error in response
                    if (response.error != null) {
                    res.json({
                        error: response.error
                    });
                    } else {
                    //else return success
                    res.json({
                        success: response
                    });
                    }
                });
        */
});

app.post('/api/registerGraduate2', function(req, res) {
    console.log("Creando cuenta graduado");
    res.sendStatus(200);
    console.log(req.body);
    var graduateRut = req.body.graduaterut;
    var cardId = req.body.cardid;
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var email = req.body.email;
    var phoneNumber = req.body.phonenumber;

    console.log("pasó");
    res.sendStatus(200);
        
});

const server = app.listen(PORT, function () {
    console.log('Express listening on port %s', PORT);
});
