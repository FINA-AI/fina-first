Ext.define('first.view.registration.FiRegistrationActionListView', {
    extend: 'Ext.grid.Panel',
    xtype: 'fiListEcm',

    requires: [
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.store.registration.FiRegistry'
    ],

    getState: function () {
        var result = this.callParent();
        this.addPropertyToState(result, 'extraParams', this.getStore().getProxy().getExtraParams());
        this.addPropertyToState(result, 'headers', this.getStore().getProxy().getHeaders());
        return result;
    },

    applyState: function (state) {
        if (state.extraParams) {
            let extraParams = state.extraParams;
            if (extraParams && extraParams.filter && Object.keys(extraParams.filter).length > 0) {
                let filter = JSON.parse(extraParams['filter']);
                delete filter['identity'];
                if (Object.keys(filter).length === 0) {
                    delete extraParams['filter'];
                } else {
                    extraParams['filter'] = JSON.stringify(filter);
                }
            }

            this.getStore().getProxy().setExtraParams(extraParams);
        }
        if (state.headers) {
            this.getStore().getProxy().setHeaders(state.headers);
        }
    },

    store: {
        type: 'fiRegistryEcm'
    },

    columns: [],

    bbar: {
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        displayInfo: true,
        items: ['->'],
        prependButtons: true
    },

});
