Ext.define('first.view.registration.task.GeneralCardView', {
    extend: 'Ext.panel.Panel',

    xtype: 'generalCardView',

    controller: 'generalCard',

    requires: [
        'Ext.form.Label'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'panel',
            margin: '20px 0px 10px 0px',

            items: [
                {
                    xtype: 'fieldset',
                    title: i18n.goToSanctionedPeopleChecklist,
                    style: {
                        margin: '10px'
                    },
                    defaults: {
                        style: {
                            margin: '10px',
                            display: 'block',
                        }
                    },
                    items: [
                        {
                            xtype: 'label',
                            html: '<span style="color:red;">&nbsp;' + i18n.checklistUpdated + '</span>',
                            hidden: true,
                            bind: {
                                hidden: '{!isSanctionedPeopleChecklistUpdated}'
                            }
                        },
                        {
                            xtype: 'label',
                            html: '<span style="color:red;">&nbsp;' + i18n.checklistNotValid + '</span>',
                            hidden: true,
                            bind: {
                                hidden: '{isSanctionedPeopleChecklistUpdated || isSanctionedPeopleChecklistValid}'
                            }
                        },
                        {
                            xtype: 'label',
                            html: '<span style="color:black;">&nbsp;' + i18n.checkListReview + '</span>',
                            hidden: true,
                            bind: {
                                hidden: '{!isSanctionedPeopleChecklistFirstEntry || (!isSanctionVerificationWindowNotOpenedAtOnce && isSanctionedPeopleChecklistFirstEntry) || (isSanctionedPeopleChecklistUpdated)}'
                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.checklistResult,
                            handler: 'onSanctionedPeopleChecklistReviewClick',
                            cls: 'finaSecondaryBtn',
                            style: {
                                margin: '10px',
                                display: 'block',
                                maxWidth: '20%'
                            }
                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    title: i18n.attestationList,
                    hidden: true,
                    bind: {
                        hidden: '{!fiAction.fina_fiManagementAttestationEnable}'
                    },
                    style: {
                        margin: '10px'
                    },
                    defaults: {
                        style: {
                            margin: '10px',
                            display: 'block',
                        }
                    },
                    items: [
                        {
                            xtype: 'label',
                            html: '<span style="color:red;">&nbsp;' + i18n.checklistUpdated + '</span>',
                            hidden: true,
                            bind: {
                                hidden: '{!isSanctionedPeopleChecklistUpdated}'
                            }
                        },
                        {
                            xtype: 'label',
                            html: '<span style="color:black;">&nbsp;' + i18n.checkListReview + '</span>',
                            hidden: true,
                            bind: {
                                hidden: '{!isSanctionedPeopleChecklistFirstEntry || (!isSanctionVerificationWindowNotOpenedAtOnce && isSanctionedPeopleChecklistFirstEntry) || (isSanctionedPeopleChecklistUpdated)}'
                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.checklistResult,
                            handler: 'onAttestationChecklistReviewClick',
                            cls: 'finaSecondaryBtn',
                            style: {
                                margin: '10px',
                                display: 'block',
                                maxWidth: '20%'
                            }
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'gapsForRedactorGrid',
            bind: {
                hidden: '{!redactingStatusIsAccepted}'
            }
        }

    ],

    bbar: {
        defaults: {
            bind: {
                disabled: '{inReview || !isRegistryActionEditor || isSanctionedPeopleChecklistUpdated || (isSanctionVerificationWindowNotOpenedAtOnce && isSanctionedPeopleChecklistFirstEntry)}'
            }
        },
        items: ['->',
            {
                text: i18n.makeGap,
                handler: 'onGap',
                cls: 'finaSecondaryBtn'
            },
            {
                text: i18n.checkDataAndGoToReportCard,
                handler: 'onReportCard',
                cls: 'finaPrimaryBtn',
                disabledTooltip: i18n.makeGapDisabledTooltip,
            },
        ]
    }
});
