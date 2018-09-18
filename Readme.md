## JQuery Datatables Editor - Alternative to the official one

Add capabilities to add, edit and delete rows in your datatables through the use of modals.

Inline editing is not supported (so far).

# Examples

There are 3 examples, for different use cases:

* a DataTable populated and maintained via Javascript, (no AJAX, no databases), with data organized in rows;

* a DataTable populated and maintained via Javascript, (no AJAX, no databases), with data organized in objects;

* a DataTable populated via AJAX, to be used in connection with a databases, with data organized in objects.


# AJAX setup

The datatable accepts the following callback functions as arguments:

    onAddRow(datatable, rowdata, success, error)
    onEditRow(datatable, rowdata, success, error)
    onDeleteRow(datatable, rowdata, success, error)

In the most common case, these function should call $.ajax as expected by the webservice.
The two functions success and error should be passed as arguments to $ajax.

Webservice **must** return the modified row in JSON format, because the success() function expects this.
Otherwise you have to write your own success() callback (e.g. refreshing the whole table). 

# Row key

There is no default key in the table.
Inside your callback functions, probably you will need a row key to build URL's, in that case you can get them from the 'rowdata' parameter.

# Column id

Please always keep in mind that DataTable framework allows two different kinds of "rows": Arrays and Objects.
In first case columns are indexed through integers; in second case columns are indexed by their attribute name.
Usually JSON's use the Object approach, but we cannot be sure.

# Validation

Following keywords are provided:

    pattern
    special
    unique (and uniqueMsg)
    maxLength
    multiple
    seelct2
    
... (TODO)
