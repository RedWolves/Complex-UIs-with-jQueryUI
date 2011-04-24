
	// Setup our tabs and cache the jQuery Object to be reused.
	var $tabs = $("#tabs").tabs({
		
		// tabTemplate: HTML template from which a new tab is created and added. 
		//							The placeholders #{href} and #{label} are replaced with the
		//							url and tab label that are passed as arguments to 
		//							the add method.
		tabTemplate: "<li><a href='#{href}'>#{label}</a>\
								 <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
								
		// add (event): This event is triggered when a tab is added.
		add: function( event, ui ) {
			
			// Setup a tab based on a jQuery Template defined in the HTML.			
			$("#newProjectTabTemplate")
				.tmpl()
				
					// append the template results to the selected contents.
					.appendTo(ui.panel)
					
					// We need to recreate our To Do list accordions to setup the new 
					// accordion that was created with the new project tab.
					.setupToDoList();
				}
	});
	
	// Setup a click event to remove a tab from the tab bar.
	$( "#tabs span.ui-icon-close" ).live( "click", function() {
		
		// Remove (method): Remove a tab. The second argument is the zero-based 
		//									index of the tab to be removed.
		$tabs.tabs('remove', $(this).closest('li').index());
	});
		
	// Setup a dialog widget and cache the results so we can call it easily.
	// This will ask the user for the name of the project.
	var addProjectItem = $("#AddProjectItem").dialog({
		
		// modal: If set to true, the dialog will have modal behavior; other items
		//        on the page will be disabled (i.e. cannot be interacted with). Modal 
		//        dialogs create an overlay below the dialog but above 
		//        other page elements.
		modal: 		true,
		
		// autoOpen: When autoOpen is true the dialog will open automatically when 
		//					 dialog is called. If false it will stay hidden until 
		// 					 .dialog("open")  is called on it.
		autoOpen: false,
		
		// buttons: Specifies which buttons should be displayed on the dialog. 
		//					The property key is the text of the button. The value is the 
		//					callback function for when the button is clicked. The context 
		//					of the callback is the dialog element; if you need access to 
		//					the button, it is available as the target of the event object.
		buttons : {
			
			// creates a button to handle adding a new tab.
			"Add new project" : function() {
				
				// using the date to create a unique tab id.
				var foo = new Date();
				$tabs.tabs("add", "#project-" + foo.getTime(), $("#project").val())
				
						 // Select the new tab to make it active.
				     .tabs("select", $tabs.tabs("length") - 1);
				
				// Close the dialog
				$(this).dialog("close");
				
				// Clear the value on the form field in the dialog.
				$("#project").val("");
			},
			
			// creates a button to cancel the dialog.
			"Cancel" : function() {
				
				// Close the dialog
				$(this).dialog("close");
				
				// Clear any values that may of been entered.
				$("#project").val("");
			}
		}
	});

	// Bind a click event on the Add a Project button.
	$("#AddProject").bind("click", function(){
		
    // Opens the dialog to add a new Project tab.
		addProjectItem.dialog('open');
		
	// Call button widget to format the Add a Project button.
	}).button();
	
	//   ------------------------------------------------------------------   //
	//   ------------------------------------------------------------------   //
	//   ------------------------------------------------------------------   //

	/******************************************************************************/
	
	// Setup a function that is easy to reuse.
	$.fn.setupToDoList = function () {
		// return the jQuery object so that we can continue chaining
    return this
      .find(".accordion")

				// call the refreshAccordion method which tearsdown and rebuilds the todo
				// list as an accordion.
  			.refreshAccordion()

				// make the todo list sortable.
  			.sortable({
	
					// constrain movement to the y axis only
					axis: "y",
					
					// define which element will be the handle when sorting.
					handle: "h3",
					
					// stop: event that handles when the element being sorted has stopped.
					//       In this instance we are setting the global stop variable which 
					//       helps determine if the todo item is in movement. 
					stop: function() {
						stop = true;
					},
					
					// Don't sort elements with class ui-state-disabled.
					cancel : ".ui-state-disabled"
				})
				
				// return the set of matched elements to it's previous state.
				.end()
			.find("button")
			
				// set the element with class 'button' as a button widget.
			  .button();
  };
  
  // A reusable plugin used to refresh the accordion.  When this is called the 
	// accordion will be torn down and setup again. Call this when you add a new 
	// item to the accordion or on initial setup.
  $.fn.refreshAccordion = function () {
	  // return the jQuery object so that we can continue chaining
    return this

				// call the destroy method which tears down the accordion.
        .accordion('destroy')

				// set our jQuery object back into an accordion
    		.accordion({
	
					// setting the active option to false allows for no item to be open and active.
					// The default is that one item is always open.  
    			active: false,

					// setting autoHeight to false allows for each item to have a dynamic height.  
    			autoHeight: false,

          // collapsible set to true allows the accordion to have no open items.  
    			collapsible : true,

          // header defines the element of the item that is the header.
    			header: "> div > h3"
    		})

				// calling the refresh method for sortable allows the new item to be sortable.
    		.sortable('refresh');
  };
	
	// accordion to do list
	// stop is a variable we will use to keep track if any item is moving during a sort.
	var stop = false;
	
	// If an item is moving during a sort we want to override the default click 
	// function of the accordion header to allow the sort to happen unimpeded.
	$( ".accordion h3" ).click(function( event ) {
		
		// if the item is moving disable the click event for the accordion widget.
		if ( stop ) {
			
			// keeps other handlers from being executed and prevents the event from 
			// bubbling up the DOM tree.
			event.stopImmediatePropagation();
			
			// this will prevent the default action of the event from being triggered.
			event.preventDefault();
			
			// reset the stop variable 
			stop = false;
		}
	});
	
	//Add a to do item
	// Define the dialog for adding a new todo item.  Assign it to a variable so 
	// that it can be reused easily.
	var addToDo = $("#AddToDoItem").dialog({
		
		// Set the dialog to be a modal meaning all other elements on the page will be disabled.
		modal: true,
		
		// Set autoOpen to False as we don't want the dialog opening on page load.
		autoOpen: false,
		
		// Define the dialogs buttons
		buttons : {
			
			// Button for adding a to-do item
			"Add to do item": function() {
				
				//create a JSON object to pass the data from the form to the template.
				var newItem = [{ 
						task: $("#task").val(),
						description: $("#description").val(),
						duedate: $("#duedate").val()
					}],
					
					// select and cache the jQuery Object for the currently visible accordion.
				  $accordion = $tabs.find(".ui-tabs-panel:visible .accordion");
				
				// Select the template, render it with the JSON data above and append it to 
				// the visible accordion.
				$("#ToDoItemTemplate")
				  .tmpl(newItem)
				  .appendTo($accordion);
				
				// Call the refreshAccordion to add the new item to the accordion 
				$accordion.refreshAccordion();
				
				// Close the dialog
				$(this).dialog("close");
				
				// Clear the fields in the dialog
				$("#task, #description, #duedate").val("");
			},
			
			// Button for cancelling adding a new to-do item
			"Cancel": function(){
				
				// close the dialog
				$(this).dialog("close");
				
				// Clear the field in the dialog
				$("#task, #description, #duedate").val("");
			}
		}
	});
	
	// Define a live click event that will open the dialog to add a new todo list.
	// We use live instead of just binding the click event because we will be 
	// dynamically adding new Add To Do buttons with each new tab.
	$(".AddToDo").live("click", function(){
		
		// call our variable that defines our Add To-Do Dialog and 
		addToDo.dialog('open');
	});
	
	// Define the datepicker widget for the duedate field.
	$("#duedate").datepicker();
	
	
	// Define a live click event that will complete a task and remove it from the list.
	// We use live instead of just binding the click even because the todo event was
	// added dynamically and live will catch the event on newly created elements that are
	//created after page load.
	
	$("input[type=checkbox]").live("click", function(){
		
		$(this)
			// Search up through the DOM tree to find the first instance of the selection.
			// We are looking for the first parent item with a data attribute of sortable-item.
			// This data attribute is set from the sortable interaction widget.
		  .closest(':data(sortable-item)')
				
				// find the H3 element and trigger a click event to activate and close
				// the accordion item.
		    .find('h3').click()
		
				// return the set of matched elements to it's previous state.
		    .end()
		
			// Hide the item we are completing with a sliding motion.  upon completion
			// of the animation fire the callback function.
		  .slideUp(function () {
			
				// remove this todo item from the DOM.
		    $(this).remove();
		  });
	});
	
	// Initially set up the todo list with what's already defined in the HTML.
  $(".ui-tabs-panel").setupToDoList();