Ext.define('first.view.registration.FiRegistrationSearchFilterView', {
    extend: 'Ext.panel.Panel',
    xtype: 'fiRegistrationSearchFilter',

    requires: [
        'first.view.registration.FiRegistrationSearchFilterController',
        'Ext.ux.layout.ResponsiveColumn'
    ],

    getState: function () {
        var result = this.callParent();
        this.addPropertyToState(result, 'filter', this.getViewModel().get('filter'));
        return result;
    },

    applyState: function (state) {
        if (state.filter) {
            this.getViewModel().set('filter', state.filter);
        }
    },

    controller: 'fiRegistrationSearchFilter',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'panel',
            flex:1,

            layout: {
                type: 'responsivecolumn',
                states: {
                    small: 1520,
                }
            },

            defaults: {
                cls:'fiRegistrationSearchFilterColumn',
                responsiveCls: 'big-50 small-100',

                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    labelWidth: 270,
                }
            },

            items: [
                {
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.filterFieldAuthor,
                            bind: {
                                value: "{filter.author}"
                            }
                        },{
                            xtype: 'textfield',
                            fieldLabel: i18n.filterFieldName,
                            bind: {
                                value: "{filter.fiRegistryName}"
                            }
                        }, {
                            xtype: 'textfield',
                            fieldLabel: i18n.filterFieldCode,
                            bind: {
                                value: "{filter.fiRegistryCode}"
                            }
                        }, {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            fieldLabel: i18n.filterFieldFromTaskReceiptDate,
                            bind: {
                                value: "{filter.taskReceiptDateFrom}"
                            }
                        }, {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            fieldLabel: i18n.filterFieldToTaskReceiptDate,
                            bind: {
                                value: "{filter.taskReceiptDateTo}"
                            }
                        },
                    ]
                },
                {
                    items: [
                        {
                            xtype: 'tagfield',
                            fieldLabel: i18n.filterFieldStatus,
                            store: {
                                data:[
                                    {status:'IN_PROGRESS',displayValue:i18n['IN_PROGRESS']},
                                    {status:'ACCEPTED',displayValue:i18n['ACCEPTED']},
                                    {status:'DECLINED',displayValue:i18n['DECLINED']},
                                    // {status:'CANCELED',displayValue:i18n['CANCELED']},
                                    // {status:'LIQUIDATION',displayValue:i18n['LIQUIDATION']},
                                    {status:'GAP',displayValue:i18n['GAP']},
                                ]
                            },
                            displayField: 'displayValue',
                            valueField: 'status',
                            queryMode: 'local',
                            typeAhead: true,
                            bind: {
                                value: "{filter.status}"
                            },
                        },{
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            fieldLabel: i18n.filterFieldFromLegalActDate,
                            bind: {
                                value: "{filter.fiRegistryLegalActDateFrom}"
                            }
                        }, {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat,
                            fieldLabel: i18n.filterFieldToLegalActDate,
                            bind: {
                                value: "{filter.fiRegistryLegalActDateTo}"
                            }
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: i18n.filterFieldRegion,
                            store: {
                                type: 'regionalStructureStore',
                            },
                            displayField: 'fina_regionalStructureRegionName',
                            valueField: 'fina_regionalStructureRegionName',
                            queryMode: 'local',
                            typeAhead: true,
                            listeners: {
                                focus: 'onFocusRegion',
                                change: 'onChangeRegion'
                            },
                            bind: {
                                value: "{filter.regionName}"
                            }
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: i18n.filterFieldCity,
                            store: {
                                type: 'regionalStructureStore',
                            },
                            displayField: 'fina_regionalStructureCityName',
                            valueField: 'fina_regionalStructureCityName',
                            queryMode: 'local',
                            typeAhead: true,
                            listeners: {
                                focus: 'onFocusCity'
                            },
                            bind: {
                                value: "{filter.cityName}"
                            }
                        },
                    ]
                }
            ]
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'center'
            },
            defaults: {
                margin: 5,
                padding: 5
            },
            items: [
                {
                    xtype: 'button',
                    reference:'searchBtnRef',
                    text: i18n.Search,
                    listeners: {
                        click: 'onFilterSearchClick'
                    }
                }, {
                    xtype: 'button',
                    text: i18n.clear,
                    listeners: {
                        click: 'onFilterClearClick'
                    }
                }
            ]
        }
    ],
});
