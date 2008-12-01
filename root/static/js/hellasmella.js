var intervalid;
var f;
var speeds = [];
var flotr_options = {
	colors: ['#C2ECFE'],
	yaxis: {min: 0},
	xaxis: {min: 0, max: 15, tickFormatter: function(n) {return ""}},
	lines: { show: false, fill: true },
	points: { show: false },
	shadowSize: 0,
	mouse: {track: false},
	grid: { outlineWidth: 0 }
};

for (var i=0; i < 15; i++) {
	speeds.push([0,0]);
}

window.onload = function () {
	update_all();
	intervalid = setInterval(update_all,7000);
	make_sortable();
	$('q').focus();
};

function dosearch () {
	new Ajax.Updater('newzbin_results','search',{
		method:'get',
		parameters: $('search').serialize(),
		onComplete : function(transport) { 
			$('q').disabled = false;
			$('category').disabled = false;
			$('searchsubmit').disabled = false;
			$('q').focus();
		}
	});
	$('q').disabled = true;
	$('category').disabled = true;
	$('searchsubmit').disabled = true;
	return false;
}

function pause () {
	new Ajax.Request('pause', {
		requestHeaders : { Accept : 'text/javascript' },
		onComplete : function (req) {
			var data = req.responseText.evalJSON();
			update_all_complete(data,false);
		}
	});
	return false;
}

function restart () {
	new Ajax.Request('continue', {
		requestHeaders : { Accept : 'text/javascript' },
		onComplete : function (req) {
			var data = req.responseText.evalJSON();
			update_all_complete(data,false);
		}
	});
	return false;
}

function clearall () {
	if (confirm("Remove all items from the queue?")) {
		new Ajax.Request('clearall', {
			requestHeaders : { Accept : 'text/javascript' },
			onComplete : function (req) {
				var data = req.responseText.evalJSON();
				update_all_complete(data,false);
			}
		});
		return false;
	}
}

function addmsgid (msgid,disable) {
	if (confirm("Add this item to the queue?")) {
		req = new Ajax.Request('add',{
			requestHeaders : { Accept : 'text/javascript' },
			parameters : 'msgid=' + msgid,
			onComplete : function (req) {
				var data = req.responseText.evalJSON();
				update_all_complete(data,false);
				if (disable) {
					$('msgid').value = '';
					$('msgid').disabled = false;
					$('addsubmit').disabled = false;
				}
			}
		});
		if (disable) {
			$('msgid').disabled = true;
			$('addsubmit').disabled = true;
		}
	}
	return false;
}

function removemsgid (msgid,cancel) {
	action="remove"
	if (cancel)
		action="cancel"

	if (confirm("Remove this item from the queue?")) {
		req = new Ajax.Request(action,{
			requestHeaders : { Accept : 'text/javascript' },
			parameters : 'id=' + msgid,
			onComplete : function (req) {
				var data = req.responseText.evalJSON();
				update_all_complete(data,false);
			}
		});
	}
	return false;
}

function update_all () {
	new Ajax.Request('status',{
		requestHeaders : { Accept : 'text/javascript' },
		onComplete: function(req) {
			var data = req.responseText.evalJSON();
			update_all_complete(data,true);
		}
	});
}

//
// if passive update means we don't check queue for deep changes
//
function update_all_complete (data,passive) {
	Jemplate.process('log.tt',data,'#log');
	Jemplate.process('status.tt',data,'#status');
	update_queue(data,passive);
	update_completed(data);
	if (data.status.currently_downloading[0]) {
		update_speed_plot(data.status.rate);
		document.title = data.status.percent_complete + "%";
		if (data.status.is_paused)
			document.title += " paused";
		else
			document.title += " " + data.status.rate + "kbps";
	}
	else {
		document.title = "idle";
		update_speed_plot(0);
	}
}

function update_speed_plot(speed) {
	var max = 0;
	if (speeds.length > 15)
		speeds.shift();
	if (speed >= 0) {
		speeds.push([undefined,speed]);
		for (var i=0; i < speeds.length; i++) {
			speeds[i][0] = i;
			if (speeds[i][1] > max)
				max = speeds[i][1];
		}
	}
	flotr_options.yaxis.max = Number(max) + (max * 0.1);
	f = Flotr.draw($('speedplot'), [speeds], flotr_options);
};

