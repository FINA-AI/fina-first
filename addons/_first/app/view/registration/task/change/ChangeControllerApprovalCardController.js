Ext.define('first.view.registration.task.change.ChangeControllerApprovalCardController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.changeControllerApprovalCard',

    requires: [
        'first.config.Config',
        'first.util.ErrorHandlerUtil',
        'first.view.registration.MetadataUtil'
    ],

    init: function () {
        let me = this,
            theFi = me.getViewModel().get('theFi'),
            lastProcessId = theFi.fina_fiRegistryLastProcessId,
            actionId = theFi['fina_fiRegistryLastActionId'],
            documentType = null,
            documentGetInfoFn = null;

        if (me.getViewModel().get('isRegistryActionController') && me.getViewModel().get('fiAction')['fina_fiRegistryActionControlStatus'] === 'REVIEW') {
            me.getViewModel().get('fiAction')['fina_fiRegistryActionControllerComment'] = "";
        }

        switch (this.getViewModel().get('fiAction')['fina_fiChangeFormType']) {
            case "managementPersonal": {
                me.getViewModel().set({
                    documentTitle: i18n.approvalLetterTitle,
                    documentStatusEmptyText: i18n.approvalLetterStatusEmpty,
                    documentStatusTooltip: " data-qtip='" + i18n.approvalLetterStatusTooltip + "' ",
                    documentViewText: i18n.confirmationLetterDownload
                });
                documentType = 'CONFIRMATION_LETTER';
                documentGetInfoFn = me.getApprovalLetterInfoText;
                break;
            }
            case "organizationalForm": {
                me.getViewModel().set({
                    documentTitle: i18n.reportCardTitle,
                    documentStatusEmptyText: i18n.reportCardInfoEmpty,
                    documentStatusTooltip: " data-qtip='" + i18n.reportCardInfoEmpty + "' ",
                    documentViewText: i18n.downloadReportCard
                });
                documentType = 'REPORT_CARD';
                documentGetInfoFn = me.getReportCardInfoText;
            }
        }

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/document/' + lastProcessId + '/' + documentType + "/" + actionId,
            success: function (response) {
                let result = JSON.parse(response.responseText);
                if (result && result.length > 0) {
                    let existingDocument = result[0];
                    existingDocument.infoText = documentGetInfoFn(result[0]);
                    me.getViewModel().set('existingDocument', existingDocument);
                }
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });

        if (!me.getViewModel().get('isFormInitialized')) {
            me.initForm(theFi.nodeType);
        } else {
            me.fireEvent('getFiCall', theFi.id, function (obj) {
                me.getViewModel().set('theFi', obj);
            })
        }
    },

    initForm: function (dataType) {
        let me = this;
        Ext.suspendLayouts();

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/dictionary/classes/' + dataType.replace(':', '_') + '/properties',
            method: 'GET',
            callback: function (options, success, response) {

                let metaDada = JSON.parse(response.responseText),
                    hiddenProperties = first.view.registration.MetadataUtil.filterAndSortMetaData(dataType, metaDada),
                    view = me.lookupReference('generalInfoForm'),
                    editableProps = first.view.registration.MetadataUtil.getGeneralInfoEditableProperties(dataType, metaDada),
                    editablePropNames = [];

                Ext.each(editableProps, function (prop) {
                    editablePropNames.push(prop.name);
                });

                editablePropNames = (!!editablePropNames && editablePropNames.length > 0) ? editablePropNames : ['fina:fiRegistryLegalFormType', 'fina:fiRegistryName'];

                Ext.each(metaDada, function (i) {
                    if (hiddenProperties.indexOf(i.name) < 0 && editablePropNames.includes(i.name)) {
                        let bindName = i.name.replace(':', '_');
                        i.mandatory = false;

                        let oldValue = first.view.registration.MetadataUtil.getFormItemXType(i, bindName, me.getViewModel());
                        oldValue.fieldLabel = oldValue.fieldLabel + ' (' + i18n.oldValue + ')';
                        let newValue = first.view.registration.MetadataUtil.getFormItemXType(i, bindName, me.getViewModel());
                        newValue.fieldLabel = newValue.fieldLabel + ' (' + i18n.newValue + ')';

                        oldValue.labelWidth = 200;
                        oldValue.disabled = false
                        oldValue.margin = '10';
                        oldValue.flex = 1;
                        oldValue.bind = {
                            value: '{theFi.' + bindName + '}',
                            readOnly: true,
                        };


                        newValue.labelWidth = 200;
                        newValue.disabled = false
                        newValue.margin = '10';
                        newValue.flex = 1;
                        newValue.bind = {
                            value: '{changedData.' + bindName.replace('fina_fiRegistry', 'fina_fiOrganisationalFormAndNameChange') + '}',
                            readOnly: true,
                        };

                        let hboxLayout = Ext.create(
                            {
                                'xtype': 'container',
                                flex: 1,
                                'layout': {
                                    type: 'hbox',
                                    align: 'stretch'
                                }
                            });
                        hboxLayout.add(oldValue);
                        hboxLayout.add(newValue);
                        view.add(hboxLayout);

                    }
                });

                me.getViewModel().set('isFormInitialized', true);
                Ext.resumeLayouts(true);
            }
        });
    },

    getApprovalLetterInfoText: function (approvalLetter) {
        let createdAt = Ext.Date.format(new Date(approvalLetter.createdAt - 0), first.config.Config.timeFormat);
        let createdBy = (approvalLetter.createdByUser ? approvalLetter.createdByUser.displayName : approvalLetter.createdBy.displayName);
        createdBy = first.view.registration.MetadataUtil.removeNonameFromName(createdBy)
        let modifiedAt = Ext.Date.format(new Date(approvalLetter.modifiedAt - 0), first.config.Config.timeFormat);
        let modifiedBy = (approvalLetter.modifiedByUser ? approvalLetter.modifiedByUser.displayName : approvalLetter.modifiedBy.displayName);
        modifiedBy = first.view.registration.MetadataUtil.removeNonameFromName(modifiedBy)

        return Ext.String.format('{0}: {1} ({2}) | {3}: {4} ({5})', i18n.approvalLetterCreatedAt, createdAt, createdBy, i18n.approvalLetterModifiedAt, modifiedAt, modifiedBy);
    },

    getReportCardInfoText: function (reportCard) {
        let createdAt = Ext.Date.format(new Date(reportCard.createdAt - 0), first.config.Config.timeFormat);
        let modifiedAt = Ext.Date.format(new Date(reportCard.modifiedAt - 0), first.config.Config.timeFormat);
        let fiDocumentIsLastVersion = reportCard.properties['fina:fiDocumentIsLastVersion'];

        return Ext.String.format('{0}: {1} | {2}: {3}  {4}', i18n.reportCardCreatedAt, createdAt, i18n.reportCardModifiedAt, modifiedAt, fiDocumentIsLastVersion ? "" : "|" + i18n.reportCardIsNotLastVersion);
    },

    onConfirmationLetterDownloadClick: function () {
        let existingDocument = this.getViewModel().get('existingDocument');
        if (existingDocument) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + existingDocument.id + '/content?attachment=true');
        }
    },

    onApprove: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionControlStatus = 'ACCEPTED';
        data.fina_fiRegistryActionPreviousStep = data.fina_fiRegistryActionStep;
        data.fina_fiRegistryActionStep = '6';

        me.getView().mask(i18n.pleaseWait);

        me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
            function (action, that) {
                me.getViewModel().set('isControllerButtonDisabled', true);
                me.getViewModel().set('fiAction', action);
                me.getViewModel().getParent().set('fiAction', action);
                me.getViewModel().set('showTaskStatusMessage', true);
            },
            null,
            function () {
                me.getView().unmask();
            }
        );
    },


    onGap: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction');

        data.fina_fiRegistryActionPreviousStep = data.fina_fiRegistryActionStep;
        data.fina_fiRegistryActionStepController = '4';

        me.getView().mask(i18n.pleaseWait);
        me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
            function (action, that) {
                me.getViewModel().set('fiAction', action);
                that.setActivateTab(action.fina_fiRegistryActionStepController);
            },
            null,
            function () {
                me.getView().unmask();
            }
        );
    },

});
