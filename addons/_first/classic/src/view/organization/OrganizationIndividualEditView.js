Ext.define('first.view.organization.OrganizationIndividualEditView', {
    extend: 'Ext.window.Window',

    xtype: 'organizationIndividualEdit',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'first.view.organization.OrganizationIndividualEditModel',
        'first.view.organization.OrganizationIndividualEditController'
    ],

    controller: 'organizationIndividualEdit',

    maxHeight: Ext.getBody().getViewSize().height - 120,
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

        bind: {
            hidden: '{!isOrganization}'
        },

        items: [{
            fieldLabel: i18n.organizationIndividualOrganizationEditTaxId + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.taxId}'
            }
        }, {
            fieldLabel: i18n.organizationIndividualOrganizationEditStateRegistryNumber + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.stateRegOrDocNumber}'
            }
        }, {
            fieldLabel: i18n.organizationIndividualOrganizationEditLegalAddress + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.address}'
            }
        }, {
            xtype: 'datefield',
            format: first.config.Config.dateFormat,
            fieldLabel: i18n.organizationIndividualOrganizationEditDateOfStateRegistry + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.stateRegOrBirthDate}'
            }
        }, {
            fieldLabel: i18n.organizationIndividualOrganizationEditCompanyName + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.name}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualOrganizationEditCompanyNameLatin,
            bind: {
                value: '{organizationIndividual.nameLatin}'
            }
        }, {
            xtype: 'combo',
            fieldLabel: i18n.organizationIndividualOrganizationEditOrganizationForm + ' <b style="color: red;">*</b>',
            emptyText: i18n.organizationIndividualOrganizationEditOrganizationFormEmpty + ' ...',
            displayField: 'displayValue',
            valueField: 'orgFormType',
            store: {
                data: [
                    {displayValue: i18n.LLC, orgFormType: 'LLC'},
                    {displayValue: i18n.OJSC, orgFormType: 'OJSC'},
                    {displayValue: i18n.CJSC, orgFormType: 'CJSC'},
                    {displayValue: i18n.IE, orgFormType: 'IE'},
                ]
            },
            bind: {
                value: '{organizationIndividual.organizationalForm}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualOrganizationEditWebsite,
            bind: {
                value: '{organizationIndividual.website}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualOrganizationEditEmail,
            vtype: 'email',
            bind: {
                value: '{organizationIndividual.email}'
            }
        }, {
            fieldLabel: i18n.organizationIndividualOrganizationEditPhone + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.phone}'
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
    }, {
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

        bind: {
            hidden: '{isOrganization}'
        },

        items: [{
            xtype: 'combo',
            fieldLabel: i18n.organizationIndividualIndividualEditTypeOfId + ' <b style="color: red;">*</b>',
            emptyText: i18n.organizationIndividualIndividualEditTypeOfIdEmpty + ' ...',
            displayField: 'displayValue',
            valueField: 'idType',
            store: {
                data: [
                    {displayValue: i18n.NATIONAL_PASSPORT, idType: 'national_passport'},
                    {displayValue: i18n.NATIONAL_ID, idType: 'national_id'},
                    {displayValue: i18n.other, idType: 'other'}
                ]
            },
            bind: {
                value: '{organizationIndividual.idType}'
            }
        }, {
            fieldLabel: i18n.organizationIndividualIndividualEditPersonalId + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.personalId}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualIndividualEditTaxId,
            bind: {
                value: '{organizationIndividual.taxId}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualIndividualEditDocumentNumber,
            bind: {
                value: '{organizationIndividual.stateRegOrDocNumber}'
            }
        }, {
            xtype: 'combo',
            fieldLabel: i18n.organizationIndividualIndividualEditGender + ' <b style="color: red;">*</b>',
            emptyText: i18n.organizationIndividualIndividualEditGenderEmpty + ' ...',
            displayField: 'displayValue',
            valueField: 'genderType',
            store: {
                data: [
                    {displayValue: i18n.FEMALE, genderType: 'female'},
                    {displayValue: i18n.MALE, genderType: 'male'}
                ]
            },
            bind: {
                value: '{organizationIndividual.gender}'
            }
        }, {
            fieldLabel: i18n.organizationIndividualIndividualEditAddress + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.address}'
            }
        }, {
            fieldLabel: i18n.organizationIndividualIndividualEditName + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.name}'
            }
        }, {
            fieldLabel: i18n.organizationIndividualIndividualEditSurname + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.surname}'
            }
        }, {
            allowBlank: true,
            xtype: 'datefield',
            format: first.config.Config.dateFormat,
            fieldLabel: i18n.organizationIndividualIndividualEditBirthDate,
            bind: {
                value: '{organizationIndividual.stateRegOrBirthDate}'
            }
        }, {
            fieldLabel: i18n.organizationIndividualIndividualEditPhone + ' <b style="color: red;">*</b>',
            bind: {
                value: '{organizationIndividual.phone}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualIndividualEditEmail,
            vtype: 'email',
            bind: {
                value: '{organizationIndividual.email}'
            }
        }, {
            allowBlank: true,
            xtype: 'combo',
            fieldLabel: i18n.organizationIndividualIndividualEditPosition,
            displayField: 'name',
            valueField: 'value',
            store: {
                data: [
                    {value: 'chairman', name: i18n.chairman},
                    {value: 'chairmanOfExecutiveBoard', name: i18n.chairmanOfExecutiveBoard},
                    {value: 'deputyChairman', name: i18n.deputyChairman},
                    {value: 'deputyChairmanOfExecutiveBoard', name: i18n.deputyChairmanOfExecutiveBoard},
                    {value: 'memberOfExecutiveBoard', name: i18n.memberOfExecutiveBoard},
                    {value: 'chairmanOfTheSupervisoryBoard', name: i18n.chairmanOfTheSupervisoryBoard},
                    {value: 'memberOfTheSupervisoryBoard', name: i18n.memberOfTheSupervisoryBoard},
                    {value: 'chiefAccountant', name: i18n.chiefAccountant},
                    {value: 'headOfStructuralUnit', name: i18n.headOfStructuralUnit},
                    {value: 'chiefAccountantOfStructuralUnit', name: i18n.chiefAccountantOfStructuralUnit},
                    {value: 'other', name: i18n.other}
                ]
            },
            bind: {
                value: '{organizationIndividual.position}'
            },
            listeners: {
                blur: 'onPositionComboBlur',
                select: 'onPositionSelect'
            }
        }, {
            xtype: 'datefield',
            format: first.config.Config.dateFormat,
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualIndividualEditAssignmentDate,
            bind: {
                value: '{organizationIndividual.assignmentDate}',
                disabled: '{!organizationIndividual.position}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualIndividualEditAssignmentDocNumber,
            bind: {
                value: '{organizationIndividual.documentNumber}',
                disabled: '{!organizationIndividual.position}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualIndividualEditBirthPlace,
            bind: {
                value: '{organizationIndividual.birthPlace}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualIndividualEditCitizenship,
            bind: {
                value: '{organizationIndividual.citizenship}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualIndividualEditEducation,
            bind: {
                value: '{organizationIndividual.education}'
            }
        }, {
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualIndividualEditComments,
            bind: {
                value: '{organizationIndividual.comments}'
            }
        }, {
            xtype: 'combo',
            allowBlank: true,
            fieldLabel: i18n.organizationIndividualIndividualEditFi,
            displayField: 'displayName',
            valueField: 'id',
            forceSelection: true,
            store: {
                autoLoad: true,
                proxy: {
                    type: 'rest',
                    url: first.config.Config.remoteRestUrl + 'ecm/node/-root-/children?relativePath=fina2first/Registry',
                    reader: {
                        type: 'json',
                        rootProperty: 'list',
                        totalProperty: 'totalResults',
                        transform: {
                            fn: function (data) {
                                let result = [];
                                if (data && data.list) {
                                    Ext.each(data.list, function (record) {
                                        if (record) {
                                            let props = record.properties;
                                            if (props) {
                                                result.push({
                                                    id: record.id,
                                                    name: props['fina:fiRegistryName'],
                                                    displayName: props['fina:fiRegistryName'] + " (" + i18n[props['fina:fiRegistryLicenseStatus']] + ")",
                                                });
                                            }
                                        }
                                    }, this);
                                }
                                return result;
                            },
                            scope: this
                        }
                    },
                }
            },
            bind: {
                value: '{organizationIndividual.registryId}'
            },
            listeners: {
                select: 'onFiRegistrySelect'
            }
        }, {
            xtype: 'combo',
            allowBlank: true,
            forceSelection: true,
            fieldLabel: i18n.organizationIndividualIndividualEditFiBranch,
            reference: 'fiRegistryBranchReference',
            displayField: 'displayName',
            valueField: 'id',
            store: {
                autoLoad: false,
                proxy: {
                    type: 'rest',
                    reader: {
                        type: 'json',
                        rootProperty: 'list',
                        totalProperty: 'totalResults',
                        transform: {
                            fn: function (data) {
                                let result = [];
                                if (data && data.list) {
                                    Ext.each(data.list, function (record) {
                                        if (record) {
                                            let props = record.properties;
                                            if (props) {
                                                let branchId = props[Object.keys(props).find(i => i.endsWith('fiRegistryBranchId'))];
                                                result.push({
                                                    id: record.id,
                                                    name: branchId,
                                                    displayName: branchId + " ("
                                                        + props['fina:fiRegistryBranchAddressRegion'] + ", "
                                                        + props['fina:fiRegistryBranchAddressCity'] + ", "
                                                        + props['fina:fiRegistryBranchAddress'] + ")",
                                                });
                                            }
                                        }
                                    }, this);
                                }
                                return result;
                            },
                            scope: this
                        }
                    },
                }
            },
            bind: {
                disabled: '{!organizationIndividual.registryId}',
                value: '{organizationIndividual.branchId}'
            },
            listeners: {
                afterrender: 'onFiRegistryBranchAfterRender'
            }
        }, {
            xtype: 'combobox',
            allowBlank: true,
            disabled: true,
            fieldLabel: i18n.organizationIndividualIndividualEditAttestationStatus,
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
            },
            bind: {
                value: '{organizationIndividual.attestationStatus}'
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