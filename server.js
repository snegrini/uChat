var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Utenti = new Array();
var nUtenti=0;

app.use('/js', express.static('js')); // load js folder
app.use('/css', express.static('css')); // load css folder
app.use('/img', express.static('img')); // load img folder

app.get('/chat', function(req, res){
	res.sendFile(__dirname + '/chat.html');
});

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


http.listen(1010, function(){
  console.log('Aperto sulla porta *:1010');
});

var ut = function(s, n, x) {

	this.ip=x;
	this.sid=s;
	this.nome=n;
	this.maxMsg=0;
	this.onChat=false;
	
	this.getSID = function(){
		console.log(this.sid);
	}
}

//funzione invia utenti
function inviaUtenti(){
		utenti="";
		for(var i=0;i<nUtenti;i++)
		{
			utenti = utenti + Utenti[i].nome + "\n";
		}
		io.emit('utenti',utenti);
}

//utente disconnesso
io.on('connection', function(socket){
	  socket.on('disconnect', function(){
		console.log('Tizio disconnesso!');
		
			for(var i=0;i<nUtenti;i++)
			{
				if(Utenti[i].sid == socket.id && Utenti[i].onChat==true){
					for(var j=i;j<nUtenti-1;j++)
					{
						Utenti[j]=Utenti[j+1];
					}
					nUtenti=nUtenti-1;
				}
			}
			inviaUtenti();
	  });
});

//ricevo nome
io.on('connection', function(socket){
	  socket.on('nome', function(n){
			console.log('test');
			Utenti[nUtenti] = new ut(socket.id, n ,socket.handshake.address);
			console.log("----------------------------------");
			console.log('Tizio connesso!');
			console.log('nome: ' + Utenti[nUtenti].nome);
			console.log('IP: ' + Utenti[nUtenti].ip);
			console.log("----------------------------------");
			nUtenti=nUtenti+1;
			inviaUtenti();
			console.log("utenti online: " + nUtenti);
			
	});
});

//ricevo messaggio
io.on('connection', function(socket){
	  socket.on('msg', function(text){
	  
		for(var i=0;i<nUtenti;i++)
		{
			if(Utenti[i].sid == socket.id){
				 testo = " <b> " + Utenti[i].nome + ": " + "</b>" + text;
				 console.log(Utenti[i].nome + ": " + text)
				 io.emit('mex',testo);
				 Utenti[i].maxMsg++;
			}
		}
	});
});

//utente entra in chat
io.on('connection', function(socket){
	  socket.on('logged', function(x){
		for(var i=0;i<nUtenti;i++)
		{
			if(Utenti[i].ip == socket.handshake.address && Utenti[i].onChat==false){
				console.log(Utenti[i].sid);
				Utenti[i].sid=socket.id;
				inviaUtenti();
				Utenti[i].onChat=true;
			}
		}
	});
});