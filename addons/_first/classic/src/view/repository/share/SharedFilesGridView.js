/**
 * Created by oto on 24.04.20.
 */
Ext.define('first.view.registration.share.SharedFilesGridView', {
    extend: 'first.view.repository.common.CommonGridView',

    xtype: 'shared-files',

    requires: [
        'first.store.repository.share.SharedFilesStore',
        'first.view.repository.share.SharedFilesController'
    ],

    controller: 'sharedfiles',

    viewModel: {},


    loadMask: true,

    columnLines: true,

    store: {
        type: 'sharedfiles'
    },

    bind: {
        selection: '{selectedDocument}'
    },

    tbar: {
        cls: 'firstFiRegistryTbar',
        minHeight: 30,
        items: []
    },

    columns: {
        defaults: {
            align: 'left'
        },
        items: [{
            width: 50,
            dataIndex: 'content',
            renderer: function (content, cell, record) {
                return first.util.RepositoryUtil.getNodeIcon(record, 'fa-x');
            }
        }, {
            flex: 3,
            text: i18n.repositoryColumnName,
            dataIndex: 'name',
            renderer: function (value, cell, record) {
                cell.tdCls = 'underlineTextDec';
                if (record.get('file') && record.get('properties')['cm:versionLabel']) {
                    return '<text style="cursor:pointer">' + value + '</text>' +
                        ' <span style="border-radius: 2px; background-color: rgba(0,0,0,0.30); padding: 2px; color: #FFFFFF">'
                        + record.get('properties')['cm:versionLabel'] + '</span>';
                }
                return '<text style="cursor:pointer;">' + value + '</text>';
            }
        }, {
            text: i18n.size,
            dataIndex: 'size',
            renderer: function (value, cell, record) {
                if (value) {
                    return Ext.util.Format.fileSize(value)
                }
                return '';
            }
        }, {
            text: i18n.repositoryColumnLocation,
            flex: 1,
            dataIndex: 'location',
            renderer: function (value, cell, record) {
                if (value) {
                    return value.lastIndexOf('/') === 0 ? "Personal Files" : value.substring(value.lastIndexOf('/') + 1, value.length);
                }
                return '';
            }
        }, {
            flex: 1,
            text: i18n.repositoryColumnModifiedAt,
            dataIndex: 'modifiedAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat)
        }, {
            flex: 1,
            text: i18n.sharedBy,
            dataIndex: 'sharedByUser',
            renderer: function (value, cell, record) {
                return value.displayName;
            }
        }, {
            bind: {
                hidden: '{!enableBreadcrumb}'
            },
            menuDisabled: true,
            sortable: false,
            resizable: false,
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-cloud-download-alt',
                tooltip: i18n.do,
                handler: 'onDownloadCtionButtonClick'
            }, ' ', {
                iconCls: 'x-fa fa-eye',
                tooltip: 'View',
                handler: 'onPreviewActionButtonClick',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('content');
                }
            }]
        }]
    },

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    listeners: {
        itemcontextmenu: 'showContextMenu',
        cellclick: 'onCellClick',
    }

});