function update_queue (data,passive) {
	var queuelist = $('queuelist');

	var queuesize = data.status.currently_downloading.length + data.status.queued.length;

	// remove one from queuesize if the queue is just displaying an empty message
	if (queuelist.childNodes[0].innerHTML == "empty...")
		queuesize --;

	// if passive update, only check if queue sizes is the same
	if(passive && queuelist.childNodes.length == queuesize) {
		return;
	}

	Jemplate.process('controls.tt',data,'#queuecontrols');
	var newitems = [];

	data.status.currently_downloading.each(function(item) {
		var listitem = document.createElement('LI');
		Jemplate.process('downloadingitem.tt',item,listitem);
		listitem.id = "queueitem_" + item.id;
		if (data.status.is_paused)
			listitem.className = 'queueitem paused';
		else
			listitem.className = 'queueitem downloading';
		newitems.push(listitem);
	});
	data.status.queued.each(function(item) {
		var listitem = document.createElement('LI');
		Jemplate.process('queueitem.tt',item,listitem);
		listitem.id = "queueitem_" + item.id;
		listitem.className = 'queueitem';
		newitems.push(listitem);
	});
	$A(queuelist.childNodes).each(function(child) {
		queuelist.removeChild(child);
	});
	if (newitems.length > 0) {
		newitems.each(function(item) {
			if (newitems.length > 1) {
				item.onmousedown = function () {
					clearInterval(intervalid);
				};
				item.onmouseup = function () {
					intervalid = setInterval(update_all,7000);
				};
			}
			queuelist.appendChild(item);
		});
	}
	else {
		var listitem = document.createElement('LI');
		listitem.className = "empty";
		listitem.innerHTML = "empty...";
		queuelist.appendChild(listitem);
	}
	make_sortable();
}

function update_completed (data) {
	var completelist = $('completed');
	
	//check if the list has changed
	if (! data.status.completed.length ||
			data.status.completed[0].nzbName == completelist.childNodes[0].innerHTML) {
		return;
	}

	if (data.status.completed.length > 0) {
		$A(completelist.childNodes).each(function(child) {
			completelist.removeChild(child);
		});
		data.status.completed.each(function(item) {
			var listitem = document.createElement('LI');
			listitem.className = 'completed';
			listitem.innerHTML = '<ul><li class="title">' + item.nzbName + '</li></ul>';
			$('completed').appendChild(listitem);
		});
	}
	else {
		var listitem = document.createElement('LI');
		listitem.className = "empty";
		listitem.innerHTML = "empty...";
		$('completed').appendChild(listitem);
	}
}

function submit_new_queue (stuff) {
	clearInterval(intervalid);
	new Ajax.Request('resort',{
		parameters : Sortable.serialize('queuelist'),
		onComplete : function (req) {
			var data = req.responseText.evalJSON();
			update_all_complete(data);
			clearInterval(intervalid);
			intervalid = setInterval(update_all,7000);
		}
	});
}

function make_sortable () {
	if ($$('#queuelist li.queueitem').length > 1) {
  		Sortable.create("queuelist", { onUpdate : submit_new_queue });
		$$('#queuelist li.queueitem').each(function(item) {
			item.style.cursor = 'move';
		});
	}
}

function toggle_form (id) {
	$A($('newzbin').getElementsByClassName('form')).each(function(form){
		if (form.id == id)
			form.style.display="block";
		else
			form.style.display="none";
	})
}

function show_info (msgid) {
	$('search_'+msgid+'_more').innerHTML = 'loading...';
	new Ajax.Request('info',{
		requestHeaders : { Accept : 'text/javascript' },
		parameters : 'msgid=' + msgid,
		onComplete: function(req) {
			var data = req.responseText.evalJSON();
			var div = document.createElement('DIV');
			div.innerHTML = data.info.filename+" "+data.info.size;
			$('search_'+msgid).appendChild(div);
			$('search_'+msgid+'_more').innerHTML = '';
		}
	});
}
