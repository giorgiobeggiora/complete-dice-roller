
var indent={
	current:0,
	add:function(){
		indent.current+=1;
	},
	del:function(){
		indent.current-=1;
	},
	get:function(){
		var i=window.indent.current;
		var indent='';
		while(i--){
			indent+='    ';
		}
		return indent;
	}
}	

function trimRoll(f) {
    return f.replace(/[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]/g, '');
}

function joinArray(arr1,arr2){
	var result=[],
		l1=arr1.length,
		l2=arr2.length
	;
	if(l2=l1-1){
		for(var i=0;i<l2;i++){
			result.push(arr1[i]);
			result.push(arr2[i]);
		}
		result.push(arr1[arr2.length]);
		return result.join('');
	}else{
		return null;
	}
}

function keep_check(f){
	var re=/\d+k\d+/g;
	return f.match(re);
}
function keep_calc(f,m){
	var re=/\d+k\d+/g;
	var results=[];
	for(var g=0;g<m.length;g++){
		var digits=m[g].split('k');
		var q=digits[0]*1;
		var k=digits[1]*1;
		if(q>0&&k>0){
			results.push(digits[0]+'d10+H'+digits[1]);
		}else{
			results.push(m[g]);
		}
	}
	f=joinArray(f.split(re),results);
	return f;
}
function d(s){
	return 1+Math.floor(Math.random()*s);
}
function dice_check(f){
	var re=/(\d+)d(\d+|F)/g;
	return f.match(re);
}
function dice_calc(f,m){
	var re=/\d+d(?:\d+|F)/g;
	var results=[];
	for(var g=0;g<m.length;g++){
		var digits=m[g].split('d');
		var fudge=digits[1]==='F'?2:0;
		var q=digits[0]*1;
		var s=fudge?3:digits[1]*1;
		if(q!=0&&s!=0){
			var r=[];
			for(var i=0;i<q;i++){
				r.push(d(s)-fudge);
			}
			results.push('['+r.join()+']d'+digits[1]);
		};
	};
	f=joinArray(f.split(re),results);
	return f;
}

function results_check(f){
	var re=/\[[\d,\-]*\]/g;
	return f.match(re);
}
function results_calc(f,m){
	var re=/\[[\d,\-]*\]/g;
	var results=[];
	for(var g=0;g<m.length;g++){
		var digits=m[g].split(']')[0].match(/-{0,1}\d+/g);
		var sum=0;
		for(var i=0,l=digits.length;i<l;i++){
			sum+=digits[i]*1;
		}
		results.push(sum);
	}
	newFormula=joinArray(f.split(re),results);
	return newFormula;
}

function doTheMath(f){
	indent.add();
	console.log(indent.get()+'math ( -->',f);
	var re=/^[\+\-\*\/\.\d\(\)]*$/g;
	if(re.test(f)){
		indent.add();
		console.log(indent.get()+'math ! -->',f);
		try{eval('f='+f);}catch(e){}
		indent.del();
	}
	console.log(indent.get()+'math ) -->',f);
	indent.del();
	return f;
}

function parentheses_check(f){
	var re=/\([^()]*\)/g;
	return f.match(re);
}
function parentheses_calc(f,m){
	var re=/\([^()]*\)/g;
	var r=[];
	for(var i=0,l=m.length;i<l;i++){
		var p=m[i];
		p=roll_unit_1(p);
		r.push(p);
	}
	f=joinArray(f.split(re),r);
	return f;
}

function hilo_check(f){
	var re=/(\[[\d,-]*\])(\+|\-)(H|L)(\d*)/g;
	return f.match(re);
}
function hilo_calc(f,m){
	var re=/\[[\d,-]*\][\+\-][HL]\d*/g;
	var i=m.length;
	var r=[];
	while(i--){
		if(m[i].indexOf('L')!=-1){
			var letter='L';
			var mm='min';
		}else{
			var letter='H';
			var mm='max';
		}
		if(m[i].indexOf('-')!=-1){
			var sign='-';
		}else{
			var sign='+';
		}			
		var rolled=m[i].split(']')[0].match(/\d+/g);
		var sides=m[i].split(']')[1].split(/[\+\-]/)[0];
		var q=m[i].split(letter)[1];
		q=q==''?1:(q*1);
		q=Math.min(q,rolled.length);
		
		var collected=[];
		while(q--){
			var minmax=null,minmax_index=-1,l=rolled.length;
			while(l--){
				if(minmax==null){
					minmax=rolled[l];
					minmax_index=l;
				}else{
					var check=Math[mm](rolled[l],minmax);
					if(check!=minmax){
						minmax=check;
						minmax_index=l;
					}
				}
			}
			if(sign=='-'){
				collected=rolled;//reference!
			}else{
				collected.push(rolled[minmax_index]);
			}
			rolled.splice(minmax_index,1);
		}
		r.push('['+collected.join()+']');
	}
	var xxx=f.split(re);
	f=joinArray(xxx,r);
	return f;
}

