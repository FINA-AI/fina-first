Ext.define('first.view.registration.FiRegistrationValidator', {

    statics: {

        getFiRegistrationExcludeTypesByExistingRecords: function (existingRecords) {
            let excludeFiTypeCodes = [];

            if (existingRecords.length > 0) {
                let fiRegistrationByTypeDisableStatus = first.view.registration.FiRegistrationValidator.getFiRegistrationByTypeDisableStatus(existingRecords);

                if (fiRegistrationByTypeDisableStatus.disableAll || (fiRegistrationByTypeDisableStatus.isActiveFiRegistryLe && fiRegistrationByTypeDisableStatus.isActiveFiRegistryFex)) {
                    excludeFiTypeCodes = ['LE', 'MFO', 'FEX', 'CRU'];
                } else if (fiRegistrationByTypeDisableStatus.isActiveFiRegistryLe) {
                    excludeFiTypeCodes = ['LE', 'MFO', 'CRU'];
                } else if (fiRegistrationByTypeDisableStatus.isActiveFiRegistryFex) {
                    excludeFiTypeCodes = ['FEX', 'MFO', 'CRU'];
                } else {
                    Ext.each(records, function (record) {
                        let isCancellationAccepted = (record.get('actionType') === 'CANCELLATION' && record.get('status') === 'ACCEPTED');
                        excludeFiTypeCodes = (!isCancellationAccepted ? [record.get('fiTypeCode')] : []);
                    });
                }
            }

            return excludeFiTypeCodes;
        },

        bindFiRegistrationMenuItems: function (records, menuItems) {

            if (Ext.isEmpty(records)) {
                Ext.each(menuItems, function (m) {
                    m.setDisabled(false);
                });
            } else {
                let fiRegistrationByTypeDisableStatus = first.view.registration.FiRegistrationValidator.getFiRegistrationByTypeDisableStatus(records);

                if (fiRegistrationByTypeDisableStatus.disableAll || (fiRegistrationByTypeDisableStatus.isActiveFiRegistryLe && fiRegistrationByTypeDisableStatus.isActiveFiRegistryFex)) {
                    Ext.each(menuItems, function (m) {
                        m.setDisabled(true);
                    });
                } else if (fiRegistrationByTypeDisableStatus.isActiveFiRegistryLe) {
                    Ext.each(menuItems, function (m) {
                        m.setDisabled(m.fiTypeCode !== 'FEX');
                    });
                } else if (fiRegistrationByTypeDisableStatus.isActiveFiRegistryFex) {
                    Ext.each(menuItems, function (m) {
                        m.setDisabled(m.fiTypeCode !== 'LE');
                    });
                } else {
                    Ext.each(menuItems, function (menuItem) {
                        Ext.each(records, function (record) {
                            let isCancellationAccepted = (record.get('actionType') === 'CANCELLATION' && record.get('status') === 'ACCEPTED');
                            let isRegistrationDeclined = (record.get('actionType') === 'REGISTRATION' && record.get('status') === 'DECLINED')
                                || (record.get('actionType') === 'DOCUMENT_WITHDRAWAL' && record.get('status') === 'ACCEPTED' && record.get('licenseStatus') === 'INACTIVE');
                            menuItem.setDisabled(record.get('fiTypeCode') === menuItem.fiTypeCode && !isCancellationAccepted && !isRegistrationDeclined);
                        });
                    });
                }
            }
        },

        getFiRegistrationByTypeDisableStatus: function (records) {
            let disableAll = false,
                isActiveFiRegistryLe = false,
                isActiveFiRegistryFex = false;

            if (records.length > 0) {
                Ext.each(records, function (record) {
                    let isCancellationAccepted = (record.get('actionType') === 'CANCELLATION' && record.get('status') === 'ACCEPTED');
                    let isRegistrationDeclined = (record.get('actionType') === 'REGISTRATION' && record.get('status') === 'DECLINED')
                        || (record.get('actionType') === 'DOCUMENT_WITHDRAWAL' && record.get('status') === 'ACCEPTED' && record.get('licenseStatus') === 'INACTIVE');
                    if (!isCancellationAccepted && !isRegistrationDeclined) {
                        let fiTypeCode = record.get('fiTypeCode');
                        switch (fiTypeCode) {
                            case 'MFO':
                            case 'CRU':
                                disableAll = true;
                                break;
                            case 'LE':
                                isActiveFiRegistryLe = true;
                                break;
                            case 'FEX':
                                isActiveFiRegistryFex = true;
                                break;
                            default:
                                break;
                        }
                    }
                });
            }

            return {
                disableAll: disableAll,
                isActiveFiRegistryLe: isActiveFiRegistryLe,
                isActiveFiRegistryFex: isActiveFiRegistryFex
            }
        }

    }

});