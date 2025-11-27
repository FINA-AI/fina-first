Ext.define('first.view.fi.request.FiDocumentRequestDocumentView', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.selection.CellModel',
        'first.view.fi.request.FiDocumentRequestDocumentModel',
        'first.view.fi.request.FiDocumentRequestDocumentController',
        'first.store.fi.FiDocumentRequestDocumentStore'
    ],

    xtype: 'fiDocumentRequestDocument',

    viewModel: {
        type: 'fiDocumentRequestDocument'
    },

    controller: 'fiDocumentRequestDocument',

    title: '<div><i class="fas fa-folder" style="margin: 2px; font-size: 18px;"></i></br>' + i18n.fiDocumentRequestDocumentTitle + '</div>',
    titleAlign: 'center',

    store: {
        type: 'fiDocumentRequestDocument',
    },

    columnLines: true,

    loadMask: true,

    features: [{
        ftype: 'grouping',
        startCollapsed: false,
        groupHeaderTpl: '{columnName}: {name} ({rows.length})'
    }],

    tbar: [{
        iconCls: 'x-fa fa-cloud-upload-alt',
        text: i18n.fiDocumentRequestDocumentTbarUploadDocumentTitle,
        tooltip: i18n.fiDocumentRequestDocumentTbarUploadDocumentTooltip,
        relativePath: 'Submitted Documents',
        handler: 'onUploadClick',
        disabled: true,
        hidden: true,
        bind: {
            disabled: '{!enableTbarItems}',
            hidden: '{!hasFiDocumentRequestAmendPermission}'
        },
        cls: 'finaSecondaryBtn'
    }, {
        iconCls: 'x-fa fa-cloud-upload-alt',
        text: i18n.fiDocumentRequestDocumentTbarUploadTemplateTitle,
        tooltip: i18n.fiDocumentRequestDocumentTbarUploadTemplateTooltip,
        relativePath: 'Templates',
        handler: 'onUploadClick',
        disabled: true,
        hidden: true,
        bind: {
            disabled: '{!enableTbarItems}',
            hidden: '{!hasFiDocumentRequestAmendPermission}'
        },
        cls: 'finaSecondaryBtn'
    }, {
        iconCls: 'x-fa fa-sync',
        text: i18n.refresh,
        tooltip: i18n.fiDocumentRequestDocumentTbarRefreshTooltip,
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
            resizable: false,
            xtype: 'actioncolumn',
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-cloud-download-alt',
                handler: 'onDownloadClick'
            },' ', {
                iconCls: 'x-fa fa-trash',
                handler: 'onDeleteClick',
                isDisabled: 'isDeleteActionDisabled'
            }]
        }, {
            hidden: true,
            text: i18n.fiDocumentRequestDocumentGridColumnType,
            dataIndex: 'fiRequestDocumentType'
        }, {
            flex: 2,
            text: i18n.fiDocumentRequestDocumentGridColumnDocumentName,
            dataIndex: 'name',
            renderer: function (content, cell, record) {
                let value = record.get('name'), icon = first.util.RepositoryUtil.getNodeIcon(record, 'x-fa');
                return icon + ' <text style="cursor:pointer;">' + value + '</text>';
            }
        }, {
            hidden: true,
            text: i18n.fiDocumentRequestDocumentGridColumnCreatedBy,
            dataIndex: 'createdBy',
            renderer: function (content, cell, record) {
                let value = record.get('createdBy');
                return value.id;
            }
        }, {
            hidden: true,
            header: i18n.createdAt,
            dataIndex: 'createdAt',
            renderer: function (content, cell, record) {
                let value = record.get('createdAt');
                return (Ext.Date.format(new Date(value * 1), first.config.Config.timeFormat));
            }
        }]
    }

});