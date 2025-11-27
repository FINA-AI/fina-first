Ext.define('first.view.fi.request.FiTreePicker', {
    extend: 'Ext.tree.Panel',

    xtype: 'fiTreePicker',

    requires: [
        'Ext.data.TreeModel',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.form.field.ComboBox'
    ],


    store: {
        type: 'tree',
        model: new Ext.data.TreeModel({
            fields: [
                {name: 'id', type: 'string'},
                {name: 'code', type: 'string'},
                {name: 'name', type: 'string'},
                {name: 'description', type: 'string'},
                {name: 'fiTypeCode', type: 'string'},
                {name: 'checked', type: 'boolean', defaultValue: false}
            ],


            root: {
                name: 'ROOT',
                id: 'root',
                expanded: true
            }


        }),

        defaultRootId: 'root',

        autoLoad: true,

        proxy: {
            type: 'rest',
            enablePaging: true,
            url: first.config.Config.remoteRestUrl + 'ecm/fi/list/'
        }

    },

    minHeight: 300,

    pickerField: this,
    displayField: 'code',
    useArrows: true,
    refresh: function () {
    },

    bindStore: function () {
    },

    tbar: [
        {
            xtype: 'combo',
            emptyText: i18n.basicFilterFiEmpty,
            store: {
                model: 'first.model.fi.FirstFiModel',

                autoLoad: false,

                proxy: {
                    type: 'rest',
                    enablePaging: true,
                    url: first.config.Config.remoteRestUrl + 'ecm/fi/list/search',
                    reader: {
                        type: 'json',
                        rootProperty: 'list',
                        totalProperty: 'totalResults'
                    }
                }
            },
            pageSize: 20,

            minChars: 2,
            queryMode: 'remote',
            displayField: 'name',
            valueField: 'id',
            multiSelect: false,
            flex: 1,

            listConfig: {
                itemTpl: [
                    '<div data-qtip="{code} - {name}">{code} - {name}</div>'
                ]
            },

            listeners: {
                select: 'onSearchFiComboSelect'
            }
        }
    ],


    columns: [{
        xtype: 'treecolumn',
        header: false,
        text: 'Name',
        flex: 1,
        align: 'left',
        dataIndex: 'code',
        renderer: function (v, metaData, record) {
            metaData.tdAttr = 'data-qtip="' + v + '"';
            if (record.get('leaf')) {
                record.data.iconCls = 'x-fa fa-university';
                return v + ' - ' + record.get('name');
            } else {
                return record.get('code');
            }
        }

    }],

    rootVisible: false,
    floating: true,
    hidden: true,
    focusOnToFront: false,

    animate: true,
    listeners: {
        checkchange: 'onFiPickerCheckChange'
    }

});
