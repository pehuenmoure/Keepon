var express = require('express');
var server = require('http').Server(app);
var fs = require('fs');
var request = require('request');
var app = express();
var phrases1 = require('./phrases1');
var phrases2 = require('./phrases2');
var phrases3 = require('./phrases3');
var phrases4 = require('./phrases4');
var phrases5 = require('./phrases5');
var phrases6 = require('./phrases6');
var phrases7 = require('./phrases7');
var phrases8 = require('./phrases8');
var phrases9 = require('./phrases9');
var phrases10 = require('./phrases10');
var phrases11 = require('./phrases11');
var phrases12 = require('./phrases12');
var phrases13 = require('./phrases13');
var commonphrases = require('./phrases14');
var phrases15 = require('./phrases15');
var names = require('./names');
var ejs = require('ejs');
var watson = require('watson-developer-cloud');
//var bootstrap = require('bootstrap');

// For local development, replace username and password
var textToSpeech = watson.text_to_speech({
  version: 'v1',
  username: 'af239344-9e16-45b4-993a-248330151028',
  password: 'td1Jik07E1FM'
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var empty = [];

app.get('/', function(req, res){
	// res.sendFile('public/index.html');
	//res.render('interface.ejs');
	var f = fs.readFileSync(__dirname + '/views/interface.ejs', 'utf-8');
	//console.log(f);
	var args = { locals: { pa: req.query.pa, pb: req.query.pb }, commonphrases: commonphrases };
	if(req.query.type == 'intro'){
		args.phrasesleft = phrases1;
		args.phrasesright = phrases2;
		res.render('interface', args);
	} else if (req.query.type == 'drawing') {
		args.phrasesleft = phrases3;
		args.phrasesright = phrases4;
		res.render('interface', args);
	}else if (req.query.type == 'lego') {
		args.phrasesleft = phrases5;
		args.phrasesright = phrases6;
		res.render('interface', args);
	}else if (req.query.type == 'conflict') {
		args.phrasesleft = phrases7;
		args.phrasesright = phrases8;
		res.render('interface', args);
	}else if (req.query.type == 'confAna') {
		args.phrasesleft = phrases9;
		args.phrasesright = phrases10;
		res.render('interface', args);
	}else if (req.query.type == 'confRes') {
		args.phrasesleft = phrases11;
		args.phrasesright = phrases12;
		res.render('interface', args);
	}else if (req.query.type == 'termination') {
		args.phrasesleft = phrases13;
		args.phrasesright = empty;
		res.render('interface', args);
	}else if (req.query.type == 'context-specific') {
		args.phrasesleft = phrases14;
		args.phrasesright = phrases15;
		res.render('interface', args);
	}else{
		args.phrasesleft = empty;
		args.phrasesright = empty;
		res.render('interface', args);
	}
})

app.get('/audio/:phrase.wav', function(req, res){
	console.log(req.url);
	//console.log(res);
	console.log(req.params.phrase);
	var phrase = req.params.phrase;
	var filename = __dirname + '/public/audio/' + phrase + '.wav';
	if(fs.existsSync(filename)){
		res.sendFile(filename);
	} else {
		getAudio(phrase, function(){ res.sendFile(filename); });
	}
});

app.listen(3000, function(){
	console.log('started on 3000');
})

var username = 'af239344-9e16-45b4-993a-248330151028';
var password = 'td1Jik07E1FM';
var urlStart = "https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=en-US_AllisonVoice"
var urlEnd = "&voice=es-ES_EnriqueVoice";
var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

function getAudio(text, finishCallback){
	var url = urlStart;
	console.log(url);

	var body = '{ "text": "<speak><prosody pitch=\\"+30Hz\\"><prosody rate=\\"-10.0%\\">' + text + '</prosody></prosody></speak>" }';
	console.log(body);

	//var stream = fs.createWriteStream('public/audio/' + 'test' +'.wav');
	request.post({
	        url : url,
	        headers : {
	        	'content-type': 'application/json',
	            "Authorization" : auth,
	            'Accept': 'audio/wav'
	        },
	        body: body,
	        //voice: ,
	        encoding: null
	    },
	    function(err, res){
	    	if(res){
		    	fs.writeFileSync('public/audio/' + text + '.wav', res.body);
		    	if(finishCallback){
			    	finishCallback();
			    }
		    }

		    if(err){
		    	console.log(err);
		    }
	    }
	);
}