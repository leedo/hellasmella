var Queue = Class.create({
	initialize: function(list) {
		this.list = list;
		this.items = [];
	},
	addItem: function(item) {
		this.items.push(item);
		this.list.insert(item);
	},
	removeItem: function(item) {
		this.items = this.items.without(item);
		item.remove();
	},
	pause: function() {
		new Ajax.Request('pause', {
			onComplete: function() { this.items.invoke('pause') }
		});
	},
	resume: function() {
		new Ajax.Request('continue', {
			onComplete: function () { this.items.invoke('resume') }
		})
	}
});

var QueueItem = Class.create({
	initialize: function(name,size,msgid) {
		this.name = name;
		this.total = size;
		this.downloaded = 0;
		this.state = 'queued';
		this.msgid = msgid;
		this.elem = new Element('li',{'class':'queueitem'}).update(this.name+' ('+this.size+')');
	},
	remove: function() {
		var action = 'remove';
		if (this.state == 'queued')
			action = 'cancel';
		new Ajax.Request(action, {
			parameters: 'id=' + this.msgid,
			onComplete: function (req) {
				this = null;
			}
		});
	},
	pause: function() {
		if (this.state == 'downloading')
			this.state == 'paused';
	}
	resume: function() {
		if (this.state == 'paused')
			this.state == 'downloading';
	}
});
