 var input_ = $('.input');
 var output_ = $('output');
 var inputText_ = $('.input input');
 var container_clone = $('.container').clone();
 var curr_focus_container = $('.container');

	 
		curr_focus_container.css({
		 'border-color' : 'blue'
	 	});
		
 input_.keydown(processCommand);

 $('body').click(function(e) {	 
	 inputText_.focus();
 });
 
 $('body').on('click', '.container', function(e) {
	 e.stopPropagation();
	 
	 if (curr_focus_container != null) {
		 curr_focus_container.css({
		 	'border-color' : 'red'
	 	});
	 }
	 
		$(this).css({
		 'border-color' : 'blue'
	 	});
		
		curr_focus_container = $(this);
	 	output_ = curr_focus_container.children('output');
		
		inputText_.focus();
 });
 
 $('output').bind('DOMSubtreeModified', function(e) {
     setTimeout(function() {
         inputText_[0].scrollIntoView();
     }, 0);
 });

 function clearConsole(input) {
     output_.html('');
     inputText_.val('');
     document.documentElement.style.height = '100%';
 }

 function printHtml(html) {
     output_[0].insertAdjacentHTML('beforeEnd', html);
     inputText_[0].scrollIntoView();
 }

var commands = [];
 
commands["about"] = function (args) {
	 printHtml("consol3 based on " + '<a href=\"http://www.htmlfivewow.com/demos/terminal/terminal.html\">HTML5 Terminal</a>');
};

commands["clear"] = function (args) {
	clearConsole(inputText_);
};

commands["cd"] = function (args) {
	window.location.href = args[0];
};

commands["bcolor"] = function (args) {
	$('html').css({
		'background' : args[0]	
	});
	$('body').css({
		'background' : args[0]	
	});
};


commands["fcolor"] = function (args) {
	$('output').css({
		'color' : args[0]	
	});
	$('.line').css({
		'color' : args[0]	
	});
	$('table').css({
		'color' : args[0]	
	});
};

commands["split"] = function (args) {
	var insertAfterThis = $('.container').last();
	insertAfterThis.after(container_clone.clone());
};


function tablify (row) {
	var row_string = "<tr>";
	for (var i = 0; i < row.length; i++) {
		row_string += "<td>";
		row_string += row[i];
		row_string += "</td>";
	}
	row_string += "</tr>";
	
	return row_string;
}

commands["date"] = function (args) {
	 printHtml((new Date()).toLocaleString());
};

	var dirPrint = "<table>";
	dirPrint +=	tablify(["NAME", "SIZE", "DATE MODIFIIED"]);
	dirPrint +=	tablify(["[parent directory]", "", ""]);
	dirPrint +=	tablify([".git/", "", "--"]);
	dirPrint +=	tablify(["css/", "", "--"]);
	dirPrint +=	tablify(["js/", "", "--"]);
	dirPrint +=	tablify(["index.html", "755 B", "--"]);
	dirPrint +=	tablify(["README.md", "0 B", "--"]);
	dirPrint += "</table>";   
	
commands["dir"] = function (args) {
	       printHtml(dirPrint);
}

var tabularCommandPrint = "<table>";
tabularCommandPrint +=	tablify(["ABOUT", "Displays about the console"]);
tabularCommandPrint +=	tablify(["CLEAR", "Clears the console"]);
tabularCommandPrint +=	tablify(["CD [dir]", "Changes directory to the target"]);
tabularCommandPrint +=	tablify(["DATE", "Displays the current date on this machine"]);
tabularCommandPrint +=	tablify(["BCOLOR [color]", "Changes the background color"]);
tabularCommandPrint +=	tablify(["FCOLOR [color]", "Changes the font color"]);
tabularCommandPrint +=	tablify(["SPLIT", "Launches a new console container"]);
tabularCommandPrint += "</table>";

commands["help"] = function (args) {
	 printHtml(tabularCommandPrint);
};


 function processCommand(e) {
     /* Ignore empty input and BACKSPACES */
     if (!inputText_.val() && e.keyCode == 8) {
         return;
     }

     if (e.keyCode == 9) { /* TAB */
         e.preventDefault();

     } else if (e.keyCode == 13) { /* ENTER */
         var divInput = $(this).clone();
		 divInput.removeClass('fixed-bottom');
		 var input = divInput.find('input')[0];
         input.autofocus = false;
         input.readOnly = true;
         output_.append(divInput);

         if (inputText_.val() && inputText_.val().trim()) {
             var args = inputText_.val().split(' ').filter(function(val, i) {
                 return val;
             });
             var cmd = args[0].toLowerCase();
             args = args.splice(1);
         }
		
		 var callback = commands[cmd];
		 
		 if (typeof callback == 'undefined') { // command does not exist
         	printHtml(cmd + ': command not found');
		 }
		 else {
			 callback(args);
		 }

         inputText_.val('');
     }
 }