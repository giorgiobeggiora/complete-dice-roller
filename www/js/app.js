/*
 * Please see the included README.md file for license terms and conditions.
 */


// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */


// For improved debugging and maintenance of your app, it is highly
// recommended that you separate your JavaScript from your HTML files.
// Use the addEventListener() method to associate events with DOM elements.

// For example:

// var el ;
// el = document.getElementById("id_myButton") ;
// el.addEventListener("click", myEventHandler, false) ;



// The function below is an example of the best way to "start" your app.
// This example is calling the standard Cordova "hide splashscreen" function.
// You can add other code to it or add additional functions that are triggered
// by the same event or other events.

var myapp={};

function onAppReady() {
	myapp.init();
    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
}
document.addEventListener("app.Ready", onAppReady, false) ;
// document.addEventListener("deviceready", onAppReady, false) ;
// document.addEventListener("onload", onAppReady, false) ;

// The app.Ready event shown above is generated by the init-dev.js file; it
// unifies a variety of common "ready" events. See the init-dev.js file for
// more details. You can use a different event to start your app, instead of
// this event. A few examples are shown in the sample code above. If you are
// using Cordova plugins you need to either use this app.Ready event or the
// standard Crordova deviceready event. Others will either not work or will
// work poorly.

// NOTE: change "dev.LOG" in "init-dev.js" to "true" to enable some console.log
// messages that can help you debug Cordova app initialization issues.

myapp.init = function(){
	
	function calculatorPageListeners(){
		var kb=document.querySelectorAll('.character');
		for(var i=0;i<kb.length;i++){
			var c=kb[i];
			if(!c.disabled)c.addEventListener('touchend',keyboardButton);
		}
		document.getElementById('resetButton').addEventListener('touchend',function(){
			document.getElementById('formula').value='';
		});
		document.getElementById('backspaceButton').addEventListener('touchend',function(){
			keyboardButton('backspace');
		});
		document.getElementById('rollButton').addEventListener('touchend',function(){
			keyboardButton('rollButton');
		});
		var rolls=document.querySelectorAll('#test button');
		for(var i=0,l=rolls.length;i<l;i++){
			rolls[i].addEventListener('touchend',function(){
				document.getElementById('formula').value=this.innerHTML;
				keyboardButton('rollButton');
			});
		}
		
		var native_keyboard=localStorage.getItem('native_keyboard');
		if(native_keyboard==null){
			native_keyboard=true;
			localStorage.setItem('native_keyboard',1);
		}else{
			native_keyboard=native_keyboard*1===1;
		}
		document.getElementById('formula').readOnly = !native_keyboard;
		
	}
	
	function optionsPageListeners(){
		console.log(localStorage.getItem('native_keyboard'));
		var native_keyboard=localStorage.getItem('native_keyboard');
		if(native_keyboard==null){
			native_keyboard=true;
			localStorage.setItem('native_keyboard',0);
		}else{
			native_keyboard=native_keyboard*1===1;
		}
		console.log(localStorage.getItem('native_keyboard'));
		if(native_keyboard)document.getElementById('native_keyboard').className+=' active';

	}
	
	document.body.addEventListener('toggle',function(event){
		var target=event.target;
		switch(target.id){
			case'native_keyboard':
				localStorage.setItem('native_keyboard',event.detail.isActive*1);
			break;
		}
	});
	
	window.addEventListener('push',function(){
		if(document.getElementById('page-options')){
			
			optionsPageListeners();
			
		}else if(document.getElementById('page-calculator')){
			
			calculatorPageListeners();

		}
	});
	
	calculatorPageListeners();
	
	//PUSH({url:'calculator.html'});
}

function keyboardButton(){
	var el=document.getElementById('formula');
	var val=el.value;
	var sel_start=el.selectionStart;
	var sel_end=el.selectionEnd;
	var key=typeof arguments[0]=='string'?arguments[0]:this.innerHTML;
	if(key=='backspace'){
		if(sel_start==sel_end){
			el.value=val.substring(0,sel_start-1)+val.substring(sel_end);
			el.selectionStart=sel_start-1;
			el.selectionEnd=sel_start-1;
		}else{
			el.value=val.substring(0,sel_start)+val.substring(sel_end);
			el.selectionStart=sel_start;
			el.selectionEnd=sel_start;
		}
	}else if(key=='rollButton'){
		var f=el.value;
		console.log('---------------------------------------------------------------');
		var r=roll(f);
		document.getElementById('result').innerHTML=r[0]+' = '+r[1];
		console.log(f);
		console.log(r);
	}else{
		var key_length=key.length;
		el.value=val.substring(0,sel_start)+key+val.substring(sel_end);
		el.selectionStart=sel_start+key_length;
		el.selectionEnd=sel_start+key_length;
	}
	el.focus();
}