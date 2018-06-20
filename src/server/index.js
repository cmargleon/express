import express from "express";
import bodyParser from "body-parser";
import path from "path";
import morgan from "morgan";

const app = express();
const router = express.Router();
const DEBUG = process.env.NODE_ENV !== 'production';
const PORT = DEBUG ? '3000' : process.env.PORT;
//var network = require('./network/network.js');

//NETWORK

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


app.use(express.static(__dirname + '/../../public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//ASYNC FUNCTIONS

/*
 * Import card for an identity
 * @param {String} cardName The card name to use for this identity
 * @param {Object} identity The identity details
 */
async function importCardForIdentity(cardName, identity) {

    //use admin connection
    adminConnection = new AdminConnection();
    businessNetworkName = 'degree';
  
    //declare metadata
    const metadata = {
        userName: identity.userID,
        version: 1,
        enrollmentSecret: identity.userSecret,
        businessNetwork: businessNetworkName
    };
  
    //get connectionProfile from json, create Idcard
    const connectionProfile = require('./local_connection.json');
    const card = new IdCard(metadata, connectionProfile);
  
    //import card
    await adminConnection.importCard(cardName, card);
  }

  /*
    * Create Graduate participant and import card for identity
    * @param {String} cardId Import card id for Graduate
    * @param {String} graduateRut Graduate account number as identifier on network
    * @param {String} firstName Graduate first name
    * @param {String} lastName Graduate last name
    * @param {String} phoneNumber Graduate phone number
    * @param {String} email Graduate email
    */
   async function registerGraduate(cardId, graduateRut,firstName, lastName, email, phoneNumber) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@degree');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create graduate participant
      const graduate = factory.newResource(namespace, 'Graduate', graduateRut);
      graduate.firstName = firstName;
      graduate.lastName = lastName;
      graduate.email = email;
      graduate.phoneNumber = phoneNumber;
      

      //add graduate participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Graduate');
      await participantRegistry.add(graduate);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Graduate#' + graduateRut, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@degree');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  }

  

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
    
    registerGraduate(cardId, graduateRut, firstName, lastName, email, phoneNumber)
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
