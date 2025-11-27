Ext.define('first.view.registration.FiProfileView', {
    extend: 'Ext.panel.Panel',

    xtype: 'fiProfileEcm',

    requires: [
        'Ext.button.Button',
        'Ext.grid.column.Date',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.tab.Panel',
        'Ext.toolbar.Separator',
        'Ext.util.History',
        'Ext.ux.layout.ResponsiveColumn',
        'first.view.registration.FiProfileController',
        'first.view.registration.FiProfileModel'
    ],

    bind: {
        title: i18n.fiProfileFI + ' - {theFi.fina_fiRegistryCode}'
    },

    controller: 'fiProfileEcm',
    viewModel: {
        type: 'fiProfile'
    },

    layout: {
        type: 'fit'
    },

    tbar:
        {
            items: [{
                handler: function () {
                    Ext.History.back();
                },
                iconCls: 'x-fa fa-arrow-left',
                cls: 'firstSystemButtons'
            }, {
                handler: function () {
                    Ext.History.forward();
                },
                iconCls: 'x-fa fa-arrow-right',
                cls: 'firstSystemButtons'
            }, {
                iconCls: 'x-fa fa-sync-alt',
                cls: 'firstSystemButtons',
                tooltip: i18n.refresh,
                handler: 'onRefreshClick'
            }, '-', {
                iconCls: 'x-fa fa-edit',
                cls: 'firstSystemButtons',
                text: i18n.edit,
                reference: 'changeButtonRef',
                menu: [
                    {
                        iconCls: 'x-fa fa-map-marker',
                        text: i18n.addBranch,
                        handler: 'onChangeBranchesClick',
                    },
                    {
                        iconCls: 'x-fa fa-map-marker',
                        text: i18n.editBranch,
                        handler: 'onEditBranchesClick',
                        hidden: true,
                        bind: {
                            hidden: '{!fiType.branchEditWorkflowKey}'
                        }
                    }
                ],
                hidden: true,
                bind: {
                    hidden: "{hideWorkflowButtons}"
                },
            }, {
                iconCls: 'x-fa fa-minus',
                cls: 'firstSystemButtons',
                text: i18n.fiRegistryDisableBtn,
                menu: [
                    {
                        iconCls: 'x-fa fa-map-marker',
                        text: i18n.disableBranch,
                        handler: 'onDisableBranchesClick',
                    },
                    {
                        iconCls: 'x-fa fa-building',
                        text: i18n.fiRegistryDisable,
                        handler: 'onDisableClick',
                    }
                ],
                hidden: true,
                bind: {
                    hidden: "{hideWorkflowButtons}"
                }
            }, {
                bind: {
                    hidden: '{isFinishHistoricDataReviewButtonHidden}'
                },
                iconCls: 'x-fa fa-check',
                cls: 'firstSystemButtons',
                tooltip: i18n.finishHistoricDataReview,
                handler: 'onFinishHistoricDataReview'
            }, {
                iconCls: 'x-fa fa-minus-circle',
                text: i18n.cancelCurrentAction,
                menu: [{
                    text: i18n.cancelCurrentAction,
                    handler: 'onCancelCurrentActionClick',
                    bind: {
                        disabled: "{!isCancelCurrentActionEnabled}"
                    }
                }, {
                    text: i18n.withdrawalProcessText,
                    handler: 'onDocumentWithdrawal',
                    disabled: true,
                    bind: {
                        disabled: "{isWithdrawalButtonDisabled || isAccepted}"
                    }
                }],
                hidden: true,
                bind: {
                    hidden: '{hideCancelWorkflowButton}'
                },
                cls: 'finaSecondaryBtn'
            }, {
                iconCls: 'x-fa fa-users',
                cls: 'finaSecondaryBtn',
                text: i18n.changeControllerButtonText,
                handler: 'onChangeControllerClick',
                hidden: true,
                bind: {
                    hidden: '{isChangeControllerButtonHidden}'
                }
            }, {
                xtype: 'component',
                class: 'title',
                bind: '<b>[{theFi.fina_fiRegistryCode}] {theFi.fina_fiRegistryIdentity} - {theFiLegalFormType} "{theFi.fina_fiRegistryName}".  ' + i18n.fiActionActionType + ': ' + '{theFiActionType}.  ' + i18n.status + ': ' + '{theFiStatus}. </b>'
            }]
        },

    items: [{
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            hidden: true,
            flex: 1.5,
            xtype: 'tabpanel',
            preventHeader: true,
            // collapsible: true,

            ui: 'navigation',
            tabPosition: 'left',
            tabRotation: 0,

            //TODO EXT UPGRADE 6.2 to 7.1
            // layout: {
            //     type: 'vbox',
            //     align: 'stretch'
            // },

            defaults: {
                layout: 'fit',
                textAlign: 'left',
            },
            region: 'center',
            reference: 'fiTabs',
            items: [],
            listeners: {
                beforetabchange: 'beforetabChange',
                tabChange: 'tabChange'
            }
        }]
    }]
});
