
var url_ws_mock_prefix = './';
if (location.href.startsWith("file://")) {
    // local URL's are not allowed
    url_ws_mock_prefix = 'https://luca-vercelli.github.io/DataTable-AltEditor/example/07_dependent_select/';

}

var countryOptions = ['Italy', 'France', 'Germany'];
var allTownsOptions = [ "Torino", "Roma", "Milano", "Napoli", "Paris", "Lyon", "Toulose" ];

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
    select2 : { width: "100%"},
    editorOnChange : function(event, altEditor) {
        console.log(event, altEditor);
        var country = $(event.currentTarget).val();
        /*
        In a real world application, this should just call a single webservice,
        passing rowdatata.country as argument
        */
        if (country == "Italy"){
            $(altEditor.modal_selector).find("#alteditor-row-town").show();
            $.ajax({
                url: url_ws_mock_prefix + 'mock_svc_italy.json',
                type: 'GET',
                success: function(options) {
                    console.log(options);
                    var town = $(altEditor.modal_selector).find('#town');
                    altEditor.reloadOptions(town, options);
                }
            });
        } else if (country == "France"){
            $(altEditor.modal_selector).find("#alteditor-row-town").show();
            $.ajax({
                url: url_ws_mock_prefix + 'mock_svc_france.json',
                type: 'GET',
                success: function(options) {
                    console.log(options);
                    var town = $(altEditor.modal_selector).find('#town');
                    altEditor.reloadOptions(town, options);
                }
            });
        } else {
            $(altEditor.modal_selector).find("#alteditor-row-town").hide();
        }
    }
  },
  {
    data: "town",
    title: "Town",
    type : "select",
    options : allTownsOptions,
    select2 : { width: "100%"}
  }];

  var myTable;
  myTable = $('#example').DataTable({
    "sPaginationType": "full_numbers",
    ajax: {
        url : url_ws_mock_prefix + 'mock_svc_load.json',
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
            url: url_ws_mock_prefix + 'mock_svc_ok.json',
            type: 'GET',
            data: rowdata,
            success: success,
            error: error
        });
    },
    onDeleteRow: function(datatable, rowdata, success, error) {
        $.ajax({
            // a tipycal url would be /{id} with type='DELETE'
            url: url_ws_mock_prefix + 'mock_svc_ok.json',
            type: 'GET',
            data: rowdata,
            success: success,
            error: error
        });
    },
    onEditRow: function(datatable, rowdata, success, error) {
        $.ajax({
            // a tipycal url would be /{id} with type='POST'
            url: url_ws_mock_prefix + 'mock_svc_ok.json',
            type: 'GET',
            data: rowdata,
            success: success,
            error: error
        });
    }
  });


});

