## JQuery Datatables Editor - Lite

Add capabilities to add, edit and delete rows in your datatables through the use of modals.

### Version 2.0
Features:
* Cleaner source code
* Improved modal layouts
* Input validation
* Callbacks for use of AJAX when a row is added/edited/deleted
* Support for Max length of items
* Support for Multiple select box
* Support for using Select2 Dropdowns

### Usage

Add it to your project after the datatables library and prior to your initialization of the datatable object!
```
<!-- Datatables scripts -->
<!-- Datatables AltEditor -->
<script src=""></script>
<!-- Init datatables -->
```

Below is an example initialization of a datatable with the editor

```
$('#dataTable').DataTable({
                dom: '<"row"<"col-md-4"l><"col-md-4"B><"col-md-4"f>>rt<"row"<"col-md-6"i><"col-md-6"p>>', // requires at least B (for buttons)
                select: 'single',   // only allow single edits at a time
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
                        data: "id",			// value sent to your callback (and read from AJAX)
                        type: "hidden",		// input type
                    },
                    {
                        title: "Name",
                        data: "name",
                        type: "text",
						pattern: ,								// regex pattern to validate input
						errorMsg: "This field is invalid"		// message to display to the user when their input is invalid
                    },
                    {
                        title: "Username",
                        data: "username",
                        type: "readonly",
						unique: true,		// this column's value is unique, prevents updating/adding the same value
						uniqueMsg: "This field is unique and that value has already been used!"		// message to display when a unique field's value has already been used
                    },
                    {
                        title: "Group",
                        data: "roles",
                        type: "select",
                        multiple: true,
                        select2: { 				// only defined when using select 2
							theme:'bootstrap' 	// set Select 2 options
						},		// if select2 is enabled
                        options: [			// options for select input, the value and option text are the same value
                            'option 1',
                            'option 2'
                        ]
                    },
                ],
				onAddRow: function(tableObj, info, cb) { // callback when a row is added to the table
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
                onDeleteRow: function(tableObj, info, cb) { // callback when a row is deleted on the table
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
                onEditRow: function(tableObj, oldInfo, newInfo, cb) { // callback when a row is edited on the table
                    info = {};
                    info.old = oldInfo;
                    info.new = newInfo;
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
            });
```

## Documentation

### Examples

Examples are coming soon...

### Contributions
Originally based off [kingkode](http://kingkode.com/free-datatables-editor-alternative/) and forked from [luca-vercelli](https://github.com/luca-vercelli/DataTable-AltEditor)
