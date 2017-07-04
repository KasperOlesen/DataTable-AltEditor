$(document).ready(function() {

  var columnDefs = [{
    title: "Id",
    type: "readonly"
  }, {
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

  myTable = $('#example').DataTable({
    "sPaginationType": "full_numbers",
    ajax: './data3.json',
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
         }]
  });


});

