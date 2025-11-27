Ext.define('first.view.registration.FiProfileQuestionnaireController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.actionQuestionnaireControllerEcm',

    requires: [
        'Ext.util.Format',
        'first.config.Config'
    ],

    listen: {
        controller: {
            '*': {
                reloadQuestionnaireGrid: 'reloadQuestionnaireGrid',
            }
        }
    },

    init: function () {
        let store = this.getView().getStore(),
            itemId = this.getViewModel().get('itemId'),
            me = this,
            view = this.getView().getView();

        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/' + itemId + '/questionnaires');
        store.on({
            'load': function (store, records, success) {
                Ext.each(records, function (rec) {
                    me.validateAction(rec);
                    me.expandQuestionnaire(rec, view)
                })
            }
        });
        store.load();
    },

    expandQuestionnaire: function (rec, view) {
        let questionnaireGroup = rec.get('questionnaireTypeGroup'),
            questionnaireGroups = ['1_QUESTIONNAIRE_TYPE_MAIN', '2_QUESTIONNAIRE_TYPE_EXTRA'];

        if (questionnaireGroups.includes(questionnaireGroup) || rec.get('status') === 'OK' || rec.get('status') === 'NO') {
            view.findFeature('grouping').expand(rec);
        }
    },

    onApprove: function (view, recIndex, cellIndex, item, e, record) {
        record.set('status', 'OK');
        this.validateAction(record);

        let reloadStore = (record.get('questionnaireParentId') != null);
        this.getView().getStore().sync(this.getStoreSyncCallback(reloadStore));
    },

    onDecline: function (view, recIndex, cellIndex, item, e, record) {
        record.set('status', 'NO');
        this.getViewModel().set('selectedQuestionnaire', record);
        this.getView().findPlugin('cellediting').startEdit(record, cellIndex);
        this.validateAction(record);

        let reloadStore = (record.get('questionnaireParentId') != null);
        this.getView().getStore().sync(this.getStoreSyncCallback(reloadStore));
    },

    onErase: function (view, recIndex, cellIndex, item, e, record) {
        record.set('note', '');
        record.set('status', 'NONE');
        this.validateAction(record);

        let reloadStore = (record.get('questionnaireParentId') != null);
        this.getView().getStore().sync(this.getStoreSyncCallback(reloadStore));
    },

    onBeforeEdit: function (editor, context, eOpts) {
        if (context.record.get('subTypeQuestionnaire') || (context.record.get("predefined") && context.colIdx < 2) || !this.getViewModel().get('editMode')) {
            return false;
        }
    },

    onEdit: function (editor, e) {
        this.getView().getStore().sync(this.getStoreSyncCallback());
    },

    onCancelEdit: function (editor, e) {
        this.getView().getStore().rejectChanges();
    },

    getStoreSyncCallback: function (reloadFiProfileQuestionnaireStore) {
        let me = this;
        return {
            success: function () {
                me.fireEvent('reloadFiRegistryStore');
                me.fireEvent('validateFiRegistryCall', me.getViewModel().get('theFi').id);

                if (reloadFiProfileQuestionnaireStore) {
                    me.getView().getStore().load();
                }
            }
        }
    },

    renderQuestion: function (value, cell, record) {
        let encodedValue = Ext.util.Format.htmlEncode(value);
        if (record.get('questionnaireParentId')) {
            cell.style = 'padding-left: 40px;';
        }
        let color;
        switch (record.get('status')) {
            case 'OK':
                color = "#73b51e";
                break;
            case 'NO':
                color = '#cf4c35';
                break;
        }
        let isObligatory = record.data.obligatory;
        return "<span data-qtip='" + encodedValue + "'"
            + (color ? " style='color:" + color + "'" : "")
            + ">" + (isObligatory ? "* " : "") + encodedValue + "</span>";
    },

    renderNote: function (value, cell, record) {
        if (value) {
            let encodedValue = Ext.util.Format.htmlEncode(value);
            return "<span data-qtip='" + encodedValue + "'>" + encodedValue + "</span>";
        }
        return null;
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.getView().getStore().reload();
    },

    onAddClick: function (comp, e, eOpts) {
        let store = this.getView().getStore(),
            view = this.getView().getView(),
            me = this;

        let item = store.add({
            questionnaireTypeGroup: '2_QUESTIONNAIRE_TYPE_EXTRA',
            predefined: false,
            subTypeQuestionnaire: false
        });

        Ext.each(store.data.items, (rec) => {
            me.expandQuestionnaire(rec, view);
        });

        this.getView().findPlugin('cellediting').startEditByPosition({
            row: store.indexOfId(item[0].id),
            column: 1
        });
    },

    onDeleteClick: function (comp, e, Opts) {
        let record = this.getViewModel().get('selectedQuestionnaire');
        this.getView().getStore().remove(record);
        this.getView().getStore().sync(this.getStoreSyncCallback());
    },

    actionColumnIsDisabled: function (view, rowIndex, colIndex, item, record) {
        let disabled = (record.get('subTypeQuestionnaire') || (record.get('questionnaireParentId') && view.store.findRecord('id', record.get('questionnaireParentId')).get('status') === 'NONE') || record.get('disableAction'));
        return !view.grid.getViewModel().get('editMode') ? true : disabled;
    },

    validateAction: function (record) {
        let store = this.getView().getStore();
        let checkedQuestion = [];
        let unCheckedQuestion = [];
        let checkSize = 0;

        if (record.get('questionnaireGroupName')) {

            store.each(function (item, idx) {
                if (item.get('questionnaireGroupName') === record.get('questionnaireGroupName')) {
                    if (item.get('status') !== 'NONE') {
                        checkedQuestion.push(item);
                    } else {
                        unCheckedQuestion.push(item);
                    }
                }
            });

            checkSize = record.get('checkSize');

        } else if (record.get('questionnaireParentId')) {
            let parentRecord = store.findRecord('questionnaireParentId', record.get('questionnaireParentId'));
            checkSize = parentRecord.get('checkSize');

            store.each(function (item, idx) {
                if (item.get('questionnaireParentId') === record.get('questionnaireParentId')) {
                    if (item.get('status') !== 'NONE') {
                        checkedQuestion.push(item);
                    } else {
                        unCheckedQuestion.push(item);
                    }
                }
            });

        }

        this.updateGridData(record, checkedQuestion, unCheckedQuestion, checkSize);
    },

    updateGridData: function (record, checkedQuestion, unCheckedQuestion, checkSize) {

        if (checkSize !== 0) {

            Ext.each(unCheckedQuestion, function (item) {
                item.set({'disableAction': checkedQuestion.length === checkSize}, {
                    dirty: false
                });
            });
        }

    },

    reloadQuestionnaireGrid: function (fiRegistryId) {
        let currentFiRegistryId = this.getViewModel().get('theFi').id;
        if (currentFiRegistryId === fiRegistryId) {
            this.getView().getView().features[0].startCollapsed = true;
            this.getView().getStore().load();
        }
    },

    exportQuestionnaire: function () {
        this.fireEvent('exportReport', 'exportQuestionnaire', this.getViewModel().get('theFi')['id']);
    }

});