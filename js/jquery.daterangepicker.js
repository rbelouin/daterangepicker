jQuery.fn.daterangepicker = function(settings) {
    var input = jQuery(this);

    // Daterangepicker defaults
    var options = jQuery.extend({
        presetRanges: [
            {text: 'Yesterday', ranges:[{s: 'today-1days', e: 'today-1days'}], rel: 'y'},
            {text: 'Last 7 days', ranges:[{s: 'today-7days', e: 'today-1days'}], rel: '7'},
            {text: 'Current month', ranges:[{s:Date.parse('today').moveToFirstDayOfMonth(), e:'today'}], rel: 'cm'},
            {text: 'Last month', ranges:[{s:Date.parse('1 month ago').moveToFirstDayOfMonth(), e:Date.parse('1 month ago').moveToLastDayOfMonth()}], rel: 'lm'},
            {text: 'Compare the two last weeks', ranges:[{s:'today-6days', e:'today'}, {s:'today-13days', e: 'today-7days'}], rel: 'cw'}
        ],
        presets: [
            {text: 'Specific date'},
            {text: 'Date range', labels: ['Start date', 'End date']},
            {text: 'Compare ranges', labels: [['DS1', 'DE1'], ['DS2', 'DE2']]}
        ],
        doneButtonText: 'Done',
        rangeSplitter: '-',
        rangeSeparator: '|',
        dateFormat: 'm/d/yy',
        closeOnSelect: true,
        posX: input.offset().left,
        posY: input.offset().top + input.outerHeight(),
        appendTo: 'body',
        onClose: function(dateText, dateArray){},
        onOpen: function(dateText, dateArray){},
        onChange: function(dateText, dateArray){},
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
            options.onChange(input.val(), jQuery.fn.daterangepicker.parse(input.val(), options.rangeSplitter, options.rangeSeparator));
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
            var li = jQuery('<li class="ui-corner-all"><span class="ui-icon ui-icon-triangle-1-s"></span><a href="#" rel="' + ((this.rel) ? this.rel : '') + '" title="' + this.text + '">' + this.text + '</a></li>').data('presetSettings', this);
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

    jQuery.fn.appendDatepicker = function(label) {
        var picker = jQuery('<div class="ui-daterangepicker-datepicker"><span>' + label + '</span></div>');
        picker.datepicker(options.datepickerOptions);
        $(this).append(picker);

        return $(this);
    };
    jQuery.fn.clickActions = function(rp, rpPickersBoxes, doneBtn) {
        // PRESET RANGES
        if($(this).data('ranges')) {
            var r = $(this).data('ranges'), t = [];
            for(var i in r) {
                var s = (typeof(r[i].s) == 'string') ? Date.parse(r[i].s) : r[i].s;
                var e = (typeof(r[i].e) == 'string') ? Date.parse(r[i].e) : r[i].e;
                s = jQuery.datepicker.formatDate(options.dateFormat, s);
                e = jQuery.datepicker.formatDate(options.dateFormat, e);
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
            var l = (settings.labels) ? settings.labels : settings.text;

            // Convert all types of labels in 2D-array labels
            if(typeof(l) == 'string') {
                l = [[l]];
            }
            else if(typeof(l) == 'object' && typeof(l[0]) == 'string') {
                l = [l];
            }

            jQuery.each(l, function(k, v) {
                var div = jQuery('<div class="ui-range"></div>').appendTo(rpPickersBoxes);
                jQuery.each(v, function(i, label) {
                    div.appendDatepicker(label);
                });
            });
            doneBtn.click(hide);
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
            options.onOpen(input.val(), jQuery.fn.daterangepicker.parse(input.val(), options.rangeSplitter, options.rangeSeparator));
        }
    }
    function hide() {
        if(rp.data('state') == 'open') {
            rp.data('state', 'closed');
            rp.fadeOut(300);
            rpPickersBoxes.fadeOut(300);
            rp.find('.ui-state-active').removeClass('ui-state-active');
            options.onClose(input.val(), jQuery.fn.daterangepicker.parse(input.val(), options.rangeSplitter, options.rangeSeparator));
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

jQuery.fn.daterangepicker.parse = function(s, rangeSplitter, rangeSeparator) {
    var a = s.split(rangeSeparator);
    jQuery.each(a, function(i, e) {
        a[i] = e.split(rangeSplitter);
    });
    return a;
};
