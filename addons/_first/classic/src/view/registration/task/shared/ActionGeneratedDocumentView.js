Ext.define('first.view.registration.task.shared.ActionGeneratedDocumentView', {
    extend: 'Ext.grid.Panel',

    xtype: 'actionGeneratedDocumentView',

    requires: [
        'first.view.registration.task.shared.ActionGeneratedDocumentController'
    ],

    controller: 'actionGeneratedDocumentController',

    layout: {
        type: 'fit'
    },

    columnLines: true,

    store: {
        type: 'actionGeneratedDocumentStore'
    },

    selModel: {
        type: 'cellmodel'
    },

    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],

    columns: [{
        flex: 0,
        xtype: 'rownumberer'
    }, {
        flex: 1,
        header: i18n.type,
        dataIndex: 'fina_fiDocumentType',
        renderer: function (content, cell, record) {
            let value = record.get('fina_fiDocumentType');
            let v = value.includes(":") ? value.split(":")[1] : value;
            return i18n[v] ? i18n[v] : v;
        }
    }, {
        xtype: 'actioncolumn',
        text: i18n.generateDownloadUpload,
        flex: 1,
        menuDisabled: true,
        sortable: false,
        resizable: false,
        hideable: false,
        align: 'center',
        items: [{
            iconCls: 'x-fa fa-cog',
            tooltip: i18n.generate,
            handler: 'onGenerateActionDocumentClick',
            isDisabled: 'isGenerateActionDocumentDisabled'
        }, '', {
            iconCls: 'x-fa fa-cloud-download-alt',
            tooltip: i18n.download,
            handler: 'onDownloadActionDocumentClick',
            isDisabled: function (view, rowIndex, colIndex, item, record) {
                return !record.get('cm_author');
            }
        }, '', {
            iconCls: 'x-fa fa-cloud-upload-alt',
            tooltip: i18n.upload,
            handler: 'onUploadActionDocumentClick',
            isDisabled: 'isUploadActionDocumentDisabled'
        }]
    }, {
        flex: 1,
        text: i18n.documentDate,
        dataIndex: 'fina_fiDocumentDate',
        xtype: 'datecolumn',
        format: first.config.Config.dateFormat,
        editor: {
            xtype: 'datefield',
            format: first.config.Config.dateFormat,
            bind: {
                disabled: '{!isEditor}'
            }
        }
    }, {
        flex: 1,
        text: i18n.documentNumber,
        dataIndex: 'fina_fiDocumentNumber',
        editor: {
            bind: {
                disabled: '{!isEditor}'
            },
            minChars: 1
        }
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        layout: {
            type: 'hbox',
            pack: 'center'
        }
    },

    listeners: {
        afterrender: 'afterRender'
    }

});
