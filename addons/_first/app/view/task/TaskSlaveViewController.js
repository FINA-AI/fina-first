Ext.define('first.view.task.TaskSlaveViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.taskSlaveViewController',

    init: function () {

    },

    onCancelTaskGridNewItemButtonClick: function (button) {
        let window = button.findParentByType('window');
        window.destroy();
    },

    onSubmitTaskGridEditItemButtonClick: function (button) {

        let formItem = this.getViewModel().get('formItem');
        let editedItemProperties = this.getViewModel().get('edit')[formItem.name];
        editedItemProperties['cm_autoVersionOnUpdateProps'] = true;

        let me = this;
        if (Ext.getCmp(formItem.name).isValid()) {
            let jsonDataProperties = {};
            Ext.each(Object.keys(editedItemProperties), function (key) {
                let itemKey = key.replace('_', ':');
                jsonDataProperties[itemKey] = editedItemProperties[key];
            });

            let jsonData = {
                name: editedItemProperties['cm_name'],
                properties: jsonDataProperties
            };

            let selectedRecord = me.getViewModel().get('selectedRecord');
            Ext.Ajax.request({
                method: 'PUT',
                url: first.config.Config.remoteRestUrl + 'ecm/node/' + selectedRecord.id,
                jsonData: jsonData,
                success: function (response) {
                    let editedNode = JSON.parse(response.responseText);

                    let node = {};
                    node.id = editedNode.id;
                    node['cm_name'] = editedNode['name'];
                    Ext.each(Object.keys(editedNode.properties), function (key) {
                        let itemKey = key.replace(':', '_');
                        node[itemKey] = editedNode.properties[key];
                    });

                    node.classProperties = selectedRecord.get('item').classProperties;
                    node.item = node;

                    let gridStore = Ext.getCmp(me.getViewModel().get('gridPanelId')).getStore();
                    gridStore.removeAt(gridStore.find('id', node.id));
                    gridStore.add(node);
                    me.getView().destroy();
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            });
        }
    },

    onSubmitTaskGridNewItemButtonClick: function (button) {
        this.getView().mask(i18n.pleaseWait);

        let formItem = this.getViewModel().get('formItem');
        let newItemProperties = this.getViewModel().get('new')[formItem.name];
        newItemProperties['cm_autoVersionOnUpdateProps'] = true;

        let me = this;
        if (Ext.getCmp(formItem.name).isValid()) {
            let jsonDataProperties = {};
            Ext.each(Object.keys(newItemProperties), function (key) {
                let itemKey = key.replace('_', ':');
                jsonDataProperties[itemKey] = newItemProperties[key];
            });

            let jsonData = {
                name: newItemProperties['cm_name'],
                nodeType: formItem['dataType'],
                properties: jsonDataProperties
            };

            let rootFolderId = me.getViewModel().get('rootFolderId');
            Ext.Ajax.request({
                method: 'POST',
                url: first.config.Config.remoteRestUrl + 'ecm/node/' + rootFolderId + '/children',
                jsonData: jsonData,
                success: function (response) {
                    let createdNode = JSON.parse(response.responseText);

                    // add created node as association to task
                    let addedAssocKey = "assoc_" + formItem.name + "_added";
                    let addedAssoc = {};
                    addedAssoc[addedAssocKey] = 'workspace://SpacesStore/' + createdNode.id;

                    jsonDataProperties.id = createdNode.id;

                    let gridStore = Ext.getCmp(me.getViewModel().get('gridPanelId')).getStore();

                    new first.util.WorkflowHelper().addOrRemoveAssociation(me.getView(), me.getViewModel().get('taskId'), addedAssoc, gridStore, jsonDataProperties, false, true);
                },
                failure: function (response) {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            });
        }
    }

});
