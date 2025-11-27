Ext.define('first.view.dashboard.dashlets.BranchesByRegion3DPieChartController', {
    extend: 'first.view.dashboard.DashletBaseController',

    requires: [
        'Ext.util.Format'
    ],
    alias: 'controller.branchesByRegion3DPieChart',

    init: function () {
        const url = `${first.config.Config.remoteRestUrl}ecm/dashboard/${this.getView().chartUrl}`;
        this.initChartStore(url);
    },

    onSeriesLabelRender: function (v) {
        return Ext.util.Format.number(v);
    },

    onTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(Ext.util.Format.number(record.get('value')));
    },

    onLabelRender: function (value, sprite, config, renderData, index) {
        let sum = 0;
        Ext.each(renderData.store.getData().items, function (el) {
            sum += Number(el.get("value"));
        });

        const record = renderData.store.getAt(index);
        const recordValue = record.get("value");

        const percent = recordValue > 0 && sum > 0 ? recordValue / sum * 100 : 0;

        const formatString = "0,000 %";

        return Ext.util.Format.number(
            percent,
            formatString
        );
    },

    loadChartData: function () {
    },

    showLabels: function () {

    }
});