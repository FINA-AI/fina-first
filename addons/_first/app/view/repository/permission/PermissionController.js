Ext.define('first.view.repository.permission.PermissionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.permissionController',

    init: function () {
        this.initData();
        let item = this.getViewModel().get('selectedNode');
        this.getViewModel().set('permissionDisableEnableBtnText', item.get('permissions').isInheritanceEnabled ? i18n.disableInheritanceAndSave : i18n.enableInheritanceAndSave)
        this.getViewModel().set('permissionDisableEnableBtnIcon', item.get('permissions').isInheritanceEnabled ? 'x-fa fa-ban' : 'x-fa fa-check')
    },

    initData: function () {
        let selectedNode = this.getViewModel().get('selectedNode');
        let grid = this.lookupReference('permissionGrid');
        let storeData = [];

        let permissions = selectedNode.get('permissions');

        Ext.each(permissions.inherited, function (inherited) {
            if (inherited['authorityId'].indexOf('GROUP_site_') < 0) {
                storeData.push(Ext.create('first.model.permission.PermissionModel',
                    {
                        authorityId: inherited.authorityId,
                        name: inherited.name,
                        accessStatus: inherited.accessStatus,
                        settable: permissions.settable,
                        type: 'INHERITED'
                    }));
            }
        });

        Ext.each(permissions.locallySet, function (locally) {
            storeData.push(Ext.create('first.model.permission.PermissionModel',
                {
                    authorityId: locally.authorityId,
                    name: locally.name,
                    accessStatus: locally.accessStatus,
                    settable: permissions.settable,
                    type: 'LOCALLY'
                }));
        });

        grid.getStore().setData(storeData)
    },

    onAddButtonClick: function () {
        this.doCardNavigation(1);
    },

    addRows: function (data) {
        let selectedNode = this.getViewModel().get('selectedNode');
        let permissions = selectedNode.get('permissions');

        let grid = this.lookupReference('permissionGrid');

        Ext.each(data, function (rec) {

            grid.getStore().insert(0, Ext.create('first.model.permission.PermissionModel',
                {
                    authorityId: rec.get('nodeType') === 'cm:person' ? rec.get('properties')['cm:userName'] : rec.get('name'),
                    name: 'Consumer',
                    accessStatus: 'ALLOWED',
                    settable: permissions.settable,
                    type: 'LOCALLY'
                }));
        });
    },

    onRemoveClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        var store = this.getView().down('grid').getStore();
        store.remove(record);
    },

    onSavePermissionsClick: function () {
        let selectedNode = this.getViewModel().get('selectedNode');
        let permissions = selectedNode.get('permissions');
        this.savePermissions(selectedNode, permissions, permissions.isInheritanceEnabled);
    },

    doCardNavigation: function (incr) {
        var me = this.getView(),
            l = me.getLayout(),
            i = l.activeItem.id.split('card-')[1],
            next = parseInt(i, 10) + incr;

        l.setActiveItem(next);
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

    onCloseClick: function () {
        this.doCardNavigation(-1);
    },

    onAddUsersClick: function () {
        let grid = this.lookupReference('userAndGroupGrid');
        let checkedRecords = grid.getSelectionModel().getSelection();

        this.addRows(checkedRecords);

        this.onCloseClick();
    },

    onDisableEnableInheritance: function () {
        let selectedNode = this.getViewModel().get('selectedNode');
        let permissions = selectedNode.get('permissions');
        this.savePermissions(selectedNode, permissions, !permissions.isInheritanceEnabled);
    },

    savePermissions: function (selectedNode, permissions, isInheritanceEnabled) {
        let me = this;
        permissions.locallySet = [];

        let grid = me.lookupReference('permissionGrid');
        let store = grid.getStore();

        store.each(function (record, idx) {
            if (record.get('type') === 'LOCALLY') {
                permissions.locallySet.push(
                    {
                        authorityId: record.get('authorityId'),
                        name: record.get('name'),
                        accessStatus: 'ALLOWED'
                    }
                )
            }
        });

        selectedNode.set('permissions', permissions);

        let nodeBodyUpdate = {
            name: selectedNode.get('name'),
            permissions: {
                inheritanceEnabled: isInheritanceEnabled,
                locallySet: permissions.locallySet

            }
        };

        Ext.Ajax.request({
            method: 'PUT',
            jsonData: nodeBodyUpdate,
            url: first.config.Config.remoteRestUrl + "ecm/node/" + selectedNode.get('id'),
            callback: function (op, success, response) {
                me.fireEvent('refreshGrid', selectedNode.get('parentId'));
                me.getView().destroy();
            }
        });
    }

});