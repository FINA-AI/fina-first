Ext.define('first.view.new.dashboard.Dashboard', {
    extend: 'Ext.panel.Panel',

    xtype: 'home',

    requires: [
        'Ext.panel.Panel',
        'first.view.new.dashboard.DashboardController',
        'first.view.new.dashboard.DashboardModel',
        'first.view.new.dashboard.widget.FilterFiRegistryWidget',
        'first.view.new.dashboard.widget.chart.FiRegistrationByYearChartView',
        'first.view.new.dashboard.widget.chart.FiStatusByTypeChartView',
        'first.view.new.dashboard.widget.fiStatistic.FiStatisticWidget',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'first.view.new.dashboard.DashboardModel',
    ],

    title: i18n.dashboard,

    controller: 'appDashboard',

    viewModel: {
        type: 'app-dashboard'
    },

    bodyPadding: 3,

    bodyCls: 'common-dashboard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    scrollable: true,

    defaults: {
        padding: '10 20',
        cls: 'common-dashboard-widget',
    },

    items: [
        {
            bodyCls: 'common-dashboard',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                bodyCls: 'common-dashboard',
                margin: '0 10',
            },
            items: [{
                xtype: 'textfield',
                fieldCls: 'dashboard-widget-search-field',
                cls: 'dashboard-widget-search',
                reference: 'searchTextField',
                hideLabel: true,
                flex: 1,
                emptyText: i18n.Search,
                enableKeyEvents: true,
                minLength: 3,
                validator: function (val) {
                    let res = /[.!*()~']/g.test(val)
                    return !res || i18n.fiRegistrySearchValidationErrorMsg;
                },
                listeners: {
                    keypress: 'onSearchKeyPress',
                }
            }, {
                width: 30,
                hidden: true,
                bind: {
                  hidden: '{!hasConfigReviewPermission}'
                },
                html: '<span class="fas fa-cog dashboard-widget-helper-Button"></span>',
                listeners: {
                    element: 'el',
                    delegate: 'span.dashboard-widget-helper-Button',
                    click: 'onConfClick'
                }
            }, {
                width: 30,
                html: '<span class="fas fa-question dashboard-widget-helper-Button"></span>',
                listeners: {
                    element: 'el',
                    delegate: 'span.dashboard-widget-helper-Button',
                    click: 'downloadUserManual'
                }
            }
            ]
        }, {
            bodyCls: 'common-dashboard',
            height: '30%',

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                bodyPadding: 15,
                cls: 'common-dashboard-widget',
                margin: '0 10'
            },
            items: [
                {
                    width: '80%',
                    xtype: 'fiStatisticWidget',
                },
                {
                    width: '20%',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },

                    items: [
                        {
                            cls:'dashboard-widget-process-title-body',
                            html: '<a class="dashboard-widget-process-title" href="#home">' +
                                i18n.dashboardWidgetTasksProcessesTitle + ':</a>',
                        },
                        {
                            cls:'dashboard-widget-process-link-body',
                            html: '<a class="dashboard-widget-process-link" href="#home">' +
                                i18n.dashboardWidgetTasksNonBankingInstitutionRegistrationTitle + '</a>',
                            listeners: {
                                element: 'el',
                                delegate: 'a.dashboard-widget-process-link',
                                click: 'fiRegistrationLinkClick'
                            }
                        }, {
                            cls:'dashboard-widget-process-link-body',
                            html: '<a class="dashboard-widget-process-link" href="#home">' +
                                i18n.dashboardWidgetTasksNonBankingInstitutionChangeTitle + '</a>',
                            listeners: {
                                element: 'el',
                                delegate: 'a.dashboard-widget-process-link',
                                click: 'fiChangeLinkClick'
                            }
                        }, {
                            cls:'dashboard-widget-process-link-body',
                            html: '<a class="dashboard-widget-process-link" href="#home">' +
                                i18n.dashboardWidgetTasksNonBankingInstitutionDisableTitle + '</a>',
                            listeners: {
                                element: 'el',
                                delegate: 'a.dashboard-widget-process-link',
                                click: 'fiCancellationLinkClick'
                            }
                        }]

                }
            ]
        }, {
            bodyCls: 'common-dashboard',
            height: '60%',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                width: '40%',
                cls: 'common-dashboard-widget',
                margin: '0 10'
            },
            items: [
                {
                    layout: {
                        align: 'stretch',
                        pack: 'center',
                        type: 'vbox'
                    },
                    xtype: 'fiStatusByTypeChartView'
                }, {
                    layout: {
                        align: 'stretch',
                        pack: 'center',
                        type: 'vbox'
                    },

                    xtype: 'fiRegistrationByYearChartView'
                }, {
                    width: '20%',
                    reference: 'taskStatisticReference',
                    bodyCls: 'common-dashboard',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },

                    defaults: {
                        margin: '0 0 20px 0',
                        style: 'border-radius: 15px; background-color: white!important;',
                        height: '33%',
                    },

                    items: [
                        {
                            layout: {
                                align: 'stretch',
                                pack: 'center',
                                type: 'vbox'
                            },

                            items: [
                                {
                                    xtype: 'filterFiRegistryWidget',
                                    data: {
                                        title: i18n.dashboardWidgetQuickFiltersActiveTasksTitle,
                                        filter: {
                                            status: ['IN_PROGRESS', 'GAP']
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
});
