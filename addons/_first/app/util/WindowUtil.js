Ext.define('WindowUtil', {

    singleton: true,

    width: Ext.getBody().getViewSize().width - 120,
    height: Ext.getBody().getViewSize().height - 120,
    labelWidth: 200,
    itemMargin: '10 120',
    itemResponsiveMarginCls: 'responsive-window-margin',
    setResponsiveHeight: function (window, items = []) {
        let visibleItems = items.filter(i => !i.hidden);
        let height = visibleItems.length * 45 + 100;
        height = height > Ext.getBody().getViewSize().height ?  Ext.getBody().getViewSize().height - 120 : height;
        window.setHeight(height)
        window.center()
    },

});