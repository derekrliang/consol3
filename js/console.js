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

         /* COMMANDS */
         switch (cmd) {
             case 'clear':
                 clearConsole(inputText_);
                 return;
             case 'date':
                 printHtml((new Date()).toLocaleString());
                 break;
             default:
                 if (cmd) {
                     printHtml(cmd + ': command not found');
                 }
         };

         inputText_.val('');
     }
 }