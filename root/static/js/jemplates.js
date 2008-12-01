/*
   This JavaScript code was generated by Jemplate, the JavaScript
   Template Toolkit. Any changes made to this file will be lost the next
   time the templates are compiled.

   Copyright 2006 - Ingy döt Net - All rights reserved.
*/

if (typeof(Jemplate) == 'undefined')
    throw('Jemplate.js must be loaded before any Jemplate template files');

Jemplate.templateMap['controls.tt'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '	<ul>\n		';
//line 6 "controls.tt"
if (stash.get(['status', 0, 'is_paused', 0])) {
output += '\n		<li><a onclick="return restart()" href="';
//line 3 "controls.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('root');

    return context.filter(output, 'url', []);
})();

output += 'continue">continue</a></li>\n		';
}
else {
output += '\n		<li><a onclick="return pause()" href="';
//line 5 "controls.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('root');

    return context.filter(output, 'url', []);
})();

output += 'pause">pause</a></li>\n		';
}

output += '\n		<li class="last">\n			<a href="';
//line 8 "controls.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('root');

    return context.filter(output, 'url', []);
})();

output += 'clear" title="clear queue, excluding current download" onclick="return clearall()">clear</a></li>\n	</ul>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['downloadingitem.tt'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<ul>\n	<li class="title">';
//line 2 "downloadingitem.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('nzbName');

    return context.filter(output, 'html', []);
})();

output += '</li>\n	<li><a href="';
//line 3 "downloadingitem.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('root');

    return context.filter(output, 'url', []);
})();

output += 'cancel?id=';
//line 3 "downloadingitem.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('id');

    return context.filter(output, 'url', []);
})();

output += '" title="remove from queue" onclick="return removemsgid(';
//line 3 "downloadingitem.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('id');

    return context.filter(output, 'html', []);
})();

output += ',true)">remove</a></li>\n	<li>';
//line 4 "downloadingitem.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('total_mb');

    return context.filter(output, 'html', []);
})();

output += 'MB</li>\n</ul>\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['log.tt'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<h2>Log <span class="note">(most recent entries on top)</span></h2>\n<ul id="loglist">\n';
//line 7 "log.tt"

// FOREACH 
(function() {
    var list = stash.get(['status', 0, 'log_entries', 0, 'reverse', 0]);
    list = new Jemplate.Iterator(list);
    var retval = list.get_first();
    var value = retval[0];
    var done = retval[1];
    var oldloop;
    try { oldloop = stash.get('loop') } finally {}
    stash.set('loop', list);
    try {
        while (! done) {
            stash.data['log_entry'] = value;
output += '\n	';
//line 6 "log.tt"

// FOREACH 
(function() {
    var list = stash.get(['log_entry', 0, 'keys', 0]);
    list = new Jemplate.Iterator(list);
    var retval = list.get_first();
    var value = retval[0];
    var done = retval[1];
    var oldloop;
    try { oldloop = stash.get('loop') } finally {}
    stash.set('loop', list);
    try {
        while (! done) {
            stash.data['key'] = value;
output += '\n	<li class="';
//line 5 "log.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('key');

    return context.filter(output, 'lower', []);
})();

output += '">';
//line 5 "log.tt"
output += stash.get(['log_entry', 0, stash.get('key'), 0]);
output += '</li>\n	';;
            retval = list.get_next();
            value = retval[0];
            done = retval[1];
        }
    }
    catch(e) {
        throw(context.set_error(e, output));
    }
    stash.set('loop', oldloop);
})();

output += '\n';;
            retval = list.get_next();
            value = retval[0];
            done = retval[1];
        }
    }
    catch(e) {
        throw(context.set_error(e, output));
    }
    stash.set('loop', oldloop);
})();

output += '\n</ul>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['queueitem.tt'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<ul>\n	<li class="title">';
//line 2 "queueitem.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('nzbName');

    return context.filter(output, 'html', []);
})();

output += '</li>\n	<li><a href="';
//line 3 "queueitem.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('root');

    return context.filter(output, 'url', []);
})();

output += 'remove?id=';
//line 3 "queueitem.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('id');

    return context.filter(output, 'url', []);
})();

output += '" title="remove from queue" onclick="return removemsgid(';
//line 3 "queueitem.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('id');

    return context.filter(output, 'html', []);
})();

output += ')">remove</a></li>\n	<li>';
//line 4 "queueitem.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('total_mb');

    return context.filter(output, 'html', []);
})();

output += 'MB</li>\n</ul>\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['search.tt'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
//line 9 "search.tt"

// FOREACH 
(function() {
    var list = stash.get('results');
    list = new Jemplate.Iterator(list);
    var retval = list.get_first();
    var value = retval[0];
    var done = retval[1];
    var oldloop;
    try { oldloop = stash.get('loop') } finally {}
    stash.set('loop', list);
    try {
        while (! done) {
            stash.data['result'] = value;
output += '\n<li id="search_';
//line 2 "search.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get(['result', 0, 'nzbid', 0]);

    return context.filter(output, 'html', []);
})();

output += '">\n	<ul id="search_';
//line 3 "search.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get(['result', 0, 'nzbid', 0]);

    return context.filter(output, 'html', []);
})();

output += '_control">\n		<li class="title"><a href="';
//line 4 "search.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get('root');

    return context.filter(output, 'url', []);
})();

output += 'add?msgid=';
//line 4 "search.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get(['result', 0, 'nzbid', 0]);

    return context.filter(output, 'url', []);
})();

output += '" onclick="return addmsgid(';
//line 4 "search.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get(['result', 0, 'nzbid', 0]);

    return context.filter(output, 'html', []);
})();

