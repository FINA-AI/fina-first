Ext.define('first.view.registration.task.FiGapFinalCardController', {
    extend: 'first.view.registration.task.FiGapCardController',

    alias: 'controller.finalGapController',

    init: function () {
        // this
    },

    afterRender: function () {
        this.load();
    },

    load: function () {
        let me = this;
        let theFi = this.getViewModel().get('theFi');
        let actionId = theFi['fina_fiRegistryLastActionId'];
        let store = this.lookupReference('gapFinalGridView').getStore();
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/node/' + actionId + '/children?relativePath=Gaps&orderBy=createdAt desc');
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
                me.bind(records);
            }
        });
    },

    bind: function (records) {
        if (records && records.length > 0) {
            let isEveryGapCorrected = true;
            Ext.each(records, function (record) {
                isEveryGapCorrected &= record.get('properties')['fina:fiGapCorrectionStatus'] === 'CORRECTED';
            });
            this.getViewModel().set('finalGap', {'isEveryGapCorrected': isEveryGapCorrected});
        }
    },

    generalRenderer: function (record, fieldName) {
        let status = record.data.properties['fina:fiGapCorrectionStatus'];
        let value = record.get('properties')[fieldName];
        let translatedValue = i18n[value] ? i18n[value] : value;

        switch (status) {
            case 'CORRECTED':
                return '<div style="color: green">' + translatedValue + '</div>';
            case 'NOT_CORRECTED':
                return '<div style="color: red">' + translatedValue + '</div>';
            default:
                break;
        }

        return translatedValue;
    },


    onCorrected: function (view, recIndex, cellIndex, item, e, record) {
        this.updateCorrectionStatus(record, 'CORRECTED');
    },

    onNotCorrected: function (view, recIndex, cellIndex, item, e, record) {
        this.updateCorrectionStatus(record, 'NOT_CORRECTED');
    },

    onErase: function (view, recIndex, cellIndex, item, e, record) {
        this.updateCorrectionStatus(record, null);
    },

    isDisabled: function () {
        return this.getViewModel().get('isController') || !this.getViewModel().get('isRegistryActionEditor');
    },

    updateCorrectionStatus: function (record, status) {
        let store = this.lookupReference('gapFinalGridView').getStore();

        let props = record.get('properties');

        props['fina:fiGapCorrectionStatus'] = status;
        if (!status || status === 'NOT_CORRECTED') {
            props["fina:fiGapCorrectionDate"] = null;
            props["fina:fiGapCorrectionLetterNumber"] = null;
            props["fina:fiGapCorrectionComment"] = null;
        }

        record.set(props);

        let me = this;
        store.sync({
            success: function () {
                store.load();
                me.bind(store.getData().items);
                me.fireEvent('reloadGapsGrid', me.getViewModel().get('theFi')['fina_fiRegistryLastActionId'], ['fiGapView', 'changeGapCard']);
            }
        });
    },

    onRefuseRegistration: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction'),
            theFi = this.getViewModel().get('theFi');

        if (data['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            data.fina_fiRegistryActionPreviousStep = data.fina_fiRegistryActionStep;
            data.fina_fiRegistryActionStep = '0';
            data.fina_fiRegistryActionControlStatus = 'NONE';

            me.getView().mask(i18n.pleaseWait);
            me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
                function (action, that) {
                    me.getViewModel().getParent().set('fiAction', action);
                    that.setActivateTab(action.fina_fiRegistryActionStep);
                    me.getViewModel().getParent().set('fiRegistryStatus', 'IN_PROGRESS');
                    theFi['fina:fiRegistryStatus'] = 'IN_PROGRESS';
                    me.getViewModel().set('theFi', theFi);
                    me.fireEvent('onActionTaskStepChange', me.getViewModel().get('theFi').id);
                    me.changeRegistryAndControllerStatus('IN_PROGRESS', function () {

                    });
                },
                null,
                function () {
                    me.getView().unmask();
                });
        } else {
            me.getViewModel().get('fiProfileTaskController').setActivateTab(0);
        }
    },

    onResumeRegistration: function () {
        let me = this,
            view = me.getView(),
            fiRegistryId = this.getViewModel().get('theFi').id;

        view.mask(i18n.pleaseWait);

        //  synchronize questionnaire from gaps
        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/fi/questionnaireBasedOnGaps/sync/' + fiRegistryId,
            success: function () {
                me.fireEvent('reloadQuestionnaireGrid', fiRegistryId);
                me.resumeRegistration();
            },
            failure: function (response) {
                view.unmask();
                first.util.ErrorHandlerUtil.showErrorWindow(response);
            }
        });
    },

    resumeRegistration: function () {
        let me = this;
        let data = this.getViewModel().get('fiAction'),
            theFi = this.getViewModel().get('theFi');

        me.getView().mask(i18n.pleaseWait);
        if (data['fina_fiRegistryActionAuthor'] === first.config.Config.conf.properties.currentUser.id) {
            data.fina_fiRegistryActionStep = '1';
            data.fina_fiRegistryActionControlStatus = 'NONE';

            me.getViewModel().get('fiProfileTaskController').updateActionTask(data.id, data,
                function (action, that) {
                    me.getViewModel().getParent().set('fiAction', action);
                    me.getViewModel().getParent().set('fiRegistryStatus', 'IN_PROGRESS');
                    theFi['fina:fiRegistryStatus'] = 'IN_PROGRESS';
                    me.getViewModel().getParent().set('theFi', theFi);
                    that.setActivateTab(action.fina_fiRegistryActionStep);
                    me.fireEvent('onActionTaskStepChange', me.getViewModel().get('theFi').id);
                    me.changeRegistryAndControllerStatus('IN_PROGRESS', function () {
                        Ext.Ajax.request({
                            method: 'POST',
                            url: first.config.Config.remoteRestUrl + 'ecm/notification/' + me.getViewModel().get('fiAction').id +
                                '?fiRegistryId=' + me.getViewModel().get('theFi').id + '&userLogin=' + first.config.Config.conf.properties.currentUser.id + '&isPausedOnGap=false',

                            success: function (response) {
                                me.getView().unmask();
                                me.fireEvent('refreshProfileView', me.getViewModel().get('theFi').id)
                            }
                        });
                    });
                },
                null,
                function () {
                    me.getView().unmask();
                });
        } else {
            me.getView().unmask();
            me.getViewModel().get('fiProfileTaskController').setActivateTab(1);
        }
    },

    beforeCellEdit: function (editor, e) {
        return e.record.get('properties')['fina:fiGapCorrectionStatus'] === 'CORRECTED';
    },

    cellEdit: function (editor, e) {
        let me = this;
        e.grid.store.sync({
            callback: function () {
                me.fireEvent('reloadGapsGrid', me.getViewModel().get('theFi')['fina_fiRegistryLastActionId'], ['fiGapView', 'changeGapCard']);
            }
        });
    }

})
;