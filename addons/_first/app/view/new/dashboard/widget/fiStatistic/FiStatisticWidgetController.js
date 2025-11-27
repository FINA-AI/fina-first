Ext.define('first.view.new.dashboard.widget.fiStatistic.FiStatisticWidgetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fiStatisticWidget',


    init: function () {
        this.initFiTypes();
    },

    initFiTypes: function () {
        let me = this;
        let fiTypesBar = this.lookupReference('fiTypesReference');

        Ext.Ajax.request({
            url: first.config.Config.remoteRestUrl + 'ecm/fi/types?start=0&limit=99',
            method: 'GET',
            success: function (response) {
                let data = JSON.parse(response.responseText).list;

                for (let el of data) {

                    let fiTypeButton = Ext.create({
                        xtype: 'checkbox',
                        labelWidth: 40,
                        fiCode: el.code,
                        fieldLabel: i18n[el.code],
                        listeners: {
                            change: 'toggleFiType'
                        }
                    })
                    fiTypesBar.add(fiTypeButton);
                }
            },
        })
    },

    toggleFiType: function (checkbox, checked) {
        let fiTypes = this.getViewModel().get('fiTypes');
        if (checked) {
            fiTypes.push(checkbox.fiCode)
        } else {
            fiTypes.splice(fiTypes.indexOf(checkbox.fiCode), 1)
        }
        this.fireEvent('filterFiTypes', fiTypes);
    },

});