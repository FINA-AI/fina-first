Ext.define('first.view.new.dashboard.widget.chart.FiStatusByTypeChartView', {
    extend: 'Ext.panel.Panel',

    xtype: 'fiStatusByTypeChartView',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.plugin.ItemEvents',
        'Ext.chart.series.Bar',
        'Ext.chart.theme.Muted',
        'first.store.dashboard.FiStatusByType',
        'first.view.new.dashboard.widget.chart.FiStatusByTypeChartController',
        'first.view.new.dashboard.widget.chart.FiStatusByTypeChartModel'
    ],

    viewModel: 'fiStatusByTypeChart',

    controller: 'fiStatusByTypeChart',

    items: [{
        reference: 'filterYearFilterBar',
        margin: '5 10',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [],
        listeners: {
            afterrender: 'afterRenderFilterYearFilterBar'
        }
    }, {
        xtype: 'cartesian',
        reference: 'fiRegistrationStatisticChart',
        width: '100%',
        height: '98%',
        theme: 'Muted',

        plugins: {
            chartitemevents: {
                moveEvents: true
            }
        },

        store: {
            type: 'fiStatusByType'
        },
        legend: {
            type: 'dom',
            docked: 'bottom'
        },

        axes: [{
            type: 'numeric',
            position: 'left',
            fields: ['active', 'inactive', 'canceled'],
            grid: true
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'fiType',
            renderer: function (axis, label) {
                return i18n[label];
            }
        }],
        series: {
            type: 'bar',
            stacked: false,
            title: [i18n.dashboardFiRegistrationStatisticActiveTitle, i18n.dashboardFiRegistrationStatisticInactiveTitle, i18n.dashboardFiRegistrationStatisticCanceledTitle],
            xField: 'fiType',
            yField: ['active', 'inactive', 'canceled'],
            label: {
                field: ['active', 'inactive', 'canceled'],
                display: 'insideEnd'
            },
            highlight: true,
            style: {
                inGroupGapWidth: -7
            },
            listeners: {
                itemclick: 'onBarChartSeriesClick'
            }
        }
    }]
});