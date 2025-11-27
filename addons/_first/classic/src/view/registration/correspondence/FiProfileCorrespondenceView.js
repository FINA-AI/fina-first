Ext.define('first.view.registration.correspondence.FiProfileCorrespondenceView', {
    extend: 'Ext.grid.Panel',
    xtype: 'fiProfileCorrespondenceEcm',

    requires: [
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'first.ux.form.field.SearchField'
    ],

    store: {
        type: 'correspondenceStore'
    },

    emptyText: 'No data to display',

    viewConfig: {
        loadMask: true
    },

    controller: 'correspondenceControllerEcm',

    border: false,

    columnLines: true,
    header: false,

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [
            {
                text: i18n.add,
                iconCls: 'x-fa fa-plus',
                cls: 'finaPrimaryBtn',
                disabled: true,
                bind: {
                    disabled: '{!isRegistryActionEditor}',
                    hidden: false
                },
                menu: {
                    items: [
                        {
                            text: i18n.TYPE_SMS,
                            tooltip: i18n.TYPE_SMS,
                            iconCls: 'x-fa fa-comment-o',
                            handler: 'onAddItem',
                            type: 'SMS'
                        },
                        {
                            text: i18n.TYPE_EMAIL,
                            tooltip: i18n.TYPE_EMAIL,
                            iconCls: 'x-fa fa-at',
                            handler: 'onAddItem',
                            type: 'EMAIL'
                        }
                    ]
                }
            },
            {
                flex: 1,
                xtype: 'ux-searchField',
                reference: 'searchField',
                onSearch: 'onSearch'
            }
        ]
    },

    columns: {
        defaults: {
            flex: 1
        },
        items: [
            {
                xtype: 'rownumberer',
                flex: 0,
            },
            {
                xtype: 'actioncolumn',
                width: 55,
                items: [{
                    tooltip: i18n.edit,
                    iconCls: 'x-fa fa-edit icon-margin',
                    handler: 'onEditClick',
                }, {
                    iconCls: 'x-fa fa-history',
                    cls: 'firstSystemButtons',
                    text: i18n.changeHistory,
                    handler: 'onHistoryClick'
                }]
            },
            {
                text: i18n.status,
                dataIndex: 'fina_smsStatus',
                renderer: function (value, record) {
                    return i18n[value] ? i18n[value] : value;
                }
            },
            {
                text: i18n.type,
                flex: 1,
                dataIndex: 'fina_smsType',
                renderer: function (value, record) {
                    return i18n['TYPE_'+ value] ? i18n['TYPE_'+ value] : value;
                }
            },

            {
                text: i18n.recipients,
                dataIndex: 'fina_smsAddress'
            },
            {
                text: i18n.title,
                dataIndex: 'fina_smsTitle'
            },
            {
                text: i18n.content,
                flex: 3,
                dataIndex: 'fina_smsContent'
            },
            {
                text: i18n.creationDate,
                xtype: 'datecolumn',
                dataIndex: 'fina_smsCreationDate',
                format: first.config.Config.dateFormat
            },
            {
                text: i18n.sendDate,
                xtype: 'datecolumn',
                dataIndex: 'fina_smsSendDate',
                format: first.config.Config.dateFormat
            },
            {
                xtype: 'actioncolumn',

                width: '10px',
                sortable: false,
                menuDisabled: true,
                items: [{
                    iconCls: 'x-fa fa-minus-circle redColor',
                    tooltip: i18n.delete,
                    handler: 'onRemoveClick',
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        let vm = view.grid.getViewModel();
                        return !vm.get('isRegistryActionEditor');
                    },
                    getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                        return first.util.GridActionColumnUtil.getDeleteButtonClassName(view.grid.getViewModel(), record);
                    }
                }],
            }
        ]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        displayInfo: true,
        items: ['->'],
        prependButtons: true
    }
});