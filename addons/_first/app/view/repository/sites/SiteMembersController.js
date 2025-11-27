/**
 * Created by oto on 27.04.20.
 */
Ext.define('first.view.repository.sites.SiteMembersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sitemembersController',

    init: function () {
        let store = this.lookupReference('siteMembersGrid').getStore(),
            url = store.proxy.getUrl(),
            selctedSite = this.getViewModel().get('selectedDocument');
        url = Ext.String.format(url, selctedSite.get('site')['id']);
        store.proxy.setUrl(url);
        store.load();
    },


    onCloseClick: function (component, e) {
        this.doCardNavigation(-1);
    },

    onAddMembersClick: function (component, e) {
        let grid = this.lookupReference('userAndGroupGrid');
        let checkedRecords = grid.getSelectionModel().getSelection();

        this.addRows(checkedRecords);

        this.onCloseClick();

    },

    addRows: function (data) {
        let me = this,
            selectedNode = me.getViewModel().get('selectedNode'),
            grid = me.lookupReference('siteMembersGrid');

        Ext.each(data, function (rec) {
            let id = rec.get('nodeType') === 'cm:person' ? rec.get('properties')['cm:userName'] : rec.get('properties')['cm:authorityName'],
                authorityType = rec.get('nodeType') === 'cm:person' ? 'USER' : 'GROUP',
                properties = rec.get('properties');
            if (!grid.getStore().findRecord("id", id)) {
                let model = Ext.create('Ext.data.Model',
                    {
                        id: id,
                        authority: {
                            authorityType: authorityType,
                            fullName: authorityType === 'GROUP' ? properties['cm:authorityName'] : properties['cm:userName'],
                            firstName: properties['cm:firstName'],
                            lastName: properties['cm:lastName'],
                        },
                        description: rec.get('nodeType') === 'cm:person' ? me.getPersonDescription(rec) : rec.get('cm:authorityName'),
                        role: 'SiteConsumer'
                    });
                model.set('dirty', true)
                grid.getStore().insert(0, model);
            }
        });
    },

    getPersonDescription: function (personNode) {
        let firstName = personNode.get('properties')['cm:firstName'],
            lastName = personNode.get('properties')['cm:lastName'];
        firstName = firstName ? firstName : '';
        lastName = lastName ? lastName : '';
        return firstName + ' ' + lastName;
    },

    onAddButtonClick: function (component, e) {
        this.doCardNavigation(1);
    },

    onSaveSiteMembersClick: function (component, e) {
        let me = this,
            selectedSite = this.getViewModel().get('selectedDocument').get('site'),
            store = this.lookupReference('siteMembersGrid').getStore(),
            modifiedRecords = store.getModifiedRecords();
        let postArray = [];
        modifiedRecords.forEach(function (record) {
            postArray.push(record.data);
        });

        me.getView().mask(i18n.pleaseWait);
        Ext.Ajax.request({
            method: 'POST',
            jsonData: postArray,
            url: first.config.Config.remoteRestUrl + "ecm/sites/" + selectedSite['id'] + "/members",
            callback: function (op, success, response) {
                me.getView().destroy();
            }
        });
    },

    onFilter: function (textfield, op) {
        let queryValue = textfield.value;
        if (op.getCharCode() === Ext.EventObject.ENTER) {
            if (textfield.value.trim().length > 0) {
                textfield.getTrigger('clear').show();
                textfield.updateLayout();
            }
            this.filterGrid(queryValue);
        }
    },

    filterGrid: function (queryValue) {
        queryValue = queryValue === null ? '' : queryValue;
        let store = this.lookupReference('userAndGroupGrid').getStore();
        store.proxy.setExtraParams({query: queryValue && queryValue.trim().length > 0 ? queryValue : null});
        store.load();
    },

    doCardNavigation: function (incr) {
        var me = this.getView(),
            l = me.getLayout(),
            i = l.activeItem.id.split('card-')[1],
            next = parseInt(i, 10) + incr;

        l.setActiveItem(next);
    },

    onRemoveMemberClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        var store = this.getView().down('grid').getStore();
        store.remove(record);
        store.sync();
    },

    isDisabledRemoveColumn: function (view, rowIndex, colIndex, item, record) {
        let vm = this.getViewModel();
        return vm.get('selectedDocument').get('createdBy')['id'] === record.get('id');
    },
});