Ext.define('first.view.repository.personalFiles.PersonalFilesViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.personalFilesViewModel',


    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    },

    formulas: {
        isSelectedRow: {
            get: function (get) {
                return !get('selectedDocument');
            }
        },
        isUserAdministrator: {
            get: function (get) {
                return first.config.Config.conf.properties.currentUser.capabilities.admin;
            }
        },
        isMultipleRowSelected: {
            get: function (get) {
                return get('selectedDocuments') && get('selectedDocuments').length > 1;
            }
        },
        getShareMenuText: {
            get: function (get) {
                let doc = get('selectedDocument');
                if (doc && doc.data && doc.data.properties) {

                    if (doc.data.properties['qshare:sharedId']) {
                        return 'Share Link Settings';
                    }
                    return i18n.share;
                }
                return i18n.share;
            }
        }
    }
});
