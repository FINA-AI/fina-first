Ext.define('first.view.repository.fileUpdate.FileUpdateView', {
    extend: 'Ext.grid.Panel',

    xtype: 'fileUpdate',

    requires: [
        'Ext.button.Button',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.util.Format',
        'first.view.repository.fileUpdate.SingleFile'
    ],


    tbar: {
        cls:'firstFiRegistryTbar',
        disabled: true,
        items: [{
            xtype: 'singlefilefield',
            listeners: {
                change: 'onFilesChoose'
            }
        }],
        bind: {
            disabled: '{isSubmitting || isAlreadySelected}'
        }
    },

    columnLines: true,

    layout: 'fit',

    store: {
        fields: ['name', 'size', 'file', 'status']
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
            header: i18n.size,
            dataIndex: 'size',
            flex: 1,
            renderer: Ext.util.Format.fileSize
        }, {
            header: i18n.status,
            dataIndex: 'status',
            flex: 1,
            renderer: function (content, cell, record) {
                switch (record.get('status')) {
                    case 'UPLOADED':
                        cell.style = 'background-color:green;';
                        return content;
                    case 'PENDING':
                        cell.style = 'background-color:yellow;';
                        return content;
                    case 'READY':
                        cell.style = 'background-color:grey;';
                        break;
                    case 'ERROR':
                        cell.style = 'background-color:red;';
                        break;
                }

                return content;
            }
        }, {
            menuDisabled: true,
            sortable: false,
            hideable: false,
            resizable: false,
            xtype: 'actioncolumn',
            width: 30,
            items: [{
                iconCls: 'x-fa fa-minus-circle removeButtonStyle',
                tooltip: i18n.fileUpdateRemoveFile,
                handler: 'onRemoveFileClick'
            }]
        }]
    },

    buttons: [{
        xtype: 'progressbar',
        id: 'fileUploadProgressBar',
        style: {
            backgroundColor: '#DCDCDC',
            float: 'left',
        },
        value: 0,
        text: 'Progress 0%',
        hidden: true
    }, '->', {
        text: i18n.buttonClose,
        iconCls: 'x-fa fa-times',
        handler: 'onCancelClick'
    }, {
        text: i18n.submit,
        iconCls: 'x-fa fa-save',
        handler: 'onFilesSubmit',
        bind: {
            disabled: '{isSubmitting}'
        }
    }]
});
