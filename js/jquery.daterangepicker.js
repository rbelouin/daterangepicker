jQuery.fn.daterangepicker = function(settings) {
    var input = jQuery(this);

    // Daterangepicker defaults
    var options = jQuery.extend({
        presetRanges: [
            {text: 'Yesterday', ranges:[{s: 'today-1days', e: 'today-1days'}]},
            {text: 'Last 7 days', ranges:[{s: 'today-7days', e: 'today'}]}
        ],
        presets: {
            singleDate: 'Specific date',
            singleRange: 'Date range',
            twoRanges: 'Compare ranges'
        },
        titles: [['DS1', 'DE1'], ['DS2', 'DE2']],
        doneButtonText: 'Done',
        rangeSplitter: '-',
        rangeSeparator: '|',
        dateFormat: 'm/d/yy',
        closeOnSelect: true,
        posX: input.offset().left,
        posY: input.offset().top + input.outerHeight(),
        appendTo: 'body',
        onClose: function(){},
        onOpen: function(){},
        onChange: function(){},
        datepickerOptions:  null
    }, settings);

    // Custom datepicker options
    var datepickerOptions = {
        onSelect: function() {
            console.debug('Coucou');
        },
        defaultDate: 0
    };
    options.datepickerOptions = (settings) ? jQuery.extend(datepickerOptions, settings.datepickerOptions) : datepickerOptions;


    // Getting data from input
    var ranges = input.val().split(options.rangeSeparator);
    for(var i in ranges) {
        ranges[i] = ranges[i].split(options.rangeSplitter);
        for(var j in ranges[i]) {
            ranges[i][j] = Date.parse(ranges[i][j]);
        }
    }

     /////////////////////////////////////
    // LET'S BUILD THE DATERANGEPICKER //
   /////////////////////////////////////
    var rp = jQuery('<div class="ui-daterangepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" style="display:none"></div>');
    var rpPresets = (function() {
        var ul = jQuery('<ul></ul>').appendTo(rp);
        jQuery.each(options.presetRanges, function() {
            var li = jQuery('<li class="ui-daterangepicker-' + this.text.replace(/ /g, '') + ' ui-corner-all"><a href="#" rel="' + this.rel + '" title="' + this.text + '">' + this.text + '</a></li>').data('ranges', this.ranges);
            ul.append(li);
        });

        ul.find('li')
            .hover(
                function() {
                    jQuery(this).addClass('ui-state-hover');
                },
                function() {
                    jQuery(this).removeClass('ui-state-hover');
                })
            .click(function() {
                rp.find('.ui-state-active').removeClass('ui-state-active');
                jQuery(this).addClass('ui-state-active');
                return false;
            });
        return ul;
    })();

    // Show, hide, or toggle rangepicker
    function show() {
        if(rp.data('state') == 'closed') {
            rp.data('state', 'open');
            rp.fadeIn(300);
            options.onOpen();
        }
    }
    function hide() {
        if(rp.data('state') == 'open') {
            rp.data('state', 'closed');
            rp.fadeOut(300);
            options.onClose();
        }
    }
    function toggle() {
        (rp.data('state') == 'open') ? hide() : show();
    }            
    rp.data('state', 'closed');

    // Manage visibility and append rangepicker to its container
    input.click(function() {
        toggle();
        return false;
    });
    jQuery(options.appendTo).append(rp);
};