function sufa_check(f){
	var re=/(\[[\d,-]*\])(\+|\-)(S|F)(\d*)/g;
	return f.match(re);
}
function sufa_calc(f,m){
	var re=/\[[\d,-]*\][\+\-][SF]\d*/g;
	var i=m.length;
	var r=[];
	while(i--){
		if(m[i].indexOf('S')!=-1){
			var letter='S';
		}else{
			var letter='F';
		}
		if(m[i].indexOf('-')!=-1){
			var sign='-';
		}else{
			var sign='+';
		}			
		var v=m[i].split(/[\+\-][SF]/)[1];
		v=v==''?8:(v*1);
		var rolled=m[i].split(']')[0].match(/\d+/g),l=rolled.length;
		var count=0;
		if(letter=='S'){
			if(sign=='+'){
				// +Sx returns >= x
				while(l--){
					if(rolled[l]>=v)count++;
				}
			}else{
				// -Sx returns < x
				while(l--){
					if(rolled[l]<v)count++;
				}
			}
		}else{
			if(sign=='+'){
				// +Fx returns <= x
				while(l--){
					if(rolled[l]<=v)count++;
				}
			}else{
				// -Fx returns > x
				while(l--){
					if(rolled[l]>v)count++;
				}
			}
		}
		r.push(count);
	}
	var xxx=f.split(re);
	f=joinArray(xxx,r);
	return f;
}

