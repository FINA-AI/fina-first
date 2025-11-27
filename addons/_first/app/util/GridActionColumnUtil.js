Ext.define('first.util.GridActionColumnUtil', {

    statics: {
        getDeleteButtonEnabled: function (vm, record) {
            let editMode = vm.get('editMode'),
                changeMode = vm.get('isChangeMode'),
                changeTypeManagement = vm.get('isChangeTypeManagement'),
                recordActionId = record.get('properties') ? record.get('properties')['fina:fiParentRegistryActionId'] : record.get('fina:fiParentRegistryActionId'),
                fiAction = vm.get('fiAction'),
                branchChangeMode = vm.get('isChangeBranchMode'),
                detail = vm.get('detail');

            if (vm.get('isIndividualEntrepreneur') && detail.name === "Authorized Persons") {
                return false;
            }

            if (record.id === 'root') {
                return false;
            }


            if (vm.get('theFi').fina_fiRegistryStatus !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin) {
                return true;
            }

            if (vm.get('theFi').fina_fiRegistryStatus !== 'IN_PROGRESS' || vm.get('inReview')) {
                return false;
            }

            if (editMode && fiAction.id === recordActionId) {
                return true;
            } else {
                return false;
            }

            // return (editMode && (changeMode && changeTypeManagement)) || record.id === 'root';
        },

        getDeleteButtonClassName: function (vm, record) {
            let fiAction = vm.get('fiAction'),
                isChangeMode = vm.get('isChangeMode'),
                isChangeTypeManagement = vm.get('isChangeTypeManagement'),
                detail = vm.get('detail');

            if (vm.get('theFi').fina_fiRegistryStatus !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin) {
                return 'x-fa fa-minus-circle redColor';
            }

            if (vm.get('theFi')['fina_fiRegistryStatus'] !== 'IN_PROGRESS' || vm.get('inReview')) {
                return 'first-action-icon-hidden';
            }

            if (detail.name === 'Beneficiaries' || detail.name === 'Authorized Persons' || detail.name === 'Complex Structures') {
                if (isChangeMode && isChangeTypeManagement) {
                    let actionId = record.get('properties') ? record.get('properties')['fina:fiParentRegistryActionId'] : record.get('fina:fiParentRegistryActionId');
                    if (actionId !== fiAction.id) {
                        return 'first-action-icon-hidden';
                    }
                }
            } else if (detail.name === 'Branches' && fiAction['fina_fiRegistryActionType'] === 'BRANCHES_CHANGE') {
                if (record.get('fina:fiParentRegistryActionId') !== fiAction.id) {
                    return 'first-action-icon-hidden';
                }
            }

            return vm.get('fiRegistryStatus') !== "IN_PROGRESS" ?
                'first-action-icon-hidden' :
                "x-fa fa-minus-circle redColor";
        },

        getDisableButtonEnabled: function (vm, record) {
            let detail = vm.get('detail'),
                fiAction = vm.get('fiAction'),
                theFi = vm.get('theFi'),
                editMode = vm.get('editMode'),
                changeMode = vm.get('isChangeMode'),
                branchChangeMode = vm.get('isChangeBranchMode'),
                status = record.get('properties') ? record.get('properties')['fina:status'] : record.get('fina:status');

            if (vm.get('isIndividualEntrepreneur') && detail.name === "Authorized Persons") {
                return false;
            }

            if (record.id === 'root') {
                return false;
            }

            if (status === 'CANCELED') {
                return false;
            }

            if (theFi['fina_fiRegistryStatus'] !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin) {
                return true;
            }

            if (theFi['fina_fiRegistryStatus'] !== 'IN_PROGRESS' || vm.get('inReview')) {
                return false;
            }

            if ((changeMode || branchChangeMode) || detail.name === 'Beneficiaries' || detail.name === 'Authorized Persons' || detail.name === 'Complex Structures') {
                let actionId = record.get('properties') ? record.get('properties')['fina:fiParentRegistryActionId'] : record.get('fina:fiParentRegistryActionId');
                return actionId !== fiAction.id && editMode;
            } else if (detail.name === 'Branches' && record.get('fina:fiParentRegistryActionId') !== fiAction.id) {
                return false;
            }
            return (editMode && (changeMode || branchChangeMode)) || record.id === 'root';
        },

        getDisableClassName: function (vm, record) {
            let fiAction = vm.get('fiAction'),
                detail = vm.get('detail'),
                theFi = vm.get('theFi'),
                isChangeMode = vm.get('isChangeMode'),
                isChangeTypeManagement = vm.get('isChangeTypeManagement'),
                branchChangeMode = vm.get('isChangeBranchMode');

            if (theFi.fina_fiRegistryStatus !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin) {
                return 'x-fa fa-ban redColor';
            }

            if (theFi['fina_fiRegistryStatus'] !== 'IN_PROGRESS') {
                return 'first-action-icon-hidden';
            }

            if (detail.name === 'Beneficiaries' || detail.name === 'Authorized Persons' || detail.name === 'Complex Structures') {
                if (isChangeMode && isChangeTypeManagement) {
                    let actionId = record.get('properties') ? record.get('properties')['fina:fiParentRegistryActionId'] : record.get('fina:fiParentRegistryActionId');
                    if (actionId !== fiAction.id) {
                        return 'x-fa fa-ban redColor';
                    }
                }
            } else if (detail.name === 'Branches' && branchChangeMode) {
                if (record.get('fina:fiParentRegistryActionId') !== fiAction.id) {
                    return 'x-fa fa-ban redColor';
                }
            }
            return "first-action-icon-hidden";
        },

        isDataEditDisabled: function (vm, record) {
            let theFi = vm.get('theFi');
            if (theFi.fina_fiRegistryStatus !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin) {
                return false;
            }

            let fiAction = vm.get('fiAction'),
                isController = vm.get('isController'),
                inReview = vm.get('inReview'),
                editMode = vm.get('editMode'),
                recordActionId = record.get('properties') ? record.get('properties')['fina:fiParentRegistryActionId'] : record.get('fina:fiParentRegistryActionId');

            // Historical Data Super Admin BUG
            recordActionId = recordActionId ? recordActionId : fiAction.id;

            if (vm.get('isEditBranchMode') && vm.get('detail')["name"] === "Branches" && vm.get('editMode')) {
                return false;
            }

            return !editMode || recordActionId !== fiAction.id || (inReview && !isController);
        }
    }
});