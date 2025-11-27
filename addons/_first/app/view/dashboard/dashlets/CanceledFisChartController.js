Ext.define('first.view.dashboard.dashlets.CanceledFisChartController', {
    extend: 'first.view.dashboard.DashletBaseController',

    requires: [
        'Ext.util.Format',
        'first.config.Config'
    ],
    alias: 'controller.canceledFisChart',

    listen: {
        'store': {
            '*': {
                redrawCanceledFisChart: 'redrawCanceledFisChart'
            }
        }
    },

    init: function () {
        const url = this.getView().url || `${first.config.Config.remoteRestUrl}ecm/dashboard/actionsCount`,
            periodType = this.getView().periodType || 'Y',
            actionType = this.getView().actionType,
            periodLimit = periodType === 'Y' ? 12 : null;

        this.getView().getStore().viewId = this.getView().id;
        this.initChartStore(url, periodType, actionType, periodLimit);
    },

    onSeriesLabelRender: function (v) {
        return Ext.util.Format.number(v);
    },

    onTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(Ext.util.Format.number(record.get('value')));
    },

    redrawCanceledFisChart: function (viewId, data, success) {
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
        if (this.getView().periodCanBeChanged) {
            this.callParent(arguments);
        }
    }
});