function all_regexp(){
	var re=/\[([\d,\-]+)\]d(\d+|F)(([+\-][HLRSF]\d*)*)/g;
	return re;
}
function all_calc(f,m){
	var rolls=m[1].split(',');
	var sides=m[2]*1;
	var re=/([+-])([HLRSF])(\d*)/g;
	var actions=[],act;
	while( (act = re.exec(m[3])) !== null ){
		if (act.index === re.lastIndex) {
			re.lastIndex++;
		};
		actions.push(act);
	};
	if(actions.length){
		//check reroll
		var l=actions.length;
		var reroll_found=false;
		for(var i=0;i<l;i++){
			var action=actions[i],
				action_sign=action[1],
				action_type=action[2],
				action_value=action[3]?(action[3]*1):(action_sign==='-'?1:10)
			;
			if(action_type==='R'){
				if(!reroll_found){
					reroll_found=true;
					var actions_reroll_indexes = [];
					var actions_reroll_drop = [];
					var actions_reroll_keep = [];
				}
				actions_reroll_indexes.push(i);
				if(action_sign==='-'){
					actions_reroll_drop.push(action_value);
				}else{
					actions_reroll_keep.push(action_value);
				}
				var j=rolls.length;
				while(j--){
					rolls[j]*=1;
					while(actions_reroll_drop.indexOf(rolls[j])!=-1){
						var newRoll=d(sides);
						rolls[j]=newRoll;
					}
					var lastRoll=rolls[j];
					var sumRoll=lastRoll;
					while(actions_reroll_keep.indexOf(lastRoll)!=-1){
						lastRoll=d(sides);
						sumRoll+=lastRoll;
					}
					rolls[j]=sumRoll;
				}
			}
		};
		if(reroll_found){
			var i=actions_reroll_indexes.length;
			while(i--){
				actions.splice(actions_reroll_indexes[i],1);
			};
		}
	}
	
	var result='['+rolls.join()+']',l=actions.length;
	for(var i=0;i<actions.length;i++){
		result+=actions[i][0];
	}
	
	var resplit=/\[[\d,\-]+\]d(?:\d|F)+(?:[+\-][HLRSF]\d*)*/;
	f=f.replace(resplit,result);
	return f;
}
function roll_unit_1(f){
	// -------------------------------------------------------------
	indent.add();
	console.log(indent.get()+'keep ( -->',f);
	var m=keep_check(f);
	if(m){
		indent.add();
		console.log(indent.get()+'keep ! -->',f);
		f=keep_calc(f,m);
		indent.del();
	}
	console.log(indent.get()+'keep ) -->',f);
	indent.del();
	// -------------------------------------------------------------
	indent.add();
	console.log(indent.get()+'dice ( -->',f);
	var m=dice_check(f);
	if(m){
		indent.add();
		console.log(indent.get()+'dice ! -->',f);
		f=dice_calc(f,m);
		indent.del();
	}
	console.log(indent.get()+'dice ) -->',f);
	indent.del();
	// -------------------------------------------------------------
	indent.add();
	console.log(indent.get()+'all  ( -->',f);
	
		indent.add();
		console.log(indent.get()+'all ! -->',f);
		var re = /\[([\d,\-]+)\]d(\d+|F)(([+\-][HLRSF]\d*)*)/g; 
		var str=f;
		var m;
		 
		while ((m = re.exec(str)) !== null) {
			if (m.index === re.lastIndex) {
				re.lastIndex++;
			}
		   console.log(f,m)
			f=all_calc(f,m);
		}
		
		indent.del();
	
	console.log(indent.get()+'all ) -->',f);
	indent.del();
	/*
	indent.add();
	console.log(indent.get()+'merg ( -->',f);
	f=f.replace(/\]\+\[/g,',');
	if(f.match(/^\(\[[\d,-]*\]\)$/)){
		f=f.replace(/\(\[/,'[');
		f=f.replace(/\]\)/,']');
	}
	console.log(indent.get()+'merg ) -->',f);
	indent.del();
	*/
	// -------------------------------------------------------------
	return f;
}
function roll_unit_2(f){
	// -------------------------------------------------------------
	indent.add();
	console.log(indent.get()+'hilo  ( -->',f);
	var m=hilo_check(f);
	if(m){
		indent.add();
		console.log(indent.get()+'hilo ! -->',f);
		f=hilo_calc(f,m);
		indent.del();
	}
	console.log(indent.get()+'hilo ) -->',f);
	indent.del();
	// -------------------------------------------------------------
	indent.add();
	console.log(indent.get()+'sufa  ( -->',f);
	var m=sufa_check(f);
	if(m){
		indent.add();
		console.log(indent.get()+'sufa ! -->',f);
		f=sufa_calc(f,m);
		indent.del();
	}
	console.log(indent.get()+'sufa ) -->',f);
	indent.del();
	// -------------------------------------------------------------
	return f;
}
function roll(f){
	f=trimRoll(f);
	F=f;
	var debug_count=0;
	var re1=/[R]/;
	var re2=/\d+[dk](\d+|F)/g;
	while(re1.test(f)||re2.test(f)){
		indent.add();
		console.log(indent.get()+'pare ( -->',f);
		var m=parentheses_check(f);
		/*if(m){
			indent.add();
			console.log(indent.get()+'pare ! -->',f);
			f=parentheses_calc(f,m);
			indent.del();
		}else{*/
			f=roll_unit_1(f);
		/*}*/
		console.log(indent.get()+'pare ) -->',f);
		indent.del();
		debug_count++;
		if(debug_count==5){
			console.error('BREAK DEBUG');
			break;
		}
	}
	
	var result_with_rolls=f;
	
	var debug_count=0;
	var re1=/[LHSF]/;
	while(re1.test(f)){
		indent.add();
		console.log(indent.get()+'pare 2 ( -->',f);
		var m=parentheses_check(f);
		/*if(m){
			indent.add();
			console.log(indent.get()+'pare ! -->',f);
			f=parentheses_calc(f,m);
			indent.del();
		}else{*/
			f=roll_unit_2(f);
		/*}*/
		console.log(indent.get()+'pare 2 ) -->',f);
		indent.del();
		debug_count++;
		if(debug_count==5){
			console.error('BREAK DEBUG 2');
			break;
		}
	}
	// -------------------------------------------------------------
	indent.add();
	console.log(indent.get()+'resu ( -->',f);
	var m=results_check(f);
	if(m){
		indent.add();
		console.log(indent.get()+'resu ! -->',f);
		f=results_calc(f,m);
		indent.del();
	}
	console.log(indent.get()+'resu ) -->',f);
	indent.del();
	// -------------------------------------------------------------
	var result=doTheMath(f);
	return [result,result_with_rolls];
}
