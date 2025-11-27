Ext.define('first.view.registration.FiLinkedInfoView', {
    extend: 'Ext.grid.Panel',

    xtype: 'linkedInfo',

    requires: [
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.feature.Grouping',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'Ext.util.Filter',
        'first.config.Config',
        'first.store.registration.FiLinkedInfoStore',
        'first.util.WorkflowHelper',
        'first.view.registration.FiLinkedInfoController'
    ],

    controller: 'fiLinkedInfoController',


    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [
            {
                iconCls: 'x-fa fa-eye',
                cls: 'firstSystemButtons',
                tooltip: i18n.showAll,
                text: i18n.showAll,
                handler: 'onShowAllPersonsClick',
                enableToggle: true,
                pressed: false,
            }, {
                xtype: 'textfield',

                triggers: {
                    clear: {
                        weight: 0,
                        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        hidden: true,
                        handler: 'onClear'
                    },
                    search: {
                        weight: 1,
                        cls: Ext.baseCSSPrefix + 'form-search-trigger',
                        handler: function (textfield, trigger, op) {
                            op.charCode = Ext.EventObject.ENTER;
                            var me = this, value = me.getValue();

                            if (value.trim().length === 0 || value.trim().length >= 3) {
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
                listeners: {
                    keypress: 'onSearchFieldEnterClick'

                }
            },]
    },

    store: {
        type: 'fiLinkedInfoStoreEcm'
    },

    reference: 'linkedInfoGrid',

    columnLines: true,

    features: [{
        ftype: 'grouping',
        enableGroupingMenu: false,
    }],

    columns: [{
        flex: 0,
        xtype: 'rownumberer',
        enableGroupContext: true
    }, {
        xtype: 'actioncolumn',
        flex: 0,
        align: 'center',
        menuDisabled: true,
        sortable: false,
        hideable: false,
        resizable: false,
        items: [{
            iconCls: 'x-fa fa-eye',
            tooltip: i18n.view,
            handler: 'onViewClick',
            isDisabled: function (view, rowIndex, colIndex, item, record) {
                return record.get('nodeType') === 'fina:fiFine';
            },
        }]
    }, {
        text: i18n.status,
        flex: 1,
        dataIndex: 'status',
        renderer: function (content, cell, record) {
            let nodeType = record.get('nodeType').split(":")[1];
            let value = '';
            let status = record.get('properties')['fina:finalStatus'];
            nodeType = nodeType.startsWith("fiAuthorizedPerson") ? 'fiAuthorizedPerson' : nodeType;
            nodeType = nodeType.startsWith("fiComplexStructure") ? 'fiBeneficiary' : nodeType;

            if (status === 'CANCELED') {
                cell.style = 'color:red;';
            }


            switch (nodeType) {
                case 'fiAuthorizedPerson':
                case 'fiBeneficiary':
                    value = i18n[status];
                    break;
            }

            record.set({'status': value}, {
                dirty: false
            });
            return value;
        }
    }, {
        text: i18n.linkType,
        flex: 1,
        dataIndex: 'linkType',
        renderer: function (content, cell, record) {
            let nodeType = record.get('nodeType').split(":")[1];
            let value = '';
            nodeType = nodeType.startsWith("fiComplexStructure") ? 'fiBeneficiary' : nodeType;
            nodeType = nodeType.startsWith("fiAuthorizedPerson") ? 'fiAuthorizedPerson' : nodeType;

            switch (nodeType) {
                case 'fiAuthorizedPerson':
                    value = i18n.authorizedPerson;
                    break;
                case 'fiBeneficiary':
                    value = i18n.beneficiary;
                    break;
                case 'fiFine':
                    value = i18n.fine;
                    break;
                default:
                    if (Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), record.get('nodeType'))) {
                        value = i18n.fi;
                    }
                    break;
            }
            record.set({'linkType': value}, {
                dirty: false
            });

            return value;
        }
    }, {
        text: i18n.registrationNumber,
        flex: 1,
        dataIndex: 'registrationNumber',
        renderer: function (content, cell, record) {
            let value = record.get('properties')['fina:fiRegistryCode'];
            if (Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), record.get('nodeType'))) {
                value = record.get('properties')['fina:fiRegistryCode'];
            } else if (record.get('properties')['fina:fiRegistry']) {
                value = record.get('properties')['fina:fiRegistry'].properties['fina:fiRegistryCode'];
            }

            record.set({'registrationNumber': value}, {
                dirty: false
            });
            return value;
        }
    }, {
        text: i18n.fiActionFiName,
        flex: 1,
        dataIndex: 'fiActionFiName',
        renderer: function (content, cell, record) {
            let value = '';
            if (Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), record.get('nodeType'))) {
                value = record.get('properties')['fina:fiRegistryName'];
            } else if (record.get('properties')['fina:fiRegistry']) {
                value = record.get('properties')['fina:fiRegistry'].properties['fina:fiRegistryName'];
            }

            record.set({'fiActionFiName': value}, {
                dirty: false
            });
            return value;
        }
    }, {
        text: i18n.identificationNumber,
        flex: 1,
        dataIndex: 'idNumber',
        renderer: function (content, cell, record) {
            let nodeType = record.get('nodeType').split(":")[1];
            let value = record.get('properties')['fina:fiRegistryIdentity'];
            nodeType = nodeType.startsWith("fiComplexStructure") ? 'fiBeneficiary' : nodeType;
            nodeType = nodeType.startsWith("fiAuthorizedPerson") ? 'fiAuthorizedPerson' : nodeType;

            let fiRegistry = record.get('properties')['fina:fiRegistry'];

            switch (nodeType) {
                case 'fiAuthorizedPerson':
                case 'fiBeneficiary':
                    value = record.get('properties')['fina:fiPersonPersonalNumber'];
                    break;
                case 'fiFine':
                    value = fiRegistry['properties']['fina:fiRegistryIdentity'];
                    break;
                default :
                    if (Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), record.get('nodeType'))) {
                        value = record.get('properties')['fina:fiRegistryIdentity'];
                    }
                    break;
            }

            record.set({'idNumber': value}, {
                dirty: false
            });
            return value;
        }
    }, {
        text: i18n.linkedGridColumnName,
        flex: 1,
        dataIndex: 'name',
        renderer: function (content, cell, record) {
            let nodeType = record.get('nodeType').split(":")[1];
            let value = '';
            nodeType = nodeType.startsWith("fiComplexStructure") ? 'fiBeneficiary' : nodeType;
            nodeType = nodeType.startsWith("fiAuthorizedPerson") ? 'fiAuthorizedPerson' : nodeType;

            switch (nodeType) {
                case 'fiAuthorizedPerson':
                case 'fiBeneficiary':
                    value = record.get('properties')['fina:fiPersonFirstName'] + ' ' + record.get('properties')['fina:fiPersonLastName'];
                    break;
                case 'fiFine':
                    let fine = record.get('properties')['fina:fiFine'],
                        langCode = first.config.Config.getLanguageCode();
                    value = fine['fineType'].names[langCode];
                    value = value ? value : '';
                    break;
                default :
                    if (Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), record.get('nodeType'))) {
                        value = record.get('properties')['fina:fiRegistryName'];
                    }
                    break;
            }

            record.set({'name': value}, {
                dirty: false
            });
            return value;
        }
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
