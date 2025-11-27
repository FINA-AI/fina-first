Ext.define('first.view.registration.FiRegistrationSearchFilterController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiRegistrationSearchFilter',

    onFilterSearchClick: function () {
        let vm = this.getViewModel();
        let filter = vm.get('filter');

        if (Ext.Object.isEmpty(filter)) {
            return;
        }

        Ext.Object.each(filter, (key, val) =>{
            if(!val) {
                delete filter[key];
            }
        })


        this.filterGrid(JSON.stringify(filter));
    },

    onFilterClearClick: function () {
        this.getViewModel().set("filter", {});
        this.filterGrid(null);
    },

    onFocusCity: function (obj) {
        obj.getStore().getProxy().url = first.config.Config.remoteRestUrl + 'ecm/node/' + this.getViewModel().get("regionalStructureId") + '/children';
        obj.getStore().load();
    },

    onFocusRegion: function (obj) {
        obj.getStore().getProxy().url = first.config.Config.remoteRestUrl + 'ecm/node/-root-/children' + '?relativePath=' + first.config.Config.conf.properties.regionalStructureFolderPath;
        obj.getStore().load();
    },

    onChangeRegion: function (obj) {
        if (obj.lastSelection !== null && obj.lastSelection.length !== 0) {
            this.getViewModel().set("regionalStructureId", obj.lastSelection[0].data.id);
        }
    },

    filterGrid: function (filter) {
        let view = this.getView(),
            grid = Ext.getCmp('actionListEcmId');
        let store = grid.getStore();

        if (filter) {
            store.proxy.setExtraParams({filter: filter});
        } else {
            delete store.proxy.extraParams['filter'];
        }
        store.proxy.setHeaders({ 'Accept-Language': '*',});
        store.load({page:1});

        view.saveState();
        grid.saveState();
    }
});
