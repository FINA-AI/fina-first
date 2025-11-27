Ext.define('first.view.registration.FiProfileModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.fiProfile',

    requires: [
        'first.config.Config'
    ],

    formulas: {
        editMode: function (get) {
            return (get('fiRegistryStatus') === 'IN_PROGRESS'
                && get('fiAction')['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id
                && get('fiAction')['fina_fiRegistryActionControlStatus'] !== 'REVIEW'
                && get('fiAction')['fina_fiRegistryActionControlStatus'] !== 'ACCEPTED') ||
                (get('fiRegistryStatus') !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin);
        },
        editModeController: function (get) {
            return get('fiRegistryStatus') === 'IN_PROGRESS'
                && get('theFi')['fina_fiRegistryLastInspectorId'] === first.config.Config.conf.properties.currentUser.id
                && get('fiAction')['fina_fiRegistryActionControlStatus'] === 'REVIEW';
        },
        inReview: function (get) {
            return get('fiRegistryStatus') === 'IN_PROGRESS'
                && get('fiAction')['fina_fiRegistryActionControlStatus'] === 'REVIEW';
        },
        isController: function (get) {
            return get('fiRegistryStatus') === 'IN_PROGRESS'
                && get('theFi')['fina_fiRegistryLastInspectorId'] === first.config.Config.conf.properties.currentUser.id;
        },
        isAccepted: function (get) {
            return get('fiRegistryStatus') === 'IN_PROGRESS'
                && get('fiAction')['fina_fiRegistryActionControlStatus'] === 'ACCEPTED';
        },
        isCancelCurrentActionEnabled: function (get) {
            return get('fiRegistryStatus') === 'IN_PROGRESS' && !get('fiAction')['fina_fiRegistryActionIsSentToController'];
        },
        isDeclined: function (get) {
            return get('fiRegistryStatus') === 'IN_PROGRESS'
                && get('fiAction')['fina_fiRegistryActionControlStatus'] === 'DECLINED';
        },
        isChangeMode: function (get) {
            if ((get('fiRegistryStatus') !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin)) {
                return false;
            }
            return get('fiAction')['fina_fiRegistryActionType'] === 'CHANGE';
        },
        isBranchesChangeMode: function (get) {
            if ((get('fiRegistryStatus') !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin)) {
                return false;
            }
            return get('fiAction')['fina_fiRegistryActionType'] === 'BRANCHES_CHANGE';
        },
        isBranchesEditMode: function (get) {
            if ((get('fiRegistryStatus') !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin)) {
                return false;
            }
            return get('fiAction')['fina_fiRegistryActionType'] === 'BRANCHES_EDIT';
        },
        isChangeTypeManagement: function (get) {
            return get('fiAction')['fina_fiChangeFormType'] === 'managementPersonal';
        },
        isRegistryActionEditor: function (get) {
            let externalProcess = get('fiAction')['fina_fiRegistryActionExternalInitiator'];

            if (externalProcess && get('theFi')['fina_fiRegistryLastInspectorId'] !== first.config.Config.conf.properties.currentUser.id) {
                return get('fiAction')['fina_fiRegistryActionExternalInitiatorIsSubmited']
            }

            return get('theFi')['fina_fiRegistryLastEditorId'] === first.config.Config.conf.properties.currentUser.id;
        },
        isRegistryActionController: function (get) {
            return get('theFi')['fina_fiRegistryLastInspectorId'] === first.config.Config.conf.properties.currentUser.id;
        },
        hideCancelWorkflowButton: function (get) {
            let fiRegistryStatus = get('fiRegistryStatus');
            return (fiRegistryStatus !== 'IN_PROGRESS' || get('theFi')['fina_fiRegistryLastEditorId'] !== first.config.Config.conf.properties.currentUser.id);
        },
        hideWorkflowButtons: function (get) {
            let fiRegistryStatus = get('fiRegistryStatus'),
                fiRegistryAction = get('fiAction'),
                actionType = get('theFi')['fina_fiActionType'],
                licenseStatus = get('theFi')['fina_fiRegistryLicenseStatus'],
                isHistoricData = get('theFi')['fina_fiRegistryIsHistoricData'];

            if (isHistoricData) {
                return true;
            }

            if (actionType !== 'REGISTRATION' && (fiRegistryStatus === 'GAP' || (fiRegistryAction.fina_fiRegistryActionStep === 9 && (actionType === 'BRANCHES_CHANGE' || actionType === 'BRANCHES_EDIT')))) {
                return !get('canStartFiProcesses');
            }

            if (fiRegistryStatus === 'IN_PROGRESS' || fiRegistryStatus === 'GAP') {
                return true;
            }

            switch (actionType) {
                case 'REGISTRATION':
                    return fiRegistryStatus !== 'ACCEPTED' || !get('canStartFiProcesses');
                case 'CANCELLATION':
                    return fiRegistryStatus === 'ACCEPTED' || !get('canStartFiProcesses');
                case 'DOCUMENT_WITHDRAWAL':
                    return licenseStatus === 'INACTIVE';
            }

            return !get('canStartFiProcesses');
        },
        canStartFiProcesses: function (get) {
            return first.config.Config.conf.properties.currentUser.editor
                || first.config.Config.conf.properties.currentUser.superAdmin
                || first.config.Config.conf.properties.currentUser.capabilities.admin;
        },
        isCancellationMode: function (get) {
            let actionType = get('theFi')['fina_fiActionType'];
            return actionType === 'CANCELLATION';
        },
        isChangeBranchMode: function (get) {
            if ((get('fiRegistryStatus') !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin)) {
                return false;
            }
            return get('fiAction')['fina_fiRegistryActionType'] === 'BRANCHES_CHANGE';
        },
        isEditBranchMode: function (get) {
            if ((get('fiRegistryStatus') !== 'IN_PROGRESS' && first.config.Config.conf.properties.currentUser.superAdmin)) {
                return false;
            }
            return get('fiAction')['fina_fiRegistryActionType'] === 'BRANCHES_EDIT';
        },
        redactingStatusIsAccepted: function (get) {
            return get('fiAction')['fina_fiRegistryActionRedactingStatus'] === "ACCEPTED";
        },
        redactingStatusIsDeclined: function (get) {
            return get('fiAction')['fina_fiRegistryActionRedactingStatus'] === "DECLINED";
        },
        redactingStatusIsWithdrawal: function (get) {
            return get('fiAction')['fina_fiRegistryActionRedactingStatus'] === "WITHDRAWAL";
        },

        isExternalProcess: function (get) {
            return get('fiAction')['fina_fiRegistryActionExternalInitiator'];
        },
        isExternalProcessSubmitted: function (get) {

            let isExternalUser = get('fiAction')['fina_fiRegistryActionExternalInitiator'];
            if (isExternalUser) {
                return get('fiAction')['fina_fiRegistryActionExternalInitiatorIsSubmited']
            }
            return true;
        },
        isWithdrawalButtonDisabled: function (get) {
            let fiAction = get('fiAction');
            return !(
                (fiAction['fina_fiRegistryActionType'] === 'REGISTRATION' || fiAction['fina_fiRegistryActionType'] === 'BRANCHES_CHANGE')
                && fiAction['fina_fiRegistryActionRedactingStatus'] !== 'WITHDRAWAL'
                && get('fiRegistryStatus') === 'IN_PROGRESS'
                && fiAction['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id
            )
        },
        isIndividualEntrepreneur: function (get) {
            return get('theFi')['fina_fiRegistryLegalFormType'] === 'individualEntrepreneur';
        },
        isFinishHistoricDataReviewButtonHidden: function (get) {
            let theFi = get('theFi'),
                isSuperAdmin = first.config.Config.conf.properties.currentUser.superAdmin,
                isHistoricData = theFi['fina_fiRegistryIsHistoricData'];

            return !isHistoricData || !isSuperAdmin;
        },
        isChangeControllerButtonHidden: function (get) {
            let processInProgress = get('fiRegistryStatus') === 'IN_PROGRESS',
                isSuperAdmin = first.config.Config.conf.properties.currentUser.superAdmin,
                isControllerAssigned = !!get('theFi')['fina_fiRegistryLastInspectorId'],
                isSentToController = !!get('fiAction')['fina_fiRegistryActionIsSentToController'];

            return !processInProgress || !isSuperAdmin || (!isControllerAssigned && !isSentToController);
        }
    }
});
