Ext.define('first.view.attestation.AttestationWindow', {
    extend: 'Ext.window.Window',

    xtype: 'attestationWindow',
    controller: 'attestationWindow',

    width: 500,
    modal: true,

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    viewModel: {},

    bind: {
        title: i18n.attestation + " | " + "{title}"
    },

    items: [{
        xtype: 'form',
        scrollable: true,
        defaults: {
            labelWidth: 175,
            xtype: 'textfield',
            anchor: '100%',
            margin: 5
        },
        reference: 'formItems',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        flex: 1,
        items: [{
            xtype: 'combobox',
            fieldLabel: i18n.attestationFiType,
            valueField: 'value',
            displayField: 'attestationType',
            store: {
                data: [
                    {value: 'LONG', attestationType: i18n['LONG']},
                    {value: 'SHORT', attestationType: i18n['SHORT']},
                ]
            },
            bind: {
                value: '{record.fiAttestationType}',
            },

            listeners: {
                change: 'changeAttestationType'
            }
        }, {
            xtype: 'combobox',
            fieldLabel: i18n.status,
            bind: {
                value: '{record.fiAttestationStatus}',
                disabled: '{!(record.fiAttestationType)}'
            },
            valueField: 'value',
            displayField: 'attestationStatus',
            store: {
                data: [
                    {value: 'underReview', attestationStatus: i18n['underReview']},
                    {value: 'declined', attestationStatus: i18n['declined']},
                    {value: 'recognized', attestationStatus: i18n['recognized']},
                    {value: 'inQueue', attestationStatus: i18n['inQueue']},
                    {value: 'inAttestationList', attestationStatus: i18n['inAttestationList']},
                    {value: 'candidateApproved', attestationStatus: i18n['candidateApproved']},
                    {value: 'candidateDisapproved', attestationStatus: i18n['candidateDisapproved']}
                ]
            }
        }, {
            xtype: 'combobox',
            fieldLabel: i18n.attestationInterviewStatus,
            valueField: 'value',
            displayField: 'name',
            store: {
                data: [
                    {value: 'PENDING', name: i18n['PENDING']},
                    {value: 'ACCEPTED', name: i18n['ACCEPTED']},
                    {value: 'DECLINED', name: i18n['DECLINED']}
                ]
            },
            bind: {
                value: '{record.fiAttestationInterviewStatus}',
                disabled: '{record.fiAttestationType == "SHORT"}'
            }
        }, {
            xtype: 'datefield',
            fieldLabel: i18n.attestationInterviewDate,
            format: first.config.Config.dateFormat,
            altFormats: 'c',
            bind: {
                value: '{record.fiAttestationInterviewDate}',
                disabled: '{record.fiAttestationType == "SHORT"}'
            }
        }, {
            xtype: 'textarea',
            fieldLabel: i18n.comment,
            bind: {
                value: '{record.fiAttestationComments}'
            }
        }]
    }],

    buttons: {
        items: [{
            text: i18n.cancel,
            iconCls: 'x-fa fa-times',
            handler: 'onCancelClick',
            cls: 'finaSecondaryBtn'
        }, {
            text: i18n.save,
            iconCls: 'x-fa fa-save',
            handler: 'onSaveClick',
            cls: 'finaPrimaryBtn'
        }]
    }
});
