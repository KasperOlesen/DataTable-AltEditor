$(document).ready(function() {
	var dataSet = [
		{"id":1,"name":"Tiger Nixon", "job":"System Architect"},
		{"id":2,"name":"Garrett Winters", "job":"Accountant"},
		{"id":3,"name":"Ashton Cox", "job":"Junior Technical Author"},
		{"id":4,"name":"Cedric Kelly", "job":"Senior Javascript Developer"},
		{"id":5,"name":"Airi Satou", "job":"Accountant"},
		{"id":6,"name":"Brielle Williamson", "job":"Integration Specialist"},
		{"id":7,"name":"Herrod Chandler", "job":"Sales Assistant"},
		{"id":8,"name":"Rhona Davidson", "job":"Integration Specialist"},
		{"id":9,"name":"Colleen Hurst", "job":"Javascript Developer"},
		{"id":10,"name":"Sonya Frost", "job":"Software Engineer"},
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
				data: "id",			// value sent to your callback
				type: "hidden",		// input type
			},
			{
				title: "Name",
				data: "name",
				type: "text",
			},
			{
				title: "Job",
				data: "job",
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
					cb(result);
				},
				error: function(result) {
					// perform callback
					cb(result);
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
					cb(result);
				},
				error: function(result) {
					// perform callback
					cb(result);
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
					cb(result);
				},
				error: function(result) {
					// perform callback
					cb(result);
				}
			});
		}
		*/
	});
});