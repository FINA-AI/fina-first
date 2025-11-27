Ext.define('first.view.tags.TagsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tags',

    onAddClick: function () {
        var view = this.getView(),
            rec = new first.model.Tag({
                name: '',
            });

        view.store.insert(0, rec);
        view.findPlugin('cellediting').startEdit(rec, 0);
    },

    onEdit: function (editor, e) {
        e.record.commit();
        e.record.save({
            success: function (e) {
                //TODO update Id
            }
        });
    },

    onRemoveClick: function (view, recIndex, cellIndex, item, e, record) {
        record.drop();
        this.getView().getStore().sync();
    },

    onRefreshClick: function (comp, e, eOpts) {
        this.getView().getStore().reload();
    },
});