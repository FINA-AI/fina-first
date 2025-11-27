Ext.define('first.view.new.dashboard.DashboardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.app-dashboard',

    requires:['first.config.Menu'],

    data: {
        fiTypes: []
    },

    formulas: {
        hasConfigReviewPermission: function (get) {
            let permissions = first.config.Config.conf['permissions'];
            return (permissions && Ext.Array.contains(permissions, 'net.fina.first.config.review'));
        },
    }

});
