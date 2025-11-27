Ext.define('first.view.registration.FiRegistrationView', {
    extend: 'Ext.panel.Panel',

    xtype: 'fis',

    requires: [
        'Ext.form.field.Tag',
        'Ext.form.field.Text',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Separator',
        'Ext.util.Filter',
        'Ext.util.History',
        'first.store.fi.FiTypeStore',
        'first.view.registration.FiRegistrationController'
    ],

    title: i18n.fiRegistry,

    controller: 'fiRegistrationEcm',

    layout: 'fit',

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [{
            handler: function () {
                Ext.History.back();
            },
            iconCls: 'x-fa fa-arrow-left',
            cls: 'firstSystemButtons',
            hidden: true,
            bind: {
                hidden: '{nonClosableViewId ===  "fis"}'
            }
        }, {
            handler: function () {
                Ext.History.forward();
            },
            iconCls: 'x-fa fa-arrow-right',
            cls: 'firstSystemButtons',
            hidden: true,
            bind: {
                hidden: '{nonClosableViewId ===  "fis"}'
            }
        }, {
            xtype: 'tbseparator',
            hidden: true,
            bind: {
                hidden: '{nonClosableViewId ===  "fis"}'
            }
        }, {
            flex: 0.2,
            xtype: 'tagfield',
            store: {
                type: 'fiTypeStore'
            },
            valueField: 'code',
            displayField: 'code',
            queryMode: 'local',
            forceSelection: true,
            listConfig: {
                itemTpl: [
                    '<div data-qtip="{code}: {description}">{code} - {description}</div>'
                ]
            },
            emptyText: i18n.fiActionFiType,
            listeners: {
                change: 'onTypeChange'
            },
            bind: {
                value: "{selectedTypes}"
            },

            stateful: true,
            stateId: 'first-fiRegistrationView-fiTypeComboStateId'
        }, {
            xtype: 'textfield',
            reference: 'fiIdentityField',
            emptyText: i18n.identifier,
            enableKeyEvents: true,
            minLength: 3,
            maxLength: 11,
            regex: new RegExp('^(?=[0-9]*$)(?:.{9}|.{11})$'),
            regexText: i18n.invalidIdentificationNumber,
            listeners: {
                keypress: 'onIdentityFieldEnterClick',
                keydown: 'onIdentityFieldEnterClick',
            },
            bind: '{identity}'
        }, {
            text: i18n.fiRegistryNew,
            iconCls: 'x-fa fa-plus',
            cls: 'finaPrimaryBtn',
            disabled: true,
            reference: 'registerNewFiMenuComponent',
            menu: {
                reference: 'registerNewFiMenu',
                items: []
            },
            listeners: {
                afterrender: 'onAfterFiTypesButtonRender'
            }
        }, {
            xtype: 'textfield',

            stateful: true,
            stateId: 'first-fiRegistrationView-searchFieldStateId',

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

                        if ((value.trim().length === 0 || value.trim().length >= 3) && textfield.isValid()) {
                            me.activeFilter = new Ext.util.Filter({
                                property: me.paramName,
                                value: value
                            });
                            me.getTrigger('clear').show();
                            me.updateLayout();
                            this.fireEvent('keypress', textfield, op)
                        }
                    },
                },
                expand: {
                    weight: 2,
                    cls: Ext.baseCSSPrefix + 'form-arrow-trigger',
                    handler: 'showHideFilter'
                }
            },
            reference: 'searchTextField',
            hideLabel: true,
            flex: 1,
            fieldStyle: 'font-family: FontAwesome',
            emptyText: i18n.Search,
            enableKeyEvents: true,
            minLength: 3,
            validator: function (val) {
                let res = /[.!*()~']/g.test(val)
                return !res || i18n.fiRegistrySearchValidationErrorMsg;
            },
            listeners: {
                keypress: 'onSearchFieldEnterClick',
                resize: 'onSearchFieldResize',
            },
            bind: {
                value: '{query}'
            }
        }, {
            text: i18n.export,
            iconCls: 'x-fa fa-cloud-download-alt',
            cls: 'finaPrimaryBtn',
            disabled: true,
            reference: 'registerExportComponent',
            menu: {
                reference: 'registerExportMenu',
                items: []
            },
            listeners: {
                afterrender: 'onAfterExportButtonRender'
            }
        }, {
            iconCls: 'x-fa fa-cloud-upload-alt',
            cls: 'finaSecondaryBtn',
            text: i18n.import,
            handler: 'onImportButtonClick',
            bind: {
                hidden: '{disableImport}'
            }
        }]
    },

    items: [{
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        reference: 'fiRegistryGrid',
        items: []
    }]
});
