Ext.define('first.view.organization.OrganizationIndividualLicenseCertificateEditView', {
    extend: 'Ext.window.Window',

    xtype: 'organizationIndividualLicenseCertificateEdit',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.view.organization.OrganizationIndividualLicenseCertificateEditModel',
        'first.view.organization.OrganizationIndividualLicenseCertificateEditController'
    ],

    controller: 'organizationIndividualLicenseCertificateEdit',

    width: 700,

    modal: true,

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'form',

        layout: {
            type: 'vbox',
            align: 'stretch'
        },

        defaults: {
            xtype: 'textfield',
            padding: 5,
            allowBlank: false,
            labelWidth: 300
        },

        scrollable: true,

        items: [{
            fieldLabel: i18n.organizationIndividualLicenseCertificateEditUniqueNumber + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividualLicenseCertificate.uniqueNumber}'
            }
        }, {
            xtype: 'combo',
            fieldLabel: i18n.organizationIndividualLicenseCertificateEditStatus + ' <b style="color: red;">*</b>',
            emptyText: i18n.organizationIndividualLicenseCertificateEditStatusEmpty + ' ...',
            displayField: 'displayValue',
            valueField: 'lcStatus',
            store: {
                data: [
                    {displayValue: i18n.ACTIVE, lcStatus: 'ACTIVE'},
                    {displayValue: i18n.EXPIRED, lcStatus: 'EXPIRED'},
                    {displayValue: i18n.SUSPENDED, lcStatus: 'SUSPENDED'},
                    {displayValue: i18n.WITHDRAWN, lcStatus: 'WITHDRAWN'},

                ]
            },
            bind: {
                value: '{organizationIndividualLicenseCertificate.status}'
            }
        }, {
            xtype: 'datefield',
            format: first.config.Config.dateFormat,
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualLicenseCertificateEditIssueDate,
            bind: {
                value: '{organizationIndividualLicenseCertificate.issueDate}'
            }
        }, {
            fieldLabel: i18n.organizationIndividualLicenseCertificateEditResolutionDocNumber + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividualLicenseCertificate.resolutionDocNumber}'
            }
        }, {
            xtype: 'combo',
            fieldLabel: i18n.organizationIndividualLicenseCertificateEditType + ' <b style="color: red;">*</b>',
            emptyText: i18n.organizationIndividualLicenseCertificateEditTypeEmpty + ' ...',
            displayField: 'name',
            valueField: 'id',
            reference: 'LicenseTypeCombo',
            store: {
                type: 'licenseTypeStore'
            },
            bind: {
                value: '{organizationIndividualLicenseCertificate.type.id}'
            }
        }, {
            xtype: 'datefield',
            format: first.config.Config.dateFormat,
            fieldLabel: i18n.organizationIndividualLicenseCertificateEditExpirationDate + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividualLicenseCertificate.expirationDate}'
            }
        }, {
            xtype: 'datefield',
            format: first.config.Config.dateFormat,
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualLicenseCertificateEditSuspendWithdrawDate,
            bind: {
                value: '{organizationIndividualLicenseCertificate.suspendDate}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualLicenseCertificateEditSuspendWithdrawReason,
            bind: {
                value: '{organizationIndividualLicenseCertificate.suspendReason}'
            }
        }],
        bbar: {
            items: ['->', {
                text: i18n.cancel,
                iconCls: 'x-fa fa-times',
                handler: 'onCancelBtnClick',
                cls: 'finaSecondaryBtn'
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-save',
                text: i18n.save,
                handler: 'onSaveBtnClick',
                cls: 'finaPrimaryBtn',
                formBind: true
            }]
        }
    }],

    listeners: {
        beforeClose: 'beforeClose'
    }
});