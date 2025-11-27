Ext.define('first.view.new.dashboard.widget.chart.FiRegistrationByYearChartView', {
    extend: 'Ext.panel.Panel',

    xtype: 'fiRegistrationByYearChartView',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
        'first.store.dashboard.FiRegistrationByYear',
        'first.view.new.dashboard.widget.chart.FiRegistrationByYearChartController'
    ],

    model: 'fiRegistrationByYearChart',

    controller: 'fiRegistrationByYearChart',

    items: [{
        xtype: 'cartesian',
        reference: 'fiRegistrationByYearChart',
        width: '100%',
        height: '98%',
        innerPadding: '0 20 0 0',
        legend: {
            type: 'dom',
            docked: 'bottom'
        },
        store: {
            type: 'fiRegistrationByYear'
        },
        axes: [{
            type: 'numeric',
            fields: ['le', 'fex', 'mfo', 'cru'],
            position: 'left',
            grid: true,
            minimum: 0
        }, {
            type: 'category',
            fields: 'year',
            position: 'bottom',
            grid: true
        }],
        series: [{
            type: 'line',
            title: i18n.LE,
            xField: 'year',
            yField: 'le',
            highlightCfg: {
                scaling: 2
            }
        }, {
            type: 'line',
            title: i18n.FEX,
            xField: 'year',
            yField: 'fex',
            highlightCfg: {
                scaling: 2
            }
        }, {
            type: 'line',
            title: i18n.MFO,
            xField: 'year',
            yField: 'mfo',
            highlightCfg: {
                scaling: 2
            }
        }, {
            type: 'line',
            title: i18n.CRU,
            xField: 'year',
            yField: 'cru',
            highlightCfg: {
                scaling: 2
            }
        }],
        listeners: {
            afterrender: 'afterChartRender'
        }
    }]
});