var employeeOptions = { "1" : "Employee", "2" : "Official" , "3" : "Director" };
var friendsOptions = { "G" : "Goofy", "D" : "Donald duck" , "M" : "Mickey" , "D" : "Daisy" };
var degreesOptions = { "0" : "None", "1" : "Degree", "2" : "High school" };

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
            title: "Position",
            type : "select",
            options : employeeOptions,
            select2 : { width: "100%"},
            render: function (data, type, row, meta) {
                if (data == null || !(data in employeeOptions)) return null;
                return employeeOptions[data];
            }
        },
        {
            data: "startDate",
            title: "Start date",
            datetimepicker: { timepicker: false, format : "Y/m/d"}
        },
        {
            data: "creationTimestamp",
            title: "Creation timestamp",
            datetimepicker: { timepicker: true, format : "Y/m/d H:i"}
        },
        {
            data: "friends",
            title: "Friends",
            type: "select",
            options: friendsOptions,
            multiple : true,
            select2 : { width: "100%"},
            render : function (data, type, row, meta) {
                if (data == null || row == null || row.degree == null) return null;
                return data.map(function(x) {return friendsOptions[x];});
            }
        },
        {
            data: "degree.id",
            title: "Degree (nested obj.)",
            type: "select",
            options: degreesOptions,
            select2 : { width: "100%"},
            render : function (data, type, row, meta) {
                if (data == null || row == null || row.degree == null) return null;
                return row.degree.caption;
            }
        }];

    var myTable;

    var url_ws_mock_get = './mock_svc_load.json';
    var url_ws_mock_ok = './mock_svc_ok.json';
    if (location.href.startsWith("file://")) {
        // local URL's are not allowed
        url_ws_mock_get = 'https://luca-vercelli.github.io/DataTable-AltEditor/example/06_select_datepicker/mock_svc_load.json';
        url_ws_mock_ok = 'https://luca-vercelli.github.io/DataTable-AltEditor/example/06_select_datepicker/mock_svc_ok.json';
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

