/**
 * Created by oto on 6/4/19.
 */
Ext.define('first.view.repository.fileUpload.FileUploadWindow', {
    extend: 'Ext.window.Window',

    xtype: 'fileuploadwindow',

    requires: [
        'Ext.layout.container.Fit',
        'first.view.repository.fileUpload.FileUploadController',
        'first.view.repository.fileUpload.FileUploadView'
    ],

    modal: true,

    width: 650,
    height: 400,
    title: i18n.uploadFilesTitle,
    scrollable: true,
    constrain: true,
    maximizable: true,
    closable: true,


    controller: 'fileUploadController',

    layout: 'fit',

    viewModel: {},

    items: [
        {
            xtype: 'fileupload'
        }
    ]

});