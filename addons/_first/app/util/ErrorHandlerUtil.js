Ext.define('first.util.ErrorHandlerUtil', {

    statics: {
        showErrorWindow: function (response, message, batch) {
            console.log('Operation failed.');

            let msgText = "<div style='text-align: center'><strong>" + i18n.havingSomeIssues + "</strong></div></br>";
            let errorMsg;

            if (batch) {
                errorMsg = this.getErrorFromBatch(batch);
            } else if (response) {
                errorMsg = this.getErrorFromResponse(response);
            }

            if (message) {
                errorMsg = message;
            }

            let window = Ext.create("Ext.window.Window", {
                title: i18n.beInformed,
                iconCls: 'x-fa fa-exclamation-triangle ',
                modal: true,
                width: 650,

                layout: {
                    type: 'fit'
                },

                focusable: true,


                items: [
                    {
                        viewConfig: {
                            enableTextSelection: true
                        },
                        margin: 5,
                        html: msgText + errorMsg
                    }
                ],

                bbar: {
                    style: 'background-color:#f2efef',
                    items: ['->',
                        {
                            xtype: 'button',
                            cls: 'finaSecondaryBtn',
                            text: i18n.close,
                            handler: function () {
                                window.destroy();
                            }
                        }]
                }
            });
            window.show().removeCls("x-unselectable");
        },

        getErrorFromResponse: function (response) {
            let error;
            let errorText;

            let briefSummary = response.responseJson ? response.responseJson.message : response.responseText,
                finaTypeExceptionIdentifier = "net.fina.first.alfresco.FinaTypeException: ",
                exceptionPrefix = finaTypeExceptionIdentifier + 'Exception';

            if (briefSummary && briefSummary.includes(exceptionPrefix)) {
                let warningMessage = briefSummary.substr(briefSummary.lastIndexOf(finaTypeExceptionIdentifier) + finaTypeExceptionIdentifier.length);
                warningMessage = warningMessage.substr(0, warningMessage.length).split(';');
                if (warningMessage.length > 1 && i18n[warningMessage[0]]) {
                    let i18nMessage = i18n[warningMessage[0]];
                    warningMessage.shift();
                    warningMessage.unshift(i18nMessage);
                    errorText = Ext.String.format.apply(this, warningMessage);
                }
            }

            if(!errorText) {
                try {
                    error = JSON.parse(response.responseText);
                } catch (e) {
                    errorText = response.statusText;
                }


                if (error && error.error) {
                    if (error.error.briefSummary) {
                        errorText = ('<br>' + this.getExceptionI18nMessage(error.error.briefSummary));
                    } else if (error.error.errorKey) {
                        errorText = ('<br>' + error.error.errorKey);
                    }
                } else if (response.exceptions && response.exceptions[0]) {
                    errorText = response.exceptions[0].getError().response.responseText;
                } else {
                    errorText = response.statusText;
                }
            }


            let errorMsg = errorText + "</br>"
                + i18n.status + ": " + response.status + "</br>"
                + "</br>"
                + i18n.goBackToPreviousStep;

            console.log(response);

            return errorMsg;
        },

        getErrorFromBatch: function (batch) {
            let error = batch.exceptions[0].error;
            let errorText;
            let status;

            if (error) {
                errorText = error.statusText;
                status = error.status;
            }

            let errorMsg = errorText + "</br>"
                + i18n.status + ": " + status + "</br>"
                + "</br>"
                + i18n.goBackToPreviousStep;

            console.log(error);

            return errorMsg;
        },

        getExceptionI18nMessage: function (message) {
            let prefix = "couldn't execute event listener : ";
            if (message.startsWith(prefix)) {
                message = message.substring(prefix.length);
                if (i18n[message]) {
                    return i18n[message];
                }
                message = message.split(';');
                if (message.length > 1 && i18n[message[0]]) {
                    let i18nMessage = i18n[message[0]];
                    message.shift();
                    message.unshift(i18nMessage);
                    return Ext.String.format.apply(this, message);
                }
            }
            return message;
        },

        detectFailureType: function (response, warningConfirmHandler, warningDenyHandler) {
            let briefSummary = response.responseJson ? response.responseJson.message : response.responseText,
                finaTypeExceptionIdentifier = "net.fina.first.alfresco.FinaTypeException: ",
                warningPrefix = finaTypeExceptionIdentifier + 'Warning';

            if (briefSummary && briefSummary.includes(warningPrefix)) {
                let warningMessage = briefSummary.substr(briefSummary.lastIndexOf(finaTypeExceptionIdentifier) + finaTypeExceptionIdentifier.length);
                warningMessage = warningMessage.substr(0, warningMessage.length).split(';');
                if (warningMessage.length > 1 && i18n[warningMessage[0]]) {
                    let i18nMessage = i18n[warningMessage[0]];
                    warningMessage.shift();
                    warningMessage.unshift(i18nMessage);
                    warningMessage = Ext.String.format.apply(this, warningMessage);

                    Ext.MessageBox.confirm(i18n.warning, warningMessage, function (btn, text) {
                        if (btn === 'yes') {
                            if (warningConfirmHandler) {
                                warningConfirmHandler();
                            }
                        } else if (btn === 'no' || btn === 'cancel') {
                            if (warningDenyHandler) {
                                warningDenyHandler();
                            }
                        }
                    }, this);
                } else {
                    first.util.ErrorHandlerUtil.showErrorWindow(response);
                }
            }
        },

        showDocumentError: function (response, message, batch) {
            console.log(response)
            let msg;
            if(message.jsonData) {
                msg = Ext.String.format(i18n.errorWhileAddingDocument, i18n[message.jsonData.documentType])
            }

            first.util.ErrorHandlerUtil.showErrorWindow(response, msg);
        },

        showReportError: function (reportName) {
            let reportNameI18n = i18n[reportName] || 'reportName';

            first.util.ErrorHandlerUtil.showErrorWindow(null,
                Ext.String.format(i18n.errorWhileGenerateReport, reportNameI18n));
        }
    }
});
