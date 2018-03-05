var user;
var currentDirectory = '';
var userLine = ''
var version = 'Alpha';
var codeName = 'Tottori';
var inputField;
var original_sample = {
    'user':'palmer',
    'name':'~',
    'type':'dir',
    'contents':[
	{
	    "name": "file1",
	    "type": "text",
	    "contents": "Hello"
	},
	{
	    "name": "file2",
	    "type": "text",
	    "contents": "World!"
	},
	{
	    "name": "javascript_image",
	    "type": "img",
	    "contents": "Javascript.png"
	},
	{
	    "name": "Palmer_Cluff_Github",
	    "type": "link",
	    "contents": "https://github.com/palmercluff"
	},
	{
	    "name": "dir1",
	    "type": "dir",
	    "contents": [
		{
		    "name": "file3",
		    "type": "text",
		    "contents": "Game"
		},
		{
		    "name": "file4",
		    "type": "text",
		    "contents": "Over!"
		},
		{
		    "name": "dir2",
		    "type": "dir",
		    "contents": [
			{
			    "name": "file5",
			    "type": "text",
			    "contents": "Blah"
			},
			{
			    "name": "dir3",
			    "type": "dir",
			    "contents": [
				{
				    "name": "file6",
				    "type": "text",
				    "contents": "Blah blah blah"
				},
			    ]
			}
		    ]
		}
	    ]
	}
    ]
}

var sample = original_sample;
var previous_directories = [];

function PalmerJS(){

    getRootDirectory(sample);

    document.body.style.backgroundColor = "black";

    var terminal = document.createElement('div');
    terminal.style.cssText = 'width:100%;height:100%;';
    terminal.id = 'terminal';
    document.body.appendChild(terminal);

    inputField = document.createElement('input');
    inputField.style.cssText = 'position:fixed;outline:none;border:none;display:block;color:red;background-color:grey;opacity:0;z-index:-100;bottom:0px';
    inputField.id = 'inputField';
    inputField.onblur = function(){
	this.focus();
    }
    inputField.onkeydown = function(e){
	if (e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40 || e.which === 9) {
	    e.preventDefault()
	}
	else if(e.which === 13){
	    var terminal = document.getElementById('terminal');
	    
	    var br = document.createElement('br');
	    br.style.cssText = 'line-height:130%;';
	    terminal.appendChild(br);

	    var cursor = document.getElementById('cursor');
	    cursor.removeAttribute('id');
	    cursor.style.display = 'none';
	    cursor.className = 'old-cursor';

	    var inputDisplay = document.getElementById('inputDisplay');
	    inputDisplay.removeAttribute('id');
	    inputDisplay.className = 'old-input-display';

	    var result = processInput(document.getElementById('inputField').value);

	    if (result != null){
		var output = document.createElement('div');
		output.style.cssText = 'color:white;font-size:16px;font-family:monospace;white-space:pre-wrap;';
		output.className = 'output';
		output.innerHTML = result;
		terminal.appendChild(output);
	    }
	    
	    inputField = document.getElementById('inputField');
	    inputField.value = '';

	    var inputDisplay = document.createElement('span');
	    inputDisplay.style.cssText = 'color:white;display:inline-block;float:left;font-family:monospace;white-space:pre-wrap;font-size:16px;';
	    inputDisplay.id = 'inputDisplay';
	    inputDisplay.textContent = userLine;
	    terminal.appendChild(inputDisplay);

	    var cursor = document.createElement('span');
	    cursor.style.cssText = 'background-color:white;width:10px;height:20px;float:left;';
	    cursor.id = 'cursor';
	    terminal.appendChild(cursor);
	}
	else{
	    setTimeout(function(){
		document.getElementById('inputDisplay').textContent = userLine + inputField.value;
	    }, 10);
	}

	window.scrollTo(0,document.body.scrollHeight);
    }
    terminal.appendChild(inputField);

    var output = document.createElement('div');
    output.style.cssText = 'color:white;font-size:16px;font-family:monospace;white-space:pre-wrap;';
    output.className = 'output';
    output.innerHTML = motd();
    terminal.appendChild(output);

    var inputDisplay = document.createElement('span');
    inputDisplay.style.cssText = 'color:white;display:inline-block;float:left;font-family:monospace;white-space:pre-wrap;font-size:16px;';
    inputDisplay.id = 'inputDisplay';
    inputDisplay.textContent = userLine;
    terminal.appendChild(inputDisplay);

    var cursor = document.createElement('span');
    cursor.style.cssText = 'background-color:white;width:10px;height:20px;float:left;';
    cursor.id = 'cursor';
    terminal.appendChild(cursor);

    startBlinkingCursor();

    document.getElementById('inputField').focus();
}

function startBlinkingCursor(){
    var showCursor = true;
    setInterval(function(){
	if (showCursor){
	    document.getElementById('cursor').style.display = 'inline-block';
	}
	else{
	    document.getElementById('cursor').style.display = 'none';
	}
	showCursor = !showCursor;
    }, 500);
}

