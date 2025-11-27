Ext.define('first.view.new.dashboard.widget.chart.FiRegistrationByYearChartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiRegistrationByYearChart',

    /**
     * Called when the view is created
     */
    init: function () {

    },

    afterChartRender: function () {
        this.getView().mask();

        let me = this,
            storeUrl = first.config.Config.remoteRestUrl + 'ecm/dashboard/fiRegistryStatusCountByYear',
            currentYear = new Date().getFullYear();

        for (let i = currentYear - 4; i <= currentYear; i++) {
            if (i === (currentYear - 4)) {
                storeUrl += '?year=' + i;
            } else {
                storeUrl += '&year=' + i;
            }
        }

        let store = this.lookupReference('fiRegistrationByYearChart').getStore();
        store.proxy.url = storeUrl;
        store.load(function (records) {
            me.getView().unmask();
        });
    }

});