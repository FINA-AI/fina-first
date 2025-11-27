Ext.define('first.view.registration.ComplexStructureController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.complexStructure',

    listen: {
        controller: {
            '*': {
                refreshBeneficiaryGridEvent: 'onRefreshBeneficiaryGridEvent'
            }
        }
    },

    init: function () {
        this.initView();
    },

    initView: function () {
        let me = this,
            detail = me.getViewModel().get('detail'),
            childType = detail.properties['fina:folderConfigChildType'];

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + childType.replace(':', '_') + '/properties',
            method: 'GET',
            callback: function (options, success, response) {
                let metaDada = JSON.parse(response.responseText),
                    hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(childType, metaDada),
                    questions = first.view.registration.MetadataUtil.getQuestions(childType, metaDada),
                    singleLineItems = first.view.registration.MetadataUtil.getSingleLineItemGroup(childType, metaDada),
                    fiName = me.getViewModel().get('theFi')['fina_fiRegistryName'];

                me.getViewModel().set('metaDada', metaDada);
                me.getViewModel().set('hiddenProperties', hiddenProperties);
                me.getViewModel().set('type', i18n[detail.name]);
                me.getViewModel().set('questions', questions);
                me.getViewModel().set('singleLineItems', singleLineItems);
                me.getViewModel().set('isTree', true);
                let cols = first.view.registration.complexStructure.ComplexStructureHelper.getTreeColumns(metaDada, childType, fiName);
                me.lookupReference('complexStructureTreeView').setColumns(cols);
                me.initBeneficiariesGridView();
            }
        });

    },

    initBeneficiariesGridView: function () {
        let view = this.lookupReference('beneficiariesGridView');
        let metaDada = this.getViewModel().get('metaDada'),
            childType = this.getViewModel().get('detail').properties['fina:folderConfigChildType'],
            hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(childType, metaDada),
            fiRegistryId = this.getViewModel().get('theFi')['id'];

        let grid = first.view.registration.complexStructure.ComplexStructureHelper.getBeneficiaryGrid(metaDada, hiddenProperties, childType, 'PHYSICAL', fiRegistryId);
        view.add(grid);
    },

    refreshBeneficiaryGrid: function () {
        let view = this.lookupReference('beneficiariesGridView');
        view.down('grid').getStore().load();
    },

    onRefreshBeneficiaryGridEvent: function (fiRegistryId) {
        let fi = this.getViewModel().get('theFi');
        if (fi && fiRegistryId === fi.id) {
            this.refreshBeneficiaryGrid();
        }
    }


});
