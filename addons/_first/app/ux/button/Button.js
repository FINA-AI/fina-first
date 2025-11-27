Ext.define('first.ux.button.Button', {
    override: 'Ext.button.Button',
    /**
     * Sets the disabledTooltip for this Button.
     *
     * @param {String/Object} disabledTooltip This may be:
     *
     *   - **String** : A string to be used as innerHTML (html tags are accepted) to show in a disabledTooltip
     *   - **Object** : A configuration object for {@link Ext.tip.QuickTipManager#register}.
     *
     * @return {Ext.button.Button} this
     */
    setDisabledTooltip: function (disabledTooltip, initial) {
        var me = this;

        if (me.rendered) {
            if (!initial || !disabledTooltip) {
                me.clearTip();
            }
            if (disabledTooltip) {
                if (Ext.quickTipsActive && Ext.isObject(disabledTooltip)) {
                    Ext.tip.QuickTipManager.register(Ext.apply({
                            target: me.el.id
                        },
                        disabledTooltip));
                    me.disabledTooltip = disabledTooltip;
                } else {
                    me.el.dom.setAttribute(me.getTipAttr(), disabledTooltip);
                }
            }
        } else {
            me.disabledTooltip = disabledTooltip;
        }
        return me;
    },

    onEnable: function () {
        var me = this,
            href = me.href,
            hrefTarget = me.hrefTarget,
            dom = me.el.dom;

        me.callParent();

        me.removeCls(me._disabledCls);
        dom.setAttribute('tabIndex', me.tabIndex);

        if (href) {
            dom.href = href;
        }
        if (hrefTarget) {
            dom.target = hrefTarget;
        }
        me.setTooltip(me.tooltip, true);
        me.setStyle({
            cursor: 'pointer'
        })
    },

    onDisable: function () {
        var me = this,
            dom = me.el.dom;

        me.callParent();

        me.addCls(me._disabledCls);
        me.removeCls(me.overCls);

        dom.removeAttribute('tabIndex');

        if (me.href) {
            dom.removeAttribute('href');
        }
        if (me.hrefTarget) {
            dom.removeAttribute('target');
        }
        me.setDisabledTooltip(me.disabledTooltip, true)
        me.setStyle({
            cursor: 'default',
            pointerEvents: 'all'
        })
    },

})