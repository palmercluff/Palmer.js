var marginTop = 5;
var user = 'palmer@palmercluff.com'
var currentDirectory = '';
var userLine = ''
var original_sample = {
    'name':'~',
    'type':'dir',
    'contents':[
	{
	    "name": "file1",
	    "type": "text",
	    "contents": "Hello",
	    "description": "1st file"
	},
	{
	    "name": "file2",
	    "type": "text",
	    "contents": "World!",
	    "description": "2nd file"
	},
	{
	    "name": "javascript_image",
	    "type": "img",
	    "contents": "Javascript.png",
	    "description": "1st image file"
	},
	{
	    "name": "Palmer_Cluff_Github",
	    "type": "link",
	    "contents": "https://github.com/palmercluff",
	    "description": "External link to GitHub account"
	},
	{
	    "name": "dir1",
	    "type": "dir",
	    "contents": [
		{
		    "name": "file3",
		    "type": "text",
		    "contents": "Game",
		    "description": "3rd file"
		},
		{
		    "name": "file4",
		    "type": "text",
		    "contents": "Over!",
		    "description": "4th file"
		},
		{
		    "name": "dir2",
		    "type": "dir",
		    "contents": [
			{
			    "name": "file5",
			    "type": "text",
			    "contents": "Blah",
			    "description": "5th file"
			},
			{
			    "name": "dir3",
			    "type": "dir",
			    "contents": [
				{
				    "name": "file6",
				    "type": "text",
				    "contents": "Blah blah blah",
				    "description": "6th file"
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
    this.version = 'Alpha';
    this.codeName = 'Tottori';
    this.inputField;

    getRootDirectory(sample);

    var terminal = document.createElement('div');
    terminal.style.cssText = 'width:500px;height:500px;background-color:grey;';
    terminal.id = 'terminal';
    document.body.appendChild(terminal);

    var inputField = document.createElement('input');
    inputField.style.cssText = 'position:absolute;outline:none;border:none;display:block;color:red;background-color:grey;opacity:0;z-index:-100;';
    inputField.id = 'inputField';
    inputField.style.marginTop = marginTop + 'px';
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
	    br.style.cssText = 'line-height:140%;';
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
		output.style.cssText = 'color:black;font-size:16px;font-family:monospace;white-space:pre-wrap;';
		output.className = 'output';
		output.innerHTML = result;
		terminal.appendChild(output);
	    }
	    
	    var inputField = document.getElementById('inputField');
	    inputField.value = '';
	    marginTop += 50;
	    inputField.style.marginTop = marginTop + 'px';

	    var inputDisplay = document.createElement('span');
	    inputDisplay.style.cssText = 'display:inline-block;float:left;font-family:monospace;white-space:pre-wrap;font-size:16px;';
	    inputDisplay.id = 'inputDisplay';
	    inputDisplay.textContent = userLine;
	    terminal.appendChild(inputDisplay);

	    var cursor = document.createElement('span');
	    cursor.style.cssText = 'position:fixed;background-color:white;width:10px;height:20px;float:left;';
	    cursor.id = 'cursor';
	    terminal.appendChild(cursor);
	}
	else{
	    setTimeout(function(){
		document.getElementById('inputDisplay').textContent = userLine + this.inputField.value;
	    }, 10);
	}
    }
    terminal.appendChild(inputField);
    this.inputField = inputField;

    var inputDisplay = document.createElement('span');
    inputDisplay.style.cssText = 'display:inline-block;float:left;font-family:monospace;white-space:pre-wrap;font-size:16px;';
    inputDisplay.id = 'inputDisplay';
    inputDisplay.textContent = userLine;
    terminal.appendChild(inputDisplay);

    var cursor = document.createElement('span');
    cursor.style.cssText = 'position:fixed;background-color:white;width:10px;height:20px;float:left;';
    cursor.id = 'cursor';
    terminal.appendChild(cursor);

    startBlinkingCursor();

    document.getElementById('inputField').focus();
    
    this.bell = function(){
	var audio = new Audio('beep.mp3');
	audio.play();
    }
    
    this.log = function(data){
	console.log(data);
    }
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
	marginTop = 5;
	return null;
    }

    else if (array[0] === 'echo'){
	if (array.length === 1){
	    return '<br style="line-height:140%">';
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
	return 'Commands are:<br style="line-height:140%;">bell browser cat cd clear echo exit gimp help ls pwd touch';
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
	var dlAnchorElem = document.getElementById('downloadAnchorElem');
	dlAnchorElem.setAttribute("href",     dataStr     );
	dlAnchorElem.setAttribute("download", "saved_filesystem.json");
	dlAnchorElem.click();
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
    currentDirectory = filesystem.name;
    userLine = user + ':' + currentDirectory + '$ ';
}
