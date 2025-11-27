/**
 * Created by oto on 25.05.20.
 */
Ext.define('first.view.repository.version.VersionGridView', {
    extend: 'Ext.grid.Panel',

    xtype: 'versiongrid',

    requires: [
        'Ext.button.Button',
        'Ext.grid.column.Action',
        'Ext.toolbar.Spacer',
        'first.store.repository.version.VersionStore'
    ],
    columnLines: true,
    layout: 'fit',

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [
            {
                xtype: 'button',
                text: i18n.uploadNewVersion,
                iconCls: 'x-fa fa-cloud-upload-alt',
                handler: 'onAddNewVersionButtonClick'
            }
        ]
    },

    viewConfig: {
        stripeRows: true,
        enableTextSelection: false,
        markDirty: true
    },

    trackMouseOver: false,
    disableSelection: true,

    store: {
        type: 'versions'
    },

    columns: {
        defaults: {
            align: 'left'
        },
        items: [{
            header: i18n.repositoryColumnName,
            dataIndex: 'name',
            flex: 2
        }, {
            header: i18n.repositoryColumnModifiedBy,
            dataIndex: 'modifiedByUserDescription',
            flex: 2
        }, {
            header: i18n.repositoryColumnModifiedAt,
            dataIndex: 'modifiedAt',
            renderer: Ext.util.Format.dateRenderer(first.config.Config.timeFormat),
            flex: 1
        }, {
            header: i18n.version,
            dataIndex: 'id',
            flex: 1
        }, {
            menuDisabled: true,
            sortable: false,
            resizable: false,
            xtype: 'actioncolumn',
            width: 100,
            items: [{
                iconCls: 'x-fa fa-history',
                tooltip: i18n.restore,
                handler: 'onRestoreVersion',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('id') === '1.0';
                }
            }, ' ', {
                iconCls: 'x-fa fa-cloud-download-alt',
                tooltip: i18n.download,
                handler: 'onDownloadVersion'
            }, ' ', {
                iconCls: 'x-fa fa-trash removeButtonStyle',
                tooltip: i18n.delete,
                handler: 'onRemoveVersion',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    if (record.get('id') === '1.0') {
                        return true;
                    } else if (first.config.Config.conf.properties.currentUser.capabilities.admin) {
                        return false;
                    } else if (record.get('modifiedByUser').id === first.config.Config.conf.properties.currentUser.id) {
                        return false;
                    }
                    return true;
                }
            }]
        }]
    },

});