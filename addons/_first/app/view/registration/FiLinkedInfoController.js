Ext.define('first.view.registration.FiLinkedInfoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiLinkedInfoController',

    requires: [
        'first.config.Config',
        'first.util.WorkflowHelper'
    ],

    onRefreshClick: function () {
        this.loadData();
    },

    afterRender: function () {
        this.loadData();
    },

    loadData: function () {
        let store = this.getView().getStore(),
            theFi = this.getViewModel().get('theFi'),
            fiId = theFi.id,
            fiCode = theFi['fina_fiRegistryCode'];
        this.getView().mask(i18n.pleaseWait);
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/linkedInfo/' + fiId + '/' + fiCode);
        store.proxy.setHeaders({'Accept-Language': '*'});
        store.addFilter({
            property: 'fina:finalStatus',
            operator: '!=',
            value: 'CANCELED'
        }, true);

        let me = this;
        store.load(function () {
            me.getView().unmask();
        });
    },

    onSearchFieldEnterClick: function (textfield, op) {
        let queryValue = textfield.value;
        if (op.getCharCode() === Ext.EventObject.ENTER) {
            if (textfield.value.trim().length > 0) {
                textfield.getTrigger('clear').show();
                textfield.updateLayout();
            }
            this.filterGrid(queryValue);
        }
    },

    filterGrid: function (queryValue) {
        queryValue = queryValue === null ? '' : queryValue;
        let view = this.getView().body.component,
            store = view.getStore();

        store.proxy.setExtraParam("search", queryValue && queryValue.trim().length > 0 ? queryValue : null);
        store.proxy.setHeaders({'Accept-Language': '*'});
        store.load();
    },

    onClear: function (textfield, trigger, op) {
        textfield.setValue('');
        textfield.getTrigger('clear').hide();
        textfield.updateLayout();
        this.filterGrid(null);
    },

    onViewClick: function (view, rowN, colN, cell, event, record) {
        let nodeType = record.get('nodeType').split(":")[1];
        nodeType = nodeType.startsWith("fiComplexStructure") ? 'fiBeneficiary' : nodeType;
        nodeType = nodeType.startsWith("fiAuthorizedPerson") ? 'fiAuthorizedPerson' : nodeType;
        let registryActionId = Ext.Array.contains(first.util.WorkflowHelper.getDataTypeFiRegistries(), record.get('nodeType')) ? record.get('id') : record.get('properties')['fina:fiRegistry'].id;

        switch (nodeType) {
            case 'fiBeneficiary':
                this.fireEvent('navChange', ('fi/' + registryActionId + '/Complex_Structures/' + record.get('id')));
                break;
            case 'fiAuthorizedPerson':
                this.fireEvent('navChange', ('fi/' + registryActionId + '/Authorized_Persons/' + record.get('id')));
                break;
            default:
                if (nodeType.indexOf('fiRegistry') >= 0)
                    this.fireEvent('navChange', ('fi/' + registryActionId));
                break;
        }

    },

    onShowAllPersonsClick: function (btn) {
        let pressed = btn.pressed;
        btn.setText(pressed ? i18n.hideDisabled : i18n.showAll);
        btn.setIconCls(pressed ? 'x-fa fa-eye-slash' : 'x-fa fa-eye');
        let store = this.getView().getStore();
        store.clearFilter(true);
        if (!pressed) {
            store.addFilter({
                property: 'fina:finalStatus',
                operator: '!=',
                value: 'CANCELED'
            }, true);
        }
        store.load();
    },

});
