// Make sure that the error state element is hidden.
$(".ui-state-error").hide();

// Call the button widget method on the login button to format it. 
$("#btnLogin").button()

	// Now bind a click event to handle the login of the form.
	.bind("click", function(){
		// Test our form for a valid login.  
		// Our form only works with:
		// 	username: script
		// 	password: junkie
		if ( $("#username").val() != "script" 
			&& $("#password").val() != "junkie") {
				// If the login credentials are not correct,
				// show our error state element.
				$(".ui-state-error").show();
				// Add an jQuery UI effect that shakes the whole login form
				// like as if it's shaking its head no.
				$("#login section").effect("shake", 150 );
			} else {
				// If the login credentials are correct, go to the todo page.
				document.location = 'todo.html';
			}
			
	// return false to cancel normal form submit event methods.
	return false;
});