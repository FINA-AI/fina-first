Ext.define('first.view.fi.request.FiDocumentRequestEditController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiDocumentRequestEdit',

    requires: [
        'first.config.Config',
        'first.util.ErrorHandlerUtil'
    ],

    init: function () {
        this.clearFiComboFilters();
    },

    onCancelBtnClick: function () {
        this.getView().close();
    },

    onSaveBtnClick: function (component, e) {
        let fiDocumentRequest = this.getViewModel().get('fiDocumentRequest'),
            isEdit = this.getViewModel().get('isEdit'),
            store = this.getViewModel().get('store'),
            me = this;

        if (isEdit) {
            if (store.getModifiedRecords().length <= 0) {
                me.getView().destroy();
            } else {
                me.getView().mask(i18n.pleaseWait);
                store.sync({
                    success: function (batch, opts) {
                        me.getView().close();
                    },
                    failure: function (batch, opts) {
                        me.getView().unmask();
                        first.util.ErrorHandlerUtil.showErrorWindow(null, i18n.error, batch);
                        store.rejectChanges();
                    }
                });
            }
        } else {
            let assigneeFiCodes = this.getViewModel().get('checkedFiCodes'),
                data = {
                    name: fiDocumentRequest.get('name'),
                    description: fiDocumentRequest.get('description'),
                    dueDate: fiDocumentRequest.get('dueDate') ? fiDocumentRequest.get('dueDate').getTime() : null,
                    submitted: fiDocumentRequest.get('submitted'),
                    submissionDate: fiDocumentRequest.get('submissionDate') ? fiDocumentRequest.get('submissionDate').getTime() : null,
                    comment: fiDocumentRequest.get('comment'),
                    fiObjectTypes: fiDocumentRequest.get('fiObjectTypes')
                },
                fd = new FormData();

            for (let i in data) {
                if (![undefined, null].includes(data[i])) {
                    fd.append(i, data[i]);
                }
            }

            assigneeFiCodes.forEach((item) => {
                fd.append("fiIds", item.fiId);
                fd.append("fiCodes", item.fiCode);
            });

            fd.append('autoRename', "true");

            let fileStore = this.getView().down('grid').getStore();
            for (let i = 0; i < fileStore.data.items.length; i++) {
                let record = fileStore.getData().getAt(i);
                if (record.get('status') === 'READY' || record.get('status') === 'ERROR') {
                    fd.append('fileNames', record.get('name'));
                    fd.append('filedata', record.get('file'));
                }
            }

            me.getView().mask(i18n.pleaseWait);
            Ext.Ajax.request({
                method: 'POST',
                url: first.config.Config.remoteRestUrl + "ecm/fi/documentRequest",
                rawData: fd,
                headers: {'Content-Type': null},
                timeout: 1800000,
                success: function (response) {
                    store.load();
                    me.getView().close();
                },
                failure: function (response) {
                    me.getView().unmask();
                    first.util.ErrorHandlerUtil.showErrorWindow(response, i18n.error, null);
                }
            });
        }
    },

    beforeClose: function (win) {
        this.getViewModel().get('store').rejectChanges();
    },

    afterFiComboRender: function (cmp) {
        var me = this;
        cmp.getEl().select('input').set({'disabled': true});
        cmp.getEl().select('input').elements[0].style.background = '#CFD2D1';
        cmp.getEl().select('input').elements[0].style.cursor = 'pointer';
        var toolTip = Ext.create('Ext.tip.ToolTip', {
            target: cmp.id,
            maxHeight: 400,
            autoScroll: true,
            autoHide: false,
            bind: {
                html: '{selectedFilterFiNames}'
            },
            listeners: {
                beforeshow: function () {
                    if (me.getViewModel().get('selectedFilterFiNames').length === 0) {
                        return false;
                    } else {
                        this.setHtml(me.getViewModel().get('selectedFilterFiNames'));
                    }
                },
                render: function (w) {
                    w.getEl().on({
                        mouseenter: function () {
                            toolTip.show();
                        },
                        mouseleave: function () {
                            toolTip.hide();
                        },
                        scope: w
                    });
                }
            }
        });
    },

    onFiPickerCheckChange: function (node, checked, e) {
        var me = this;
        if (node.get('leaf')) {
            if (!checked) {
                me.getViewModel().set("isLeafUnselected", true);
            }
            me.collectFis(checked, node);
            me.addDataToFiComboBox();
        } else {
            if (!me.getViewModel().get("isLeafUnselected")) {
                node.expand(false, function () {
                    var checked = node.get('checked');

                    node.eachChild(function (child) {
                        child.set('checked', checked);
                        me.collectFis(checked, child);
                    });

                    me.addDataToFiComboBox();

                });
            }
            me.getViewModel().set("isLeafUnselected", false);
        }
    },

    collectFis: function (checked, node) {
        var me = this;
        var checkedFis = me.getViewModel().get('checkedFis');
        var checkedFiCodes = me.getViewModel().get('checkedFiCodes');

        var fiNames = me.getViewModel().get('selectedFilterFiNames');

        if (checked) {
            checkedFis.push(node.data);
            checkedFiCodes.push({fiCode: node.data.code, fiId: node.data.id});
            fiNames.push(node.data.name);
        } else {
            checkedFis.splice(checkedFis.indexOf(node.data, 1));
            checkedFiCodes.splice(checkedFiCodes.map(d => d.fiCode).indexOf(node.data.code, 1));
            fiNames.splice(fiNames.indexOf(node.data.name), 1);
        }
    },

    addDataToFiComboBox: function () {
        var me = this;
        var fiComboField = this.lookupReference("fiPickerTagField");
        var checkedFis = me.getViewModel().get('checkedFis');
        var checkedFiCodes = me.getViewModel().get('checkedFiCodes');

        fiComboField.getStore().setData(checkedFis);
        fiComboField.setValue(checkedFiCodes.map(d => d.fiCode));
    },

    clearFiComboFilters: function () {
        this.getViewModel().set('filter.inspection.fiId', []);
        this.getViewModel().set('checkedFis', []);
        this.getViewModel().set('checkedFiCodes', []);
        this.getViewModel().set('selectedFilterFiNames', []);
    },

    onSearchFiComboSelect: function (combo, model) {
        var me = this;
        var tree = me.lookupReference('fiTreePicker');

        var fiTypeNode = tree.getStore().findNode('code', model.get('fiTypeCode'));
        var path = '' + fiTypeNode.get('id') + '/' + model.get('id');
        tree.expandPath(path, {
            select: true,
            focus: true,
            callback: function (success, record, node) {
                record.set('checked', true);
                tree.fireEvent('checkchange', record, true);
            }
        });
    },

    afterFiObjectsRender: function () {
        let fiObjectsGrid = this.lookupReference("fiDocumentRequestObjects").getView();
        let vm = this.getViewModel();
        let store = fiObjectsGrid.getStore();

        store.proxy.url = first.config.Config.remoteRestUrl + 'ecm/fi/documentRequest/' + this.getViewModel().get('fiDocumentRequest').id + '/objects';
        vm.set("isFiObjectGridHidden", !vm.get("isEdit"));
        if (!vm.get("isEdit")) {
            return
        }

        store.load({
            callback: function () {
                if (store.getCount() === 0) {
                    vm.set("isFiObjectGridHidden", true)
                }
            }
        });
    },

    rowNumberRenderer: function (value, cell, record) {
        let groups = this.lookupReference("fiDocumentRequestObjects").getStore().getGroups();
        let output = 0;
        let flag = true;
        let ri = cell.recordIndex + 1;

        groups.each(function (group) {
            ri = ri - group.length;
            if (ri === 0 && flag) {
                flag = false;
                output = group.length;
            } else if (ri < 0 && flag) {
                flag = false;
                output = group.length + ri;
            }
        });

        return output;
    },

    onFiObjectApprove: function (view, recIndex, cellIndex, item, e, record) {
        this.updateFiObject(record.get('id'), {"fina:fiDocumentRequestFiObjectIsPresented": true});
    },

    onFiObjectErase: function (view, recIndex, cellIndex, item, e, record) {
        this.updateFiObject(record.get('id'), {
            "fina:fiDocumentRequestFiObjectIsPresented": false,
            "fina:fiDocumentRequestFiObjectComment": null
        });
    },

    onFiObjectsEdit: function (editor, context, eOpts) {
        let record = context.record;
        this.updateFiObject(record.get('id'), {"fina:fiDocumentRequestFiObjectComment": record.get('fina_fiDocumentRequestFiObjectComment')});
    },

    updateFiObject: function (id, properties) {
        let store = this.lookupReference("fiDocumentRequestObjects").getView().getStore();

        Ext.Ajax.request({
            method: 'PUT',
            url: first.config.Config.remoteRestUrl + 'ecm/node/' + id,
            jsonData: {
                id: id,
                properties: properties
            },
            callback: function () {
                store.load();
            }
        });
    },

    onTemplatesViewRender: function (field) {
        let dockedItems = field.getDockedItems();
        for (let item of dockedItems) {
            if (item.xtype === 'toolbar') {
                item.items.items[0].button.setText(i18n.fiDocumentRequestDocumentTbarUploadTemplateTooltip);
            }
        }
    },

    onFilesChoose: function (fileField, value) {
        let files = fileField.fileInputEl.dom.files;
        let store = this.getView().down('grid').getStore();
        Ext.Array.forEach(Ext.Array.from(files), function (file) {
            store.add({
                file: file,
                name: file.name,
                size: file.size,
                status: 'READY'
            });
        });
    }
});
