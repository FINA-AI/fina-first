Ext.define('first.view.registration.task.SanctionedPeopleChecklistController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.sanctionedPeopleChecklistController',

    requires: [
        'first.config.Config'
    ],

    init: function () {

    },

    onSaveClick: function () {
        let store = this.lookupReference('sanctionedPeopleChecklist').getStore();
        let storeProxyUrl = store.proxy.getUrl();
        let me = this;
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/');
        me.getView().mask(i18n.pleaseWait);
        if (store.getModifiedRecords().length <= 0) {
            me.getView().destroy();
        }

        store.sync({
            callback: function () {
                store.proxy.setUrl(storeProxyUrl);
                store.load();
                me.getView().destroy();
            },
            failure: function () {
                me.getView().unmask();
            }
        });
    },

    changeSanctionedPeopleChecklistUpdatedStatus: function () {
        if (this.getViewModel().get('isRegistryActionEditor')) {
            let me = this,
                theFi = me.getViewModel().get('theFi'),
                actionId = theFi['fina_fiRegistryLastActionId'];

            Ext.Ajax.request({
                method: 'GET',
                url: first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '?relativePath=VALIDATION_RESULT',
                callback: function (options, success, response) {
                    let checklistModifiedFlagNode = JSON.parse(response.responseText);

                    Ext.Ajax.request({
                        method: 'PUT',
                        url: first.config.Config.remoteRestUrl + 'ecm/node/' + checklistModifiedFlagNode.id,
                        jsonData: {
                            id: checklistModifiedFlagNode.id,
                            properties: {
                                'fina:fiRegistryValidationResultSanctionedPeopleChecklistModified': false
                            }
                        },
                        callback: function (options, success, response) {
                            me.fireEvent('sanctionedPeopleChecklistUpdate', actionId);
                        }
                    });
                }
            });
        }
    },

    onCancelClick: function () {
        this.getView().destroy();
    },

    load: function () {
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let store = this.lookupReference('sanctionedPeopleChecklist').getStore();
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=Sanctioned People Checklist&orderBy=createdAt asc');
        let me = this;
        store.load({
            callback: function () {
                me.changeSanctionedPeopleChecklistUpdatedStatus();
            }
        });
    },

    afterRender: function () {
        this.load();
    },

    beforeCellEdit: function (obj, editor) {
        return !this.getView().getViewModel().get('isDisabled') && this.getView().getViewModel().get('isRegistryActionEditor')
            && !editor.record.get('fina_fiSanctionedPeopleChecklistItemNotEditable');
    },

    isInListChangeListener: function () {
        let record = this.getView().lookupReference('sanctionedPeopleChecklist').getSelectionModel().getSelection();
        record[0].set('fina_fiSanctionedPeopleChecklistItemDateChecked', new Date());
    },


    onRenderName: function (content, cell, record) {
        let name = record.get('fina_fiSanctionedPeopleChecklistItemName');
        let idNum = record.get('fina_fiSanctionedPeopleChecklistItemIdNumber');
        let date = record.get('fina_fiSanctionedPeopleChecklistItemBirthDate');
        let formatDate = date ? ", " + Ext.Date.format(new Date(date), first.config.Config.dateFormat) : "";
        let legalForm = this.getViewModel().get('theFi')['fina_fiRegistryLegalFormType'];
        legalForm = record.get('fina_fiSanctionedPeopleChecklistItemType') === 'fiRegistryLP' ? i18n[legalForm] ? i18n[legalForm] + " " : '' : '';
        let parentName = record.get('fina_fiSanctionedPeopleChecklistItemParentName');
        return legalForm + (name ? (name + ",  " + idNum) : idNum) + formatDate + (parentName ? `, ${parentName}` : '');
    },

    exportSanctionedPeople: function () {
        this.fireEvent('exportReport', 'exportSanctionedPeopleRegistration', this.getViewModel().get('theFi')['id']);
    }

});
