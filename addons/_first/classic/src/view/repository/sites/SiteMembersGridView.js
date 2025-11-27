/**
 * Created by oto on 27.04.20.
 */
Ext.define('first.view.repository.sites.SiteMembersGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'siteMembersGrid',

    requires: [
        'Ext.button.Button',
        'Ext.data.Model',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Ext.form.field.ComboBox',
        'Ext.grid.column.Action',
        'Ext.grid.column.Widget',
        'first.config.Config'
    ],

    columnLines: true,
    layout: 'fit',

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'x-fa fa-plus',
                handler: 'onAddButtonClick'
            }, '|', {
                xtype: 'button',
                text: 'Save',
                iconCls: 'x-fa fa-save',
                handler: 'onSaveSiteMembersClick'
            }
        ]
    },

    viewConfig: {
        stripeRows: true,
        enableTextSelection: false,
        markDirty: true
    },

    trackMouseOver: false,
    disableSelection: true,

    store: {
        alias: 'store.siteMembersStore',

        model: Ext.create('Ext.data.Model', {
            fields: [
                {name: 'id', type: 'string'},
                {name: 'person'},
                {name: 'role'}
            ],

            idProperty: 'id'
        }),

        autoLoad: false,

        proxy: {
            type: 'rest',
            url: first.config.Config.remoteRestUrl + "ecm/sites/{0}/members",
            reader: {
                type: 'json'
            },
            writer: {
                type: 'json',
                writeAllFields: true
            }
        },
    },

    columns: {
        defaults: {
            align: 'left'
        },
        items: [{
            width: 40,
            sortable: false,
            renderer: function (value, metadata, record, col, row, grid) {
                metadata.style = 'cursor: pointer; ';
                return record.get('authority')['authorityType'] === 'GROUP' ? '<i class="fa fa-users" </i>' : '<i class="fa fa-user"></i>';
            }
        }, {
            header: 'Authority Id',
            dataIndex: 'id',
            bind: '{record.id}',
            renderer: function (value, metadata, record) {
                let authority = record.get('authority');
                return authority['fullName'];
            },
            flex: 1
        }, {
            header: i18n.description,
            dataIndex: 'description',
            renderer: function (value, metadata, record, col, row, grid) {
                let authority = record.get('authority'),
                    type = authority['authorityType'];

                switch (type) {
                    case 'GROUP':
                        value = authority['displayName'] ? authority['displayName'] : authority['fullName'];
                        break;
                    case 'USER':
                        let firstName = authority['firstName'],
                            lastName = authority['lastName'];
                        firstName = firstName ? firstName : '';
                        lastName = lastName ? lastName : '';
                        value = firstName + ' ' + lastName;
                        break;
                }
                return value;

            },
            flex: 1
        }, {
            xtype: 'widgetcolumn',
            header: i18n.role,
            dataIndex: 'role',
            flex: 1,
            valueField: 'id',
            widget: {
                xtype: 'combo',
                bind: {
                    value: '{record.role}'
                },
                valueField: 'id',
                displayField: 'name',
                store: [{id: 'SiteManager', name: 'Manager'},
                    {id: 'SiteCollaborator', name: 'Collaborator'},
                    {id: 'SiteContributor', name: 'Contributor'},
                    {id: 'SiteConsumer', name: 'Consumer'}]
            }
        }, {
            menuDisabled: true,
            sortable: false,
            resizable: false,
            xtype: 'actioncolumn',
            width: 30,
            items: [{
                iconCls: 'x-fa fa-minus-circle removeButtonStyle',
                tooltip: 'Remove',
                handler: 'onRemoveMemberClick',
                tooltip: 'Delete',
                isDisabled: 'isDisabledRemoveColumn',
                getClass: function (value, meta, record, rowIx, ColIx, store, view) {
                    return record.get('type') === "INHERITED" ?
                        'x-hide-display' :
                        "x-fa fa-minus-circle removeButtonStyle";
                }
            }]
        }]
    },


});