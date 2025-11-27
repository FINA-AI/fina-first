Ext.define('first.view.registration.task.change.ChangeSanctionedPeopleCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'changeSanctionedPeopleCard',

    requires: [
        'first.view.registration.task.change.ChangeSanctionedPeopleCardController'
    ],

    controller: 'changeSanctionedPeopleCard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'cardHeader'
        },
        {
            xtype: 'grid',
            flex: 1,
            columnLines: true,
            reference: 'changeSanctionedPeopleGrid',
            title: i18n.checkAddedDataInSanctionedPeopleChecklist,
            emptyText: '<div style="text-align:center;">' + i18n.noDataToDisplayInSanctionedPeopleChecklist + '</div>',
            store: {
                type: 'changeSanctionedPeople'
            },
            selModel: {
                type: 'cellmodel'
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
                listeners: {
                    beforeedit: 'beforeCellEdit'
                }

            },
            iconCls: 'fa fa-list',

            tbar: {
                items: [
                    '->', {
                        xtype: 'button',
                        text: i18n.export,
                        iconCls: 'x-fa fa-cloud-download-alt',
                        cls: 'finaSecondaryBtn',
                        handler: 'exportSanctionedPeople'
                    }]
            },

            columns: [
                {
                    xtype: 'rownumberer',
                    flex: 0
                },
                {
                    xtype: 'actioncolumn',
                    flex: 0,
                    menuDisabled: true,
                    sortable: false,
                    hideable: false,
                    resizable: false,
                    items: [{
                        iconCls: 'x-fa fa-eye icon-margin',
                        tooltip: "Edit",
                        handler: 'onViewClick'
                    }]
                },
                {
                    header: i18n.changeObject,
                    dataIndex: 'fina_fiManagementChangeObject',
                    flex: 1,
                    renderer: function (content, cell, record) {
                        switch (record.get('fina_fiManagementChangeType')) {
                            case 'fiAuthorizedPerson':
                                return i18n[record.get('fina_fiManagementChangeObject')];
                            case 'fiBeneficiary':
                                return i18n[record.get('fina_fiManagementChangeObject').toLowerCase()];
                        }
                        return '';
                    }
                },
                {
                    header: i18n.changeType,
                    dataIndex: 'fina_fiManagementChangeType',
                    flex: 1,
                    renderer: function (content, cell, record) {
                        return i18n[record.get('fina_fiManagementChangeStatus')];
                    }
                },
                {
                    header: i18n.changeName,
                    dataIndex: 'fina_fiManagementChangeName',
                    flex: 1
                },
                {
                    header: i18n.isInList,
                    dataIndex: 'fina_fiManagementChangeObjectIsSanctioned',
                    flex: 1,
                    bind: {
                        disabled: '{isDisabled}'
                    },
                    editor: {
                        xtype: 'combobox',
                        displayField: 'textValue',
                        valueField: 'boolValue',
                        queryMode: 'local',
                        forceSelection: true,
                        store: {
                            fields: ['boolValue', 'textValue'],
                            data: [
                                {
                                    'boolValue': true,
                                    'textValue': i18n.yes
                                },
                                {
                                    'boolValue': false,
                                    'textValue': i18n.no
                                }
                            ]
                        },
                        listeners: {
                            change: 'onComboValueChange'
                        }
                    },
                    renderer: function (content) {
                        return [undefined, null].includes(content) ? content : content ? i18n.yes : i18n.no;
                    }
                },
                {
                    header: i18n.dateChecked,
                    xtype: 'datecolumn',
                    dataIndex: 'fina_fiManagementChangeObjectSanctionedCheckDate',
                    format: first.config.Config.dateFormat,
                    flex: 1,
                    editor: {
                        xtype: 'datefield',
                        format: first.config.Config.dateFormat
                    }
                }
            ],

            bbar: {
                xtype: 'pagingtoolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                }
            }
        }
    ],

    bbar: {
        bind: {
            hidden: '{!isRegistryActionEditor}'
        },
        items: ['->',
            {
                text: i18n.makeGap,
                handler: 'onGap',
                cls: 'finaSecondaryBtn'
            },
            {
                text: i18n.changeList,
                handler: 'onChangeList',
                cls: 'finaSecondaryBtn'
            },
            {
                text: i18n.confirmationLetterGeneration,
                handler: 'onGenerateApprovalLetter',
                bind: {
                    disabled: '{disableConfirmationLetter}',
                },
                cls: 'finaPrimaryBtn'
            }
        ]
    }

});
