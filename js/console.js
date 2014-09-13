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

commands["date"] = function (args) {
	 printHtml((new Date()).toLocaleString());
};

var tabularCommandPrint = "<table>";
tabularCommandPrint += "<tr><td>" + 	"ABOUT" 	+ "</td>" + "<td>" + "Displays about the console" + "</td></tr>";
tabularCommandPrint += "<tr><td>" + 	"CLEAR" 	+ "</td>" + "<td>" + "Clears the console" + "</td></tr>";
tabularCommandPrint += "<tr><td>" + 	"CD" 		+ "</td>" + "<td>" + "Changes directory to the target" + "</td></tr>";
tabularCommandPrint += "<tr><td>" + 	"DATE" 		+ "</td>" + "<td>" + "Displays the current date on this machine" + "</td></tr>";
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