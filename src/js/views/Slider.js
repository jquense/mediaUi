'use strict';

var Backbone = require('Backbone')
  , $ = require('../lib/jquery-2.0.3.js')
  , _ = require('lodash')



module.exports = Backbone.View.extend({
    template: require('../../templates/slider.hbs'),

    tagName: 'div',
    className: 'm-slider',

    initialize: function(opts){
        var self = this;

        this.$el.addClass('m-slider');

        this.min = 0;
        this.max = 100;
        this.step = 1; 
        this.adjustable = opts.adjustable;

        this.model = new Backbone.Model({
            position: 0,
        })

        this.model.on('change', _.bind(this.render, this));

        this.enable(opts.enable);
        this.render();
    },

    enable: function(enable){
        var self = this
          , ns = '.' + this.cid;

        self.$el.hammer()
            .off('touch' + ns)
            .off('drag' + ns)
            .off('dragend' + ns)
            .off('tap' + ns);

        enable = typeof enable === 'boolean'
            ? enable
            : true;

        if ( enable && this.adjustable ){
            self.$el.hammer()
                .on('touch' + ns, _.bind(self._dragStart, self))
                .on('drag' + ns,  function(e){
                    if ( !self._dragging) return;
                
                    e.gesture.preventDefault();
                    self._position( self._getPosition( e.gesture.center.pageX ) );
                })
                .on('dragend' + ns, function(e){
                    self._dragging = false;
                    self._change();   
                })
                .on('tap' + ns, function(e){
                    if ( self._dragging) return;

                    e.gesture.preventDefault();

                    self._position( self._getPosition( e.gesture.center.pageX ) );
                    self._change();   
                });
        }
            
    },

    render: function(m){
        var model = m || this.model
          , templ = this.template
          , pos   = model.get('position')
          , total = Math.abs(this.max - this.min)
          , percent = pos / total * 100;
        
        templ = templ({
            adjustable: this.adjustable,
            pos: percent + "%",
        });

        this.$el.html( templ );
    },
    
    position: function(pos){
        if ( !this._dragging )
            this._position(pos)
    },

    _position: function(pos){
        var model = this.model;

        if ( pos < this.min || pos > this.max )
            return;

        model.set('position', pos);    
    },

    _getPosition: function(xPos){
        var left = this.$el.offset().left || 0
          , mousePos = xPos - left
          , percent  = mousePos / this.$el.width();

        return percent * ( this.max - this.min );
    },
     
    _dragStart: function(e){
        var pos = e.gesture.center.pageX
          , thumb = this.$el.find('.m-slider-thumb')
          , offset = thumb.offset()
          , w = thumb.width()
          , onThumb = pos >= offset.left && pos <= offset.left + (w || 0)
        
        //console.log(onThumb)
        this._dragging = onThumb; 
        e.gesture.preventDefault();   
    },

    _change: function(){
        this.trigger('change', Math.floor(this.model.get('position')) );       
    }
 
})

