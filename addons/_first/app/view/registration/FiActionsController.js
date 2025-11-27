Ext.define('first.view.registration.FiActionsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiActionsEcm',

    requires: [
        'first.config.Config'
    ],

    init: function () {
        let store = this.getView().getStore(),
            itemId = this.getViewModel().get('itemId');
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/' + itemId + '/actions');
        store.load();
    },

    onViewProcessClick: function (view, rowIdx, colIdx, item, e, rec) {
        this.fireEvent('navChange', 'wfDetails/' + rec.get('processId'));
    },

    actionTypeRenderer: function (value) {
        let label = i18n[value];
        switch (value) {
            case 'REGISTRATION':
                return '<div style="font-weight: bold; color: green">' + label + '</div>';
            case 'CHANGE':
            case 'BRANCHES_CHANGE':
            case 'BRANCHES_EDIT':
            case 'DOCUMENT_WITHDRAWAL':
                return '<div style="font-weight: bold; color: blue">' + label + '</div>';
            case 'CANCELLATION':
                return '<div style="font-weight: bold; color: red">' + label + '</div>';
        }
    },

    onViewDetailsClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        let fiRegistry = this.getViewModel().get('theFi'),
            title = Ext.String.format('[{0}] {1} | {2} | <i>{3}:</i> {4} | <i>{5}:</i> {6}',
                fiRegistry['fina_fiRegistryCode'],
                fiRegistry['fina_fiRegistryIdentity'],
                i18n[record.get('type')],
                i18n.fiActionAuthor,
                record.get('author'),
                i18n.taskItemGridCreatedAt,
                Ext.Date.format(new Date(record.get('createdAt') - 0), first.config.Config.timeFormat)),
            window = Ext.create("Ext.window.Window", {
                title: title,
                iconCls: 'x-fa fa-cog',
                modal: true,
                maximizable: true,
                height: Ext.getBody().getViewSize().height - 120,
                width: Ext.getBody().getViewSize().width - 120,

                layout: {
                    type: 'fit'
                },

                items: [{
                    xtype: 'fiProcessHistoryPage',
                    viewModel: {
                        data: {
                            selectedActionGridItem: record,
                            fiRegistry: fiRegistry
                        }
                    }
                }],
            });
        window.show();
    },

    filterButtonClick: function () {
        let store = this.getView().getStore();
        store.clearFilter();

        Ext.Object.each(this.getViewModel().get('filter'), (key, value) => {
            if (value) {
                store.filter({
                    property: key.includes('date') ? 'createdAt' : key,
                    value: value,
                    operator: key.includes('date') ? key === 'dateFrom' ? '>=' : '<=' : '',
                    id: key
                });
            }
        });
    },

    clearFilters: function () {
        this.getView().getStore().clearFilter();
        this.getViewModel().set('filter', {});
    }
});
