Ext.define('first.view.registration.MetadataUtil', {

    requires: [],

    statics: {
        filterAndSortMetaData: function (className, metaDada) {
            let me = this,
                hiddenProperties = [],
                sequenceNamesArray = [],
                hiddenMetadata = metaDada.find(i => i.name === className + 'HiddenFieldNames'),
                sortMetadata = metaDada.find(i => i.name === className + 'Sequence');

            if (hiddenMetadata && hiddenMetadata.constraints) {
                hiddenProperties = me.getAllowedValues(hiddenMetadata.constraints);
            }

            if (sortMetadata && sortMetadata.constraints) {
                sequenceNamesArray = me.getAllowedValues(sortMetadata.constraints);
            }

            metaDada.sort(function (i, j) {
                return sequenceNamesArray.indexOf(i.name) - sequenceNamesArray.indexOf(j.name);
            });

            return hiddenProperties;
        },

        getNonEditableProps: function (className, metaData) {
            let nonEditableFields = metaData.find(i => i.name === className + 'NonEditableFields');

            if (nonEditableFields && nonEditableFields.constraints) {
                return this.getAllowedValues(nonEditableFields.constraints);
            }

            return [];
        },

        getAllowedValues: function (constraints) {
            let result = [];
            let constraint = constraints.find(i => i.type === 'LIST');

            if (constraint) {

                let parameter = constraint.parameters.find(i => i.hasOwnProperty('allowedValues'));

                if (parameter) {
                    Ext.each(parameter.allowedValues, function (i) {
                        result.push(i);
                    });
                }
            }

            return result;
        },

        getAllowedValuesWithTranslations: function (constraints) {
            let result = this.getAllowedValues(constraints);
            return result.map(item => {
                return {
                    id: item,
                    name: i18n[item]
                }
            });
        },

        getGeneralInfoEditableProperties: function (className, metaData) {
            let editableProperties = metaData.find(i => i.name === className + 'GeneralInfoChangeFieldNames'),
                result = [];

            if (editableProperties && editableProperties.constraints) {
                let propertyNames = this.getAllowedValues(editableProperties.constraints);
                Ext.each(propertyNames, function (propName) {
                    let propertyDefinition = metaData.find(i => i.name === propName);
                    if (propertyDefinition) {
                        result.push(propertyDefinition);
                    }
                });
            }

            return result;
        },

        addValidation: function (component, item) {
            let constraints = item.constraints;

            for (let i in constraints) {
                let constraint = constraints[i];
                switch (constraint.type) {
                    case 'MINMAX':
                        for (let j in constraint.parameters) {
                            let parameter = constraint.parameters[j];
                            if (parameter.minValue !== undefined) {
                                component.minValue = parameter.minValue;
                            } else if (parameter.maxValue !== undefined) {
                                component.maxValue = parameter.maxValue;
                            }
                        }
                        break;
                    case 'REGEX':
                    case 'FINA_REGEX':
                        if (constraint.parameters) {

                            let expression = '^' + constraint.parameters.find(function (p) {
                                return p.expression && p.expression.trim().length > 0;
                            }).expression + '$';
                            let requiresMatchObj = constraint.parameters.find(function (p) {
                                return p.requiresMatch !== 'undefined';
                            });

                            let maxLength = constraint.parameters.find(p => p.length);
                            if (maxLength) {
                                maxLength = maxLength['length'];
                            }

                            let requiresMatch = requiresMatchObj ? requiresMatchObj['requiresMatch'] : true;

                            component.validator = function (val) {
                                let regex = new RegExp(expression);
                                let errMsgText = i18n[item.name.split(':')[1] + 'ValidationText'];
                                let errMsg = errMsgText ? errMsgText : i18n.textDontMatch + ' "' + item.title + '" ' + i18n.InappropriateCharacters;
                                let valid = regex.test(val);
                                valid = maxLength > 0 ? valid && val.length == maxLength : valid;

                                if (!requiresMatch) {
                                    valid = !valid;
                                }
                                return valid ? true : errMsg;
                            };
                        }
                        break;
                }
            }
        },

        getFormItemXType: function (formItem, bindName, viewModel, bindPrefix, propsToChange) {
            let result = {xtype: 'textfield'};


            let list = formItem.constraints.find(i => i.type === 'LIST');

            if (list) {
                let values = this.getAllowedValues(formItem.constraints),
                    data = [];

                Ext.each(values, function (value) {
                    let description = i18n[value];

                    if (!description) {
                        description = value;
                    }

                    let item = {"description": description};
                    item[bindName] = value;
                    data.push(item);
                });

                var store = Ext.create('Ext.data.Store', {
                    fields: [bindName, 'description'],
                    data: data
                });

                result = {
                    xtype: formItem.multiValued ? 'tagfield' : 'combobox',
                    store: store,
                    valueField: bindName,
                    displayField: 'description',
                    queryMode: 'local',
                    forceSelection: true
                };
            }

            let dataType = formItem.dataType.toString();

            let isPhysicalPersonField = ['fina:fiPersonPersonalNumber'].includes(formItem.name) || formItem.name.includes(':fiPersonTaxId'),
                isLegalPersonField = ['fina:fiComplexStructureLegalName', 'fina:fiComplexStructureIdentificationNumber'].includes(formItem.name);

            if (isPhysicalPersonField || isLegalPersonField) {
                let propName = formItem.name.replace(':', '_'),
                    searchByProps = isPhysicalPersonField ? formItem.name :
                        (formItem.name === 'fina:fiComplexStructureLegalName' ? 'fina:fiRegistryName' : 'fina:fiRegistryIdentity'),
                    distinctProps = isPhysicalPersonField ? 'fina:fiPersonFirstName,fina:fiPersonLastName,fina:fiPersonPersonalNumber'
                        : 'fina:fiRegistryIdentity,fina:fiRegistryName',
                    itemTpl = isPhysicalPersonField ? '<div>{fina_fiPersonFirstName} {fina_fiPersonLastName} [{' + formItem.name.replace(':', '_') + '}]</div>' :
                        '<div>{fina_fiRegistryName} [{fina_fiRegistryIdentity}]</div>',
                    combosBindPrefix = isPhysicalPersonField ? 'fiPersonCombos' : 'fiLegalPersonCombos',
                    me = this;

                result = {
                    xtype: 'combobox',
                    store: {
                        autoLoad: false,

                        proxy: {
                            type: 'rest',
                            extraParams: {
                                searchByProps: searchByProps,
                                distinctProps: distinctProps,
                                searchPropertyWildcardCondition: 'STARTS_WITH'
                            },
                            enablePaging: true,
                            url: first.config.Config.remoteRestUrl + "ecm/search/inProperties",
                            headers: {
                                'Accept-Language': '*'
                            },
                            reader: {
                                type: 'json',
                                rootProperty: 'list',
                                totalProperty: 'totalResults',
                                transform: {
                                    fn: function (data) {
                                        if (data && data.list) {
                                            Ext.each(data.list, function (record) {
                                                if (record) {
                                                    let props = record.properties;
                                                    if (props) {
                                                        Ext.Object.each(props, function (key, val) {
                                                            record[key.replace(':', '_')] = val;
                                                        });
                                                    }
                                                }
                                            }, this);
                                        }
                                        return data;
                                    },
                                    scope: this
                                }
                            }
                        }
                    },
                    valueField: 'id',
                    displayField: propName,
                    listConfig: {
                        itemTpl: [
                            itemTpl
                        ]
                    },
                    queryMode: 'remote',
                    forceSelection: false,
                    hideTrigger: true,
                    triggerAction: 'query',
                    minChars: 3,

                    bindField: 'rawValue',

                    publishes: ['value', 'rawValue', 'dirty'],
                    valuePublishEvent: ['change', 'select', 'blur'],

                    listeners: {
                        afterrender: function (combo) {
                            viewModel.set(combosBindPrefix + '.' + bindName, combo);
                        },
                        select: function (combo, record, eOpts) {
                            if (bindPrefix && !combo['isBlurSelection']) {
                                let data = record.getData();

                                if (isPhysicalPersonField) {
                                    me.onPhysicalPersonFieldSelection(propsToChange, data, viewModel, bindPrefix, bindName, combo, combosBindPrefix);
                                } else {
                                    me.onLegalPersonFieldSelection(propsToChange, data, viewModel, bindPrefix, combosBindPrefix)
                                }
                            }
                            combo['isBlurSelection'] = false;

                        },
                        blur: function (combo, event, eOpts) {
                            combo.publishState('rawValue', combo.getRawValue());
                            combo['isBlurSelection'] = !combo.getSelection();
                        },
                        change: function (combo, newValue, oldValue, eOpts) {
                            if (!combo['isBlurSelection']) {
                                combo.publishState('rawValue', newValue);
                            }
                        },
                        beforeselect: function (combo, record, eOpts) {
                            combo['isBlurSelection'] = false;
                        }
                    }
                };
            } else if (formItem.name.endsWith('AddressCity')) {
                let internalName = formItem.name.substring(0, formItem.name.length - 'AddressCity'.length).replace(':', '_');

                result = {
                    xtype: 'combobox',
                    store: {
                        type: 'regionalStructureStore',
                    },
                    valueField: 'fina_regionalStructureCityName',
                    displayField: 'fina_regionalStructureCityName',
                    queryMode: 'local',
                    forceSelection: true,
                    filterPickList: true,
                    listeners: {
                        afterrender: function (cmp) {
                            viewModel.set(internalName + "CityComponent", cmp);
                        },
                        focus: function (cmp) {
                            let store = cmp.getStore();
                            let regCmp = viewModel.get(internalName + 'RegionComponent');
                            if (regCmp && regCmp.getSelection() && store.getCount() === 0) {
                                store.getProxy().url = first.config.Config.remoteRestUrl + 'ecm/node/' + regCmp.getSelection().id + '/children';
                                store.load();
                            }
                        },
                    }
                };
            } else if (formItem.name.endsWith('AddressRegion')) {

                let internalNameRegion = formItem.name.substring(0, formItem.name.length - 'AddressRegion'.length).replace(':', '_');

                result = {
                    xtype: 'combobox',
                    store: {
                        type: 'regionalStructureStore',
                        autoLoad: true,
                        proxy: {
                            url: first.config.Config.remoteRestUrl + 'ecm/node/-root-/children' + '?relativePath=' + first.config.Config.conf.properties.regionalStructureFolderPath + '&orderBy=createdAt'
                        },
                    },
                    valueField: 'fina_regionalStructureRegionName',
                    displayField: 'fina_regionalStructureRegionName',
                    queryMode: 'local',
                    forceSelection: true,
                    filterPickList: true,
                    listeners: {
                        afterrender: function (cmp) {
                            viewModel.set(internalNameRegion + "RegionComponent", cmp);
                        },
                        change: function (cmp, newValue, oldValue) {
                            let cityCmp = viewModel.get(internalNameRegion + "CityComponent");
                            let store = cityCmp.getStore();

                            if (newValue !== null && oldValue !== null && newValue !== oldValue) {
                                cityCmp.clearValue();
                            }
                            if (cmp.getSelection()) {
                                store.getProxy().url = first.config.Config.remoteRestUrl + 'ecm/node/' + cmp.getSelection().id + '/children';
                                store.load(function (records) {
                                    if (store.getCount() === 1) {
                                        cityCmp.select(records[0])
                                    }
                                })
                            } else {
                                store.clearData()
                            }
                        },
                    }
                };
            } else if (formItem.name.endsWith('Address')) {
                let internalNameAddress = formItem.name.substring(0, formItem.name.length - 'Address'.length).replace(':', '_');
                result = {
                    xtype: 'textfield',
                    listeners: {
                        afterrender: function (cmp) {
                            viewModel.set(internalNameAddress + "AddressComponent", cmp)
                        }
                    }
                }
            } else if (formItem.name.includes('FromAdministrators')) {
                let position = formItem.name.split('FromAdministrators')[1],
                    prefix = viewModel.get('theFi')['nodeType'].split(":")[0];

                result = {
                    xtype: 'combobox',
                    store: {
                        type: 'regionalStructureStore',
                        autoLoad: true,
                        proxy: {
                            url: first.config.Config.remoteRestUrl + "ecm/search/template/administratorsAndIndividualsQueryTemplate",
                            extraParams: {
                                properties: [position,
                                    viewModel.get('theFi')["id"],
                                    viewModel.get('model')['id'],
                                    position === 'chiefAccountant' ? 'chiefAccountantOfStructuralUnit' : position],
                                fiRegistryCode: viewModel.get('theFi')["fina_fiRegistryCode"],
                                relativePath: 'Authorized Persons'
                            },
                            headers: {
                                'Accept-Language': '*'
                            },
                            reader: {
                                type: 'json',
                                rootProperty: 'list',
                                transform: {
                                    fn: function (data) {
                                        if (data && data.list) {
                                            Ext.each(data.list, function (record) {
                                                if (record.nodeType === 'fina:organizationIndividualRegistry') {
                                                    record.properties['fina:fiPersonFirstName'] = record.properties['fina:organizationIndividualRegistryName'];
                                                    record.properties['fina:fiPersonLastName'] = record.properties['fina:organizationIndividualRegistrySurname'];
                                                    record.properties[prefix + ':fiAuthorizedPersonAttestationStatus'] = record.properties['fina:organizationIndividualRegistryAttestationStatus'];
                                                    record.properties['fina:fiPersonPersonalNumber'] = record.properties['fina:organizationIndividualRegistryPersonalId'];
                                                }
                                                record.fullName = record.properties['fina:fiPersonFirstName'] + ' '
                                                    + record.properties['fina:fiPersonLastName'];
                                                record.displayName = record.fullName + (record.properties[prefix + ':fiAuthorizedPersonAttestationStatus']
                                                    ? " [" + i18n[record.properties[prefix + ':fiAuthorizedPersonAttestationStatus']] + "]" : "");
                                                record.fiPersonPersonalNumber = record.properties['fina:fiPersonPersonalNumber'];
                                            }, this);
                                        }
                                        return data;
                                    },
                                    scope: this
                                }
                            },
                        },
                    },
                    valueField: 'fiPersonPersonalNumber',
                    displayField: 'displayName',
                    queryMode: 'local',
                    forceSelection: true,
                    filterPickList: true,
                    listeners: {
                        change: function (cmp) {
                            viewModel.set(bindPrefix + '.' + formItem.name.replace(":", "_") + 'FullName', cmp.getSelection() ? cmp.getSelection().get('fullName') : null);
                        },
                    }
                };
            } else {
                switch (dataType) {
                    case 'd:int':
                    case 'd:long':
                    case 'd:double':
                        result = {
                            xtype: 'numberfield',
                            forcePrecision: true,
                            decimalPrecision: 10
                        };
                        break;
                    case 'd:date':
                        result = {
                            xtype: 'datefield',
                            format: first.config.Config.dateFormat
                        };
                        break;
                    case 'cm:person':
                        result = {
                            xtype: formItem.name === 'bpm_assignee' ? 'combobox' : 'tagfield',
                            store: {
                                type: 'ecmUsersStore'
                            },
                            valueField: 'id',
                            displayField: 'id',
                            queryMode: 'local',
                            forceSelection: true,
                            filterPickList: true
                        };
                        break;
                    case 'cm:authorityContainer':
                        result = {
                            xtype: formItem.name === 'bpm_groupAssignee' ? 'combobox' : 'tagfield',
                            store: {
                                type: 'ecmGroupStore'
                            },
                            valueField: 'id',
                            displayField: 'displayName',
                            queryMode: 'local',
                            filterPickList: true,
                            forceSelection: true
                        };
                        break;
                    case 'd:boolean':
                        let data = [{value: i18n.yes}, {value: i18n.no}];
                        data[0][bindName] = true;
                        data[1][bindName] = false;

                        result = {
                            xtype: 'combobox',
                            store: {
                                data: data
                            },
                            valueField: bindName,
                            displayField: 'value',
                            queryMode: 'local',
                            forceSelection: true
                        };
                        break;
                    default:
                        break;
                }
            }

            result.allowBlank = !formItem.mandatory;
            result.labelAlign = 'top';

            let title = formItem.title;
            if (formItem.mandatory) {
                title += ' <b style="color: red;">*</b>'
            }
            result.fieldLabel = title;

            if (!viewModel.get('editMode')) {
                result.disabled = false;
            } else if (formItem.protectedValue && !first.config.Config.conf.properties.currentUser.superAdmin) {
                result.disabled = true;
            }

            this.addValidation(result, formItem);

            return result;
        },

        onPhysicalPersonFieldSelection: function (propsToChange, data, viewModel, bindPrefix, bindName, combo, combosBindPrefix) {
            for (let item in data) {
                let propToSet = !propsToChange ? null : propsToChange.find(i => i.name === item);
                if (propToSet && item.includes("_fiPerson")) {
                    let value = data[item];

                    if (value) {
                        if (propToSet.type === 'd:date') {
                            value = new Date(Date.parse(value));
                        }

                        viewModel.set(bindPrefix + '.' + item, value);

                        let combos = viewModel.get(combosBindPrefix);
                        if (combos && combos[item]) {
                            combos[item].clearInvalid();
                        }
                    }
                } else if (propsToChange) {
                    if (item.includes("_fiAttestationPosition") || item.includes("_fiAttestationDocType")) {
                        propToSet = item.includes("_fiAttestationDocType")
                            ? (propsToChange.find(i => i.name.includes('_fiAuthorizedPersonDocType'))
                                || propsToChange.find(i => i.name.includes('_blackLstTypeOfId')))
                            : propsToChange.find(i => i.name.includes('_fiAuthorizedPersonPosition'));

                        if (propToSet) {
                            viewModel.set(bindPrefix + '.' + propToSet.name, data[item]);
                        }
                    }
                }
            }

            viewModel.set(bindPrefix + '.' + bindName, combo.getRawValue());
        },

        onLegalPersonFieldSelection(propsToChange, data, viewModel, bindPrefix, combosBindPrefix) {
            for (let item in data) {
                let propToSet = null;
                switch (item) {
                    case 'fina_fiRegistryName':
                        propToSet = 'fina_fiComplexStructureLegalName';
                        break;
                    case 'fina_fiRegistryIdentity':
                        propToSet = 'fina_fiComplexStructureIdentificationNumber';
                        break;
                    case 'fina_fiRegistryLegalFormType':
                        propToSet = 'fina_fiComplexStructureLegalType';
                        break;
                    default:
                        break;
                }

                if (propToSet) {
                    let value = data[item];
                    if (value) {
                        viewModel.set(bindPrefix + '.' + propToSet, value);

                        let combos = viewModel.get(combosBindPrefix);
                        if (combos && combos[propToSet]) {
                            combos[propToSet].clearInvalid();
                        }
                    }
                }
            }
        },

        getQuestions: function (className, metaDada) {
            return this.getItemsFromConstraints(className, metaDada, 'Questions');
        },

        getSingleLineItemGroup: function (className, metaDada) {
            return this.getItemsFromConstraints(className, metaDada, 'SingleLineItemGroup');
        },

        getItemsFromConstraints: function (className, metaDada, fieldEndName) {
            let me = this,
                properties = [],
                md = metaDada.find(i => i.name === className + fieldEndName);

            if (md && md.constraints) {
                properties = me.getAllowedValues(md.constraints);
            }
            return properties;
        },

        getMetaDataConstraintFields: function (className, metaDada, fieldEndName) {
            let fieldNames = this.getItemsFromConstraints(className, metaDada, fieldEndName);
            return fieldNames.map(item => metaDada.find(i => i.name === item));
        },

        addNonResidentAndPersonalNubmerValidation: function (generatedFormItem, formItems, viewModel, metaData) {
            generatedFormItem.listeners = {
                'change': function (combo, newValue, oldValue) {
                    let idField = formItems.getForm().findField("fina_fiPersonPersonalNumber");
                    let nonResidentDocumentField = formItems.getForm().findField("fina_fiPersonNonResidentDocNumber");
                    let personalNumberItem = metaData.find(element => element.name === 'fina:fiPersonPersonalNumber');

                    if (idField && nonResidentDocumentField) {
                        if (newValue === "passportOfaForeignCitizen" || newValue === 'other') {
                            idField.clearInvalid();
                            idField.validator = null;
                            idField.allowBlank = true;
                            idField.setFieldLabel(personalNumberItem.title);

                            first.view.registration.MetadataUtil.addValidation(idField, {
                                name: generatedFormItem.name,
                                constraints: [
                                    {
                                        type: 'FINA_REGEX',
                                        parameters: [
                                            {
                                                expression: '([A-Za-z0-9]+)',
                                                requiresMatch: true
                                            }
                                        ]
                                    }
                                ]
                            });

                            if (idField.getValue()) {
                                idField.isValid();
                                idField.validate();
                            }

                            viewModel.set('customValidatorFunctions', [function () {
                                let personalNumberValue = idField.getValue();
                                personalNumberValue = personalNumberValue ? personalNumberValue : "";
                                let nonResidentDocumentValue = nonResidentDocumentField.getValue();
                                nonResidentDocumentValue = nonResidentDocumentValue ? nonResidentDocumentValue : "";
                                let valid = personalNumberValue.trim().length > 0 || nonResidentDocumentValue.trim().length > 0;
                                if (!valid) {
                                    Ext.toast(i18n.nonResidentInfoInvalid, i18n.warning)
                                }
                                return valid;
                            }]);
                        } else {
                            idField.setFieldLabel(personalNumberItem.title + ' <b style="color: red;">*</b>');
                            first.view.registration.MetadataUtil.addValidation(idField, personalNumberItem);
                            idField.allowBlank = !personalNumberItem.mandatory;
                            viewModel.set('customValidatorFunctions', null);
                            if (idField.getValue()) {
                                idField.isValid();
                                idField.validate();
                            }

                        }

                    }

                }
            }
        },

        removeNonameFromName: function (name) {
            return name ? name.split(' ').map(d => d === 'NONAME' ? '' : d).join(' ') : '';
        }
    }
});
