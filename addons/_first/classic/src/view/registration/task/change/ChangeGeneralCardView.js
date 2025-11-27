Ext.define('first.view.registration.task.change.ChangeGeneralCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'changeGeneralCard',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.column.RowNumberer',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'first.store.change.ChangesStore',
        'first.view.registration.task.change.ChangeGeneralCardController',
        'first.view.registration.task.shared.CardHeaderView',
        'first.view.registration.task.shared.GapsForRedactorGridView'
    ],

    controller: 'changeGeneralCard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'cardHeader',
        },
        {
            xtype: 'grid',
            columnLines: true,
            tools: [{
                iconCls: 'x-fa fa-sync',
                tooltip: i18n.refresh,
                handler: 'onRefreshClick'
            }],
            iconCls: 'x-fa fa-list-ol',
            flex: 1,
            title: i18n.changesGridTitle,
            reference: 'changesGridView',
            store: {
                type: 'generalChanges'
            },

            columns: [{
                flex: 0,
                xtype: 'rownumberer'
            }, {
                xtype: 'actioncolumn',
                width: 40,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                hideable: false,
                resizable: false,
                items: [{
                    iconCls: 'x-fa fa-eye',
                    tooltip: "Edit",
                    handler: 'onViewClick'
                }]
            }, {
                text: i18n.changeObject,
                flex: 1,
                dataIndex: 'fina_fiGapObject',
                renderer: function (content, cell, record) {
                    switch (record.get('fina_fiManagementChangeType')) {
                        case 'fiAuthorizedPerson':
                            return i18n[record.get('fina_fiManagementChangeObject')];
                        case 'fiBeneficiary':
                            return i18n[record.get('fina_fiManagementChangeObject').toLowerCase()];
                    }
                    return '';
                }
            }, {
                text: i18n.changeType,
                flex: 1,
                dataIndex: 'fina_fiGapReason',
                renderer: function (content, cell, record) {
                    return i18n[record.get('fina_fiManagementChangeStatus')];
                }
            }, {
                text: i18n.changeName,
                flex: 1,
                dataIndex: 'fina_fiGapReason',
                renderer: function (content, cell, record) {
                    let res = '';
                    if (record.get('fina_fiManagementChangeObjectLegalFormType')) {
                        res += i18n[record.get('fina_fiManagementChangeObjectLegalFormType')] + ' ';
                    }
                    return res + record.get('fina_fiManagementChangeName');
                }
            }],


            bbar: {
                xtype: 'pagingtoolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                }
            }
        },
        {
            xtype: 'panel',
            flex: 1,
            layout: 'fit',
            items: [{
                xtype: 'gapsForRedactorGrid',
            }],
            bind: {
                hidden: '{!isDeclined||isGridHidden||!redactingStatusIsAccepted}'
            }
        }],


    bbar: {
        bind: {
            hidden: '{!isRegistryActionEditor}'
        },
        items: ['->',
            {
                text: i18n.makeGap,
                handler: 'onGap',
                cls: 'finaSecondaryBtn',
            },
            {
                text: i18n.goToSanctionedPeopleChecklist,
                handler: 'onSanctionedPeopleCheck',
                cls: 'finaPrimaryBtn',
                disabled: true,
                bind: {
                    disabled:'{disableSanctionPeopleCheckButton}'
                }
            },
        ]
    }

});
