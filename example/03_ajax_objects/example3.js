$(document).ready(function() {

  var columnDefs = [{
    data: "id",
    title: "Id",
    type: "readonly"
  },
  {
    data: "name",
    title: "Name"
  },
 {
    data: "position",
    title: "Position"
  },
 {
    data: "office",
    title: "Office"
  },
 {
    data: "extension",
    title: "Extn."
  },
 {
    data: "startDate",
    title: "Start date"
  },
 {
    data: "salary",
    title: "Salary"
  }];

  var myTable;

  // local URL's are not allowed
  var url_ws_mock_get = './mock_svc_load.json';
  var url_ws_mock_ok = './mock_svc_ok.json';
  
  myTable = $('#example').DataTable({
    "sPaginationType": "full_numbers",
    ajax: {
        url : url_ws_mock_get,
        // our data is an array of objects, in the root node instead of /data node, so we need 'dataSrc' parameter
        dataSrc : ''
    },
    columns: columnDefs,
	    dom: 'Bfrtip',        // Needs button container
        select: 'single',
        responsive: true,
        altEditor: true,     // Enable altEditor
        buttons: [{
            text: 'Add',
            name: 'add'        // do not change name
        },
        {
            extend: 'selected', // Bind to Selected row
            text: 'Edit',
            name: 'edit'        // do not change name
        },
        {
            extend: 'selected', // Bind to Selected row
            text: 'Delete',
            name: 'delete'      // do not change name
        },
        {
            text: 'Refresh',
            name: 'refresh'      // do not change name
        }],
        onAddRow: function(datatable, rowdata, success, error) {
            $.ajax({
                // a tipycal url would be / with type='PUT'
                url: url_ws_mock_ok,
                type: 'GET',
                data: rowdata,
                success: success,
                error: error
            });
        },
        onDeleteRow: function(datatable, rowdata, success, error) {
            $.ajax({
                // a tipycal url would be /{id} with type='DELETE'
                url: url_ws_mock_ok,
                type: 'GET',
                data: rowdata,
                success: success,
                error: error
            });
        },
        onEditRow: function(datatable, rowdata, success, error) {
            $.ajax({
                // a tipycal url would be /{id} with type='POST'
                url: url_ws_mock_ok,
                type: 'GET',
                data: rowdata,
                success: success,
                error: error
            });
        }
  });


});

