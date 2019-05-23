## JQuery Datatables Editor - Alternative to the official one

Add capabilities to add, edit and delete rows in your datatables through the use of modals.

Inline editing is not supported (so far).

### Examples

There are some examples, for different use cases:

* a DataTable populated and maintained via Javascript, (no AJAX, no databases), with data organized in rows;

* a DataTable populated and maintained via Javascript, (no AJAX, no databases), with data organized in objects;

* a DataTable populated via AJAX, to be used in connection with a databases, with data organized in objects.


### AJAX setup

The datatable accepts the following callback functions as arguments:

    onAddRow(datatable, rowdata, success, error)
    onEditRow(datatable, rowdata, success, error)
    onDeleteRow(datatable, rowdata, success, error)

In the most common case, these function should call `$.ajax` as expected by the webservice.
The two functions `success` and `error` should be passed as arguments to `$.ajax`.

Webservice **must** return the modified row in JSON format, because the `success()` function expects this.
Otherwise you have to write your own `success()` callback (e.g. refreshing the whole table). 

### Row key

There is no default key in the table.
Inside your callback functions, probably you will need a row key to build URL's, in that case you can get them from the `rowdata` parameter.

### Column id

Please always keep in mind that DataTable framework allows two different kinds of "rows": Arrays and Objects.
In first case columns are indexed through integers; in second case columns are indexed by their attribute name.
Usually JSON's use the Object approach, but we cannot be sure.

### Column modifiers, and validation

Following column options are provided.

    type = "text" | "select" | "hidden" | "readonly"

Type of HTML input to be shown.

    hoverMsg = "some msg"

The message will appear as a tooltip over the input field.

    pattern = r.e.

If type is `"input"`, the typed text will be matched against given regular expression, before submit.

    msg = "some string"

An error message that is displayed in case pattern is not matched. Set HTML `"data-errorMsg"` attribute.

    maxLength = integer

If type is `"input"`, set HTML `"maxlength"` attribute.

    options = ["a", "b", "c"]

If type is `"select"`, the options that shall be presented.

    select2 = {}

If type is `"select"`, enable a select2 component. Select2 jQuery plugin must be linked. More select2 configuration options may be passed within the array.

    datepicker = {}

If type is `"text"`, enable a datepicker component. jQuery-UI plugin must be linked. More datepicker configuration options may be passed within the array.

    multiple = true | false

Set HTML `"multiple"` attribute (for use with select2).

    unique = true | false

Ensure that no two rows have the same value. The check is performed client side, not server side. Set HTML `"data-unique"` attribute. (Probably there's some issue with this).

    uniqueMsg = "some string"

An error message that is displayed when the unique constraint is not respected. Set HTML `"data-uniqueMsg"` attribute.

    special = "any string"

Set HTML `"data-special"` attribute (don't know what's that needed for).


### Credits
See LICENSE and CHANGELOG for various credits.

