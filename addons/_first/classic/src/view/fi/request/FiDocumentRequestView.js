Ext.define('first.view.fi.request.FiDocumentRequestView', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.feature.Grouping',
        'Ext.layout.container.HBox',
        'Ext.selection.CellModel',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.util.Format',
        'Ext.util.History',
        'first.store.fi.FiDocumentRequestStore',
        'first.view.fi.request.FiDocumentRequestController',
        'first.view.fi.request.FiDocumentRequestModel'
    ],

    xtype: 'fiDocumentRequest',

    viewModel: {
        type: 'fiDocumentRequest'
    },

    controller: 'fiDocumentRequest',

    title: '<div><i class="fas fa-file-invoice" style="margin: 2px; font-size: 18px;"></i></br>' + i18n.fiDocumentRequestTitle + '</div>',
    titleAlign: 'center',

    columnLines: true,

    loadMask: true,

    bind: {
        selection: '{selectedFiDocumentRequestItem}'
    },

    features: [{
        ftype: 'grouping',
        startCollapsed: false
    }],

    store: {
        type: 'fiDocumentRequest',
    },

    tbar: [{
        handler: function () {
            Ext.History.back();
        },
        iconCls: 'x-fa fa-arrow-left',
        cls: 'firstSystemButtons',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "fiDocumentRequestPage"}'
        }
    }, {
        handler: function () {
            Ext.History.forward();
        },
        iconCls: 'x-fa fa-arrow-right',
        cls: 'firstSystemButtons',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "fiDocumentRequestPage"}'
        }
    }, {
        xtype: 'tbseparator',
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "fiDocumentRequestPage"}'
        }
    }, {
        text: i18n.add,
        iconCls: 'x-fa fa-plus-circle',
        handler: 'onAddClick',
        cls: 'finaPrimaryBtn',
        hidden: true,
        bind: {
            hidden: '{!hasFiDocumentRequestAmendPermission}'
        }
    }, {
        iconCls: 'x-fa fa-sync',
        text: i18n.refresh,
        handler: 'onRefreshClick',
        cls: 'finaSecondaryBtn'
    }],

    columns: {
        defaults: {
            flex: 1
        },
        items: [{
            flex: 0,
            xtype: 'rownumberer'
        }, {
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-edit',
                handler: 'onEditClick',
                isDisabled: 'isEditActionDisabled'
            }, ' ', {
                iconCls: 'x-fa fa-trash',
                handler: 'onDeleteClick',
                isDisabled: 'isDeleteActionDisabled'
            }]
        }, {
            text: i18n.fiDocumentRequestGridColumnName,
            dataIndex: 'name'
        }, {
            flex: 2,
            text: i18n.fiDocumentRequestGridColumnDescription,
            dataIndex: 'description'
        }, {
            text: i18n.attestationFiCode,
            dataIndex: 'assigneeFiCode'
        }, {
            text: i18n.attestationFiName,
            dataIndex: 'assigneeFiName'
        }, {
            align: 'center',
            text: i18n.fiDocumentRequestGridColumnDueDate,
            dataIndex: 'dueDate',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat)
        }, {
            text: i18n.fiDocumentRequestGridColumnSubmissionStatus,
            xtype: 'actioncolumn',
            dataIndex: 'submitted',
            align: 'center',
            sortable: true,
            resizable: false,
            items: [{
                getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                    value = value ? i18n.submitted : i18n.notSubmitted;
                    meta.tdAttr = 'data-qtip="' + value + '"';
                    if (record.get('submitted')) {
                        return 'cell-license-status-active';
                    }
                    return 'cell-license-status-inactive';
                }
            }]
        }, {
            align: 'center',
            text: i18n.fiDocumentRequestGridColumnSubmissionDate,
            dataIndex: 'submissionDate',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat)
        }, {
            hidden: true,
            align: 'center',
            text: i18n.createdAt,
            dataIndex: 'createdAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }, {
            hidden: true,
            align: 'center',
            header: i18n.modifiedAt,
            dataIndex: 'modifiedAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    listeners: {
        select: 'onSelectFiDocumentRequestItem',
        afterrender: 'afterRender'
    }
});