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
var phrases14 = require('./phrases14');
var phrases15 = require('./phrases15');
var phrases16 = require('./phrases16');
var phrases17 = require('./phrases17');
var names = require('./names');
var ejs = require('ejs');
var watson = require('watson-developer-cloud');


//var bootstrap = require('bootstrap');

// For local development, replace username and password
var textToSpeech = watson.text_to_speech({
  version: 'v1',
  username: '647eef5c-131c-40ad-a7bf-f39b024306bb',
  password: 'MMcJeTYiJsGx'
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
	var args = { locals: { pa: req.query.pa, pb: req.query.pb }, phrases14: phrases14, phrases16: phrases16 };
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
		args.phrasesleft = empty;
		args.phrasesright = phrases15;
		res.render('interface', args);
	}else{
		args.phrasesleft = empty;
		args.phrasesright = empty;
		res.render('interface', args);
	}
})

function getFileName(phrase){
	var filename = __dirname + '/public/audio/' + phrase + '.wav';
	return filename;
}

app.get('/audio/:phrase.wav', function(req, res){
	//console.log(res);
	console.log(req.params.phrase);
	var phrase = req.params.phrase;
	var filename = getFileName(phrase);
	if(fs.existsSync(filename)){
		console.log('File exists');
		res.sendFile(filename);
	} else {
		getAudio(phrase, function(){ res.sendFile(filename); });
	}
	
});

app.get('/allaudio', function(req,res){
	var pa = req.query.pa;
	var pb = req.query.pb;
	// var count = 0;
	// console.log('attempting to download all');
	// for (var i = 1; i < 18; i++){
	// 	var phrases = eval("phrases" + i);
	// 	for (var j = 0; j < phrases.length; j++){
	// 		console.log(j);
	// 		phrase = phrases[j].replace(/<participantA>/g, pa);
	// 		phrase = phrase.replace(/<participantB>/g, pb);
	// 		var filename = getFileName(phrase);
	// 		if(!(fs.existsSync(filename))){
	// 			count++;

	// 		    setTimeout(function()
	// 		    {
	// 		        getAudio(phrase, function(){ 
	// 					count--;
	// 					console.log('downloaded a file: ' + count);
	// 					if (count == 0){
	// 						res.send('Done downloading with ' + pa + ' and ' + pb);
	// 					}
	// 				});
	// 		    }, 500 * count);
	// 		}
	// 	}
	// }
	downloada_b(pa, pb, res, 0);
});

//var testString = '<nonsense>';
//testString = testString.replace(/<nonsense>/g, 'some sense');
//console.log(testString);

app.listen(3000, function(){
	console.log('started on 3000');
})

var username = '647eef5c-131c-40ad-a7bf-f39b024306bb';
var password = 'MMcJeTYiJsGx';
var urlStart = "https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=en-US_AllisonVoice"
var urlEnd = "&voice=es-ES_EnriqueVoice";
var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

function getAudio(text, finishCallback){
	console.log('starting to download: ' + text);
	var url = urlStart;
	//console.log(url);

	var body = '{ "text": "<speak><prosody pitch=\\"+10Hz\\"><prosody rate=\\"-10.0%\\">' + text + '</prosody></prosody></speak>" }';
	//console.log('Getting audio for ' + text);

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
	    		if (res.body.includes('<HTML><BODY>') || res.body.includes('Forwarding error')){
	    			console.log('Did not download '+ text);
	    		}else{
			    	fs.writeFileSync('public/audio/' + text + '.wav', res.body);
			    	if(finishCallback){
				    	finishCallback();
				    }
				}
		    }

		    if(err){
		    	console.log(err);
		    }
	    }
	);
}

app.get('/downloadnames', function(req, res){
	downloadAll(res);
});

function downloadAll(res){
	
		for(var k=0 ; k < names.length; k++){
			var pa = names[k];
			var pb = names[k];
			downloada_b(pa, pb, res, 1);
		}
	
}

function downloada_b(pa, pb, res, int){
	var count = 0;
	console.log('attempting to download all');
	for (var i = 1; i < 18; i++){
		var phrases = eval("phrases" + i);
		for (var j = 0; j < phrases.length; j++){
			// console.log(j);
			var phrase = phrases[j].replace(/<participantA>/g, pa);
			phrase = phrase.replace(/<participantB>/g, pb);
			var filename = getFileName(phrase);
			if(!(fs.existsSync(filename))){
				console.log('initiating download: ' + phrase);
				count++;
			    setTimeout(function(phrase)
			    {
			        getAudio(phrase, function(){ 
			        	if(int == 0){
							count--;
							console.log('downloaded a file: ' + count);
							if (count == 0){
								res.send('Done downloading with ' + pa + ' and ' + pb);
							}
						}else{
							count--;
							console.log('downloaded a file: ' + count);
						}
					});
			    }, 500 * count, phrase);
			} else {
				console.log('not downloading: ' + phrase);
			}
		}
	}
}






