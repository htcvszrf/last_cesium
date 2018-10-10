var WS = null, WSNAME = null;
var WSURL = 'ws://192.168.0.80:8084'
var SEND = null; //我添加的	
function NewWS(url, name){
    var ws = {};
    var socket = new WebSocket(url);
    socket.onopen = function(event) {
        send({type:'login', name: name});
        socket.onmessage = function(event) {
        	if(WSNAME!='pc')return;
            ws.onmessage && ws.onmessage(event.data);
        };
        socket.onclose = function(event) {
            ws.onclose && ws.onclose(event);
        };
        socket.onerror = function(event) {
            ws.onerror && ws.onerror(event);
        };
        ws.onload && ws.onload();
    }
    ws.send = send;
    function send(json) {
        socket.send(JSON.stringify(json));
    }
    ws.close = function () {
        socket.close();
    }
    ws.connection = socket;

    return ws;
}

function WS_pc(back) {
	WSNAME = 'pc'
	//debugger;
	WS = NewWS(WSURL, 'pc') 
	WS.onmessage = function(message) {
			var json = JSON.parse(message)
	        switch(json.type) {
	            case 'callback' :
	                if(json.data && json.data.ctrl) {
	                	back && back(json.data.ctrl, json.json)
	                }
	                break;
	        }
	    }
}
function WS_phone() {
	WSNAME = 'phone'
	WS = NewWS(WSURL, 'phone') 
	return function(ctrl, json) {
		setTimeout(function() {
			WS.send({type: "call", json:json||{}, data: {ctrl: ctrl}})
		},300)
		
	}
}
/*function checkLeave(){
	debugger
	send = WS_phone();
}*/

/*

function WS(url, name){
	    var ws = {};
	    var socket = new WebSocket(url);
	    socket.onopen = function(event) {
	        send({type:'login', name: name});
	        socket.onmessage = function(event) {
	            ws.onmessage && ws.onmessage(event.data);
	        };
	        socket.onclose = function(event) {
	            ws.onclose && ws.onclose(event);
	        };
	        socket.onerror = function(event) {
	            ws.onerror && ws.onerror(event);
	        };
	        ws.onload && ws.onload();
	    }
	    ws.send = send;
	    function send(json) {
	        socket.send(JSON.stringify(json));
	    }
	    ws.close = function () {
	        socket.close();
	    }
	    ws.connection = socket;

	    return ws;
	}
    $(function() {
    	
    	var ws = WS('ws://192.168.0.80:8084', 'phone')
    	
    	
    	
    	$('#btnnn').click(function() {
    		ws.send({type: "call", data: {ctrl: "romm"}})
    		gis.mapManager.map.zoomIn()
    	})
    	//被控制
    	
    })
    
    
    if(1) {
		var ws = WS('ws://192.168.0.80:8084', 'pc')
	    ws.onmessage = function(message) {
			var json = JSON.parse(message)
	        switch(json.type) {
	            case 'callback' :
	                if(json.data && json.data.ctrl) {
	                    switch(json.data.ctrl) {
	                    	case "romm":
	                    		gis.mapManager.map.zoomIn()
	                    	break
	                        case "up":
	                            
	                            break;
	                        case "down":
	                            
	                            break
	                        case "left":
	                            
	                            break
	                        case "right":
	                            
	                            break
	                    }
	                }
	                break;
	        }
	    }
}
    
    */
