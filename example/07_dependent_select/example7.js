// local URL's are not allowed
//var url_ws_mock_get = './mock_svc_load.json';
//var url_ws_mock_ok = './mock_svc_ok.json';
//var url_ws_mock_dep = './mock_svc_dependent.json';
var url_ws_mock_get = 'https://luca-vercelli.github.io/DataTable-AltEditor/example/07_dependent_select/mock_svc_load.json';
var url_ws_mock_ok = 'https://luca-vercelli.github.io/DataTable-AltEditor/example/07_dependent_select/mock_svc_ok.json';
var url_ws_mock_dep = 'https://luca-vercelli.github.io/DataTable-AltEditor/example/07_dependent_select//mock_svc_dependent.json';


var countryOptions = ['Italy', 'France', 'Germany'];
var townOptions = function(rowdata) {
	var options = [];
    $.ajax({
        // a tipycal url would be / with type='PUT'
        async: false; 			// <-- IMPORTANT...
        url: url_ws_mock_dep,  // in a real world application this should depend on rowdata
        type: 'GET',
        success: function(data) {
            options = data;
        }
    });
    return options;
};

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
    data: "country",
    title: "Country",
    type : "select",
    options : countryOptions,
    select2 : { width: "100%"}
  },
 {
    data: "town",
    title: "Town",
    type : "select",
    options : townOptions,
    select2 : { width: "100%"}
  }];

  var myTable;
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

