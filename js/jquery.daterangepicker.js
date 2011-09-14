jQuery.fn.daterangepicker = function(settings) {
    var input = jQuery(this);

    // Daterangepicker defaults
    var options = jQuery.extend({
        presetRanges: [
            {text: 'Yesterday', ranges:[{s: 'today-1days', e: 'today-1days'}]},
            {text: 'Last 7 days', ranges:[{s: 'today-7days', e: 'today'}]},
            {text: 'Compare the two last weeks', ranges:[{s:'today-7days', e:'today'}, {s:'today-15days', e: 'today-8days'}]}
        ],
        presets: {
            singleDate: {title: 'Specific date'},
            singleRange: {title: 'Date range', labels: ['Start date', 'End date']},
            twoRanges: {title: 'Compare ranges', labels: [['DS1', 'DE1'], ['DS2', 'DE2']]}
        },
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
            var ranges = [];
            rpPickersBoxes.find('.ui-range').each(function(i, e) {
                var dates = [];
                $(e).find('.ui-daterangepicker-datepicker').each(function(i, e) {
                    dates.push(jQuery.datepicker.formatDate(options.dateFormat, $(e).datepicker('getDate')));
                });
                ranges.push(dates.join(options.rangeSplitter));
            });
            input.val(ranges.join(options.rangeSeparator));
        },
        defaultDate: 0,
        dateFormat: options.dateFormat
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
    var rp = jQuery('<div class="ui-daterangepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" style="display:none; left:' + options.posX + 'px; top:' + options.posY+ 'px"></div>');
    var rpPresets = (function() {
        var ul = jQuery('<ul></ul>').appendTo(rp);
        // PresetRanges
        jQuery.each(options.presetRanges, function() {
            var li = jQuery('<li class="ui-corner-all"><a href="#" rel="' + ((this.rel) ? this.rel : '') + '" title="' + this.text + '">' + this.text + '</a></li>').data('ranges', this.ranges);
            ul.append(li);
        });
        // Presets
        jQuery.each(options.presets, function() {
            var li = jQuery('<li class="ui-corner-all"><a href="#" rel="' + this.rel + '" title="' + this.title + '">' + this.title + '</a></li>').data('presetSettings', this);
            ul.append(li);
        });
        return ul;
    })();
	var rpPickersBoxes = jQuery('<div class="ui-ranges ui-widget-header ui-corner-all ui-helper-clearfix" style="display:none"></div>').appendTo(rp);
    var doneBtn = jQuery('<button class="ui-daterangepicker-doneBtn ui-state-default ui-corner-all">' + options.doneButtonText + '</button>');

     /////////////////////////////////////////
    // LET'S MANAGE DATERANGEPICKER EVENTS //
   /////////////////////////////////////////
    rpPresets.find('li')
        .hover(
            function() {
                jQuery(this).addClass('ui-state-hover');
            },
            function() {
                jQuery(this).removeClass('ui-state-hover');
            })
        .click(function() {
            rp.find('.ui-state-active').removeClass('ui-state-active');
            jQuery(this).addClass('ui-state-active').clickActions(rp, rpPickersBoxes, doneBtn);
            return false;
        });

    jQuery.fn.appendDatepicker = function(title) {
        var picker = jQuery('<div class="ui-daterangepicker-datepicker"><span>' + title + '</span></div>');
        picker.datepicker(options.datepickerOptions);
        $(this).append(picker);

        return $(this);
    };
    jQuery.fn.clickActions = function(rp, rpPickersBoxes, doneBtn) {
        // PRESET RANGES
        if($(this).data('ranges')) {
            var r = $(this).data('ranges'), t = [];
            for(var i in r) {
                var s = jQuery.datepicker.formatDate(options.dateFormat, Date.parse(r[i].s));
                var e = jQuery.datepicker.formatDate(options.dateFormat, Date.parse(r[i].e));
                t.push(s + options.rangeSplitter + e);
            }
            input.val(t.join(options.rangeSeparator));
            if(options.closeOnSelect) {
                hide();
            }
        }
        // PRESETS
        else {
            rpPickersBoxes.empty();
            var settings = $(this).data('presetSettings');
            var l = (settings.labels) ? settings.labels : settings.title;

            // Convert all types of labels in 2D-array labels
            if(typeof(l) == 'string') {
                l = [[l]];
            }
            else if(typeof(l) == 'object' && typeof(l[0]) == 'string') {
                l = [l];
            }

            jQuery.each(l, function(k, v) {
                var div = jQuery('<div class="ui-range"></div>').appendTo(rpPickersBoxes);
                jQuery.each(v, function(i, title) {
                    div.appendDatepicker(title);
                });
            });
            rpPickersBoxes.append(doneBtn);
            rpPickersBoxes.show();
        }

        return $(this);
    };

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
            rpPickersBoxes.fadeOut(300);
            rp.find('.ui-state-active').removeClass('ui-state-active');
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
