Ext.define('first.view.new.dashboard.widget.FilterFiRegistryWidgetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filterFiRegistryWidget',

    requires: [
        'Ext.app.ViewController',
        'first.config.Config',
        'first.util.ErrorHandlerUtil'
    ],

    listen: {
        controller: {
            '*': {
                filterFiTypes: 'filterFiTypes',
            },
        }
    },

    /**
     * Called when the view is created
     */
    init: function () {

    },

    fiRegistryFilterHandler: function () {
        let filter = this.getView().getData()['filter'];
        if (filter) {
            this.fireEvent('filterFiRegistry', filter);
        }
    },

    afterRender: function () {
        this.initData();
    },

    initData: function (fiTypes) {
        let data = this.getView().getData(),
            filter = data['filter'];

        if(fiTypes && !data['dependsOnFiType']) {
            return;
        }

        filter['types'] = fiTypes;

        if (filter) {
            let view = this.getView();

            view.mask();
            Ext.Ajax.request({
                url: first.config.Config.remoteRestUrl + 'ecm/dashboard/fiRegistryCountByFilter',
                method: 'POST',
                jsonData: filter,
                success: function (response) {
                    view.setData({
                        amount: response.responseText,
                        title: data.title,
                        icon: data.icon,
                        filter: data.filter,
                        dependsOnFiType: data.dependsOnFiType
                    });
                    view.unmask();
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                    view.unmask();
                }
            });
        }
    },

    filterFiTypes: function (fiTypes) {
        this.initData(fiTypes);
    },

});