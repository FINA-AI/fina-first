Ext.define('first.view.task.TaskItemViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.taskItemViewController',

    requires: [
        'Ext.app.ViewModel',
        'first.util.DocumentRepositoryHelper'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },

    onAddSelectedItemClick: function (component, e) {
        let selectedDocument = this.getViewModel().get('selectedDocument');
        if (selectedDocument) {
            let taskItemModel = {
                id: selectedDocument.get('id'),
                name: selectedDocument.get('name'),
                createdAt: selectedDocument.get('createdAt'),
                createdBy: selectedDocument.get('createdBy').id,
                modifiedAt: selectedDocument.get('modifiedAt'),
                modifiedBy: selectedDocument.get('modifiedBy').id,
            };

            let pickerStore = Ext.getCmp('taskItemPicker').getStore();
            pickerStore.removeAt(pickerStore.find('id', selectedDocument.id));

            let taskItemViewId = this.getViewModel().get('taskItemViewId');
            let taskItemStore = Ext.getCmp(taskItemViewId).getStore();
            taskItemStore.add(taskItemModel);

            Ext.toast(i18n.taskItemNode + ': ' + taskItemModel.name + ',' + i18n.taskItemNodeIsAddedToGrid, i18n.information);
        } else {
            Ext.toast(i18n.taskItemNodeIsNotSelected, i18n.warning);
        }
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onRemoveTaskItemClick: function (component, e) {
        let selectedItem = this.getViewModel().get('selectedTaskItem');
        if (selectedItem) {
            let store = this.getView().getStore();
            store.removeAt(store.find('id', selectedItem.id));
        }
    },

    onCloseItemPickerClick: function (component, e) {
        let window = component.findParentByType('window');
        window.destroy();
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onAddTaskItemClick: function (component, e) {


        let window = Ext.getCmp('taskItemPickerWindow');
        if (window) {
            window.destroy();
        }

        let currentViewId = this.getView().id;
        let viewModel = new Ext.app.ViewModel({
            data: {
                taskItemViewId: currentViewId
            }
        });

        let itemPickerGridPanel = Ext.create('first.view.repository.personalFiles.PersonalFilesGridView', {
            id: 'taskItemPicker',
            flex: 1,
            viewModel: viewModel
        });

        Ext.create('Ext.window.Window', {
            id: 'taskItemPickerWindow',
            controller: 'taskItemViewController',
            viewModel: viewModel,
            title: i18n.taskItemDocumentRepository,
            iconCls: 'x-fa fa-file-o',
            closable: true,
            width: 900,
            height: 550,
            scrollable: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [itemPickerGridPanel],
            buttons: ['->', {
                text: i18n.taskItemAddSelected,
                handler: 'onAddSelectedItemClick',
                disabled: true,
                bind: {
                    disabled: '{!selectedDocument}'
                },
            }, {
                text: i18n.close,
                handler: 'onCloseItemPickerClick'
            }]
        }).show();

    },

    onDownloadItemActionClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        let documentRepositoryHelper = new first.util.DocumentRepositoryHelper();
        if (record.get('mimeType')) {
            documentRepositoryHelper.openDownloadFileUrl(record.id);
        } else {
            documentRepositoryHelper.onFolderDownload(record.id, this.getView());
        }
    }

});