output += ')">';
//line 4 "search.tt"
output += stash.get(['result', 0, 'title', 0]);
output += '</a></li>\n		<li id="search_';
//line 5 "search.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get(['result', 0, 'nzbid', 0]);

    return context.filter(output, 'html', []);
})();

output += '_more"><a href="javascript:void(0);" onclick="show_info(';
//line 5 "search.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get(['result', 0, 'nzbid', 0]);

    return context.filter(output, 'html', []);
})();

output += ')">more</a></li>\n		<li>';
//line 6 "search.tt"

// FILTER
output += (function() {
    var output = '';

output += stash.get(['result', 0, 'days', 0]);

    return context.filter(output, 'html', []);
})();

output += ' days</li>\n	</ul>\n</li>\n';;
            retval = list.get_next();
            value = retval[0];
            done = retval[1];
        }
    }
    catch(e) {
        throw(context.set_error(e, output));
    }
    stash.set('loop', oldloop);
})();

output += '\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['status.tt'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<h2>Status</h2>\n<dl>\n	<dt>State</dt>\n	<dd>';
//line 4 "status.tt"
if (! stash.get(['status', 0, 'currently_downloading', 0, 0, 0])) {
output += 'idle';
}
else if (stash.get(['status', 0, 'is_paused', 0])) {
output += 'paused';
}
else {
output += 'downloading';
}

output += '</dd>\n	';
//line 38 "status.tt"
if (stash.get(['status', 0, 'currently_downloading', 0, 0, 0])) {
output += '\n	<dt>Currently Downloading</dt>\n	<dd>\n		';
//line 10 "status.tt"

// FOREACH 
(function() {
    var list = stash.get(['status', 0, 'currently_downloading', 0]);
    list = new Jemplate.Iterator(list);
    var retval = list.get_first();
    var value = retval[0];
    var done = retval[1];
    var oldloop;
    try { oldloop = stash.get('loop') } finally {}
    stash.set('loop', list);
    try {
        while (! done) {
            stash.data['current'] = value;
output += '\n			';
//line 9 "status.tt"
output += stash.get(['current', 0, 'nzbName', 0]);
output += '\n		';;
            retval = list.get_next();
            value = retval[0];
            done = retval[1];
        }
    }
    catch(e) {
        throw(context.set_error(e, output));
    }
    stash.set('loop', oldloop);
})();

output += '\n	</dd>\n	<dt>Progress</dt>\n	<dd>\n		<div class="progressbar">\n			<div class="progress" style="width:';
//line 15 "status.tt"
output += stash.get(['status', 0, 'percent_complete', 0]);
output += '%"></div>\n		<div class="progresstext">\n';
//line 17 "status.tt"
output += stash.get(['status', 0, 'percent_complete', 0]);
output += '% <span style="font-size:0.9em">(';
//line 17 "status.tt"
output += stash.get(['status', 0, 'queued_mb', 0]);
output += 'MB remaining)</span>\n		</div>\n			\n		</div>\n		\n	</dd>\n	<dt>Rate</dt>\n	<dd>';
//line 24 "status.tt"
output += stash.get(['status', 0, 'rate', 0]);
output += 'KB/s</dd>\n	<dt>Time Remaining</dt>\n	<dd>\n		';
//line 37 "status.tt"
if (stash.get(['status', 0, 'time_remaining', 0])) {
output += '\n			';
//line 30 "status.tt"
if (stash.get(['status', 0, 'time_remaining', 0, 'hours', 0]) > 0) {
output += '\n				';
//line 29 "status.tt"
output += stash.get(['status', 0, 'time_remaining', 0, 'hours', 0]);
output += ' hour';
//line 29 "status.tt"
if (stash.get(['status', 0, 'time_remaining', 0, 'hours', 0]) > 1) {
output += 's';
}

output += '\n			';
}

output += '\n			';
//line 34 "status.tt"
if (stash.get(['status', 0, 'time_remaining', 0, 'minutes', 0]) > 0) {
output += '\n				';
//line 32 "status.tt"
if (stash.get(['status', 0, 'time_remaining', 0, 'hours', 0]) > 0) {
output += 'and';
}

output += '\n				';
//line 33 "status.tt"
output += stash.get(['status', 0, 'time_remaining', 0, 'minutes', 0]);
output += ' minute';
//line 33 "status.tt"
if (stash.get(['status', 0, 'time_remaining', 0, 'minutes', 0]) > 1) {
output += 's';
}

output += '\n			';
}

output += '\n		';
}
else {
output += '\n		n/a\n		';
}

output += '\n	';
}

output += '\n	';
//line 46 "status.tt"
if (stash.get(['status', 0, 'currently_processing', 0, 0, 0])) {
output += '\n	<dt class="processing">Currently Processing</dt>\n	<dd class="processing">\n		';
//line 44 "status.tt"

// FOREACH 
(function() {
    var list = stash.get(['status', 0, 'currently_processing', 0]);
    list = new Jemplate.Iterator(list);
    var retval = list.get_first();
    var value = retval[0];
    var done = retval[1];
    var oldloop;
    try { oldloop = stash.get('loop') } finally {}
    stash.set('loop', list);
    try {
        while (! done) {
            stash.data['current'] = value;
output += '\n			';
//line 43 "status.tt"
output += stash.get(['current', 0, 'nzbName', 0]);
output += '\n		';;
            retval = list.get_next();
            value = retval[0];
            done = retval[1];
        }
    }
    catch(e) {
        throw(context.set_error(e, output));
    }
    stash.set('loop', oldloop);
})();

output += '\n	</dd>\n	';
}

output += '\n</dl>\n\n';
//line 51 "status.tt"
if (stash.get(['status', 0, 'currently_downloading', 0, 0, 0])) {
output += '\n<div id="speedplot" style="width:200px;height:100px;margin-top:10px"></div>\n';
}

output += '\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

