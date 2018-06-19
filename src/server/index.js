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

app.get('/test2', function(req, res) {
    res.send("200");
});

app.get('/test3', function(req, res) {
    res.sendStatus(200).send("funciona");
});

const server = app.listen(PORT, function () {
    console.log('Express listening on port %s', PORT);
});
