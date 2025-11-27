Ext.define('first.view.dashboard.dashlets.RegisteredBranchesChartController', {
    extend: 'first.view.dashboard.DashletBaseController',
    alias: 'controller.registeredBranchesChart',

    requires: [
        'Ext.util.Format',
        'first.config.Config'
    ],

    listen: {
        'store': {
            '*': {
                redrawRegisteredBranchesChart: 'redrawRegisteredBranchesChart'
            }
        }
    },

    init() {
        const url = `${first.config.Config.remoteRestUrl}ecm/dashboard/branchesCountByTypeOrderedByYear`;

        this.getView().getStore().viewId = this.getView().id;
        this.initChartStore(url);
    },

    onSeriesLabelRender: function (v) {
        return Ext.util.Format.number(v);
    },

    onTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(Ext.util.Format.number(record.get("value")));
    },

    redrawRegisteredBranchesChart: function (viewId, data, success) {
        const view = this.getView();
        if (viewId === view.id) {
            if (success) {
                let params = first.util.ChartHelper.calculateChartParams(data),
                    valueAxis = view.getAxes()[0];

                valueAxis.setMaximum(params.max);
                valueAxis.setMajorTickSteps(params.step);
                view.redraw();
            }
        }
    },

    loadChartData: function () {
    },
});