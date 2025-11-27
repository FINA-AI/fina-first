Ext.define('first.view.dashboard.DashboardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'dashboard',

    requires: [
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.resizer.Splitter',
        'Ext.toolbar.Fill',
        'first.view.dashboard.ManagementDashboardController',
        'first.view.dashboard.dashlets.BranchesByRegion3DPieChart',
        'first.view.dashboard.dashlets.CanceledFisBarChart',
        'first.view.dashboard.dashlets.RegionMap',
        'first.view.dashboard.dashlets.RegisteredBranchesChart',
        'first.view.repository.share.ToggleFieldComponent'
    ],

    bind: {
        title: '{title}'
    },

    controller: 'managementDashboard',

    bodyStyle: {"background-color": "#F2EFEF"},

    tbar: ['->', {
        xtype: 'panel',
        layout: 'hbox',
        defaults: {
            margin: '2 40 2 2'
        },
        bodyStyle: {"background-color": "#F2EFEF"},
        items: [{
            xtype: 'togglefieldcomponent',
            fieldLabel: i18n.dashboardMonthQuarter,
            checked: true,
            listeners: {
                change: 'onChangePeriod'
            }
        }, {
            xtype: 'togglefieldcomponent',
            fieldLabel: i18n.dashboardLabel,
            checked: false,
            listeners: {
                change: 'onChangeLabelVisibility'
            }
        }]
    }],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    autoScroll: true,

    defaults: {
        xtype: 'panel',
        layout: 'hbox',
        height: 380,
        bodyStyle: {"background-color": "#F2EFEF"},
        defaults: {
            flex: 1,
            height: '100%',
            tools: [{
                type: 'refresh',
                handler: 'refreshChart'
            }, {
                type: 'print',
                handler: 'downloadChart'
            }],
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                flex: 1
            }
        }
    },

    items: [{
        margin: '10 10 10 10',
        items: [{
            title: i18n.dashletFiRegistryActiveFisTitle,
            items: [{
                xtype: 'canceledFisChart',
                reference: 'activeFisChartRef',
                periodType: 'Q',
                url: `${first.config.Config.remoteRestUrl}ecm/dashboard/activeFiCount`,
                periodCanBeChanged: true
            }]
        }, {
            flex: 0,
            xtype: 'splitter'
        }, {
            title: i18n.dashletFiRegistryRegistrationTitle,
            items: [{
                xtype: 'canceledFisChart',
                reference: 'registeredFisChartRef',
                actionType: "REGISTRATION",
                periodCanBeChanged: false
            }]
        }]
    }, {
        margin: '0 10 10 10',
        items: [{
            title: i18n.dashletFiRegistryCancellationTitle,
            items: [{
                xtype: 'canceledFisChart',
                reference: 'canceledFisChartRef',
                actionType: "CANCELLATION",
                periodCanBeChanged: false
            }]
        }, {
            flex: 0,
            xtype: 'splitter'
        }, {
            title: i18n.dashletGeographicalDistributionTitle,
            tools: [{
                type: 'print',
                handler: 'downloadRegionMap'
            }],
            items: [{
                xtype: 'regionMap'
            }]
        },]
    }, {
        margin: '0 10 10 10',
        height: 530,
        items: [{
            flex: 0,
            xtype: 'splitter'
        }, {
            title: i18n.headOfficesByRegion,
            items: [{
                xtype: 'branchesByRegion3DPieChart',
                reference: 'headOfficesByRegion3DPieChartRef',
                chartUrl: "headOfficesRegionCountByType",
            }]
        }, {
            flex: 0,
            xtype: 'splitter'
        }, {
            title: i18n.branchesByRegion,
            items: [{
                xtype: 'branchesByRegion3DPieChart',
                reference: 'branchesByRegion3DPieCharRef',
                chartUrl: "branchesRegionCountByType",
            }]
        }]
    }]
});