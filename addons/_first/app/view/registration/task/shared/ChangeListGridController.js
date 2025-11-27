Ext.define('first.view.registration.task.shared.ChangeListGridController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.changeListGrid',

    init: function () {
        this.load();
    },

    load: function () {
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let grid = this.getView(),
            store = grid.getStore();
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=Performed Changes&orderBy=createdAt desc');
        store.load();
    },

    onViewClick: function (view, recIndex, cellIndex, item, e, record) {
        let tabName = '';
        switch (record.get('fina_fiManagementChangeType')) {
            case 'fiBeneficiary':
                tabName = 'Complex_Structures';
                break;
            case 'fiAuthorizedPerson':
                tabName = 'Authorized_Persons';
                break;

        }
        let fiProfileController = this.getViewModel().get('fiProfileController');
        fiProfileController.setActiveTabAndSelectRecord(tabName, record.get('fina_fiManagementChangeReferenceId'));
    },

    onRefreshClick: function () {
        this.load();
    }

});
