import express from "express";
import bodyParser from "body-parser";
import path from "path";
import morgan from "morgan";

const app = express();
const router = express.Router();
const DEBUG = process.env.NODE_ENV !== 'production';
const PORT = DEBUG ? '3000' : process.env.PORT;

app.use(express.static(__dirname + '/../../public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/test', function(req, res) {
    res.sendStatus(200);
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

    console.log("pasó")
        
});

const server = app.listen(PORT, function () {
    console.log('Express listening on port %s', PORT);
});
