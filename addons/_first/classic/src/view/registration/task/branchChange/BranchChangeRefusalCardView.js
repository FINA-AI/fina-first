Ext.define('first.view.registration.task.branchChange.BranchChangeRefusalCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'branchChangeRefusalCard',

    controller: 'branchChangeRefusalCard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'cardHeader'
    }, {
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        flex: 1,
        items: [{
            xtype: 'label',
            hidden: true,
            bind: {
                html: '<p style="text-align: center; font-size: 24px; color: #3892d4; margin-top: 34px; font-weight:100;">' + i18n.successfullySentToRedactor + "</br></br></br><b><i>" + ' " {redactorName} "' + '</b></i></p>',
                hidden: '{!taskRedactor}'
            }
        }, {
            xtype: 'grid',
            iconCls: 'x-fa fa-list-ol',
            columnLines: true,
            flex: 1,
            title: i18n.branchesChangeRefusalHeaderTitle,
            reference: 'branchChangesGridViewFinal',

            selModel: {
                type: 'cellmodel'
            },

            plugins: [{
                ptype: 'cellediting',
                clicksToEdit: 1,
                listeners: {
                    beforeedit: 'beforeCellEdit'
                }
            }],

            store: {
                type: 'branchesGeneralChanges'
            },

            columns: [{
                flex: 0,
                xtype: 'rownumberer'
            }, {
                xtype: 'actioncolumn',
                flex: 1,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                items: [{
                    iconCls: 'x-fa fa-eye icon-margin',
                    tooltip: i18n.view,
                    handler: 'onViewClick'
                }]
            }, {
                text: i18n.status,
                flex: 0,
                dataIndex: 'fina_fiBranchesChangeStatus',
                renderer: function (content, cell, record) {
                    return i18n[content];
                }
            }, {
                text: i18n.branchesChangeRefusalBranchColumn,
                flex: 1,
                dataIndex: 'fina_branch',
                renderer: 'branchNameRenderer'
            }, {
                text: i18n.documents,
                flex: 3,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                columns: [{
                    xtype: 'actioncolumn',
                    text: i18n.branchesChangeRefusalGenerateDownloadColumn,
                    flex: 1,
                    menuDisabled: true,
                    sortable: false,
                    hideable: false,
                    resizable: false,
                    align: 'center',
                    items: [{
                        iconCls: 'x-fa fa-cog',
                        tooltip: i18n.generate,
                        handler: 'onGenerateRefusalLetterClick',
                        isDisabled: 'isGenerateRefusalLetterDisabled'
                    }, '', {
                        iconCls: 'x-fa fa-cloud-download-alt',
                        tooltip: i18n.download,
                        handler: 'onDownloadRefusalLetterClick',
                        isDisabled: function (view, rowIndex, colIndex, item, record) {
                            let properties = record.get('properties');
                            return !(properties && properties['fina:fiBranchRefusalLetterDocument'] && properties['fina:fiBranchRefusalLetterDocument'].id);
                        }
                    }, '', {
                        iconCls: 'x-fa fa-cloud-upload-alt',
                        tooltip: i18n.upload,
                        handler: 'onUploadRefusalLetterClick',
                        isDisabled: 'isUploadRefusalLetterDisabled'
                    }]
                }, {
                    text: i18n.branchesChangeRefusalGenerationStatusColumn,
                    flex: 1,
                    dataIndex: 'fina_branchDocumentGenerateStatus',
                    align: 'center',
                    renderer: function (content, cell, record) {
                        let document = record.get('properties')['fina:fiBranchRefusalLetterDocument'];
                        return !document ? '<b style="color: red">' + i18n.branchesChangeRefusalStatusIsNotGenerated + '</b>' : '<b style="color: green">' + i18n.branchesChangeRefusalStatusGenerated + '</b>';
                    }
                }, {
                    text: i18n.branchesChangeRefusalGenerationDateColumn,
                    flex: 1,
                    dataIndex: 'fina_branchDocumentGenerateDate',
                    renderer: function (content, cell, record) {
                        let document = record.get('properties')['fina:fiBranchRefusalLetterDocument'];
                        return !document ? '' : Ext.Date.format(new Date(Number(document['modifiedAt'])), first.config.Config.timeFormat);
                    }
                }, {
                    flex: 1,
                    text: i18n.branchesChangeRefusalLetterDateColumn,
                    dataIndex: 'fina_refusalLetterDocumentDate',
                    xtype: 'datecolumn',
                    format: first.config.Config.dateFormat,
                    editor: {
                        disabled: true,
                        xtype: 'datefield',
                        format: first.config.Config.dateFormat,
                        bind: {
                            disabled: '{!isRegistryActionEditor}'
                        }
                    }
                }, {
                    flex: 1,
                    text: i18n.branchesChangeRefusalLetterNumberColumn,
                    dataIndex: 'fina_refusalLetterDocumentNumber',
                    editor: {
                        disabled: true,
                        minChars: 1,
                        bind: {
                            disabled: '{!isRegistryActionEditor}'
                        }
                    }
                }]
            }],
            bbar: {
                xtype: 'pagingtoolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                }
            }
        }]
    }],

    bbar: ['->', {
        reference: 'finishChangeBranch',
        iconCls: 'x-fa fa-check',
        cls: 'finaPrimaryBtn',
        text: i18n.branchesChangeRefusalButton,
        handler: 'onRefuseChangeBranchClick',
        disabled: true,
        bind: {
            disabled: '{!isAllRefusalLetterGenerated || theFi.fina_fiRegistryStatus != "IN_PROGRESS" || !isRegistryActionEditor}'
        }
    }]
});

