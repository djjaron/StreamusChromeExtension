﻿define([
    'foreground/model/genericPrompt',
    'foreground/view/createPlaylistView',
    'foreground/view/prompt/genericPromptView'
], function (GenericPrompt, CreatePlaylistView, GenericPromptView) {
    'use strict';
    
    var CreatePlaylistPromptView = GenericPromptView.extend({
        initialize: function() {
            this.model = new GenericPrompt({
                title: chrome.i18n.getMessage('createPlaylist'),
                okButtonText: chrome.i18n.getMessage('create'),
                view: new CreatePlaylistView()
            });
            
            GenericPromptView.prototype.initialize.apply(this, arguments);
        }
    });

    return CreatePlaylistPromptView;
});