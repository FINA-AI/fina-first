Ext.define('first.view.dashboard.dashlets.RegisteredBranchesChart', {
    extend: 'Ext.chart.CartesianChart',

    xtype: 'registeredBranchesChart',
    requires: [
        'Ext.chart.axis.Category3D',
        'Ext.chart.axis.Numeric3D',
        'Ext.chart.series.Bar3D',
        'Ext.data.proxy.Rest',
        'first.view.dashboard.dashlets.RegisteredBranchesChartController',
        'Ext.chart.grid.HorizontalGrid3D',
        'Ext.chart.grid.VerticalGrid3D',
    ],
    controller: 'registeredBranchesChart',

    store: {
        proxy: {
            type: 'rest',
            enablePaging: false,
        },
        listeners: {
            load: function (store, data, success) {
                this.fireEvent('redrawRegisteredBranchesChart', store.viewId, data, success);
            }
        }
    },
    axes: [{
        type: 'numeric3d',
        fields: ['value'],
        position: 'left',
        grid: true,
        minimum: 0
    }, {
        type: 'category3d',
        fields: 'quarter',
        position: 'bottom',
        label: {
            rotate: {
                degrees: -60,
            }
        }
    }],
    series: [{
        type: 'bar3d',
        xField: 'quarter',
        yField: 'value',
        highlight: true,
        tooltip: {
            trackMouse: true,
            renderer: 'onTooltipRender'
        },
        label: {
            field: 'value',
            display: "none",
            renderer: 'onSeriesLabelRender'
        }
    }],

});