Ext.define('first.view.dashboard.DashletBaseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashletBaseController',

    listen: {
        controller: {
            'managementDashboard': {
                periodTypeChange: 'loadChartData',
                showLabels: 'showLabels'
            }
        }
    },

    /**
     * Called when the view is created
     */
    init: function () {

    },

    loadChartData: function (periodType, actionType) {
        const store = this.getView().getStore();
        if (store) {
            this.setExtraParams(store, periodType, actionType);
            store.load();
        }
    },

    initChartStore: function (url, periodType, actionType, periodLimit) {
        const view = this.getView();
        const store = view.getStore();
        store.getProxy().setUrl(url);

        this.setExtraParams(store, periodType, actionType, periodLimit);

        store.on('beforeload', () => view.mask(i18n.pleaseWait));

        store.onAfter('load', () => view.unmask());

        store.load();
    },

    setExtraParams: function (store, periodType, actionType, periodLimit) {
        const fiType = this.getViewModel().get('fiType');
        store.proxy.extraParams.fiType = fiType;

        if (periodType) {
            store.proxy.extraParams.periodType = periodType;
        }

        if (actionType) {
            store.proxy.extraParams.actionType = actionType;
        }

        if (periodLimit) {
            store.proxy.extraParams.periodLimit = periodLimit;
        }
    },

    showLabels: function (isShow) {
        this.getView().getSeries()[0].setLabel({
            display: isShow ? 'over' : 'none'
        });
    }
});