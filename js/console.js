 var input_ = $('#input');
 var output_ = $('output');
 var inputText_ = $('#input input');

 input_.keydown(processCommand);

 $(window).click(function(e) {
     inputText_[0].focus();
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
tabularCommandPrint +=	tablify(["CD", "Changes directory to the target"]);
tabularCommandPrint +=	tablify(["DATE", "Displays the current date on this machine"]);
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
         var line = this.cloneNode(true);
         line.removeAttribute('id')
         line.classList.add('line');
         var input = line.querySelector('input');
         input.autofocus = false;
         input.readOnly = true;
         output_.append(line);

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