function processInput(str){
    var array = str.split(/(\s+)/).filter(function(e){
	return e.trim().length > 0;
    });

    if (array[0] == null){
	return null;
    }

    else if (array[0] === 'bell'){
	var audio = new Audio('beep.mp3');
	audio.play();
	return null;
    }

    else if (array[0] === 'browser'){
	for (var key in sample){
	    if (key === 'contents'){
		var temp = sample[key];
		for (var i = 0; i < temp.length; i++){
		    if (array[1] === temp[i].name && temp[i].type === 'link'){
			window.open(temp[i].contents, '_blank');
			return null;
		    }
		}
	    }
	}
	return 'browser: ' + array[1] + ': is not a link file';
    }

    else if (array[0] === 'cat'){
	for (var key in sample){
	    if (key === 'contents'){
		var temp = sample[key];
		for (var i = 0; i < temp.length; i++){
		    if (array[1] === temp[i].name && temp[i].type === 'text'){
			return temp[i].contents;
		    }
		}
	    }
	}
	return 'cat: ' + array[1] + ': No such file';
    }

    else if (array[0] === 'cd'){
	if (array[1] == null){
	    sample = original_sample;
	    currentDirectory = sample.name;
	    userLine = user + ':' + currentDirectory + '$ ';
	    return null;
	}

	else if (array[1] === '..' || array[1] === '../'){
	    var currentDirectoryLength = sample.name.length;
	    if (sample.name === '~'){
		return null;
	    }
	    if (previous_directories.length === 1){
		currentDirectory = currentDirectory.substring(0, currentDirectory.length - (currentDirectoryLength + 2));
	    }
	    else{
		currentDirectory = currentDirectory.substring(0, currentDirectory.length - (currentDirectoryLength + 1));
	    }
	    sample = previous_directories[previous_directories.length - 1];
	    previous_directories.pop();
	    userLine = user + ':' + currentDirectory + '$ ';
	    return null;
	}
	
	for (var key in sample){
	    if (key === 'contents'){
		var temp = sample[key];
		for (var i = 0; i < temp.length; i++){
		    if (array[1] === temp[i].name && temp[i].type === 'dir'){
			previous_directories.push(sample);
			if (currentDirectory === '~'){
			    currentDirectory += '/' + temp[i].name + '/';
			}
			else{
			    currentDirectory += temp[i].name + '/';
			}
			userLine = user + ':' + currentDirectory + '$ ';
			sample = temp[i];
			return null;
		    }
		}
	    }
	}

	return '-bash: cd: ' + array[1] + ': No such directory';
    }

    else if (array[0] === 'clear'){
	var breaks = document.getElementsByTagName('br');
	while(breaks.length > 0){
	    breaks[0].parentNode.removeChild(breaks[0]);
	}
	var outputs = document.getElementsByClassName('output');
	while(outputs.length > 0){
	    outputs[0].parentNode.removeChild(outputs[0]);
	}
	var oldCursors = document.getElementsByClassName('old-cursor');
	while(oldCursors.length > 0){
	    oldCursors[0].parentNode.removeChild(oldCursors[0]);
	}
	var oldInputDisplays = document.getElementsByClassName('old-input-display');
	while(oldInputDisplays.length > 0){
	    oldInputDisplays[0].parentNode.removeChild(oldInputDisplays[0]);
	}
	
	return null;
    }

    else if (array[0] === 'echo'){
	if (array.length === 1){
	    return '<br style="line-height:130%">';
	}
	if (array[2] === '>' && array[3] != null){
	    for (var key in sample){
		if (key === 'contents'){
		    var temp = sample[key];
		    for (var i = 0; i < temp.length; i++){
			if (array[3] === temp[i].name && temp[i].type === 'text'){
			    sample.contents[i].contents = array[1];
			    return null;
			}
		    }
		}
	    }
	}
	return array[1];
    }

    else if (array[0] === 'exit'){
	window.location = 'http://www.palmercluff.com';
    }

    else if (array[0] === 'gimp'){
	for (var key in sample){
	    if (key === 'contents'){
		var temp = sample[key];
		for (var i = 0; i < temp.length; i++){
		    if (array[1] === temp[i].name && temp[i].type === 'img'){
			return '<img src="' + temp[i].contents + '">';
		    }
		}
	    }
	}
	return 'gimp: ' + array[1] + ': is not an image file';
    }

    else if (array[0] === 'help'){
	return 'Commands are:<br>bell browser cat cd clear echo exit gimp help ls pwd save touch';
    }

    else if (array[0] === 'ls'){
	var str = '';
	for (var key in sample){
	    if (key === 'contents'){
		var temp = sample[key];
		for (var i = 0; i < temp.length; i++){
		    str += temp[i].name + ' ';
		}
	    }
	}
	return str;
    }

    else if (array[0] === 'pwd'){
	return currentDirectory;
    }

    else if (array[0] === 'save'){
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sample));
	var downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href",     dataStr);
	downloadAnchorNode.setAttribute("download", "saved_filesystem.json");
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
    }

    else if (array[0] === 'touch'){
	if (array.length === 1){
	    return 'touch: missing file operand';
	}
	
	sample.contents.push({
	    "name": array[1],
	    "type": "text",
	    "contents": ""
	});
	return null;
    }

    else{
	return '-bash: ' + array[0] + ': command not found';
    }
}

function getRootDirectory(filesystem){
    console.log(filesystem);
    user = filesystem.user + '@palmercluff.com'
    currentDirectory = filesystem.name;
    userLine = user + ':' + currentDirectory + '$ ';
}

function motd(){
    return " ____   __    __    __  __  ____  ____     ____  ___ <br>(  _ \\ /__\\  (  )  (  \\/  )( ___)(  _ \\   (_  _)/ __)<br> )___//(__)\\  )(__  )    (  )__)  )   /  .-_)(  \\__ \\<br>(__) (__)(__)(____)(_/\\/\\_)(____)(_)\\_)()\\____) (___/<br>Version Alpha<br><br>";
}
