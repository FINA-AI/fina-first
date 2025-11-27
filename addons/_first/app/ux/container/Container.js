Ext.define('first.ux.container.Container', {
    override: 'Ext.draw.Container',

    requires: [
        'first.config.Config'
    ],

    defaultDownloadServerUrl: `${first.config.Config.remoteRestUrl}ecm/dashboard/download/chart`
});