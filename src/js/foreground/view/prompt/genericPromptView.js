﻿define([
    'text!template/genericPrompt.html'
], function (GenericPromptTemplate) {
    'use strict';

    var GenericPromptView = Backbone.Marionette.ItemView.extend({
        className: 'prompt',
        template: _.template(GenericPromptTemplate),

        events: {
            'click': 'hideIfClickOutsidePanel',
            'click @ui.okButton': 'doOk',
            'keydown .submittable': 'doOkOnEnter'
        },
        
        triggers: {
            'click .remove': 'hide'
        },
        
        ui: {
            panel: '.panel',
            content: '.content',
            okButton: 'button.ok'
        },
        
        onRender: function () {
            //  Add specific content to the generic dialog's interior
            this.ui.content.append(this.model.get('view').render().el);
        },
        
        initialize: function () {
            this.$el.addClass(this.model.get('view').className + '-prompt');
        },

        onShow: function () {
            //  Store original values in data attribute to be able to revert without magic numbers.
            this.$el.data('background', this.$el.css('background')).transition({
                'background': 'rgba(0, 0, 0, 0.5)'
            }, 'snap');

            //  TODO: It's bad practice to access $('body') like this. I should consider depending on just CSS3 animations.
            //  I don't remember why I am using jQuery transit in favor of CSS3 animations. Perhaps for stopping the animation.
            //  Calculate center for prompt by finding the average difference between prompts height and the body
            var yTranslateCenter = ($('body').height() - this.ui.panel.height()) / 2;
            
            this.ui.panel.transition({
                y: yTranslateCenter,
                opacity: 1
            }, 'snap');

            //  Be sure to tell the child view it has been shown!
            this.model.get('view').triggerMethod('show');
        },
        
        close: function () {
            this.$el.transition({
                'background': this.$el.data('background')
            }, function () {
                Backbone.Marionette.ItemView.prototype.close.apply(this, arguments);
            }.bind(this));

            this.ui.panel.transition({
                y: 0,
                opacity: 0
            });
        },
        
        //  If the user clicks the 'dark' area outside the panel -- hide the panel.
        hideIfClickOutsidePanel: function (event) {
            if (event.target == event.currentTarget) {
                this.triggerMethod('hide');
            }
        },
        
        //  If the enter key is pressed on a submittable element, treat as if user pressed OK button.
        doOkOnEnter: function(event) {
            if (event.which === 13) {
                this.doOk();
            }
        },
        
        doOk: function () {
            //  Run validation logic if provided else assume valid
            var contentView = this.model.get('view');
            var isValid = _.isFunction(contentView.validate) ? contentView.validate() : true;
            
            if (isValid) {
                if (_.isFunction(contentView.doOk)) {
                    contentView.doOk();
                }

                this.triggerMethod('hide');
            }
        }
    });

    return GenericPromptView;
});