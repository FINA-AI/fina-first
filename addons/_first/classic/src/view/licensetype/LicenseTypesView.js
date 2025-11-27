Ext.define('first.view.licensetype.LicenseTypesView', {
    extend: 'Ext.grid.Panel',

    xtype: 'licenseTypesView',

    requires: [
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
    ],

    controller: 'licenseTypeController',

    layout: 'fit',

    loadMask: true,

    columnLines: true,

    store: {
        type: 'licenseTypeStore'
    },

    tbar: {
        cls:'firstFiRegistryTbar',
        items: [{
            text: i18n.licenseTypeAdd,
            iconCls: 'x-fa fa-plus-circle',
            handler: 'onAddClick',
            flex: 1,
            cls: 'finaPrimaryBtn'
        }, {
            xtype: 'textfield',
            emptyText: i18n.licenseTypeSearch,
            flex: 4,
            enableKeyEvents: true,
            listeners: {
                keypress: 'onEnterPress'
            }
        }],
        bind: {
            hidden: '{!hasConfigAmendPermission}'
        }
    },

    columns: {
        defaults: {
            align: 'left',
            flex: 2
        },
        items: [{
            xtype: 'rownumberer',
            flex: 0
        },{
            menuDisabled: true,
            sortable: false,
            hideable: false,
            xtype: 'actioncolumn',
            align: 'center',
            flex: 0,
            items: [{
                iconCls: 'x-fa fa-edit icon-margin',
                handler: 'onEditClick',
            },{
                iconCls: 'x-fa fa-trash',
                handler: 'onRemoveClick'

            }]
        },{
            text: i18n.type,
            dataIndex: 'type',
            flex: 1,
            renderer: function (value) {
                if (value === 'LICENSE') {
                    return i18n.LICENSE
                } else if (value === "CERTIFICATE") {
                    return i18n.CERTIFICATE
                }
            }
        }, {
            text: i18n.licenseTypeIdentifier,
            dataIndex: 'identifier',
        }, {
            text: i18n.licenseName,
            dataIndex: 'name'
        },{
            text: i18n.licenseRegistrationDate,
            dataIndex: 'registrationDate',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.dateFormat)
        },{
            text: i18n.licenseDocumentNumber,
            dataIndex: 'documentNumber', 
            flex: 1
        }]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }
});
