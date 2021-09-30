/**
 * @summary altEditor
 * @description Lightweight editor for DataTables
 * @version 2.0
 * @file dataTables.editor.free.js
 * @author kingkode (www.kingkode.com)
 *  Modified by: Kasper Olesen (https://github.com/KasperOlesen), Luca Vercelli (https://github.com/luca-vercelli), Zack Hable (www.cobaltdevteam.com)
 * @contact www.kingkode.com/contact
 * @contact zack@cobaltdevteam.com
 * @copyright Copyright 2016 Kingkode
 *
 * This source file is free software, available under the following license: MIT
 * license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 *
 */
 (function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables.net'], function ($) {
            return factory($, window, document);
        });
    }
    else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }

            if (!$ || !$.fn.dataTable) {
                $ = require('datatables.net')(root, $).$;
            }

            return factory($, root, root.document);
        };
    }
    else {
        // Browser
        factory(jQuery, window, document);
    }
})
(function ($, window, document, undefined) {
    'use strict';
    var DataTable = $.fn.dataTable;

    var _instance = 0;

    /**
     * altEditor provides modal editing of records for Datatables
     *
     * @class altEditor
     * @constructor
     * @param {object}
     *            oTD DataTables settings object
     * @param {object}
     *            oConfig Configuration object for altEditor
     */
    var altEditor = function (dt, opts) {
        if (!DataTable.versionCheck || !DataTable.versionCheck('1.10.8')) {
            throw ("Warning: altEditor requires DataTables 1.10.8 or greater");
        }

        // User and defaults configuration object
        this.c = $.extend(true, {}, DataTable.defaults.altEditor,
            altEditor.defaults, opts);

        /**
         * @namespace Settings object which contains customisable information
         *            for altEditor instance
         */
        this.s = {
            /** @type {DataTable.Api} DataTables' API instance */
            dt: new DataTable.Api(dt),

            /** @type {String} Unique namespace for events attached to the document */
            namespace: '.altEditor' + (_instance++)
        };

        /**
         * @namespace Common and useful DOM elements for the class instance
         */
        this.dom = {
            /** @type {jQuery} altEditor handle */
            modal: $('<div class="dt-altEditor-handle"/>'),
        };

        /* Constructor logic */
        this._constructor();
    }

    $.extend(
        altEditor.prototype,
        {
            /***************************************************************
             * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
             * Constructor * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
             */

            /**
             * Initialise the RowReorder instance
             *
             * @private
             */
            _constructor: function () {
                var that = this;
                var dt = this.s.dt;

                if (dt.settings()[0].oInit.onAddRow)
                    that.onAddRow = dt.settings()[0].oInit.onAddRow;
                if (dt.settings()[0].oInit.onDeleteRow)
                    that.onDeleteRow = dt.settings()[0].oInit.onDeleteRow;
                if (dt.settings()[0].oInit.onEditRow)
                    that.onEditRow = dt.settings()[0].oInit.onEditRow;

                that.closeModalOnSuccess = dt.settings()[0].oInit.closeModalOnSuccess;
                if (that.closeModalOnSuccess === undefined) {
                    that.closeModalOnSuccess = true;
                }

                that.encodeFiles = dt.settings()[0].oInit.encodeFiles;
                if (that.encodeFiles === undefined) {
                    that.encodeFiles = true;
                }

                // Register datatable selection listener
                this.selectionListener()

                var lang = this.s.dt.settings()[0].oLanguage;
                if (lang.altEditor) {
                    this.language = lang.altEditor;
                    this._setup();
                }
                // Load from URL
                else if (typeof lang.altEditorUrl === 'string' && lang.altEditorUrl != '') {
                    $.ajax( {
                        dataType: 'json',
                        url: lang.altEditorUrl,
                        success: function ( json ) {
                            that.language = json;
                            that._setup();
                        },
                        error: function () {
                            // Error occurred loading language file, continue on as best we can
                            that.language = {};
                            that._setup();
                        }
                    } );
                }
                // Default
                else {
                    this.language = {};
                    this._setup();
                }

                dt.on('destroy.altEditor', function () {
                    dt.off('.altEditor');
                    $(dt.table().body()).off(that.s.namespace);
                    $(document.body).off(that.s.namespace);
                });
            },

            /***************************************************************
             * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
             * Private methods * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
             */

            /**
             * Setup dom and bind button actions
             *
             * @private
             */
            _setup: function () {
                var that = this;
                var dt = this.s.dt;

                this.random_id = ("" + Math.random()).replace(".", "");

                var modal_id = 'altEditor-modal-' + this.random_id;
                this.modal_selector = '#' + modal_id;

                this._initLanguage();

                var modal = '<div class="modal fade altEditor-modal reveal" id="' + modal_id + '" tabindex="-1" role="dialog" data-reveal>' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<h4 style="padding-top: 1rem;padding-left: 1rem;" class="modal-title"></h4>' +
                    '<button style="margin: initial;" type="button" class="close close-button" data-dismiss="modal" data-close aria-label="' + this.language.modalClose + '">' +
                    '<span aria-hidden="true">&times;</span></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<p></p>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                // Add modal
                $('body').append(modal);

                // Add Edit Button
                if (dt.button('edit:name')) {
                    dt.button('edit:name').action(function (e, dt, node, config) {
                        that._openEditModal();

                        $('#altEditor-edit-form-' + that.random_id)
                        .off('submit')
                        .on('submit', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            that._editRowData();
                        });
                    });
                }

                // Add Delete Button
                if (dt.button('delete:name')) {
                    dt.button('delete:name').action(function (e, dt, node, config) {
                        that._openDeleteModal();

                        $('#altEditor-delete-form-' + that.random_id)
                        .off('submit')
                        .on('submit', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            that._deleteRow();
                        });
                    });
                }

                // Add Add Button
                if (dt.button('add:name')) {
                    dt.button('add:name').action(function (e, dt, node, config) {
                        that._openAddModal();

                        $('#altEditor-add-form-' + that.random_id)
                        .off('submit')
                        .on('submit', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            that._addRowData();
                        });
                    });
                }

                // Bind 'unique' error messages
                $(this.modal_selector).on('input', '[data-unique]', function(elm) {
                    if ($(elm.target).attr('data-unique') == null || $(elm.target).attr('data-unique') === 'false') {
                        return;
                    }
                    var target = $(elm.target);
                    var colData = dt.column("th:contains('" + target.attr("name") + "')").data();
                    // go through each item in this column
                    var selectedCellData = null;
                    if (dt.row({selected: true}).index() != null)
                        selectedCellData = dt.cell(dt.row({selected: true}).index(), dt.column("th:contains('" + target.attr("name") + "')").index()).data();
                    elm.target.setCustomValidity('');
                    for (var j in colData) {
                        // if the element is in the column and its not the selected one then its not unique
                        if (target.val() == colData[j] && colData[j] != selectedCellData) {
                            elm.target.setCustomValidity(that.language.error.unique);
                        }
                    }
                });

                // Add Refresh button
                if (this.s.dt.button('refresh:name')) {
                    this.s.dt.button('refresh:name').action(function (e, dt, node, config) {
                        if (dt.ajax && dt.ajax.url()) {
                            dt.ajax.reload();
                        }
                    });
                }
            },

            /**
             * Init translate
             * 
             * @private
             */
            _initLanguage: function () {
                this.language.modalClose = this.language.modalClose || 'Close';
                this.language.edit = this.language.edit || {};
                this.language.edit = { 
                    title: this.language.edit.title || 'Edit record',
                    button: this.language.edit.button || 'Edit'
                };
                this.language.delete = this.language.delete || {};
                this.language.delete = { 
                    title: this.language.delete.title || 'Delete record',
                    button: this.language.delete.button || 'Delete' 
                };
                this.language.add = this.language.add || {};
                this.language.add = { 
                    title: this.language.add.title || 'Add record',
                    button: this.language.add.button || 'Add'
                };
                this.language.success = this.language.success || 'Success!';
                this.language.error = this.language.error || {};
                this.language.error = { 
                    message: this.language.error.message || 'There was an unknown error!',
                    label: this.language.error.label || 'Error!',
                    responseCode: this.language.error.responseCode || 'Response code: ',
                    required: this.language.error.required || 'Field is required',
                    unique: this.language.error.unique || 'Duplicated field'
                };
            },

            /**
             * Emit an event on the DataTable for listeners
             *
             * @param {string}
             *            name Event name
             * @param {array}
             *            args Event arguments
             * @private
             */
            _emitEvent: function (name, args) {
                this.s.dt.iterator('table', function (ctx, i) {
                    $(ctx.nTable).triggerHandler(name + '.dt', args);
                });
            },

            /**
             * Open Edit Modal for selected row
             *
             * @private
             */
            _openEditModal: function () {

                var dt = this.s.dt;
                var adata = dt.rows({
                    selected: true
                });

                var columnDefs = this.completeColumnDefs();
                var data = this.createDialog(columnDefs, this.language.edit.title, this.language.edit.button,
                    this.language.modalClose, 'editRowBtn', 'altEditor-edit-form');

                var selector = this.modal_selector;

                for (var j in columnDefs) {
                    if (columnDefs[j].name != null) {
                        var jquerySelector = "#" + columnDefs[j].name.toString().replace(/\./g, "\\.");

                        var arrIndex = columnDefs[j].name.toString().split(".");
                        var selectedValue = adata.data()[0];
                        for (var index = 0; index < arrIndex.length; index++) {
                            if (selectedValue) {
                                selectedValue = selectedValue[arrIndex[index]];
                            }
                        }

                        if (typeof selectedValue !== 'object' && selectedValue !== null) {
                            selectedValue = selectedValue.toString().trim();
                        }

                        // Added Select2
                        if (columnDefs[j].type.indexOf("select") >= 0 && columnDefs[j].select2) {
                            var jsonValue = undefined;
                            try { jsonValue = JSON.parse(selectedValue); } catch (e) { }
                            if (typeof jsonValue === 'object') { selectedValue = jsonValue; }
                        }
                        // Added checkbox
                        else if (columnDefs[j].type.indexOf("checkbox") >= 0) {
                            if (this._quoteattr(selectedValue) === "true" || this._quoteattr(selectedValue) == "1") { // MS SQL Databases use bits for booleans. 1 is equivlent to true, 0 is false
                                $(selector).find(jquerySelector).prop("checked", this._quoteattr(selectedValue)); // required by checkbox
                            }
                        }
                        // Added date
                        else if (columnDefs[j].type.indexOf("date") >= 0) {
                            if (columnDefs[j].dateFormat !== "") {
                                var mDate = moment(this._quoteattr(selectedValue));
                                if (mDate && mDate.isValid()) {
                                    $(selector).find(jquerySelector).val(mDate.format(columnDefs[j].dateFormat));
                                }
                            }
                        }

                        $(selector).find(jquerySelector)
                                    .filter(':input[type!="file"]').val(selectedValue) // this._quoteattr or not? see #121
                                                                    .trigger("change"); // required by select2
                    }
                }

                $(selector + ' input[0]').trigger('focus');
                $(selector).trigger("alteditor:some_dialog_opened").trigger("alteditor:edit_dialog_opened");
            },

            /**
             * Callback for "Edit" button
             */
            _editRowData: function () {
                var that = this;
                var dt = this.s.dt;
                var adata = dt.rows({
                    selected: true
                });

                var rowDataArray = {}; // Complete new row data
                var originalRowDataArray = adata.data()[0]; // Original row data

                var $inputs = $('form[name="altEditor-edit-form-' + this.random_id + '"]').find( 'select, textarea, input' );

                // Getting the inputs from the edit-modal
                $inputs.filter(':input[type!="file"], :input[type="checkbox"]').each(function (i) {
                    rowDataArray[$(this).attr('id')] = $(this).val();
                });

                //Getting Files from the modal
                var numFilesQueued = 0;
                $inputs.filter(':input[type="file"]').each(function (i) {
                    if ($(this).prop('files')[0]) {
                        var context = this;

                        if (that.encodeFiles) {
                            ++numFilesQueued;
                            that.getBase64($(this).prop('files')[0], function (filecontent) {
                                rowDataArray[$(context).attr('id')] = filecontent;
                                --numFilesQueued;
                            });
                        } else {
                            rowDataArray[$(this).attr('id')] = $(this).prop('files')[0];
                        }
                    }
                });

                // Getting the checkbox from the modal
                $inputs.filter(':input[type="checkbox"]').each(function (i) {
                    rowDataArray[$(this).attr('id')] = this.checked;
                });

                var checkFilesQueued = function() {
                    if (numFilesQueued == 0) {
                        that.onEditRow(that,
                            rowDataArray,
                            function(data,b,c,d,e){ that._editRowCallback(data,b,c,d,e); },
                            function(data){ that._errorCallback(data); },
                            originalRowDataArray);
                    } else {
                        console.log("Waiting for file base64-decoding...");
                        setTimeout(checkFilesQueued, 1000);
                    }
                };

                checkFilesQueued();
            },

            /**
             * Open Delete Modal for selected row
             *
             * @private
             */
            _openDeleteModal: function () {

                var that = this;
                var dt = this.s.dt;
                var adata = dt.rows({
                    selected: true
                });
                var formName = 'altEditor-delete-form-' + this.random_id;
                var selector = this.modal_selector;
                var fill = function () {
                    var btns = '<button type="button" data-content="remove" class="btn btn-default button secondary" data-close data-dismiss="modal">' + that.language.modalClose + '</button>' +
                        '<button type="submit"  data-content="remove" class="btn btn-danger button" id="deleteRowBtn">' + that.language.delete.button + '</button>';
                    $(selector).find('.modal-title').html(that.language.delete.title);
                    $(selector).find('.modal-body').html(that.language.deleteMessage || `<h5>Are you sure you wish to delete ${adata.count()} rows?</h5>`);
                    $(selector).find('.modal-footer').html(btns);
                    var modalContent = $(selector).find('.modal-content');
                    if (modalContent.parent().is('form')) {
                        modalContent.parent().attr('name', formName);
                        modalContent.parent().attr('id', formName);
                    }
                    else {
                        modalContent.wrap("<form name='" + formName + "' id='" + formName + "' role='form'></form>");
                    }
                };

                this.internalOpenDialog(selector, fill);
                $(selector + ' input[0]').trigger('focus');
                $(selector).trigger("alteditor:some_dialog_opened").trigger("alteditor:delete_dialog_opened");
            },

            /**
             * Callback for "Delete" button
             */
            _deleteRow: function () {
                var that = this;
                var dt = this.s.dt;

                var adata = dt.rows({
                    selected: true
                });

                that.onDeleteRow(that,
                    adata,
                    function(data){ that._deleteRowCallback(data); },
                    function(data){ that._errorCallback(data); }
                );
            },

            /**
             * Open Add Modal for selected row
             *
             * @private
             */
            _openAddModal: function () {
                var dt = this.s.dt;
                var columnDefs = this.completeColumnDefs();
                var data = this.createDialog(columnDefs, this.language.add.title, this.language.add.button,
                    this.language.modalClose, 'addRowBtn', 'altEditor-add-form');

                var selector = this.modal_selector;
                $(selector + ' input[0]').trigger('focus');
                $(selector).trigger("alteditor:some_dialog_opened").trigger("alteditor:add_dialog_opened");
            },

            selectionListener: function() {

                var dt = this.s.dt

                dt.on('select', function (e, dt, type, indexes) {
                    // when multiple rows selected then disable edit button
                    if (dt.rows({selected: true}).count() > 1) {
                        dt.buttons('edit:name').disable()
                    }
                })

                dt.on('deselect', function (e, dt, type, indexes) {
                    // when multiple rows selected then disable edit button
                    if (dt.rows({selected: true}).count() > 1) {
                        dt.buttons('edit:name').disable()
                    }
                })
            },

            /**
            * Complete DataTable.context[0].aoColumns with default values
            */
            completeColumnDefs: function () {
                var columnDefs = [];
                var dt = this.s.dt;
                for (var i in dt.context[0].aoColumns) {
                    var obj = dt.context[0].aoColumns[i];
                    columnDefs[i] = {
                        title: obj.sTitle,
                        placeholder: (obj.placeholder ? obj.placeholder : obj.title), //added placeholder
                        name: (obj.data ? obj.data : obj.mData),
                        type: (obj.type ? obj.type : 'text'),
                        rows: (obj.rows ? obj.rows : '5'),
                        cols: (obj.cols ? obj.cols : '30'),
                        options: (obj.options ? obj.options : []),
                        readonly: (obj.readonly ? obj.readonly : false),
                        disabled: (obj.disabled ? obj.disabled : false),
                        required: (obj.required ? obj.required : false),
                        hoverMsg: (obj.hoverMsg ? obj.hoverMsg : ''),
                        pattern: (obj.pattern ? obj.pattern : '.*'),
                        accept: (obj.accept ? obj.accept : ''),
                        special: (obj.special ? obj.special : ''),
                        unique: (obj.unique ? obj.unique : false),
                        maxLength: (obj.maxLength ? obj.maxLength : false),
                        multiple: (obj.multiple ? obj.multiple : false),
                        select2: (obj.select2 ? obj.select2 : false),
                        datepicker: (obj.datepicker ? obj.datepicker : false),
                        datetimepicker: (obj.datetimepicker ? obj.datetimepicker : false),
                        editorOnChange: (obj.editorOnChange ? obj.editorOnChange : null),
                        style: (obj.style ? obj.style : ''),
                        dateFormat: (obj.dateFormat ? obj.dateFormat : ''),
                        optionsSortByLabel: (obj.optionsSortByLabel ? obj.optionsSortByLabel : false),
                        inline: (obj.inline ? obj.inline : false), // Added for inline columns
                        step: (obj.step ? obj.step : null), // Number fields
						min: (obj.min ? obj.min : null), // Number fields
						max: (obj.max ? obj.max : null), // Number fields
						value: (obj.value ? obj.value : '') // Allow a default value
                    }
                }
                return columnDefs;
            },

            /**
            * Create both Edit and Add dialogs
            * @param columnDefs as returned by completeColumnDefs()
            */
            createDialog: function(columnDefs, modalTitle, buttonCaption, closeCaption, buttonClass, formName) {
                formName = [formName, this.random_id].join('-');
                var that = this,
                    data = "", 
                    count = 0;

                var fillAttrs = function (obj, attrs)
                {
                    var attrsStr = '';
                    for (var i in attrs) {
                        var attr = attrs[i];
                        if (!obj[attr]) continue;

                        attrsStr += " " + attr + "='" + that._quoteattr(obj[attr]) + "'";
                    }

                    return attrsStr + " ";
                };
                
                for (var j in columnDefs) {
                    var title = columnDefs[j].title.replace(/(<([^>]+)>)/gi, "").trim();

                    //handle hidden fields
                    if (columnDefs[j].type.indexOf("hidden") >= 0) {
                        data += "<input type='hidden' "
                            + "id='" + this._quoteattr(columnDefs[j].name) + "' "
                            + fillAttrs(columnDefs[j], ['name', 'value'])
                            + "></input>";
                    }
                    else {
                        // handle fields that are visible to the user
                        if (columnDefs[j].inline) { //to add upto 4 inline columns
                            if(count == 0) {
                                count++;
                                data += "<div style='margin-left: initial;margin-right: initial;' class='form-group row' id='alteditor-row-" + this._quoteattr(columnDefs[j].name) + "'>";
                                data += "<div class='col-sm-3 col-md-3 col-lg-3 text-right' style='padding-top:4px;'>";
                                data += "<label for='" + this._quoteattr(columnDefs[j].name) + "'>" + title + ":</label></div>";
                                data += "<div class='col-sm-2 col-md-2 col-lg-2'>";
                            }
                            else {
                                data += "<div class='col-sm-2 col-md-2 col-lg-2'>";
                            }
                        }
                        else {
                            data += "<div style='margin-left: initial;margin-right: initial;' class='form-group row' id='alteditor-row-" + this._quoteattr(columnDefs[j].name) +"'>";
                            data += "<div class='col-sm-3 col-md-3 col-lg-3 text-right' style='padding-top:4px;'>";
                            data += "<label for='" + this._quoteattr(columnDefs[j].name) + "'>" + title + ":</label></div>";
                            data += "<div class='col-sm-8 col-md-8 col-lg-8'>";
                        }

                        // Adding select-fields
                        if (columnDefs[j].type.indexOf("select") >= 0) {
                            var options = "",
                                optionsArray = columnDefs[j].options;
                            if (optionsArray.length > 0) {
                                // array-style select or select2
                                for (var i = 0; i < optionsArray.length; i++) {
                                    options += "<option value='" + this._quoteattr(optionsArray[i])
                                        + "'>" + optionsArray[i] + "</option>";
                                }
                            } else {
                                // object-style select or select2
                                for (var x in optionsArray) {
                                    options += "<option value='" + this._quoteattr(x) + "' >"
                                        + optionsArray[x] + "</option>";
                                }
                            }

                            data += "<select class='form-control" + (columnDefs[j].select2 ? ' select2' : '') + "' "
                                + fillAttrs(columnDefs[j], ['name', 'style', 'readonly', 'disabled', 'required', 'multiple'])
                                + "id='" + this._quoteattr(columnDefs[j].name) + "' "
                                + "placeholder='" + this._quoteattr(columnDefs[j].placeholder ? columnDefs[j].placeholder : title) + "' "
                                + "data-special='" + this._quoteattr(columnDefs[j].special) + "' "
                                + "data-unique='" + columnDefs[j].unique + "' "
                                + ">" + options
                                + "</select>";
                        }
                        // Adding Text Area
                        else if (columnDefs[j].type.indexOf("textarea") >= 0)
                        {
                            data += "<textarea class='form-control' "
                                + "id='" + this._quoteattr(columnDefs[j].name) + "' "
                                + fillAttrs(columnDefs[j], ['name', 'style', 'rows', 'cols', 'maxlength', 'readonly', 'disabled', 'required'])
                                + "placeholder='" + this._quoteattr(columnDefs[j].placeholder ? columnDefs[j].placeholder : title) + "' "
                                + "data-special='" + this._quoteattr(columnDefs[j].special) + "' "
                                + "data-unique='" + columnDefs[j].unique + "'>"
                                    + (columnDefs[j].value ? columnDefs[j].value : '')
                                + "</textarea>";
                        }
                        // Adding text-inputs and error labels, but also new HTML5 types (email, color, ...)
                        else {
                            data += "<input class='form-control' "
                                + fillAttrs(columnDefs[j], ['type', 'pattern', 'accept', 'name', 'step', 'min', 'max', 'maxlength', 'value', 'readonly', 'disabled', 'required'])
                                + /* ???? */ (columnDefs[j].type.indexOf("readonly") >= 0 ? "readonly " : "") 
                                + "id='" + this._quoteattr(columnDefs[j].name) + "' "
                                + "title='" + this._quoteattr(columnDefs[j].hoverMsg) + "' "
                                + "placeholder='" + this._quoteattr(columnDefs[j].placeholder ? columnDefs[j].placeholder : title) + "' "
                                + "data-special='" + this._quoteattr(columnDefs[j].special) + "' "
                                + "data-unique='" + columnDefs[j].unique + "' "
                                + "style='overflow: hidden; " + this._quoteattr(columnDefs[j].style) + "' "
                                + "class='form-control form-control-sm'>";
                        }

                        data += "<label id='" + this._quoteattr(columnDefs[j].name) + "-label"
                                + "' class='errorLabel'></label>";

                        if(!columnDefs[j].inline || (+j+1 < columnDefs.length && !columnDefs[+j+1].inline)) {
                            data += "</div><div style='clear:both;'></div></div>";
                        }
                        else {
                            data += "</div>";
                        }
                    }
                }
                // data += "</form>";

                var selector = this.modal_selector;
                var fill = function () 
                {
                    var btns = '<button type="button" data-content="remove" class="btn btn-default button secondary" data-dismiss="modal" data-close>' + closeCaption + '</button>' 
                        + '<button type="submit" form="' + formName + '" data-content="remove" class="btn btn-primary button" id="' + buttonClass + '">' + buttonCaption + '</button>';

                    $(selector).find('.modal-title').html(modalTitle);
                    $(selector).find('.modal-body').html(data);
                    $(selector).find('.modal-footer').html(btns);

                    var modalContent = $(selector).find('.modal-content');
                    if (modalContent.parent().is('form')) {
                        modalContent.parent().attr('name', formName);
                        modalContent.parent().attr('id', formName);
                    } 
                    else {
                        modalContent.wrap("<form name='" + formName + "' id='" + formName + "' role='form'></form>");
                    }
                };

                this.internalOpenDialog(selector, fill);
                $(selector + ' input[0]').trigger('focus');

                var that = this;

                // enable select 2 items, datepicker, datetimepickerm
                for (var j in columnDefs) {
                    if (columnDefs[j].select2) {
                        // Require select2 plugin
                        $(selector).find("select#" + columnDefs[j].name).select2(columnDefs[j].select2);
                    } 
                    else if (columnDefs[j].datepicker) {
                        // Require jquery-ui
                        $(selector).find("#" + columnDefs[j].name).datepicker(columnDefs[j].datepicker);
                    } 
                    else if (columnDefs[j].datetimepicker) {
                        // Require datetimepicker plugin
                        $(selector).find("#" + columnDefs[j].name).datetimepicker(columnDefs[j].datetimepicker);
                    }

                    // custom onchange triggers
                    if (columnDefs[j].editorOnChange) {
                        // $.escapeSelector requires jQuery 3.x
                        $(selector).find("#" + $.escapeSelector(columnDefs[j].name)).attr('alt-editor-id', this._quoteattr(j));
                        $(selector).find("#" + $.escapeSelector(columnDefs[j].name)).on('change', function(elm) {
                            var f = columnDefs[$(this).attr('alt-editor-id')].editorOnChange;
                            f(elm, that);
                        });
                    }

                    //added select sort
                    if (columnDefs[j].type.indexOf("select") >= 0) {
                        if (columnDefs[j].optionsSortByLabel) {
                            var jquerySelector = "#" + columnDefs[j].name.toString().replace(/\./g, "\\.");
                            var opts_list = $(selector).find(jquerySelector).find('option');
                            opts_list.sort(function (a, b) { return $(a).text() > $(b).text() ? 1 : -1; });
                            $(selector).find(jquerySelector).html('').append(opts_list);
                            $(selector).find(jquerySelector).val($(jquerySelector + " option:first").val());
                        }
                    }
                }
            },

            /**
             * Callback for "Add" button
             */
            _addRowData: function () {
                var that = this;

                var rowDataArray = {};
                var $inputs = $('form[name="altEditor-add-form-' + this.random_id + '"]').find( 'select, textarea, input' );

                // Getting the inputs from the edit-modal
                $inputs.filter(':input[type!="file"], :input[type="checkbox"]').each(function (i) {
                    rowDataArray[$(this).attr('id')] = $(this).val();
                });

                //Getting Files from the modal
                var numFilesQueued = 0;
                $inputs.filter(':input[type="file"]').each(function (i) {
                    var context = this;

                    if ($(this).prop('files')[0]) {
                        if (that.encodeFiles) {
                            ++numFilesQueued;
                            that.getBase64($(this).prop('files')[0], function (filecontent) {
                                rowDataArray[$(context).attr('id')] = filecontent;
                                --numFilesQueued;
                            });
                        } else {
                            rowDataArray[$(this).attr('id')] = $(this).prop('files')[0];
                        }
                    }
                });

                // Getting the checkbox from the modal
                $inputs.filter(':input[type="checkbox"]').each(function (i) {
                    rowDataArray[$(this).attr('id')] = this.checked;
                });

                var checkFilesQueued = function() {
                    if (numFilesQueued == 0) {
                        that.onAddRow(that,
                            rowDataArray,
                            function(data){ that._addRowCallback(data); },
                            function(data){ that._errorCallback(data);
                        });
                    } else {
                        console.log("Waiting for file base64-decoding...");
                        setTimeout(checkFilesQueued, 1000);
                    }
                };

                checkFilesQueued();
            },

            /**
             * Called after a row has been deleted on server
             */
            _deleteRowCallback: function (response, status, more) {
                    var selector = this.modal_selector;
                    $(selector + ' .modal-body .alert').remove();

                    if (this.closeModalOnSuccess) {
                        this.internalCloseDialog(selector);
                    } else {
                        var message = '<div class="alert alert-success" role="alert">' +
                            '<strong>' + this.language.success + '</strong>' +
                            '</div>';
                        $(selector + ' .modal-body').append(message);
                    }

                    this.s.dt.rows({
                        selected : true
                    }).remove();
                    this.s.dt.draw('page');

                    // Disabling submit button
                    $("div"+selector).find("button#addRowBtn").prop('disabled', true);
                    $("div"+selector).find("button#editRowBtn").prop('disabled', true);
                    $("div"+selector).find("button#deleteRowBtn").prop('disabled', true);
            },

            /**
             * Called after a row has been inserted on server
             */
            _addRowCallback: function (response, status, more) {

                    //TODO should honor dt.ajax().dataSrc

                    var data = (typeof response === "string") ? JSON.parse(response) : response;
                    var selector = this.modal_selector;
                    $(selector + ' .modal-body .alert').remove();

                    if (this.closeModalOnSuccess) {
                        this.internalCloseDialog(selector);
                    } 
                    else {
                        var message = '<div class="alert alert-success" role="alert">' +
                            '<strong>' + this.language.success + '</strong>' +
                            '</div>';
                        $(selector + ' .modal-body').append(message);
                    }

                    this.s.dt.row.add(data).draw(false);

                    // Disabling submit button
                    $("div" + selector).find("button#addRowBtn").prop('disabled', true);
                    $("div" + selector).find("button#editRowBtn").prop('disabled', true);
                    $("div" + selector).find("button#deleteRowBtn").prop('disabled', true);
            },

            /**
             * Called after a row has been updated on server
             */
            _editRowCallback: function (response, status, more) {

                    //TODO should honor dt.ajax().dataSrc

                    var data = (typeof response === "string") ? JSON.parse(response) : response;
                    var selector = this.modal_selector;
                    $(selector + ' .modal-body .alert').remove();

                    if (this.closeModalOnSuccess) {
                        this.internalCloseDialog(selector);
                    } 
                    else {
                        var message = '<div class="alert alert-success" role="alert">' +
                            '<strong>' + this.language.success + '</strong>' +
                            '</div>';
                        $(selector + ' .modal-body').append(message);
                    }

                    this.s.dt.row({selected: true}).data(data);
                    this.s.dt.draw('page');

                    // Disabling submit button
                    $("div" + selector).find("button#addRowBtn").prop('disabled', true);
                    $("div" + selector).find("button#editRowBtn").prop('disabled', true);
                    $("div" + selector).find("button#deleteRowBtn").prop('disabled', true);
            },

            /**
             * Called after AJAX server returned an error
             */
            _errorCallback: function (response, status, more) {
                    var error = response;
                    var selector = this.modal_selector;
                    $(selector + ' .modal-body .alert').remove();

                    var errstr = this.language.error.message;
                    if (error.responseJSON) {
                        if (error.responseJSON.errors) {
                            errstr = "";
                            for (var key in error.responseJSON.errors) {
                                errstr += error.responseJSON.errors[key][0];
                            }
                        }
                    }
                    else if (error.responseText) {
                        errstr = error.responseText;
                    }
                    else {
                        errstr = (error.status == null) ? "" : this.language.error.responseCode + error.status;
                    }

                    var message = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + this.language.error.label + '</strong>' 
                        + (errstr ? '<br />' + errstr : '') +
                        '</div>';

                    $(selector + ' .modal-body').append(message);
            },

            /**
             * Default callback for insertion: mock webservice, always success.
             */
            onAddRow: function(dt, rowdata, success, error) {
                console.log("Missing AJAX configuration for INSERT");
                success(rowdata);
            },

            /**
             * Default callback for editing: mock webservice, always success.
             */
            onEditRow: function(dt, rowdata, success, error) {
                console.log("Missing AJAX configuration for UPDATE");
                success(rowdata);
            },

            /**
             * Default callback for deletion: mock webservice, always success.
             */
            onDeleteRow: function(dt, selectedRows, success, error) {
                console.log("Missing AJAX configuration for DELETE");
                selectedRows.every(function (rowIdx, tableLoop, rowLoop) {
                    success(this.data())
                })
            },

            /**
             * Open a dialog using available framework
             */
            internalOpenDialog(selector, onopen) {
                var $sel = $(selector);
                if ($sel.modal) {
                    // Bootstrap
                    $sel.on('show.bs.modal', onopen);
                    $sel.modal('show');
                } 
                else if ($sel.foundation){
                    // Foundation
                    $sel.on('open.zf.reveal', onopen);
                    $sel.on('closed.zf.reveal', function() { $('.reveal-overlay').hide(); });
                    var popup = new Foundation.Reveal($sel);
                    popup.open();

                } 
                else {
                    console.error('You must load Bootstrap or Foundation in order to open modal dialogs');
                    return;
                }
            },

            /**
             * Close a dialog using available framework
             */
            internalCloseDialog(selector) {
                var $sel = $(selector);
                if ($sel.modal) {
                    // Bootstrap
                    $sel.modal('hide');

                } else if ($sel.foundation){
                    // Foundation
                    var popup = new Foundation.Reveal($sel);
                    popup.close();
                    $('.reveal-overlay').hide();

                } else {
                    console.error('You must load Bootstrap or Foundation in order to open modal dialogs');
                    return;
                }
            },

            /**
             * Dinamically reload options in SELECT menu
            */
            reloadOptions: function($select, options) {
                var oldValue = $select.val();
                $select.empty(); // remove old options
                if (options.length > 0) {
                    // array-style select or select2
                    $.each(options, function(key, value) {
                      $select.append($("<option></option>")
                         .attr("value", value).text(value));
                    });
                } 
                else {
                    // object-style select or select2
                    $.each(options, function(key, value) {
                      $select.append($("<option></option>")
                         .attr("value", value).text(key));
                    });
                }

                $select.val(oldValue); // if still present, of course
                $select.trigger('change');
            },

            /**
             * Convert file to Base 64 form
             * @see https://stackoverflow.com/questions/36280818
             */
            getBase64: function(file, onSuccess, onError) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                        if (onSuccess) onSuccess(reader.result);
                };
                reader.onerror = function (error) {
                        console.log('Error: ', error);
                        if (onError) onError(error);
                };
            },

            /**
             * Sanitizes input for use in HTML
             * @param s
             * @param preserveCR
             * @returns {string}
             * @private
             */
            _quoteattr: function (s, preserveCR) {
                if (s == null) {
                    return "";
                }

                preserveCR = preserveCR ? '&#13;' : '\n';

                if (Array.isArray(s)) {
                    // for MULTIPLE SELECT
                    var newArray = [];
                    var x;
                    for (x in s) newArray.push(s[x]);
                    return newArray;
                }

                return ('' + s) /* Forces the conversion to string. */
                    .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
                    .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
                    .replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
                    .replace(/[\r\n]/g, preserveCR);
            },
        });

    /**
     * altEditor version
     *
     * @static
     * @type String
     */
    altEditor.version = '2.0';

    /**
     * altEditor defaults
     *
     * @namespace
     */
    altEditor.defaults = {
        /**
         * @type {Boolean} Ask user what they want to do, even for a single
         *       option
         */
        alwaysAsk: false,

        /** @type {string|null} What will trigger a focus */
        focus: null, // focus, click, hover

        /** @type {column-selector} Columns to provide auto fill for */
        columns: '', // all

        /** @type {boolean|null} Update the cells after a drag */
        update: null, // false is editor given, true otherwise

        /** @type {DataTable.Editor} Editor instance for automatic submission */
        editor: null
    };

    /**
     * Classes used by altEditor that are configurable
     *
     * @namespace
     */
    altEditor.classes = {
        /** @type {String} Class used by the selection button */
        btn: 'btn'
    };

    // Attach a listener to the document which listens for DataTables
    // initialisation
    // events so we can automatically initialise
    $(document).on('preInit.dt.altEditor', function (e, settings, json) {
        if (e.namespace !== 'dt') {
            return;
        }

        var init = settings.oInit.altEditor;
        var defaults = DataTable.defaults.altEditor;

        if (init || defaults) {
            var opts = $.extend({}, init, defaults);

            if (init !== false) {

                var editor = new altEditor(settings, opts);
                // e is a jQuery event object
                // e.target is the underlying jQuery object, e.g. $('#mytable')
                // so that you can retrieve the altEditor object later
                e.target.altEditor = editor;
            }
        }
    });

    // Alias for access
    DataTable.altEditor = altEditor;
    return altEditor;
});