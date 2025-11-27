/**
 * Created by oto on 24.04.20.
 */
Ext.define('first.view.repository.share.SharedFilesController', {
    extend: 'first.view.repository.common.CommonController',
    alias: 'controller.sharedfiles',

    requires: [
        'first.view.repository.common.CommonContextMenuController'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },

    onDownloadCtionButtonClick: function (grid, rowIndex, colIndex, item, e, record, row) {
        if (!record) {
            record = this.getViewModel().get('selectedDocument')
        }
        let documentRepositoryHelper = new first.util.DocumentRepositoryHelper();

        documentRepositoryHelper.openDownloadFileUrl(record.get('nodeId'));

    },

    showContextMenu: function (component, record, item, index, e) {
        e.preventDefault();
        this.getViewModel().set('selectedDocument', record);
        this.getViewModel().set('isFile', record.get('file'))
        this.getContextMenu(record).showAt(e.getXY());
    },

    getContextMenu: function (record) {
        var me = this;

        return Ext.create('Ext.menu.Menu', {
            controller: 'commoncontextmenu',
            viewModel: me.getViewModel(),
            record: record,
            items: [ {
                text: i18n.download,
                handler: 'onDownloadMenuClick',
                iconCls: 'x-fa fa-cloud-download-alt'
            }, {
                iconCls: 'x-fa fa-edit',
                text: i18n.documentRepositoryContextMenuEditContent,
                handler: 'onEditContentMenuClick',
                bind: {
                    disabled: '{selectedDocument.folder || !selectedDocument.content}'
                }
            }, {
                xtype: 'menuseparator'
            },{
                text: i18n.remove,
                iconCls: 'x-fa fa-times',
                handler: 'onRemoveFromSharedMenuClick',
            }]
        });
    }
});