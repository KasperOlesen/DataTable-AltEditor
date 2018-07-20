$(document).ready(function() {
	var dataSet = [
		[1,"Tiger Nixon", "System Architect"],
		[2,"Garrett Winters", "Accountant"],
		[3,"Ashton Cox", "Junior Technical Author"],
		[4,"Cedric Kelly", "Senior Javascript Developer"],
		[5,"Airi Satou", "Accountant"],
		[6,"Brielle Williamson", "Integration Specialist"],
		[7,"Herrod Chandler", "Sales Assistant"],
		[8,"Rhona Davidson", "Integration Specialist"],
		[9,"Colleen Hurst", "Javascript Developer"],
		[10,"Sonya Frost", "Software Engineer"],
	];

	$('#example').DataTable({
		dom: '<"row"<"col-md-4"l><"col-md-4"B><"col-md-4"f>>rt<"row"<"col-md-6"i><"col-md-6"p>>', // requires at least B (for buttons)
		select: 'single',   // only allow single edits at a time
		data: dataSet,
		buttons: [{
                    text: 'Add',
                    name: 'add',        // DO NOT change name (from AltEditor)
                    className: 'btn btn-primary'
            },
			{
				extend: 'selected',     // Bind to Selected row
				text: 'Edit',
				name: 'edit',        // DO NOT change name (from AltEditor)
				className: 'btn btn-secondary'
			},
			{
				extend: 'selected',     // Bind to Selected row
				text: 'Delete',
				name: 'delete',      // DO NOT change name (from AltEditor)
				className: 'btn btn-danger'
			},
			{
				text: 'Refresh',
				name: 'refresh',     // DO NOT change name (from AltEditor)
				className: 'btn btn-info'
			}],
		altEditor: true,            // enable our plugin
		columns: [{
				//data: "id",			// value sent to your callback
				type: "hidden",		// input type
			},
			{
				title: "Name",
				//data: "name",
				type: "readonly",
			},
			{
				title: "Job",
				//data: "roles",
				type: "select",
				multiple: true,
				options: [			// options for select input, the value and option text are the same value
					"System Architect",
					"Accountant",
					"Junior Technical Author",
					"Senior Javascript Developer",
					"Integration Specialist",
					"Sales Assistant",
					"Javascript Developer",
					"Software Engineer"
				]
			},
		],
		// we'll use the default logger,since we have no AJAX endpoints
		/*
		onAddRow: function(info, cb) { // callback when a row is added to the table
			$.ajax({
				url: '',
				type: 'PUT',
				data: info,
				success: function(result) {
					// display some message to the user
					// perform callback
					cb(tableObj, result);
				},
				error: function(result) {
					// perform callback
					cb(tableObj, result);
				}
			});
		},
		onDeleteRow: function(info, cb) { // callback when a row is deleted on the table
			$.ajax({
				url: '',
				type: 'DELETE',
				data: info,
				success: function(result) {
					// display some message to the user
					// perform callback
					cb(tableObj, result);
				},
				error: function(result) {
					// perform callback
					cb(tableObj, result);
				}
			});
		},
		onEditRow: function(info, cb) { // callback when a row is edited on the table
			$.ajax({
				url: '/',
				type: 'POST',
				data: info,
				success: function(result) {
					// display some message to the user
					// perform callback
					cb(tableObj, result);
				},
				error: function(result) {
					// perform callback
					cb(tableObj, result);
				}
			});
		}
		*/
	});
});