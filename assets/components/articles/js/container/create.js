
Articles.page.CreateArticlesContainer = function(config) {
    config = config || {record:{}};
    config.record = config.record || {};
    Ext.applyIf(config,{
        panelXType: 'articles-panel-container'
    });
    config.canDuplicate = false;
    config.canDelete = false;
    Articles.page.CreateArticlesContainer.superclass.constructor.call(this,config);
};
Ext.extend(Articles.page.CreateArticlesContainer,MODx.page.CreateResource,{

});
Ext.reg('articles-page-articles-container-create',Articles.page.CreateArticlesContainer);



Articles.panel.Container = function(config) {
    config = config || {};
    Articles.panel.Container.superclass.constructor.call(this,config);
};
Ext.extend(Articles.panel.Container,MODx.panel.Resource,{
    getFields: function(config) {
        var it = [];
        it.push({
            title: _('articles.container')
            ,id: 'modx-resource-settings'
            ,cls: 'modx-resource-tab'
            ,layout: 'form'
            ,labelAlign: 'top'
            ,labelSeparator: ''
            ,bodyCssClass: 'tab-panel-wrapper main-wrapper'
            ,autoHeight: true
            ,defaults: {
                border: false
                ,msgTarget: 'side'
                ,width: 400
            }
            ,items: this.getMainFields(config)
        });
        it.push({
            title: _('articles.template')
            ,id: 'modx-articles-template'
            ,cls: 'modx-resource-tab'
            ,layout: 'form'
            ,labelAlign: 'top'
            ,labelSeparator: ''
            ,bodyCssClass: 'tab-panel-wrapper main-wrapper'
            ,autoHeight: true
            ,defaults: {
                border: false
                ,msgTarget: 'side'
                ,width: 400
            }
            ,items: this.getTemplateSettings(config)
        });
        it.push({
            title: _('articles.advanced_settings')
            ,id: 'modx-articles-advanced-settings'
            ,cls: 'modx-resource-tab'
            ,labelAlign: 'top'
            ,labelSeparator: ''
            ,bodyCssClass: 'tab-panel-wrapper form-with-labels'
            ,autoHeight: true
            ,items: this.getBlogSettings(config)
        });
        if (config.show_tvs && MODx.config.tvs_below_content != 1) {
            it.push(this.getTemplateVariablesPanel(config));
        }
        if (MODx.perm.resourcegroup_resource_list == 1) {
            it.push(this.getAccessPermissionsTab(config));
        }
        var its = [];
        its.push(this.getPageHeader(config),{
            id:'modx-resource-tabs'
            ,xtype: 'modx-tabs'
            ,forceLayout: true
            ,deferredRender: false
            ,collapsible: true
            ,itemId: 'tabs'
            ,items: it
        });
        if (MODx.config.tvs_below_content == 1) {
            var tvs = this.getTemplateVariablesPanel(config);
            tvs.style = 'margin-top: 10px;visibility: visible';
            its.push(tvs);
        }
        return its;
    }
    ,getPageHeader: function(config) {
        config = config || {record:{}};
        return {
            html: '<h2>'+_('articles.container_new')+'</h2>'
            ,id: 'modx-resource-header'
            ,cls: 'modx-page-header'
            ,border: false
            ,forceLayout: true
            ,anchor: '100%'
        };
    }


    ,getTemplateSettings: function(config) {
        return [{
            xtype: 'articles-tab-template-settings'
            ,record: config.record
        }];
    }

    ,getBlogSettings: function(config) {
        return [{
            xtype: 'articles-tab-advanced-settings'
            ,record: config.record
        }];
    }


    ,getMainLeftFields: function(config) {
        config = config || {record:{}};

        var aliasLength = ~~MODx.config['friendly_alias_max_length'] || 0;

        var createPage = MODx.action ? MODx.action['resource/create'] : 'resource/create';
        return [{
            xtype: 'textfield'
            ,fieldLabel: _('articles.container_title')+'<span class="required">*</span>'
            ,description: MODx.expandHelp ? '' : '<b>[[*pagetitle]]</b><br />'+_('articles.container_title_desc')
            ,name: 'pagetitle'
            ,id: 'modx-resource-pagetitle'
            ,maxLength: 255
            ,anchor: '100%'
            ,allowBlank: false
            ,enableKeyEvents: true
            ,listeners: {
                'keyup': {scope:this,fn:function(f,e) {
                    var titlePrefix = MODx.request.a == createPage ? _('new_document') : _('document');
                    var title = Ext.util.Format.stripTags(f.getValue());
                    Ext.getCmp('modx-resource-header').getEl().update('<h2>'+title+'</h2>');
                }}
            }
        },{
            xtype: MODx.expandHelp ? 'label' : 'hidden'
            ,forId: 'modx-resource-pagetitle'
            ,html: _('articles.container_title_desc')
            ,cls: 'desc-under'

        },{
            xtype: 'textfield'
            ,fieldLabel: _('articles.container_alias')
            ,description: '<b>[[*alias]]</b><br />'+_('articles.container_alias_desc')
            ,name: 'alias'
            ,id: 'modx-resource-alias'
            ,maxLength: (aliasLength > 255 || aliasLength === 0) ? 255 : aliasLength
            ,anchor: '100%'
            ,value: config.record.alias || ''
        },{
            xtype: MODx.expandHelp ? 'label' : 'hidden'
            ,forId: 'modx-resource-alias'
            ,html: _('articles.container_alias_desc')
            ,cls: 'desc-under'

        },{
            xtype: 'textarea'
            ,fieldLabel: _('articles.container_description')
            ,description: '<b>[[*description]]</b><br />'+_('articles.container_description_desc')
            ,name: 'description'
            ,id: 'modx-resource-description'
            ,maxLength: 255
            ,anchor: '100%'
            ,value: config.record.description || ''
        },{
            xtype: MODx.expandHelp ? 'label' : 'hidden'
            ,forId: 'modx-resource-description'
            ,html: _('articles.container_description_desc')
            ,cls: 'desc-under'

        },{
            xtype: 'hidden'
            ,name: 'class_key'
            ,id: 'modx-resource-class-key'
            ,value: 'ArticlesContainer'
        }];
    }

    ,getMainRightFields: function(config) {
        config = config || {};
        return [{
            xtype: 'textfield'
            ,fieldLabel: _('resource_menutitle')
            ,description: MODx.expandHelp ? '' : '<b>[[*menutitle]]</b><br />'+_('articles.container_menutitle_desc')
            ,name: 'menutitle'
            ,id: 'modx-resource-menutitle'
            ,maxLength: 255
            ,anchor: '100%'
            ,value: config.record.menutitle || ''
        },{
            xtype: MODx.expandHelp ? 'label' : 'hidden'
            ,forId: 'modx-resource-menutitle'
            ,html: _('articles.container_menutitle_desc')
            ,cls: 'desc-under'

        },{
            xtype: 'textfield'
            ,fieldLabel: _('resource_link_attributes')
            ,description: MODx.expandHelp ? '' : '<b>[[*link_attributes]]</b><br />'+_('resource_link_attributes_help')
            ,name: 'link_attributes'
            ,id: 'modx-resource-link-attributes'
            ,maxLength: 255
            ,anchor: '100%'
            ,value: config.record.link_attributes || ''
        },{
            xtype: MODx.expandHelp ? 'label' : 'hidden'
            ,forId: 'modx-resource-link-attributes'
            ,html: _('resource_link_attributes_help')
            ,cls: 'desc-under'

        },{
            xtype: 'xcheckbox'
            ,boxLabel: _('resource_hide_from_menus')
            ,hideLabel: true
            ,description: '<b>[[*hidemenu]]</b><br />'+_('resource_hide_from_menus_help')
            ,name: 'hidemenu'
            ,id: 'modx-resource-hidemenu'
            ,inputValue: 1
            ,checked: parseInt(config.record.hidemenu) || false
        },{
            xtype: 'xcheckbox'
            ,boxLabel: _('resource_folder')
            ,hideLabel: true
            ,description: '<b>[[*isfolder]]</b><br />'+_('resource_folder_help')
            ,name: 'isfolder'
            ,id: 'modx-resource-isfolder'
            ,inputValue: 1
            ,checked: parseInt(config.record.isfolder) || true
        },{
            xtype: 'xcheckbox'
            ,boxLabel: _('resource_published')
            ,hideLabel: true
            ,description: '<b>[[*published]]</b><br />'+_('resource_published_help')
            ,name: 'published'
            ,id: 'modx-resource-published'
            ,inputValue: 1
            ,checked: parseInt(config.record.published)
        }]
    }


});
Ext.reg('articles-panel-container',Articles.panel.Container);