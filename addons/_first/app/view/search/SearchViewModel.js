Ext.define('first.view.search.SearchViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.searchViewModel',


    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    },

    formulas: {
        isSelectedNode: {
            get: function (get) {
                return !get('selectedNode');
            }
        },
        hidePropertyPanel: {
            get: function (get) {
                return (!get('selectedNode') || !get('isInfoEnabled'));
            }
        }
    }
});
