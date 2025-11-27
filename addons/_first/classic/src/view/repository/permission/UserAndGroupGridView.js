Ext.define('first.view.repository.permission.UserAndGroupGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'userAndGroup',

    requires: [
        'first.store.permission.UserAndGroupStore'
    ],

    columnLines: true,
    layout: 'fit',

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [
            {
                xtype: 'textfield',
                triggers: {
                    clear: {
                        weight: 0,
                        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        hidden: true,
                        handler: function (textfield, trigger, op) {
                            var me = this;
                            me.setValue('');
                            me.getTrigger('clear').hide();
                            me.updateLayout();
                        }
                    },
                    search: {
                        weight: 1,
                        cls: Ext.baseCSSPrefix + 'form-search-trigger',
                        handler: function (textfield, trigger, op) {
                            op.charCode = Ext.EventObject.ENTER;
                            var me = this, value = me.getValue();

                            if (value.trim().length > 0) {
                                me.activeFilter = new Ext.util.Filter({
                                    property: me.paramName,
                                    value: value
                                });
                                me.getTrigger('clear').show();
                                me.updateLayout();
                                this.fireEvent('keypress', textfield, op)
                            }
                        },
                    }
                },
                reference: 'searchTextField',
                hideLabel: true,
                flex: 1,
                fieldStyle: 'font-family: FontAwesome',
                emptyText: i18n.Search,
                enableKeyEvents: true,
                minLength: 1,
                listeners: {
                    keypress: 'onFilter'
                }
            }
        ]
    },


    store: {
        type: 'userAndGroup'
    },

    selType: 'checkboxmodel',

    columns: {
        defaults: {
            align: 'left'
        },
        items: [{
            width: 40,
            sortable: false,
            renderer: function (value, metadata, record, col, row, grid) {
                metadata.style = 'cursor: pointer; ';

                return record.get('nodeType') === 'cm:person' ? '<i class="fa fa-user" </i>' : '<i class="fa fa-users"></i>';
            }
        }, {
            header: i18n.repositoryUserAndGroupGridNameColumn,
            dataIndex: 'name',
            flex: 1,
            renderer: function (value, metadata, record, col, row, grid) {
                if (record.get('nodeType') === 'cm:person') {
                    let firstName = record.get('properties')['cm:firstName'];
                    let lastName = record.get('properties')['cm:lastName'];
                    value = (firstName ? firstName : '') + ' ' + (lastName ? lastName : '') + '(' + record.get('properties')['cm:userName'] + ')';
                } else {
                    value = record.get('properties')['cm:authorityName'];
                }
                metadata.style = 'cursor: pointer; ';
                return value;
            }
        }
        ]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    }


});
