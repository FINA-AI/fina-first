Ext.define('first.view.registration.task.ControllerGapCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'controllerGap',

    requires: [
        'Ext.button.Button',
        'first.view.registration.task.ControllerGapController',
    ],

    controller: 'controllerGap',

    layout: {
        type: 'fit'
    },

    margin: 1,

    items: [
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
            reference: 'controllerGapGridView',
            columnLines: true,
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
                flex: 1,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                items: [{
                    iconCls: 'x-fa fa-edit icon-margin',
                    tooltip: i18n.edit,
                    handler: 'onEditClick',
                    isDisabled: 'disableEdit'
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
                flex: 1,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                items: [{
                    iconCls: 'cell-editing-delete-row',
                    handler: 'onRemoveClick',
                    tooltip: i18n.delete,
                    isDisabled: 'disableRemove'
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
        items: [
            '->', {
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
