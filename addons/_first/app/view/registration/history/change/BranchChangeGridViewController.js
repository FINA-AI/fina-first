Ext.define('first.view.registration.history.change.BranchChangeGridViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.branchChangeGridViewController',

    /**
     * Called when the view is created
     */
    init: function () {

    },

    load: function () {
        let actionId = this.getViewModel().get('fiRegistryActionId'),
            store = this.getView().getStore();

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/branchChanges/' + actionId + '?relativePath=Performed Changes');
        store.load();
    },

    afterRender: function () {
        this.load();
    },

    branchNameRenderer: function (content, cell, record) {
        let branch = record.get('properties')['fina:fiRegistryBranch'];
        let uniqueProperties = ['fina:fiRegistryBranchType', 'fina:fiRegistryBranchAddressRegion', 'fina:fiRegistryBranchAddressCity', 'fina:fiRegistryBranchAddress'];
        return !branch ? '' : this.getRenderString(uniqueProperties, branch['properties']);
    },

    getRenderString: function (array, properties) {
        let result = '';
        for (let i in array) {
            let value = properties[array[i]];
            if (value) {
                result += i18n[value] ? i18n[value] : value;
                if (i !== array.length - 1) {
                    result += ', ';
                }
            }
        }

        return result;
    },

    onDownloadDocumentClick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['fina:fiDocument'] && properties['fina:fiDocument'].id) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + properties['fina:fiDocument'].id + '/content?attachment=true');
        }
    }

});