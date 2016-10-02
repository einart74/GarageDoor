       
		var imgSource = "https://rawgit.com/einart74/GarageDoor/master/src/data/img/" ;
	   	   
		var pingPongTimer = 0;
		var pingPongCounter = 0;

		var ws;
		
		var $downloadingDoorImage = $("<img>");
		$downloadingDoorImage.load(function(){
			$('#door').attr("src", $(this).attr("src"));	
		});
		
		var $downloadingLightImage = $("<img>");
		$downloadingLightImage.load(function(){
			$('#light').attr("src", $(this).attr("src"));	
		});
							
					
        function log(msg) {
          //  document.getElementById('msg').innerHTML += msg + '<br />';
			console.log( msg );
        }
		
        function start() {
			log('connecting...');
			
			// clear pingPongTimer
			if (window.pingPongTimer) {
				window.clearInterval(window.pingPongTimer);
				window.pingPongTimer = 0;
			} 
			pingPongCounter = 0;
				
            var parser = document.createElement('a');
            parser.href = document.URL;
			var websocketServerLocation = 'ws://' + parser.hostname + '/ws';
			
			log('websocketServerLocation: ' + websocketServerLocation);		
            

            ws = new WebSocket(websocketServerLocation);
            ws.onopen = function () {
                log('connected');
				/*
				// clear re-connection timer..
                if (window.connectionTimer) {
                    window.clearInterval(window.connectionTimer);
                    window.connectionTimer = 0;
                } 
				*/
				// enable ping-pong timer..
				if (!window.pingPongTimer) { 
					window.pingPongTimer = setInterval(function () { ping() }, 1000);
				}
            };
			/*
            ws.onclose = function () {
                log('disconnected');
				// if no re-connection timer exists, add one...
                if (!window.connectionTimer) { 
                    window.connectionTimer = setInterval(function () { start(websocketServerLocation) }, 100);
                }
				
				if (window.pingPongTimer) {
                    window.clearInterval(window.pingPongTimer);
                    window.pingPongTimer = 0;
                } 
            };
			*/
            ws.onmessage = function (e) {
				var message = e.data.trim();
				if (message.startsWith("pong"))
				{ 
					 log('pong received...');
					pingPongCounter--;
				} 
				else if (message.startsWith("Door"))
				{ 
					log('Door status received...');
					$downloadingDoorImage.attr("src", imgSource.concat("/garageDoor-", message.substring(5), ".gif"));
				} else if (message.startsWith("Light"))
				{
					log('Light status received...');
					$downloadingLightImage.attr("src", imgSource.concat("/ligth-", message.substring(6), ".gif"));
				}  
            };
			
        }
		 function ping() {

			// check pingpong counter..
			if (pingPongCounter !== 0)
			{
				// missed pong... connection issues..
				log('connection lost');
				ws.close();
				start()
				return;
			}
			
			// send ping...
			pingPongCounter++;
			
			// send ping...
			if (ws.readyState !== 1) return; 
			log('Sending ping');
            ws.send('ping');
        }	
		
        function door() {
			// send door
            if (ws.readyState !== 1) return; 
			log('Sending Door command');
            ws.send('door');
        }
		
        function light() {
			// send light
            if (ws.readyState !== 1) return;
			log('Sending Light command');
            ws.send('light');
        } 
		
$( document ).ready(function() {
    console.log( "ready!" );
	start();
});