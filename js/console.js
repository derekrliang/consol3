 $(document).ready(function() {
 	/* DOM Elements */
 	var input_ = $('.input');
 	var output_ = $('output');
 	var inputText_ = $('.input input');
 	var container_clone = $('.container').clone();
 	var curr_focus_container = $('.container');
	
 	/* DOM Event Binds */
 	input_.keydown(processCommand);
 	$('body').click(function(e) {
 		inputText_.focus();
 	});
	
	function selectContainer_(container) {
 		if(curr_focus_container != null) {
 			curr_focus_container.removeClass('cont-selected');
 		}
 		curr_focus_container = container;
 		curr_focus_container.addClass('cont-selected');
 		output_ = curr_focus_container.children('output');
 		inputText_.focus();		
	}
	
	function selectContainer(e) {
		e.stopPropagation();
 		if(curr_focus_container != null) {
 			curr_focus_container.removeClass('cont-selected');
 		}
 		curr_focus_container = $(this);
 		curr_focus_container.addClass('cont-selected');
 		output_ = curr_focus_container.children('output');
 		inputText_.focus();	
	}
	
 	$('body').on('click', '.container', selectContainer);
	
 	/* Console Variables */
 	var containerIndex = 0;
 	var containerHistory = [];
 	var historyIndex = -1;
	
 	/* Initialize the first container */
 	containerHistory[0] = new Array();
 	curr_focus_container.addClass('cont-selected');
	curr_focus_container.children().first().append("<div>master-console[id=" + containerIndex + "]</div>");

 	function clearConsole(input) {
 		output_.html('');
 		inputText_.val('');
 		document.documentElement.style.height = '100%';
 	}

 	function printHtml(html) {
		output_.append(html);
 	}
	
 	var commands = [];
	
 	commands["about"] = function(args) {
 		printHtml("consol3 inspired by " + '<a href=\"http://www.htmlfivewow.com/demos/terminal/terminal.html\">HTML5 Terminal</a>. Copyright (c) 2014 Derek Liang. All rights reserved.');
 	};
	
 	commands["clear"] = function(args) {
		if (args.length > 0) {
			if (args[0] == "all") {
				for (var i = 0; i <= containerIndex; ++i) {
					commands["sel"]([i]);
					clearConsole(inputText_);
				}
			}
		}
		clearConsole(inputText_);
 	};
	
 	commands["cd"] = function(args) {
 		window.location.href = args[0];
 	};
	
 	commands["bcolor"] = function(args) {
 		curr_focus_container.css({
 			'background': args[0]
 		});
 	};
	
 	commands["fcolor"] = function(args) {
 		curr_focus_container.css({
 			'color': args[0]
 		});
 	};
	
	commands["width"] = function(args) {
		if (args.length > 0) {
			curr_focus_container.css({
				'width': args[0]
			});
		} else {
			printHtml("takes in one argument of size px");	
		}
 	};
	
	commands["height"] = function(args) {
		if (args.length > 0) {
			curr_focus_container.css({
				'height': args[0]
			});
		} else {
			printHtml("takes in one argument of size px");	
		}
 	};
	
 	commands["split"] = function(args) {		
		// var insertAfterThis = $('.container').last();
 		var insertAfterThis = $('.container').last()[0];
		var split_num = 1;
		
		if (args.length > 0) {
			split_num =  args[0];
		}
		
		var startTime = new Date();
		
		/* Here lies the old, slow JQuery code. Left for reference.
			Split time for 10000 consoles took: 1159ms 
			Split time for 10000 consoles took: 1135ms

		for (var i = 0; i < split_num; ++i) {
			// Clone the basic container
			var newContainer = container_clone.clone();
			
			// Add an unique id div displaying it to the user.
			++containerIndex
			newContainer.children().first().append("<div>console[id=" + containerIndex + "]</div>");
			insertAfterThis.after(newContainer);
			containerHistory[containerIndex] = new Array();
			insertAfterThis = newContainer;
		}
		*/
		
		/* Native JavaScript
			Split time for 10000 consoles took: 159ms 
			Split time for 10000 consoles took: 164ms
		*/
		
		for (var i = 0; i < split_num; ++i) {
			++containerIndex
			
			// Cloning DOM elements is very expensive. Instead, we just use a template string of the DOM we want to create.
			// insertAdjacentHTML (standardized in HTML 5 along with innerHTML) is way faster.
			
			insertAfterThis.insertAdjacentHTML('afterEnd',
			 "<div class=\"container\"><output>console[id=" + containerIndex + "]</output></div>");
			 
			containerHistory[containerIndex] = new Array();
			
			// Get next sibling since we don't have a DOM Object.
			insertAfterThis = insertAfterThis.nextSibling;
		}
		
		var endTime = new Date();
		console.log("Split time for " + split_num + " consoles took: " + (endTime - startTime) + "ms");
 	};
	
	commands["goto"] = function(args) {
		// If any arguments, pass it through 'sel' to select that console before scrolling to it.
		commands["sel"](args);
		$('html, body').animate({
			scrollTop: curr_focus_container.offset().top
		}, 2000);
	};
	
	commands["sel"] = function(args) {
		if (args.length > 0) {
			selectContainer_($($('.container').get(args[0])));
		}
	};
	
	commands["this"] = function(args) {
		var console_index = curr_focus_container.index();
		
		if (console_index == 0) {
			printHtml("<div>master-console[id=" + console_index + "]</div>");
		} else {
			printHtml("<div>console[id=" + console_index + "]</div>");
		}
	};
	
	var imageSearch;
	var page = 1;
	var thumbnails = true;
	var maxPages = 1;
	commands["image"] = function(args) {
		// Refer to: https://developers.google.com/image-search/v1/devguide
		if (args.length > 2 && (args[0] == "google" || args[0] == "google+")) {
			var startIndex = 2;

			if (args[0] == "google+") {
				thumbnails = false;
			}
			
			maxPages = args[1];

			var searchquery = "";
			for (var i = startIndex; i < args.length; i++) {
				searchquery += args[i] + " ";
			}
			
			console.log("searchq: " + searchquery);
			
			imageSearch = new google.search.ImageSearch();
			imageSearch.setSearchCompleteCallback(this, function(e) {
				console.log("google search complete!");

				if (imageSearch.results && imageSearch.results.length > 0) {
				  var results = imageSearch.results;
				  console.log("results: " + results.length);
				  for (var i = 0; i < results.length; i++) {
					var result = results[i];
					
					if (thumbnails) {
						printHtml("<img src=\"" + result.tbUrl + "\" />");
					} else {
						printHtml("<img src=\"" + result.url + "\" />");
					}
				  }
				}
				
				if (page < maxPages) {
					imageSearch.gotoPage(page);
					page++;
				} else {
					page = 1;
					maxPages = 1;
					thumbnails = true;
					imageSearch.clearResults();
				}
			}, null);
			
			imageSearch.setResultSetSize(google.search.Search.LARGE_RESULTSET);
			imageSearch.execute(searchquery);
		} else if (args.length > 0 && args[0]) {
			printHtml("<img src=\"" + args[0] + "\" />");
		}
	};

 	function tablify(row) {
 		var row_string = "<tr>";
 		for(var i = 0; i < row.length; i++) {
 			row_string += "<td>";
 			row_string += row[i];
 			row_string += "</td>";
 		}
 		row_string += "</tr>";
 		return row_string;
 	}
 	commands["date"] = function(args) {
 		printHtml((new Date()).toLocaleString());
 	};
 	var dirPrint = "<table>";
 	dirPrint += tablify(["NAME", "SIZE", "DATE MODIFIIED"]);
 	dirPrint += tablify(["[parent directory]", "", ""]);
 	dirPrint += tablify([".git/", "", "--"]);
 	dirPrint += tablify(["css/", "", "--"]);
 	dirPrint += tablify(["js/", "", "--"]);
 	dirPrint += tablify(["index.html", "755 B", "--"]);
 	dirPrint += tablify(["README.md", "0 B", "--"]);
 	dirPrint += "</table>";
 	commands["dir"] = function(args) {
 		printHtml(dirPrint);
 	}
 	var tabularCommandPrint = "<table>";
 	tabularCommandPrint += tablify(["ABOUT", "Displays about the console"]);
 	tabularCommandPrint += tablify(["CLEAR", "Clears the console"]);
 	tabularCommandPrint += tablify(["CD [dir]", "Changes directory to the target"]);
 	tabularCommandPrint += tablify(["DATE", "Displays the current date on this machine"]);
 	tabularCommandPrint += tablify(["BCOLOR [color]", "Changes the background color"]);
 	tabularCommandPrint += tablify(["FCOLOR [color]", "Changes the font color"]);
 	tabularCommandPrint += tablify(["SPLIT", "Launches a new console container"]);
	tabularCommandPrint += tablify(["GOTO", "Scrolls to the selected container, or given index."]);
	tabularCommandPrint += tablify(["SEL", "Selects given console id."]);
	tabularCommandPrint += tablify(["THIS", "Displays container information."]);
	tabularCommandPrint += tablify(["IMAGE google #{PAGES} searchQuery", "Displays a google image search for up pages * 8, with cap at 64 images."]);
	tabularCommandPrint += tablify(["IMAGE url", "Displays the image."]);
 	tabularCommandPrint += "</table>";
 	commands["help"] = function(args) {
 		printHtml(tabularCommandPrint);
 	};

 	function processCommand(e) {
 		/* Ignore empty input and BACKSPACES */
 		if(!inputText_.val() && e.keyCode == 8) {
 			return;
 		}
 		if(e.keyCode == 9) { /* TAB */
 			e.preventDefault();
 		} else if(e.keyCode == 38) { /* UP ARROW */
 			/* Sets the input value, when incrementing history (reset on ENTER) */
 			var current_container_index = curr_focus_container.index()
 			var history = containerHistory[current_container_index];
 			if(history.length > 0) {
 				if(historyIndex != history.length) {
 					inputText_.val(history[history.length - historyIndex - 1]);
 					historyIndex++;
 				}
 			}
 		} else if(e.keyCode == 40) { /* DOWN ARROW */
 			/* Sets the input value, when decrementing history (reset on ENTER) */
 			var current_container_index = curr_focus_container.index()
 			var history = containerHistory[current_container_index];
 			if(history.length > 0) {
 				if(historyIndex > 0) {
 					historyIndex--;
 					inputText_.val(history[history.length - historyIndex - 1]);
 				}
 			}
 		} else if(e.keyCode == 13) { /* ENTER */
		
		 	/* Save the input text into the container's history list */
 			var current_container_index = curr_focus_container.index();
 			containerHistory[current_container_index].push(inputText_.val());
			
 			/* Reset history index count */
 			historyIndex = 0;
			
			/* Clone input and plaace it into the console container */
 			var divInput = $(this).clone();
 			divInput.removeClass('fixed-bottom');
 			var input = divInput.find('input')[0];
 			input.autofocus = false;
 			input.readOnly = true;
 			output_.append(divInput);
			
 			if(inputText_.val() && inputText_.val().trim()) {
 				var args = inputText_.val().split(' ').filter(function(val, i) {
 					return val;
 				});
 				var cmd = args[0].toLowerCase();
 				args = args.splice(1);
 			}
			
			/* Get command callback function */
 			var callback = commands[cmd];
 			if (typeof callback == 'undefined') {
 				printHtml(cmd + ': command not found');
 			} else {
 				callback(args);
 			}
			
			/* Clear input */
			inputText_.val('');
 		}
 	}
 });