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
    data: "imagelink",
    title: "Avatar (direct link)",
    render: function(data, type, row, meta) {
        if (data) return `<img style='max-width:300px;max-height:300px' src='${data}'></img> or <button onclick='window.open("${data}")'>Download</button>`;
    },
    disabled: true
  },
 {
    name: "image",
    data: null,
    render: function(data, type, row, meta) {
        return "My file";
    },
    type: "file",
    title: "Avatar (base64 upload)"
  }];

  var myTable;

  // local URL's are not allowed
  var url_ws_mock_get = './mock_svc_load.json';
  var url_ws_mock_ok = './mock_svc_ok.json';
  if (location.href.startsWith("file://")) {
    // local URL's are not allowed
    url_ws_mock_get = 'https://luca-vercelli.github.io/DataTable-AltEditor/example/10_file_upload/mock_svc_load.json';
    url_ws_mock_ok = 'https://luca-vercelli.github.io/DataTable-AltEditor/example/10_file_upload/mock_svc_ok.json';
  }
  
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

