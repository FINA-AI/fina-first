Ext.define('first.view.registration.FiRegistrationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.fiRegistrationEcm',

    requires: [
        'first.config.Config',
        'first.store.fi.FiTypeStore',
        'first.util.WorkflowHelper',
        'first.view.registration.FiRegistrationValidator',
        'Ext.menu.Menu',
        'first.view.registration.FiRegistryListItemContextMenuController'
    ],

    listen: {
        controller: {
            '*': {
                reloadFiRegistryStore: 'reloadStore',
                filterFiRegistryStore: 'filterFiRegistryStore',
                searchFiRegistryStore: 'searchFiRegistryStore',
            }
        }
    },

    init: function () {
        let registryListItem = {
            id: 'actionListEcmId',
            reference: 'actionListEcmGrid',
            collapsible: true,
            collapseDirection: 'left',
            titleCollapse: false,
            hideCollapseTool: true,
            flex: 1,
            stateful: true,
            stateId: 'first-fiRegistrationView-fiListGridStateId'
        }
        registryListItem['xtype'] = this.getViewModel().get('displaySimplifiedRegistry') ? 'fiSimplifiedListEcm' : 'fiGeneralListEcm';
        let fiRegistryGrid = this.lookupReference('fiRegistryGrid');
        if (fiRegistryGrid) {
            fiRegistryGrid.add(registryListItem);
        }

        if (first.config.Config.conf.permissions.indexOf('net.fina.first.registry.import') < 0) {
            this.getViewModel().set("disableImport", true);
        } else {
            this.getViewModel().set("disableImport", false);
        }
    },

    reloadStore: function () {
        try {
            Ext.getCmp('actionListEcmId').getStore().reload();
        } catch (e) {
            console.log(e);
        }
    },

    onConfirmItemSelect: function (choice) {
        if (choice === 'yes') {
            //
        }
    },

    onFiRegistrySelected: function (el, record) {
        this.getViewModel().set('selectedFiRegistry', record);
    },

    statusRenderer: function (value, cell, record) {
        cell.tdAttr = 'data-qtip="' + i18n.fiLastActionStatus + '"';
        let label = i18n[value];
        switch (value) {
            case 'ACCEPTED':
                return '<div style="font-weight: bold; color: green">' + label + '</div>';
            case 'DECLINED':
                return '<div style="font-weight: bold; color: red">' + label + '</div>';
            case 'CANCELED':
                return '<div style="font-weight: bold; color: red">' + label + '</div>';
            case 'LIQUIDATION':
                return '<div style="font-weight: bold; color: grey">' + label + '</div>';
            case 'GAP':
                return '<div style="font-weight: bold; color: red">' + label + '</div>';
        }

        if (value !== 'GAP') {
            let redactingStatus;
            switch (record.get('redactingStatus')) {
                case 'DECLINED':
                    redactingStatus = " " + i18n.GAP;
                    break;
                case 'ACCEPTED':
                    redactingStatus = "";
                    break;
                default:
                    redactingStatus = "";
                    break;
            }


            switch (record.get('controlStatus')) {
                case 'REVIEW':
                    return '<div style="font-weight: bold; color: darkgoldenrod">' + i18n[record.get('controlStatus')] + '</div>';
                case 'ACCEPTED':
                    let acceptedColor = redactingStatus ? 'darkgoldenrod' : 'darkgreen';
                    return '<div style="font-weight: bold; color: ' + acceptedColor + '">' + i18n.acceptedByController + redactingStatus + '</div>';
                case 'DECLINED':
                    let declinedColor = redactingStatus ? 'darkgoldenrod' : 'darkred';
                    return '<div style="font-weight: bold; color: ' + declinedColor + '">' + i18n.declinedByController + redactingStatus + '</div>';
            }
        }
        return '<div style="font-weight: bold; color: blue">' + label + '</div>';
    },

    actionTypeRenderer: function (value, meta) {
        let label = i18n[value];
        meta.tdAttr = 'data-qtip="' + i18n.fiLastAction + '"';
        switch (value) {
            case 'REGISTRATION':
                return '<div style="font-weight: bold; color: green">' + label + '</div>';
            case 'CHANGE':
            case 'BRANCHES_CHANGE':
            case 'BRANCHES_EDIT':
            case 'DOCUMENT_WITHDRAWAL':
                return '<div style="font-weight: bold; color: blue">' + label + '</div>';
            case 'CANCELLATION':
                return '<div style="font-weight: bold; color: red">' + label + '</div>';
        }
    },

    controlStatusRenderer: function (value) {
        let label = i18n[value];
        switch (value) {
            case 'ACCEPTED':
                return '<div style="font-weight: bold; color: green">' + label + '</div>';
            case 'REVIEW':
                return '<div style="font-weight: bold; color: blue">' + label + '</div>';
            case 'DECLINED':
                return '<div style="font-weight: bold; color: red">' + label + '</div>';
        }
    },

    onFiClick: function (view, rowIdx, colIdx, item, e, rec) {
        this.fireEvent('navChange', 'fi/' + rec.id);
    },

    onSearchFieldEnterClick: function (textfield, op) {
        let queryValue = textfield.value;
        if (op.getCharCode() === Ext.EventObject.ENTER && textfield.isValid()) {
            if (textfield.value.trim().length > 0) {
                textfield.getTrigger('clear').show();
                textfield.updateLayout();
            }
            this.filterGrid(queryValue);
        }
    },

    filterGrid: function (queryValue) {
        queryValue = queryValue === null ? '' : queryValue;
        if (queryValue.trim().length === 0 || queryValue.trim().length >= 3) {
            let view = this.lookupReference('actionListEcmGrid'),
                store = view.getStore(),
                newState = Ext.apply({}, view.getState());

            newState.extraParams.filter = {};
            view.applyState(newState);
            store.proxy.setExtraParam("query", queryValue && queryValue.trim().length > 0 ? queryValue : null);
            store.proxy.setHeaders({'Accept-Language': '*'});
            store.load({page: 1});

            view.saveState();
        }
    },

    onViewProcessClick: function (view, rowIdx, colIdx, item, e, rec) {
        let lastProcessId = rec.get('lastProcessId');
        if (lastProcessId) {
            this.fireEvent('navChange', 'wfDetails/' + lastProcessId);
        }
    },

    onAfterFiTypesButtonRender: function (component) {
        let menu = component.getMenu();
        if (menu && menu.items && menu.items.items) {
            Ext.each(menu.items.items, function (item) {
                menu.remove(item);
            });
        }

        let fiTypeStore = Ext.create('first.store.fi.FiTypeStore', {
            autoLoad: false
        });
        component.setDisabledTooltip(i18n.registrationDisabledTooltip)

        fiTypeStore.load({
            callback: function (records, operation, success) {
                Ext.each(records, function (record) {
                    let menuItem = {
                        text: record.get('code') + ' - ' + record.get('description'),
                        tooltip: record.get('code') + ' - ' + record.get('description'),
                        fiTypeId: record.get('id'),
                        workflowKey: record.get('registrationWorkflowKey'),
                        handler: 'fiRegistrationHandler',
                        fiTypeCode: record.get('code')
                    };
                    menu.add(menuItem);
                });
                component.setDisabled(true);
            }
        })
    },

    fiRegistrationHandler: function (item) {
        let me = this,
            view = this.lookupReference('actionListEcmGrid'),
            store = view.getStore();

        if (item && item.workflowKey) {
            let fiIdentity = this.lookupReference('fiIdentityField').getValue(),
                workflowParams = 'fwf_fiStartTaskBaseFiIdentity__' + fiIdentity;
            if (fiIdentity.length === 11) {
                workflowParams += ',fwf_fiRegLegalFormType__individualEntrepreneur';
            }

            if (store.getData().items.filter(el => el.data.licenseStatus === 'ACTIVE').length === 1) {
                let record = store.getAt(0);
                let fiRegistrationNumber = record.get('id'),
                    fiCode = record.get('code'),
                    name = record.get('name');

                let legalFormType = record.get('legalFormType');
                legalFormType = i18n[legalFormType] ? i18n[legalFormType] : '';
                let fiName = legalFormType + ' ' + name,
                    warningDisplayMsg = fiCode + ' (' + fiName + ')';

                Ext.Msg.confirm(i18n.warning, Ext.String.format(i18n.fiCopyMessageWarning, warningDisplayMsg), function (button) {
                    if (button === 'yes') {
                        me.disableRegistrationMenu();
                        first.util.WorkflowHelper
                            .createWorkflowViewAsWindow(item.workflowKey, workflowParams,
                                true, fiRegistrationNumber);
                    }
                });
            } else {
                me.disableRegistrationMenu();
                first.util.WorkflowHelper
                    .createWorkflowViewAsWindow(item.workflowKey, workflowParams, true);
            }
        } else {
            Ext.toast(i18n.fiTypeNotAssignedWorkflow, i18n.error);
        }
    },

    onExportButtonClick: function (item) {
        let locale = first.config.Config.getLanguageCode(),
            filter = this.getViewModel().get('filter');
        let filterStr = JSON.stringify(filter);
        let url = first.config.Config.remoteRestUrl + 'ecm/fi/export/' + locale;
        if (filter && !Ext.Object.isEmpty(filter) && this.isNonEmptyFilter(filter)) {
            url += '?filter=' + encodeURI(filterStr);
        }
        if (item.nodeId) {
            let queryParam = '{0}templateId=' + item.nodeId + '&fileName=' + item.fileName;
            url = url.indexOf('?') > 0 ? (url + Ext.String.format(queryParam, '&')) : (url + Ext.String.format(queryParam, '?'))
        }
        window.open(url, '_blank');
    },

    isNonEmptyFilter: function (filterObj) {
        let res = false;
        Ext.each(Object.keys(filterObj), function (key) {
            if (filterObj[key]) {
                res = true;
            }
        });
        return res;
    },

    showHideFilter: function (textfield, trigger, op) {
        let panel = this.lookupReference('fiRegistrationSearchFilterRef');
        if (panel) {
            panel.destroy()
        } else {
            panel = Ext.widget({
                reference: 'fiRegistrationSearchFilterRef',
                xtype: "fiRegistrationSearchFilter",
                floating: true,
                width: textfield.lastBox.width,
                x: textfield.lastBox.x,
                y: textfield.lastBox.y + 25,

                stateful: true,
                stateId: 'first-fiRegistrationSearchFilterStateId',

                viewModel: {
                    data: {}
                }
            });
            textfield.up().add(panel);
            panel.show()
        }
    },

    onSearchFieldResize: function (obj) {
        let panel = this.lookupReference('fiRegistrationSearchFilterRef');
        if (panel) {
            panel.setWidth(obj.lastBox.width)
        }
    },

    onTypeChange: function (e, newValue, oldValue) {
        let view = this.lookupReference('actionListEcmGrid'),
            store = view.getStore(),
            filter = store.proxy.extraParams['filter'] && !Ext.Object.isEmpty(store.proxy.extraParams['filter']) ? JSON.parse(store.proxy.extraParams['filter']) : {};

        if (!Ext.Object.isEmpty(newValue)) {
            filter['types'] = newValue;
        } else {
            delete filter['types'];
        }
        filter = JSON.stringify(filter);
        if (filter !== '{}') {
            store.proxy.setExtraParam("filter", filter);
        } else {
            delete store.proxy.extraParams['filter'];
        }

        store.proxy.setHeaders({'Accept-Language': '*'});
        store.load();
        view.saveState();
    },

    onIdentityFieldEnterClick: function (textfield, op) {
        let me = this,
            registrationMenu = me.lookupReference('registerNewFiMenuComponent');

        if (op.getCharCode() === Ext.EventObject.ENTER) {
            let queryValue = textfield.value;

            if (queryValue.trim().length === 0 || (queryValue.trim().length >= textfield.minLength && queryValue.trim().length <= textfield.maxLength)) {

                let view = this.lookupReference('actionListEcmGrid'),
                    store = view.getStore(),
                    filter = store.proxy.extraParams && store.proxy.extraParams['filter'] ?
                        (
                            Ext.Object.isEmpty(store.proxy.extraParams['filter']) ?
                                {} :
                                JSON.parse(store.proxy.extraParams['filter'])
                        ) :
                        {};

                if (queryValue.trim().length !== 0) {
                    filter['identity'] = queryValue;
                } else {
                    delete filter['identity'];
                }
                filter = JSON.stringify(filter);
                if (filter !== '{}') {
                    store.proxy.setExtraParam("filter", filter);
                } else {
                    delete store.proxy.extraParams['filter'];
                }

                store.proxy.setHeaders({'Accept-Language': '*'});
                store.load({
                    callback: function (records, operation, success) {
                        let menu = me.lookupReference('registerNewFiMenu');
                        first.view.registration.FiRegistrationValidator.bindFiRegistrationMenuItems(records, menu.items.items);
                    }
                });
                view.saveState();

                registrationMenu.setDisabled(false);
            }

            if (queryValue.trim().length === 0 || (queryValue.trim().length !== 9 && queryValue.trim().length !== 11)) {
                registrationMenu.setDisabled(true);
            }

        } else {
            registrationMenu.setDisabled(true);
        }
    },

    onAfterExportButtonRender: function (component) {
        let menu = component.getMenu(),
            me = this;
        if (menu && menu.items && menu.items.items) {
            Ext.each(menu.items.items, function (item) {
                menu.remove(item);
            });
        }

        Ext.Ajax.request({
            method: 'GET',
            url: first.config.Config.remoteRestUrl + "ecm/fi/report/templates",
            success: function (response) {
                let data = JSON.parse(response.responseText);
                me.renderExportMenuData(component, data);
            }
        });
    },

    renderExportMenuData: function (component, data) {
        let menu = component.getMenu();

        menu.add({
            text: i18n.exportRegistry,
            tooltip: i18n.exportRegistry,
            handler: 'onExportButtonClick'
        });


        Ext.each(data, function (record) {
            let fileName = record['name'];
            let text = fileName.substring(0, fileName.lastIndexOf('.'));

            let menuItem = {
                text: text,
                tooltip: text,
                fileName: fileName,
                nodeId: record['id'],
                handler: 'onExportButtonClick'
            };
            menu.add(menuItem);
        });
        component.setDisabled(false)
    },

    onImportButtonClick: function () {
        let window = Ext.create('Ext.window.Window', {
            reference: 'fileImportWindow',
            title: i18n.importFiles,
            iconCls: 'x-fa fa-cloud-upload-alt',
            controller: 'fiRegistrationEcm',
            layout: 'fit',
            height: 150,
            width: 350,
            modal: true,
            items: [{
                xtype: 'form',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                bodyPadding: '10 10 0',
                reference: 'importForm',
                items: [{
                    flex: 1,
                    xtype: 'filefield',
                    fieldLabel: Ext.String.format(i18n.selectFileOfType, 'XLSX'),
                }]
            }],

            buttons: [{
                xtype: 'button',
                text: i18n.uploadAndImport,
                handler: 'uploadAndImport'
            }]
        });
        window.show();
    },

    uploadAndImport: function (a, b, c) {
        const importFormComponent = this.lookupReference('importForm'),
            form = importFormComponent.getForm();

        if (form.isValid()) {
            form.submit({
                method: 'POST',
                url: first.config.Config.remoteRestUrl + 'ecm/fi/import',
                waitMsg: i18n.uploadingFile,
                success: function (fp, o) {
                    let tpl = new Ext.XTemplate(
                        i18n.fileProcessedOnServer + '<br />',
                        i18n.fileProcessedName + ': {fileName}<br />',
                        i18n.fileProcessedSize + ': {fileSize:fileSize}'
                    );

                    importFormComponent.up('window').close();
                    Ext.Msg.alert(i18n.fileProcessedSuccess, tpl.apply(o.result));
                },
                failure: function (fp, o) {
                    importFormComponent.up('window').close();
                    Ext.Msg.alert(i18n.fileProcessedWithError, i18n.fileProcessedWithError);
                }
            });
        }
    },

    filterFiRegistryStore: function (filter) {
        let me = this;
        this.filterStore(function (store) {
            me.getViewModel().set('filter', filter);
            filter = JSON.stringify(filter);

            if (filter) {
                store.proxy.setExtraParams({filter: filter});
            } else {
                delete store.proxy.extraParams['filter'];
            }
        })
    },

    searchFiRegistryStore: function (query) {
        let me = this;
        me.getViewModel().set('query', query);

        this.filterStore(function (store) {
            if (query != null) {
                store.proxy.setExtraParams({query: query});
            } else {
                delete store.proxy.extraParams['query'];
            }
        })
    },

    filterStore: function (fn) {
        if (fn) {
            let grid = Ext.getCmp('actionListEcmId');
            if (grid) {
                grid.mask(i18n.pleaseWait);
                let store = grid.getStore();

                fn(store);
                store.proxy.setHeaders({'Accept-Language': '*',});
                store.load(function (records) {
                    grid.unmask();
                });
            }
        }
    },

    afterFiRegistryGridRender: function () {
        let filter = this.getViewModel().get('filter');
        let query = this.getViewModel().get('query');

        if (query != null) {
            this.searchFiRegistryStore(query);
        } else if (filter && Object.keys(filter).length > 0) {
            this.filterFiRegistryStore(filter);
        } else {
            this.reloadStore();
        }
    },

    disableRegistrationMenu: function () {
        let registrationMenu = this.lookupReference('registerNewFiMenuComponent');
        registrationMenu.setDisabled(true);
    },

    /**
     * @param {Ext.view.View} component
     * @param {Ext.data.Model} record
     * @param {HTMLElement} item
     * @param {Number} index
     * @param {Ext.event.Event} e
     */
    onOpenItemContextMenu: function (component, record, item, index, e) {
        e.preventDefault();
        let isSuperAdmin = first.config.Config.conf.properties.currentUser.superAdmin,
            isActiveTask = ['IN_PROGRESS', 'GAP', 'LIQUIDATION'].includes(record.get('status'));

        if (isSuperAdmin && isActiveTask) {
            this.getContextMenu(record).showAt(e.getXY());
        }
    },

    getContextMenu(record) {
        let me = this;
        return Ext.create('Ext.menu.Menu', {
            controller: 'fiRegistryListItemContextMenuController',
            viewModel: me.getViewModel(),
            record: record,
            items: [{
                text: '<span style="margin: 7px; text-align: center;">' + i18n.changeTaskAssignee + '</span>',
                handler: 'onChangeTaskAssignee',
                iconCls: 'x-fa fa-users-cog'
            }]
        });
    }

});
