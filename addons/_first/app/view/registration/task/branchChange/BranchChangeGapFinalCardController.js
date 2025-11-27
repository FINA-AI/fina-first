Ext.define('first.view.registration.task.branchChange.BranchChangeGapFinalCardController', {
    extend: 'first.view.registration.task.FiGapFinalCardController',

    alias: 'controller.branchChangeFinalGapController',

    listen: {
        controller: {
            '*': {
                reloadChangeBranchesGapsGrid: 'reloadChangeBranchesGapsGrid'
            }
        }
    },

    reloadChangeBranchesGapsGrid: function (registryId) {
        if (this.getViewModel().get('theFi')['id'] === registryId) {
            this.load();
        }
    },

    load: function () {
        let me = this;
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let store = this.lookupReference('gapFinalGridView').getStore();
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/branchChanges/' + actionId + '/gaps?changesRelativePath=Performed Changes&orderBy=createdAt desc');
        store.proxy.setApi({
            update: first.config.Config.remoteRestUrl + 'ecm/node/'
        });
        store.proxy.setWriter({
            type: 'json',
            writeAllFields: false,
            transform: {
                fn: function (data) {
                    Ext.each(data, function (item) {
                        let updatedProps = {};
                        if (item) {
                            Ext.Object.each(item, function (key, value) {
                                if (key !== "id") {
                                    updatedProps[key.replace("_", ":")] = value;
                                }
                            });
                            data = {
                                id: item.id,
                                properties: updatedProps
                            }
                        }
                    });
                    return data;
                },
                scope: this
            }
        });

        store.load({
            callback: function (records) {
                if (records) {
                    for (let rec of records) {
                        let doc = rec.get('properties').document;

                        if (doc) {
                            me.getViewModel().set('branchesCorrection', {
                                deadline: new Date(doc.properties['fina:fiDocumentCorrectionDeadline']),
                                deadlineDays: doc.properties['fina:fiDocumentCorrectionDeadlineDays']
                            });
                            break;
                        }
                    }
                }
            }
        });
    },

    updateCorrectionStatus: function (record, status) {
        let store = this.lookupReference('gapFinalGridView').getStore();

        let props = record.get('properties');

        props['fina:fiGapCorrectionStatus'] = status;
        if (status === 'NOT_CORRECTED') {
            props["fina:fiGapCorrectionDate"] = null;
            props["fina:fiGapCorrectionLetterNumber"] = null;
            props["fina:fiGapCorrectionComment"] = null;
        }

        record.set(props);

        let me = this;
        store.sync({
            success: function () {
                store.load();
                me.fireEvent('reloadGapsGrid', me.getViewModel().get('theFi')['fina_fiRegistryLastActionId'], ['fiGapView', 'changeGapCard']);
            }
        });
    },

    onResumeRegistration: function () {
        let me = this,
            theFi = this.getViewModel().get('theFi');
        me.getView().mask(i18n.pleaseWait);

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/questionnaireBasedOnGaps/sync/' + theFi.id,
            success: function () {
                me.fireEvent('reloadQuestionnaireGrid', theFi.id);
                me.resumeRegistration();
            },
            failure: function (response) {
                first.util.ErrorHandlerUtil.showErrorWindow(response);
                me.getView().unmask();
            }
        });


    },

    resumeRegistration: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction'),
            theFi = this.getViewModel().get('theFi'),
            fiRegistryId=theFi.id;

        if (data['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            me.getView().mask(i18n.pleaseWait);
            Ext.Ajax.request({
                method: 'POST',
                url: first.config.Config.remoteRestUrl + 'ecm/fi/branchChanges/' + data.id + '/restart?relativePath=Performed Changes',
                success: function (response) {

                    data.fina_fiRegistryActionStep = '1';
                    data.fina_fiRegistryActionControlStatus = 'NONE';

                    me.getView().mask(i18n.pleaseWait);
                    me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
                        function (action, that) {
                            me.fireEvent('changesListUpdated', action.id);

                            me.getViewModel().getParent().set('fiAction', action);
                            me.getViewModel().getParent().set('fiRegistryStatus', 'IN_PROGRESS');
                            theFi['fina_fiRegistryStatus'] = 'IN_PROGRESS';
                            me.getViewModel().getParent().set('theFi', theFi);
                            me.fireEvent('onActionTaskStepChange', me.getViewModel().get('theFi').id);
                            me.changeRegistryAndControllerStatus('IN_PROGRESS', function () {
                                Ext.Ajax.request({
                                    method: 'POST',
                                    url: first.config.Config.remoteRestUrl + 'ecm/notification/' + me.getViewModel().get('fiAction').id +
                                        '?fiRegistryId=' + me.getViewModel().get('theFi').id + '&userLogin=' + first.config.Config.conf.properties.currentUser.id + '&isPausedOnGap=false',

                                    success: function (response) {
                                        me.getView().unmask();
                                    }
                                });

                                that.setActivateTab(action.fina_fiRegistryActionStep);
                            });
                        },
                        null,
                        function () {
                            me.getView().unmask();
                        });
                },
                failure: function (response, message) {
                    me.getView().unmask();
                    first.util.ErrorHandlerUtil.showDocumentError(response, message);
                }
            });
        } else {
            me.getViewModel().get('fiProfileTaskController').setActivateTab(1);
        }

    },

    cellEdit: function (editor, e) {
        let me = this;
        e.grid.store.sync({
            callback: function () {
                me.fireEvent('reloadGapsGrid', me.getViewModel().get('theFi')['fina_fiRegistryLastActionId'], ['fiGapView', 'changeGapCard']);
            }
        });
    },

    onDownloadDocumentClick: function (grid, row, col, btn, event, record) {
        let properties = record.get('properties');
        if (properties && properties['document']) {
            window.open(first.config.Config.remoteRestUrl + 'ecm/node/' + properties['document'].id + '/content?attachment=true');
        }
    }

});
