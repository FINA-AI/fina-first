Ext.define('first.view.registration.history.FiProcessHistoryItemController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiProcessHistoryItemController',

    /**
     * Called when the view is created
     */
    init: function () {
        let me = this,
            selectedActionGridItem = this.getViewModel().get('selectedActionGridItem'),
            activeItemName = this.getViewModel().get('activeFiProcessHistoryItemName'),
            store = this.getView().getStore();

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + selectedActionGridItem.id + '/children/full');
        store.load(function (records) {
            try {
                store.add({
                    id: selectedActionGridItem.get('documentsFolderId'),
                    name: i18n['Documents'],
                    properties: {
                        'fina:folderConfigChildType': 'fina:fiDocument'
                    }
                });
            } catch (e) {
            }

            if (activeItemName) {
                for (let record of records) {
                    if (record.get('name') === activeItemName) {
                        me.getView().getSelectionModel().select(record);
                        break;
                    }
                }
            } else {
                me.getView().getSelectionModel().select(0);
            }
        });
    },

    onSelectFiProcessHistoryItem: function (component, record) {
        let selectedActionGridItem = this.getViewModel().get('selectedActionGridItem');
        this.fireEvent('reloadFiProcessHistoryItemDetails', selectedActionGridItem.id, record.data);
    }

});