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
```
$('#dataTable').DataTable({
                dom: '<"row"<"col-md-4"l><"col-md-4"B><"col-md-4"f>>rt<"row"<"col-md-6"i><"col-md-6"p>>', // requires at least B (for buttons)
                select: 'single',   // only allow single edits at a time
                buttons: [
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
                        id: "id",
                        data: "id",
                        type: "hidden",
                        visible: false,
                        searchable: false
                    },
                    {
                        title: "Name",
                        id: "name",
                        data: "name",
                        type: "readonly",
                    },
                    {
                        title: "Username",
                        id: "username",
                        data: "username",
                        type: "readonly",
                    },
                    {
                        title: "Group",
                        id: "roles",
                        data: "roles",
                        type: "select",
                        multiple: true,
                        select2: true,
                        options: [
                            'option 1',
                            'option 2'
                        ]
                    },
                ],
				onAddRow: function(tableObj, info, cb) {
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
                onDeleteRow: function(tableObj, info, cb) {
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
                onEditRow: function(tableObj, oldInfo, newInfo, cb) {
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
                            cb(tableObj, result);
                        },
                        error: function(result) {
                            // perform callback
                            cb(tableObj, result);
                        }
                    });
                }
            });
```

### Contributions
Originally based off [kingkod](http://kingkode.com/free-datatables-editor-alternative/) and forked from [luca-vercelli](https://github.com/luca-vercelli/DataTable-AltEditor)
