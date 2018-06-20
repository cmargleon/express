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

export async function registerGraduate(cardId, graduateRut,firstName, lastName, email, phoneNumber) {
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
