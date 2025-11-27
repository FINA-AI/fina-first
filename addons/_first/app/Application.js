Ext.define('first.Application', {
    extend: 'Ext.app.Application',

    name: 'first',

    defaultToken: 'home',

    controllers: [
        'Root@first.controller'
    ],

    stores: [],

    onBeforeLaunch: function () {
        try {
            loadExtI18n();
        } catch (error) {
            // Didn't translate EXT standard interface
        }

        this.callParent();
    },

    launch: function () {
        Ext.MessageBox = Ext.Msg = new Ext.window.MessageBox();

        Ext.tip.QuickTipManager.init();

        //TODO disable states
        // Ext.state.Manager.setProvider(Ext.create('first.util.RemoteStateProvider', {
        //     url: first.config.Config.remoteRestUrl + 'security/state'
        // }));
    }
});
