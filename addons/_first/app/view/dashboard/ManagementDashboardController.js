Ext.define('first.view.dashboard.ManagementDashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.managementDashboard',

    /**
     * Called when the view is created
     */
    init: function () {

    },

    refreshChart: function (arg0, arg1, toolBtn) {
        const chartRef = toolBtn.getRefOwner().items.items[0].referenceKey,
            chart = this.lookupReference(chartRef);

        chart.getStore().reload();
    },

    downloadChart: function (arg0, arg1, toolBtn) {
        const chartRef = toolBtn.getRefOwner().items.items[0].referenceKey,
            chart = this.lookupReference(chartRef);

        if (Ext.is.Desktop) {
            chart.download({filename: "Chart"});
        } else {
            chart.preview();
        }
    },

    onChangeLabelVisibility: function (component, newValue, oldValue) {
        this.fireEvent('showLabels', newValue);
    },

    onChangePeriod: function (component, newValue, oldValue) {
        const periodType = newValue ? 'Q' : 'M';
        this.fireEvent('periodTypeChange', periodType);
    },

    downloadRegionMap: function () {
        this.fireEvent('exportMap');
    }
});