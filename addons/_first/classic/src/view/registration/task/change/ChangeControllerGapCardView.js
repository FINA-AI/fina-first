Ext.define('first.view.registration.task.change.ChangeControllerGapCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'changeControllerGapCard',

    requires: [
        'Ext.button.Button',
        'Ext.form.Label',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.store.registration.FiGapStore',
        'first.view.registration.task.change.ChangeControllerGapCardController',
        'first.view.registration.task.shared.CardHeaderView'
    ],

    controller: 'changeControllerGapCard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'cardHeader'
        },
        {
            xtype: 'label',
            hidden: true,
            bind: {
                html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToRedactor + "</br></br></br><b><i>" + ' " {redactorName} "' + '</b></i></p>',
                hidden: '{!showTaskStatusMessage}'
            }
        },
        {
            xtype: 'grid',
            flex: 1,
            columnLines: true,
            reference: 'controllerGapGridView',
            tbar: {
                items: [{
                    iconCls: 'x-fa fa-plus',
                    cls: 'finaSecondaryBtn',
                    tooltip: i18n.addErrorButtonText,
                    text: i18n.addErrorButtonText,
                    handler: 'onAddClick',
                    bind: {
                        disabled: '{isDeclined}'
                    }
                }]
            },

            store: {
                type: 'fiGapStore'
            },

            columns: [{
                flex: 0,
                xtype: 'rownumberer'
            }, {
                xtype: 'actioncolumn',
                width: 50,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                items: [{
                    iconCls: 'x-fa fa-edit',
                    tooltip: i18n.edit,
                    handler: 'onEditClick',
                    isActionDisabled: 'disableEdit'
                }]
            }, {
                text: i18n.errorObjectColumnTitle,
                flex: 1,
                dataIndex: 'fina_fiGapObject',
                renderer: 'objectRenderer'
            }, {
                text: i18n.errorReasonColumnTitle,
                flex: 1,
                dataIndex: 'fina_fiGapReason',
                renderer: 'reasonRenderer'
            }, {
                xtype: 'actioncolumn',
                width: 50,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                items: [{
                    iconCls: 'cell-editing-delete-row',
                    handler: 'onRemoveClick',
                    tooltip: i18n.delete,
                    isActionDisabled: 'disableRemove'
                }]
            }],


            bbar: {
                xtype: 'pagingtoolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                }
            },
        }
    ],

    bbar: {
        cls:'firstFiRegistryTbar',
        items: [
            '->',
            {
                xtype: 'button',
                cls: 'finaSecondaryBtn',
                text: i18n.goBack,
                handler: 'onBack',
                bind: {
                    disabled: '{isDeclined}'
                }
            },
            {
                xtype: 'button',
                cls: 'finaPrimaryBtn',
                text: i18n.sendGapToRedactor,
                handler: 'onSendGap',
                bind: {
                    disabled: '{isDeclined}'
                }
            }
        ]
    }

});
