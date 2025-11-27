Ext.define('first.view.registration.task.branchChange.BranchChangeControllerApprovalCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'branchChangeControllerApprovalCard',

    requires: [
        'Ext.button.Button',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.column.Column',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.selection.CellModel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.store.change.BranchesGeneralChangeStore',
        'first.view.registration.task.branchChange.BranchChangeControllerApprovalController',
        'first.view.registration.task.branchChange.BranchChangeGeneralCardController',
        'first.view.registration.task.shared.CardHeaderView'
    ],

    controller: 'branchChangeControllerApproval',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'cardHeader'
    }, {
        xtype: 'form',
        flex: 1,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: {
            flex: 1,
            margin: 0
        },
        items: [{
            xtype: 'label',
            flex: 0,
            hidden: true,
            bind: {
                html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToRedactor + "</br></br></br><b><i>" + ' " {redactorName} "' + '</b></i></p>',
                hidden: '{inReview}'
            }
        }, {
            xtype: 'panel',
            controller: 'branchChangeGeneralCard',
            layout: 'fit',

            reference: 'branchChangesGridContainerPanel',

            items: [{
                xtype: 'grid',

                selModel: {
                    type: 'cellmodel'
                },

                plugins: {
                    ptype: 'cellediting',
                    clicksToEdit: 1
                },

                columnLines: true,
                flex: 1,
                title: i18n.changesGridTitle,
                reference: 'branchChangesGridView',
                store: {
                    type: 'branchesGeneralChanges'
                },

                columns: [{
                    flex: 0,
                    xtype: 'rownumberer'
                }, {
                    xtype: 'actioncolumn',
                    width: 40,
                    menuDisabled: true,
                    sortable: false,
                    hideable: false,
                    align: 'center',
                    items: [{
                        iconCls: 'x-fa fa-eye',
                        tooltip: i18n.view,
                        handler: 'onViewClick'
                    }]
                }, {
                    text: i18n.status,
                    flex: 1,
                    dataIndex: 'fina_fiBranchesChangeStatus',
                    editable: false,
                    renderer: function (content, cell, record) {
                        return i18n[content];
                    }
                }, {
                    xtype: 'gridcolumn',
                    text: i18n.finalStatus,
                    flex: 1,
                    dataIndex: 'fina_fiBranchesChangeFinalStatus',
                    allowBlank: false,
                    editable: false,
                    renderer: function (content) {
                        return content ? i18n[content] : '';
                    }
                }, {
                    text: i18n.SUBDIVISION,
                    flex: 1,
                    dataIndex: 'fina_branch',
                    renderer: 'branchNameRenderer'
                }, {
                    xtype: 'actioncolumn',
                    text: i18n.reportCardGapletter,
                    flex: 1,
                    menuDisabled: true,
                    sortable: false,
                    hideable: false,
                    align: 'center',
                    items: [{
                        iconCls: 'x-fa fa-cloud-download-alt',
                        tooltip: i18n.download,
                        handler: 'onDownloadDocumentClick',
                        isDisabled: function (view, rowIndex, colIndex, item, record) {
                            let properties = record.get('properties');
                            return !(properties && properties['fina:fiDocument'] && properties['fina:fiDocument'].id);
                        }
                    }, '', {
                        iconCls: 'x-fa fa-cloud-upload-alt',
                        tooltip: i18n.upload,
                        handler: 'onDocumentUploadClick',
                        isDisabled: 'isUploadDocumentDisabled'
                    }]
                }, {
                    text: i18n.generateStatus,
                    flex: 1,
                    dataIndex: 'fina_branchDocumentGenerateStatus',
                    renderer: function (content, cell, record) {
                        let document = record.get('properties')['fina:fiDocument'];
                        return !document ? '' : i18n['GENERATED'];
                    }
                }, {
                    text: i18n.generateTime,
                    flex: 1,
                    dataIndex: 'fina_branchDocumentGenerateDate',
                    renderer: function (content, cell, record) {
                        let document = record.get('properties')['fina:fiDocument'];
                        return !document ? '' : Ext.Date.format(new Date(Number(document['modifiedAt'])), first.config.Config.timeFormat);
                    }
                }, {
                    text: i18n.comment,
                    flex: 1,
                    dataIndex: 'fina_fiBranchesChangeFinalStatusNote'
                }],


                bbar: {
                    xtype: 'pagingtoolbar',
                    layout: {
                        type: 'hbox',
                        pack: 'center'
                    }
                }
            }]
        }]
    }],

    bbar: {
        items: ['->', {
            xtype: 'button',
            cls: 'finaSecondaryBtn',
            text: i18n.sendErrors,
            handler: 'onGap',
            bind: {
                disabled: '{isControllerButtonDisabled}'
            }
        }, {
            xtype: 'button',
            text: i18n.accept,
            cls: 'finaPrimaryBtn',
            handler: 'onApprove',
            bind: {
                disabled: '{isControllerButtonDisabled}'
            }
        }]
    }
});