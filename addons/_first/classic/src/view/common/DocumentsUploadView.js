Ext.define('first.view.common.DocumentsUploadView', {
    extend: 'Ext.grid.Panel',

    xtype: 'documentsUpload',

    title: '<div><i class="fas fa-folder" style="margin: 2px; font-size: 18px;"></i></br>' + i18n.documents + '</div>',
    titleAlign: 'center',

    columnLines: true,

    loadMask: true,

    tbar: [{
        iconCls: 'x-fa fa-cloud-upload-alt',
        text: i18n.upload,
        handler: 'onUploadClick',
        disabled: true,
        bind: {
            disabled: '{!enableTbarItems}',
            hidden: '{!hasAmendPermission}'
        },
        cls: 'finaSecondaryBtn'
    }, {
        iconCls: 'x-fa fa-sync',
        text: i18n.refresh,
        handler: 'onRefreshClick',
        disabled: true,
        bind: {
            disabled: '{!enableTbarItems}'
        },
        cls: 'finaSecondaryBtn'
    }],

    columns: {
        defaults: {
            flex: 1
        },
        items: [{
            flex: 0,
            xtype: 'rownumberer'
        }, {
            menuDisabled: true,
            sortable: false,
            hideable: false,
            xtype: 'actioncolumn',
            resizable: false,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-cloud-download-alt icon-margin',
                handler: 'onDownloadClick'
            }, {
                iconCls: 'x-fa fa-trash icon-margin',
                handler: 'onDeleteClick',
                isDisabled: 'isDeleteActionDisabled'
            }]
        }, {
            flex: 2,
            text: i18n.documentsUploadName,
            dataIndex: 'name',
            renderer: function (content, cell, record) {
                let value = record.get('name'), icon = first.util.RepositoryUtil.getNodeIcon(record, 'x-fa');
                return icon + ' <text style="cursor:pointer;">' + value + '</text>';
            }
        }, {
            header: i18n.documentsUploadCreatedBy,
            dataIndex: 'createdBy',
            renderer: function (content, cell, record) {
                let value = record.get('createdBy');
                return value.id;
            }
        }, {
            header: i18n.documentsUploadCreationDate,
            dataIndex: 'createdAt',
            renderer: function (content, cell, record) {
                let value = record.get('createdAt');
                return (Ext.Date.format(new Date(value * 1), first.config.Config.timeFormat));
            }
        }]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        disabled: true,
        bind: {
            disabled: '{!enableTbarItems}'
        }
    }
});