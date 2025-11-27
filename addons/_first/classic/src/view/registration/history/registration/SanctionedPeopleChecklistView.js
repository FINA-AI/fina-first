Ext.define('first.view.registration.history.registration.SanctionedPeopleChecklistView', {
    extend: 'Ext.grid.Panel',

    xtype: 'sanctionedPeopleChecklistView',

    requires: [
        'Ext.form.field.ComboBox',
        'Ext.grid.column.Column',
        'Ext.grid.column.Date',
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'first.store.registration.SanctionedPeopleStore',
        'first.view.registration.history.registration.SanctionedPeopleChecklistViewController'
    ],

    controller: 'sanctionedPeopleChecklistViewController',

    layout: {
        type: 'fit'
    },

    columnLines: true,

    store: {
        type: 'sanctionedPeopleStore'
    },

    columns: [{
        flex: 0,
        xtype: 'rownumberer'
    }, {
        header: i18n.personType,
        dataIndex: 'fina_fiSanctionedPeopleChecklistItemType',
        flex: 2,
        renderer: function (content, cell, record) {
            let value = record.get('fina_fiSanctionedPeopleChecklistItemType');
            let v = value.includes(":") ? value.split(":")[1] : value;
            return i18n[v] ? i18n[v] : v;
        }
    }, {
        header: i18n.nameAndIdentificationNumber,
        dataIndex: 'fina_fiSanctionedPeopleChecklistItemName',
        flex: 2,
        renderer: function (content, cell, record) {
            let name = record.get('fina_fiSanctionedPeopleChecklistItemName');
            let idNum = record.get('fina_fiSanctionedPeopleChecklistItemIdNumber');
            let date = record.get('fina_fiSanctionedPeopleChecklistItemBirthDate');
            let formatDate = date? ", " + Ext.Date.format(new Date(date), first.config.Config.dateFormat) : "";
            return (name ? (name + ",  " + idNum) : idNum) +formatDate;
        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'fina_fiSanctionedPeopleChecklistItemIsSanctioned',
        header: i18n.isInList,
        displayField: 'value',
        flex: 1,
        renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
            return value ? i18n.yes : i18n.no;
        },

        editor: {
            xtype: 'combo',
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
    }, {
        xtype: 'datecolumn',
        header: i18n.dateChecked,
        dataIndex: 'fina_fiSanctionedPeopleChecklistItemDateChecked',
        flex: 1,
        width: 95,
        format: first.config.Config.dateFormat
    }, {
        header: i18n.sanctionedPeopleChecklistItemComment,
        dataIndex: 'fina_fiSanctionedPeopleChecklistItemComment',
        flex: 1
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    listeners: {
        afterrender: 'afterRender'
    }

});
