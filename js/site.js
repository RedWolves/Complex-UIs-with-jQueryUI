
	$(".ui-state-error").hide();
	// Login page 
	$("#btnLogin").button().click(function(){
		if ($("#username").val() != "script" && $("#password").val() != "junkie") {
			$(".ui-state-error").show();
  		$("#login section").effect("shake", 150 );
		} else {
			document.location = 'todo.html';
		}
		return false;
	});
	
	//ToDo list page
	function BindToDoList(){
		$(".accordion")
					.accordion({
						active: false,
						autoHeight: false,
						collapsible : true,
						header: "> div > h3"
					})
					.sortable({
						axis: "y",
						handle: "h3",
						stop: function() {
							stop = true;
						},
						cancel : ".ui-state-disabled"
					})
					.find("input[type=checkbox]").live("click", function(){
						var $container = $(this).parent().parent();
						if ($container.hasClass("ui-state-disabled")) {
							$container.removeClass("ui-state-disabled");
						} else {
							$container.addClass("ui-state-disabled");
							$container.find("h3").trigger("click");
							$container.remove();
						}
					});
					
					
					$("button").button();
	}
	
	//Add a project 
	$("#AddProject").bind("click", function(){
		$("#AddProjectItem").dialog({
			modal: true,
			buttons : {
				"Add new project" : function() {
					var foo = new Date();
					$("#tabs").tabs("add", "#project-" + foo.getTime(), $("#project").val())
										.tabs("select", $("#tabs ul li a").length - 1);
					$(this).dialog("close");
					BindToDoList();
					$("#project").val("");
				},
				"Cancel" : function() {
					$(this).dialog("close");
					$("#project").val("");
				}
			}
		});
	});
	
	//Add a to do item
	$(".AddToDo").live("click", function(){
		$("#AddToDoItem").dialog({
			modal: true,
			buttons : {
				"Add to do item": function() {
					var newItem = [{ 
							task: $("#task").val(),
							description: $("#description").val(),
							duedate: $("#duedate").val()
						}];
					var $accordion = $($("#tabs ul li a:eq(" + $('.ui-tabs-selected').index() + ")").attr("href")).find(".accordion");
					$("#ToDoItemTemplate").tmpl(newItem).appendTo($accordion);
					$accordion.accordion("destroy");
					BindToDoList();
					$(this).dialog("close");
					$("#task, #description, #duedate").val("");
				},
				"Cancel": function(){
					$(this).dialog("close");
					$("#task, #description, #duedate").val("");
				}
			}
		});
	});
	$("#duedate").datepicker();
	
	//project tabs
	$("#tabs").tabs({
		tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
		add: function( event, ui ) {
						//var foo = new Date();
						//var time = foo.getTime();
						//var project = [{
						//	tabid = "project" + time;
						//}];
						$(ui.panel).append($("#newProjectTabTemplate").tmpl());
					}
	});
	
	//remove tab on click
	$( "#tabs span.ui-icon-close" ).live( "click", function() {
				var index = $( "li", $("#tabs") ).index( $( this ).parent() );
				$("#tabs").tabs( "remove", index );
			});
	
	
	//accordion to do list
	var stop = false;
	$( ".accordion h3" ).click(function( event ) {
		if ( stop ) {
			event.stopImmediatePropagation();
			event.preventDefault();
			stop = false;
		}
	});
	
	BindToDoList();