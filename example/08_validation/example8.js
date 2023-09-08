$(document).ready(function() {

  var dataSet = [
    [1, "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011-04-25", "$320,800", addOne(), '1'],
    [2, "Garrett Winters", "Accountant", "Tokyo", "8422", "2011-07-25", "$170,750", addOne(), '1'],
    [3, "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009-01-12", "$86,000", addOne(), '1'],
    [4, "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012-03-29", "$433,060", addOne(), '1'],
    [5, "Airi Satou", "Accountant", "Tokyo", "5407", "2008-11-28", "$162,700", addOne(), '1'],
    [6, "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012-12-02", "$372,000", addOne(), '1'],
    [7, "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012-08-06", "$137,500", addOne(), '1'],
    [8, "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010-10-14", "$327,900", addOne(), '1'],
    [9, "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009-09-15", "$205,500", addOne(), '1'],
    [10, "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008-12-13", "$103,600", addOne(), '1'],
    [11, "Jena Gaines", "Office Manager", "London", "3814", "2008-12-19", "$90,560", addOne(), '1'],
    [12, "Quinn Flynn", "Support Lead", "Edinburgh", "9497", "2013-03-03", "$342,000", addOne(), '1'],
    [13, "Charde Marshall", "Regional Director", "San Francisco", "6741", "2008-10-16", "$470,600", addOne(), '1'],
    [14, "Haley Kennedy", "Senior Marketing Designer", "London", "3597", "2012-12-18", "$313,500", addOne(), '1'],
    [15, "Tatyana Fitzpatrick", "Regional Director", "London", "1965", "2010-03-17", "$385,750", addOne(), '1'],
    [16, "Michael Silva", "Marketing Designer", "London", "1581", "2012-11-27", "$198,500", addOne(), '1'],
    [17, "Paul Byrd", "Chief Financial Officer (CFO)", "New York", "3059", "2010-06-09", "$725,000", addOne(), '1'],
    [18, "Gloria Little", "Systems Administrator", "New York", "1721", "2009-04-10", "$237,500", addOne(), '1'],
    [19, "Bradley Greer", "Software Engineer", "London", "2558", "2012-10-13", "$132,000", addOne(), '1'],
    [20, "Dai Rios", "Personnel Lead", "Edinburgh", "2290", "2012-09-26", "$217,500", addOne(), '1'],
    [21, "Jenette Caldwell", "Development Lead", "New York", "1937", "2011-09-03", "$345,000", addOne(), '1'],
    [22, "Yuri Berry", "Chief Marketing Officer (CMO)", "New York", "6154", "2009-06-25", "$675,000", addOne(), '1'],
    [23, "Caesar Vance", "Pre-Sales Support", "New York", "8330", "2011-12-12", "$106,450", addOne(), '1'],
    [24, "Doris Wilder", "Sales Assistant", "Sidney", "3023", "2010-09-20", "$85,600", addOne(), '1'],
    [25, "Angelica Ramos", "Chief Executive Officer (CEO)", "London", "5797", "2009-10-09", "$1,200,000", addOne(), '1'],
    [26, "Gavin Joyce", "Developer", "Edinburgh", "8822", "2010-12-22", "$92,575", addOne(), '1'],
    [27, "Jennifer Chang", "Regional Director", "Singapore", "9239", "2010-11-14", "$357,650", addOne(), '1'],
    [28, "Brenden Wagner", "Software Engineer", "San Francisco", "1314", "2011-06-07", "$206,850", addOne(), '1'],
    [29, "Fiona Green", "Chief Operating Officer (COO)", "San Francisco", "2947", "2010-03-11", "$850,000", addOne(), '1'],
    [30, "Shou Itou", "Regional Marketing", "Tokyo", "8899", "2011-08-14", "$163,000", addOne(), '1'],
    [31, "Michelle House", "Integration Specialist", "Sidney", "2769", "2011-06-02", "$95,400", addOne(), '1'],
    [32, "Suki Burks", "Developer", "London", "6832", "2009-10-22", "$114,500", addOne(), '1'],
    [33, "Prescott Bartlett", "Technical Author", "London", "3606", "2011-05-07", "$145,000", addOne(), '1'],
    [34, "Gavin Cortez", "Team Leader", "San Francisco", "2860", "2008-10-26", "$235,500", addOne(), '1'],
    [35, "Martena Mccray", "Post-Sales support", "Edinburgh", "8240", "2011-03-09", "$324,050", addOne(), '1'],
    [36, "Unity Butler", "Marketing Designer", "San Francisco", "5384", "2009-12-09", "$85,675", addOne(), '1'],
  ];

  var columnDefs = [{
    title: "Id",
    type: "readonly"
  }, {
    title: "Name",
    type: "text",
    required: true,
    unique: true,
    name: "name"
  }, {
    title: "Position",
    required: true,
    type: "text"
  }, {
    title: "Office"
    //no type = text
  }, {
    title: "Extn.",
    type: "number"
  }, {
    title: "Start date",
    type: "date"
  }, {
    title: "Salary",
    type: "text",
    pattern: "\\$[0-9]*,[0-9]{3}",
    hoverMsg: "At least $1,000"
  }, {
    title: "Unique number",
    type: "number",
    unique: true
  }, {
    title: "Select unique",
    type: "select",
    select2: { 'allowClear': true, 'placeholder': 'Choose an option', 'width': '100%' },
    options: ['1', '2', '3', '4', '5', '6', '7', '8'], 
    unique: true
  }];

  var myTable;

  myTable = $('#example').DataTable({
    "sPaginationType": "full_numbers",
    data: dataSet,
    columns: columnDefs,
    initComplete: function () {
      let i = 0
      this.api().columns().header().to$().each(function () {
        let def = columnDefs[i] ?? null;
        $(this).attr('name', def.name ?? `${i}`)
        i++
      })
    },
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
         }]
  });


});

window.counter = 0;
function addOne() {
  return ++window.counter;
}