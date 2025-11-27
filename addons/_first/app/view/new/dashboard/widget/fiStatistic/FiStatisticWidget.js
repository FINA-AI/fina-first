Ext.define('first.view.new.dashboard.widget.fiStatistic.FiStatisticWidget', {
    extend: 'Ext.panel.Panel',

    xtype: 'fiStatisticWidget',

    requires: [
        'first.view.new.dashboard.widget.FilterFiRegistryWidget',
        'first.view.new.dashboard.widget.fiStatistic.FiStatisticWidgetController',
    ],

    controller: 'fiStatisticWidget',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    },

    items: [
        {
            layout: {
                type: 'vbox',
                align: 'center',
            },

            items: [{
                reference: 'fiTypesReference',
                layout: {
                    type: 'hbox',
                    align: 'center'
                },

                defaults: {
                  margin: '0 20'
                },

                items: []
            }]
        }, {
            xtype: 'panel',
            layout: 'column',
            autoScroll: true,
            defaults: {
                columnWidth: 0.33,
                style: 'border: 1px solid #527ec8!important; border-radius: 10px;',
                margin: 15,
            },
            cls: 'fi-statistic-widget',
            items: [
                {
                    xtype: 'filterFiRegistryWidget',
                    data: {
                        title: i18n.dashboardFilterActiveFiRegistrationTitle,
                        dependsOnFiType: true,
                        filter: {
                            status: ['IN_PROGRESS', 'GAP'],
                            fiRegistryActionType: ['REGISTRATION']
                        }
                    }
                }, {
                    xtype: 'filterFiRegistryWidget',
                    data: {
                        title: i18n.dashboardFilterActiveFiChangeTitle,
                        dependsOnFiType: true,
                        filter: {
                            status: ['IN_PROGRESS', 'GAP'],
                            fiRegistryActionType: ['CHANGE', 'BRANCHES_CHANGE', 'BRANCHES_EDIT']
                        }
                    }
                }, {
                    xtype: 'filterFiRegistryWidget',
                    data: {
                        title: i18n.dashboardFilterActiveFiCancellationTitle,
                        dependsOnFiType: true,
                        filter: {
                            status: ['IN_PROGRESS', 'GAP'],
                            fiRegistryActionType: ['CANCELLATION']
                        }
                    }
                },
            ]
        },
    ]
})