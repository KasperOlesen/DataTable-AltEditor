$(document).ready(function() {

  var dataSet = [
    [1,"Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800"],
    [2,"Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750"],
    [3,"Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000"],
    [4,"Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060"],
    [5,"Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700"],
    [6,"Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000"],
    [7,"Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500"],
    [8,"Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900"],
    [9,"Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500"],
    [10,"Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600"],
    [11,"Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560"],
    [12,"Quinn Flynn", "Support Lead", "Edinburgh", "9497", "2013/03/03", "$342,000"],
    [13,"Charde Marshall", "Regional Director", "San Francisco", "6741", "2008/10/16", "$470,600"],
    [14,"Haley Kennedy", "Senior Marketing Designer", "London", "3597", "2012/12/18", "$313,500"],
    [15,"Tatyana Fitzpatrick", "Regional Director", "London", "1965", "2010/03/17", "$385,750"],
    [16,"Michael Silva", "Marketing Designer", "London", "1581", "2012/11/27", "$198,500"],
    [17,"Paul Byrd", "Chief Financial Officer (CFO)", "New York", "3059", "2010/06/09", "$725,000"],
    [18,"Gloria Little", "Systems Administrator", "New York", "1721", "2009/04/10", "$237,500"],
    [19,"Bradley Greer", "Software Engineer", "London", "2558", "2012/10/13", "$132,000"],
    [20,"Dai Rios", "Personnel Lead", "Edinburgh", "2290", "2012/09/26", "$217,500"],
    [21,"Jenette Caldwell", "Development Lead", "New York", "1937", "2011/09/03", "$345,000"],
    [22,"Yuri Berry", "Chief Marketing Officer (CMO)", "New York", "6154", "2009/06/25", "$675,000"],
    [23,"Caesar Vance", "Pre-Sales Support", "New York", "8330", "2011/12/12", "$106,450"],
    [24,"Doris Wilder", "Sales Assistant", "Sidney", "3023", "2010/09/20", "$85,600"],
    [25,"Angelica Ramos", "Chief Executive Officer (CEO)", "London", "5797", "2009/10/09", "$1,200,000"],
    [26,"Gavin Joyce", "Developer", "Edinburgh", "8822", "2010/12/22", "$92,575"],
    [27,"Jennifer Chang", "Regional Director", "Singapore", "9239", "2010/11/14", "$357,650"],
    [28,"Brenden Wagner", "Software Engineer", "San Francisco", "1314", "2011/06/07", "$206,850"],
    [29,"Fiona Green", "Chief Operating Officer (COO)", "San Francisco", "2947", "2010/03/11", "$850,000"],
    [30,"Shou Itou", "Regional Marketing", "Tokyo", "8899", "2011/08/14", "$163,000"],
    [31,"Michelle House", "Integration Specialist", "Sidney", "2769", "2011/06/02", "$95,400"],
    [32,"Suki Burks", "Developer", "London", "6832", "2009/10/22", "$114,500"],
    [33,"Prescott Bartlett", "Technical Author", "London", "3606", "2011/05/07", "$145,000"],
    [34,"Gavin Cortez", "Team Leader", "San Francisco", "2860", "2008/10/26", "$235,500"],
    [35,"Martena Mccray", "Post-Sales support", "Edinburgh", "8240", "2011/03/09", "$324,050"],
    [36,"Unity Butler", "Marketing Designer", "San Francisco", "5384", "2009/12/09", "$85,675"]
  ];

  var columnDefs = [{
    title: "Id",
    type: "readonly"
  }, {
    title: "Name",
    type: "text"
  }, {
    title: "Position",
    type: "text"
  }, {
    title: "Office"
    //no type = text
  }, {
    title: "Extn.",
    type: "text"
  }, {
    title: "Start date",
    type: "readonly"
  }, {
    title: "Salary",
    type: "text"
  }];

  var myTable;

  myTable = $('#example').DataTable({
    "sPaginationType": "full_numbers",
    data: dataSet,
    columns: columnDefs,
    dom: 'Bfrtip',        // Needs button container
    select: 'single',
    responsive: true,
    altEditor: true,     // Enable altEditor
    buttons: [{
        text: 'Aggiungi',
        name: 'add'        // do not change name
        },
        {
        extend: 'selected', // Bind to Selected row
        text: 'Modifica',
        name: 'edit'        // do not change name
        },
        {
        extend: 'selected', // Bind to Selected row
        text: 'Elimina',
        name: 'delete'      // do not change name
        }],
    language: {
        
        // see https://datatables.net/plug-ins/i18n/Italian
        "sEmptyTable":     "Nessun dato presente nella tabella",
        "sInfo":           "Vista da _START_ a _END_ di _TOTAL_ elementi",
        "sInfoEmpty":      "Vista da 0 a 0 di 0 elementi",
        "sInfoFiltered":   "(filtrati da _MAX_ elementi totali)",
        "sInfoPostFix":    "",
        "sInfoThousands":  ".",
        "sLengthMenu":     "Visualizza _MENU_ elementi",
        "sLoadingRecords": "Caricamento...",
        "sProcessing":     "Elaborazione...",
        "sSearch":         "Cerca:",
        "sZeroRecords":    "La ricerca non ha portato alcun risultato.",
        "oPaginate": {
            "sFirst":      "Inizio",
            "sPrevious":   "Precedente",
            "sNext":       "Successivo",
            "sLast":       "Fine"
        },
        "oAria": {
            "sSortAscending":  ": attiva per ordinare la colonna in ordine crescente",
            "sSortDescending": ": attiva per ordinare la colonna in ordine decrescente"
        },
        
        // see /translations
        "altEditor" : {
            "modalClose" : "Chiudi",
            "edit" : {
                "title" : "Modifica",
                "button" : "Modifica"
            },
            "add" : {
                "title" : "Nuovo",
                "button" : "Crea"
            },
            "delete" : {
                "title" : "Elimina",
                "button" : "Elimina"
            },
            "success" : "Fatto.",
            "error" : {
                "message" : "Si è verificato un errore non previsto.",
                "label" : "Errore",
                "responseCode" : "Response code:",
                "required" : "Valore obbligatorio",
                "unique" : "Valore duplicato"
            }
        }
    }
  });


});

