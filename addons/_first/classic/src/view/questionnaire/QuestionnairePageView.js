Ext.define('first.view.questionnaire.QuestionnairePageView', {
    extend: 'Ext.panel.Panel',

    xtype: 'questionnaire',

    requires: [
        'Ext.layout.container.Fit',
        'Ext.tab.Panel',
        'Ext.util.History',
        'first.view.fi.FiTypeView',
        'first.view.licensetype.LicenseTypesView',
        'first.view.property.PropertyView',
        'first.view.questionnaire.QuestionnaireGroupView',
        'first.view.questionnaire.QuestionnaireManagementView',
        'first.view.questionnaire.QuestionnaireView'
    ],

    title: i18n.menuQuestionnaireManagement,

    tbar: {
        cls: 'firstFiRegistryTbar',
        items: [{
            handler: function () {
                Ext.History.back();
            },
            iconCls: 'x-fa fa-arrow-left',
            cls: 'firstSystemButtons'
        }, {
            handler: function () {
                Ext.History.forward();
            },
            iconCls: 'x-fa fa-arrow-right',
            cls: 'firstSystemButtons'
        }],
        hidden: true,
        bind: {
            hidden: '{nonClosableViewId ===  "questionnaire"}'
        }
    },

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'tabpanel',
        defaults: {
            layout: 'fit'
        },
        hidden: true,
        bind: {
            hidden: '{!hasConfigReviewPermission}'
        },
        items: [{
            title: i18n.questionnairePageQuestionnaire,
            xtype: 'questionnaireView'
        }, {
            title: i18n.questionnairePageQuestionnaireGroups,
            xtype: 'questionnaireGroupView'
        }, {
            title: i18n.questionnairePageQuestionnaireFiTypes,
            xtype: 'fiTypeView'
        }, {
            title: i18n.management,
            xtype: 'questionnaireManagemetView'
        }, {
            title: i18n.licenseTypes,
            xtype: 'licenseTypesView'
        }, {
            title: i18n.propertyConfiguration,
            xtype: 'configPropertyView'
        }]
    }],


});
