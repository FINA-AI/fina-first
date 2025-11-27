Ext.define('first.view.registration.correspondence.FiProfileCorrespondenceController', {
    extend: 'first.view.registration.FiProfileDetailsController',
    alias: 'controller.correspondenceControllerEcm',

    init: function () {

    },

    afterRender: function () {
        let store = this.getView().getStore(),
            tabId = this.getViewModel().get('tabId');
        store.proxy.setUrl(first.config.Config.remoteRestUrl + 'ecm/fi/' + tabId + '/details');
        store.load();
    },

    onEditClick: function (view, recIndex, cellIndex, item, e, record) {
        let properties = record.data['properties'],
            data = {};
        Ext.Object.each(properties, function (key, val) {
            if (key.endsWith('Date')) {
                val = new Date(val);
            }

            data[key.replace(':', '_')] = val;
        });

        this.addOrEdit(data, view, record);
    },

    onAddItem: function (component) {
        const type = component.type;
        this.addOrEdit(null, component, null, type);
    },

    addOrEdit: function (model, view, record, type) {
        let window = Ext.create('first.view.registration.correspondence.FiProfileCorrespondenceEditView'),
            store = this.getView().getStore();

        if (!type) {
            type = model['fina_smsType'];
        }

        let typeStr = i18n['TYPE_' + type],
            windowTitle = Ext.String.format(model ? i18n.editCorrespondenceItem : i18n.createCorrespondenceItem, typeStr);

        let windowViewModel = window.getViewModel();

        windowViewModel.set('title', windowTitle);
        windowViewModel.set('store', store);
        windowViewModel.set('isEdit', !!model);
        windowViewModel.set('theFi', this.getViewModel().get('theFi'));
        windowViewModel.set('tabId', this.getViewModel().get('tabId'));
        windowViewModel.set('record', record);
        windowViewModel.set('isRegistryActionEditor', this.getViewModel().get('isRegistryActionEditor'));

        if (!model) {
            model = {};
        }
        model['fina_smsType'] = type;
        windowViewModel.set('model', model);

        window.show();
    },

    onSearch: function (textfield) {
        let store = this.getView().getStore();
        store.getProxy().setExtraParams({'query': textfield.value});
        store.getProxy().setHeaders({'Accept-Language': '*'});
        store.load({page: 1});
    }

});