var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var path = require('path');

var speech_to_text = new SpeechToTextV1 ({
  username: '1be8ec3f-266f-4e20-80f1-28574750003c',
  password: 'HgPcg6cZRt2Q'
});

var service = {};
service.sendAudio = sendAudio;

module.exports = service;


function getSession(){
    speech_to_text.createSession({}, function(error, session) {
    if (error)
        console.log('Error:', error);
    else
        console.log(JSON.stringify(session, null, 2));
        return JSON.stringify(session, null, 2);
    });
}

function sendAudio(){
    //console.log(path.join(__dirname, 'audio.mp3'))
    return new Promise( ( resolve, reject ) => {
        var params = {
        'session_id': getSession(),
        audio: fs.createReadStream(path.join(__dirname, 'audio.mp3')),
        'content_type': 'audio/mp3',
        'max_alternatives': 0,
        'word_confidence': false
        //keywords: ['pizza'],
        //'keywords_threshold': 0.5
        };

        speech_to_text.recognize(params, function(error, transcript) {
            if (error){
                //console.log('Error:', error);
                return reject( error );
            }
            else{
                //console.log(JSON.stringify(transcript, null, 2));
                return resolve(transcript);
            }
        });
    } );
}