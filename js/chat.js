var socket=io();
socket.emit('logged','');
var logged=true;

	//arrivo Messaggio
	socket.on('mex', function(msg) {
		document.getElementById("chatBox").innerHTML = document.getElementById("chatBox").innerHTML + msg + "<br \>";
		var ta = document.getElementById('chatBox');
		ta.scrollTop = ta.scrollHeight;
	});
	
	//arrivo Utenti
	socket.on('utenti', function(nomi) {
		document.getElementById("boxUtenti").value = nomi;
	});


var maxMsg=0;
var tx;

//funzione invio messaggi
function inviaMSG(t) {
	var messaggio = document.getElementById("testo").value;
	
	if (messaggio == "\n") {
        document.getElementById("testo").value = "";
    }
	else if (logged && t==13) {
		maxMsg++;
		
		clearInterval(tx);
		tx = setInterval(function () {maxMsg=0}, 5000);
			
		if (maxMsg <= 8 && messaggio != "\n" &&  messaggio != "") {
			
			socket.emit('msg', messaggio);
		}
		else if (maxMsg > 8 && messaggio != "\n" &&  messaggio != "") {
			document.getElementById("chatBox").innerHTML = document.getElementById("chatBox").innerHTML + "NON SPAMMARE, aspetta 5 secondi!" + "<br />";
					var ta = document.getElementById('chatBox');
					ta.scrollTop = ta.scrollHeight;
		}
		document.getElementById("testo").value = ""
	}
}

function checkRefresh()
{
	if( document.refreshForm.visited.value == "" )
	{
		// This is a fresh page load
		document.refreshForm.visited.value = "1";

		// You may want to add code here special for
		// fresh page loads
	}
	else
	{
		// This is a page refresh

		// Insert code here representing what to do on
		// a refresh
	}
}