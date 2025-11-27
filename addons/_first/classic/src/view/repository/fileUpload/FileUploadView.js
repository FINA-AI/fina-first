/**
 * Created by oto on 6/4/19.
 */
Ext.define('first.view.repository.fileUpload.FileUploadView', {
    extend: 'Ext.grid.Panel',

    xtype: 'fileupload',

    requires: [
        'Ext.button.Button',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.util.Format',
        'first.store.tag.TagStore',
        'first.view.repository.fileUpload.FileUploadController',
        'first.view.repository.fileUpload.MultiFile'
    ],

    controller: 'fileUploadController',

    tbar:
        {
            items: [
                {
                    xtype: 'multifilefield',
                    bind: {
                        disabled: '{isSubmitting}'
                    },
                    listeners: {
                        change: 'onFilesChoose'
                    }
                }
            ]
        },

    columnLines: true,

    layout: 'fit',

    viewConfig: {
        emptyText: '<div height="300px"width="100%" class="drag-file-label" style="align-content: center;text-align: center;vertical-align: center">' +
            '<i class="fa fa-cloud-upload" aria-hidden="true"></i>' +
            '  ' + i18n.dragAndDRopText +
            '</div>' +
            '<div class="drag-file-icon"></div>',
        deferEmptyText: false
    },

    store: {
        fields: ['name', 'size', 'file', 'status']
    },

    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],

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
            header: i18n.tags,
            dataIndex: 'tags',
            flex: 1.5,
            editor: {
                xtype: 'tagfield',
                filterPickList: true,
                store: {
                    type: 'tagStore'
                },
                displayField: 'tag',
                valueField: 'tag',
                queryMode: 'local',
                createNewOnEnter: true,
                createNewOnBlur: true
            }
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
            resizable: false,
            xtype: 'actioncolumn',
            width: 30,
            items: [{
                iconCls: 'x-fa fa-minus-circle removeButtonStyle',
                tooltip: 'Remove File',
                handler: 'onRemoveFileClick'
            }]
        }]
    },

    listeners: {

        drop: {
            element: 'el',
            fn: 'drop'
        },

        dragstart: {
            element: 'el',
            fn: 'addDropZone'
        },

        dragenter: {
            element: 'el',
            fn: 'addDropZone'
        },

        dragover: {
            element: 'el',
            fn: 'addDropZone'
        },

        dragleave: {
            element: 'el',
            fn: 'removeDropZone'
        },

        dragexit: {
            element: 'el',
            fn: 'removeDropZone'
        }

    },

    buttons:
        [
            {
                xtype: 'progressbar',
                id: 'fileUploadProgressBar',
                style: {
                    backgroundColor: '#DCDCDC',
                    float: 'left',
                },
                value: 0,
                text: 'Progress 0%',
                hidden: true
            },
            '->',
            {
                xtype: 'button',
                text: i18n.buttonClose,
                iconCls: 'x-fa fa-times',
                cls: 'finaSecondaryBtn',
                handler: 'onCancelClick'
            },
            {
                xtype: 'button',
                text: i18n.submit,
                iconCls: 'x-fa fa-save',
                cls: 'finaPrimaryBtn',
                handler: 'onFilesSubmit',
                bind: {
                    disabled: '{isSubmitting}'
                }
            }
        ]
})
;