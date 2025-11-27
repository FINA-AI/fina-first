Ext.define('first.view.registration.task.SanctionedPeopleChecklistWindow', {
    extend: 'Ext.window.Window',

    xtype: 'sanctionedPeopleChecklistWindow',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.grid.column.Column',
        'Ext.grid.column.Date',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.selection.CellModel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.store.registration.SanctionedPeopleStore',
        'first.view.registration.task.SanctionedPeopleChecklistController'
    ],
    controller: 'sanctionedPeopleChecklistController',

    height: Ext.getBody().getViewSize().height - 120,
    width: Ext.getBody().getViewSize().width - 120,
    resizable: true,
    maximizable: true,
    modal: true,

    layout: {
        type: 'fit'
    },

    title: i18n.goToSanctionedPeopleChecklist,

    items: [
        {
            xtype: 'grid',
            reference: 'sanctionedPeopleChecklist',
            height: '300px',
            width: '500px',
            columnLines: true,

            selModel: {
                type: 'cellmodel'
            },

            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
                listeners: {
                    beforeedit: 'beforeCellEdit'
                }

            },

            store: {
                type: 'sanctionedPeopleStore'
            },

            tbar: {
                items: [
                    '->', {
                        xtype: 'button',
                        text: i18n.export,
                        iconCls: 'x-fa fa-cloud-download-alt',
                        cls: 'finaSecondaryBtn',
                        handler: 'exportSanctionedPeople'
                    }]
            },

            columns: [
                {
                    flex: 0,
                    xtype: 'rownumberer'
                },
                {
                    header: i18n.personType,
                    dataIndex: 'fina_fiSanctionedPeopleChecklistItemType',
                    flex: 2,
                    renderer: function (content, cell, record) {
                        let value = record.get('fina_fiSanctionedPeopleChecklistItemType');
                        let v = value.includes(":") ? value.split(":")[1] : value;
                        return i18n[v] ? i18n[v] : v;
                    }
                },
                {
                    header: i18n.nameAndIdentificationNumber,
                    dataIndex: 'fina_fiSanctionedPeopleChecklistItemName',
                    flex: 2,
                    renderer: 'onRenderName'
                },
                {
                    xtype: 'gridcolumn',

                    dataIndex: 'fina_fiSanctionedPeopleChecklistItemIsSanctioned',
                    header: i18n.isInList,
                    displayField: 'value',
                    flex: 1,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return [undefined, null].includes(value) ? value : value ? i18n.yes : i18n.no;
                    },

                    editor: {
                        xtype: 'combo',
                        allowBlank: false,
                        displayField: 'value',
                        valueField: 'fina_fiSanctionedPeopleChecklistItemIsSanctioned',

                        store: {
                            data: [
                                {value: i18n.yes, fina_fiSanctionedPeopleChecklistItemIsSanctioned: true},
                                {value: i18n.no, fina_fiSanctionedPeopleChecklistItemIsSanctioned: false}
                            ]
                        },
                        listeners: {
                            'change': 'isInListChangeListener'
                        }
                    },
                },
                {
                    xtype: 'datecolumn',
                    header: i18n.dateChecked,
                    dataIndex: 'fina_fiSanctionedPeopleChecklistItemDateChecked',
                    flex: 1,
                    width: 95,
                    renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat),
                    editor: {
                        xtype: 'datefield',
                        format: first.config.Config.dateFormat,
                        allowBlank: false
                    }

                },
                {
                    header: i18n.sanctionedPeopleChecklistItemComment,
                    dataIndex: 'fina_fiSanctionedPeopleChecklistItemComment',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: true
                    },
                    flex: 1
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                }
            },
        }
    ],

    listeners: {
        afterrender: 'afterRender'
    },
    buttons: {
        bind: {
            hidden: '{!isRegistryActionEditor || isAccepted}'
        },
        items: [{
            text: i18n.cancel,
            iconCls: 'x-fa fa-times',
            handler: 'onCancelClick',
            cls: 'finaSecondaryBtn'
        }, {
            text: i18n.save,
            iconCls: 'x-fa fa-save',
            handler: 'onSaveClick',
            cls: 'finaPrimaryBtn'
        }]
    }
});
