"use strict";

const embed = {
	"getHtml": (url) => `<iframe class='stream' src='${url}' frameborder=0 scrolling='no' allowfullscreen></iframe>`,
	"pattern": /(https?:\/\/)|(www.)|(twitch.tv\/)|(justin.tv\/)|(ustream.tv\/(channel\/)?)|(livestream.com\/)|((live.)?nicovideo.jp\/watch\/)|(hitbox.tv\/)|((gaming.)?youtube.com\/(watch\?v=)?(v\/)?)|(youtu.be\/)/gi,
	"ttv": {
		"bar": 0,
		"pattern": /(https?:\/\/)|(www.)|(twitch.tv\/)/gi,
		"getStream": (channel) => embed.getHtml(`//player.twitch.tv/?channel=${channel}`),
		"getVod": (video) => embed.getHtml(`//player.twitch.tv/?autoplay=true&video=${video}`)
	},
	"ust": {
		"bar": 0,
		"pattern": /(https?:\/\/)|(www.)|(ustream.tv\/(channel\/)?)/gi,
		"getStream": (id) => embed.getHtml(`//www.ustream.tv/embed/${id}?html5ui&wmode=direct&autoplay=true`),
		"getVod": (id) => embed.getHtml(`//www.ustream.tv/embed/recorded/${id}?v=3&autoplay=true`)
	},
	"lst": {
		"bar": 29,
		"pattern": /(https?:\/\/)|(www.)|(livestream.com\/)/gi,
		"getStream": (channel) => embed.getHtml(`//player.twitch.tv/?channel=${channel}`),
		"getVod": (video) => embed.getHtml(`//player.twitch.tv/?autoplay=true&video=${video}`)
	},
	"yut": {
		"bar": 0,
		"pattern": /(https?:\/\/)|(www.)|((gaming.)?youtube.com\/(watch\?v=)?(v\/)?)|(youtu.be\/)/gi,
		"getStream": (v, start) => embed.getHtml(`//www.youtube.com/embed/${v}?autoplay=1&hl=en_US&color=white&enablejsapi=1&showinfo=1&autohide=2&html5=1&start=${start}`),
		"getVod": (video) => embed.getHtml(`//player.twitch.tv/?autoplay=true&video=${video}`)
	},
	"nnd": {
		"bar": 0,
		"pattern": /(https?:\/\/)|(www.)|((live.)?nicovideo.jp\/watch\/)/gi,
		"getStream": (channel) => embed.getHtml(`//player.twitch.tv/?channel=${channel}`),
		"getVod": (video) => embed.getHtml(`//player.twitch.tv/?autoplay=true&video=${video}`)
	},
	"htv": {
		"bar": 0,
		"pattern": /(https?:\/\/)|(www.)|(hitbox.tv\/)/gi,
		"getStream": (channel) => embed.getHtml(`//www.hitbox.tv/embed/${channel}?popout=true&autoplay=true`),
		"getVod": (video) => embed.getHtml(`//player.twitch.tv/?autoplay=true&video=${video}`)
	}
}

class FVApp {
	constructor (streamContainer, iconContainer, iconsArray, streamsArray) {
		this.streams = new StreamArea(streamContainer, streamsArray);
		this.icons = new IconArea(iconContainer, this.streams, iconsArray);
	}
}

class PageElement {
	constructor (selector) {
		this.element = $(selector);
		this.position = {
			x: null,
			y: null,
			z: null
		};
		this.visible = 1;
	}
	move () {

	}
	resize () {

	}
}

class User {

}

class MenuArea extends PageElement {

}

class Menu {

}

class StreamArea extends PageElement {
	constructor (streamContainer, streamsArray) {
		super(streamContainer)
		this.streams = streamsArray || [];
		this.activeStream = null;
	}
	load () {

	}
	update () {

	}
	addStream (stream) {
		if (this.findStream(stream) > -1) this.removeStream(stream);
		this.activeStream = stream;
		stream.create();
		stream.parentObj = this;
		this.element.append( stream.jqEl );
		this.streams.push( stream );
	}
	findStream (stream) {
		return this.streams.indexOf(stream)
	}
	removeStream (stream) {
		stream.jqEl.remove();
		this.streams.splice(this.findStream(stream), 1);
	}
	clear () {

	}
	save () {

	}
}

class Stream {
	constructor (site, channel) {
		this.site = site;
		this.channel = channel;
		this.jqEl = null;
		this.parentObj = null;
		this.selected = 0;
		this.ratio = {
			"A": 16,
			"B": 9
		}
		this.ratioLocked = 1;
	}
	create () {
		const div = $('<div>').addClass('streamwrap');
		const iframe = embed[this.site].getStream( this.channel );
		this.jqEl = div.html(iframe);
	}
	destroy () {
		if (this.el) this.el.remove();
		this.jqEl = null;
	}
}

class IconArea extends PageElement {
	constructor (iconContainer, controlArea, iconsArray) {
		super(iconContainer);
		this.controlArea = controlArea;
		this.input = iconsArray || [];
		this.icons = [];
		this.updateRate = 120000;
	}
	load () {
		if (this.icons.length) this.clear();
		const end = this.input.length;
		for (let i =0; i < end; i++) {
			let icon = new Icon(this.input[i]);
			this.addIcon(icon);
		}
	}
	update () {

	}
	addIcon (icon) {
		if (this.findIcon(icon) > -1) this.removeIcon(icon);
		icon.create();
		icon.parentObj = this;
		this.element.append( icon.jqEl );
		this.icons.push(icon);
	}
	findIcon (icon) {
		return this.icons.indexOf(icon)
	}
	removeIcon (icon) {
		icon.jqEl.remove();
		this.icons.splice( this.findIcon(icon), 1 );
	}
	clear () {
		console.log('icons cleared');
		this.element.empty();
		this.icons = [];
	}
	save () {

	}
}

class Icon {
	constructor (obj) {
		this.jqEl = null;
		this.parentObj = null;
		this.site = obj.site;
		this.channel = obj.channel;
		this.name = obj.name;
		this.imgHtml = `<img src='${ obj.icon }'>`;
	}
	create () {
		const div = $('<div>').addClass('icon tooltip n');
		const label = `<span class='bubble'><span class='arrow'></span>${this.name}</span>`;
		const img = this.applyBorder( this.imgHtml );
		div.append( label, img );
		div.click( this.click.bind(this) );
		this.jqEl = div;
	}
	destroy () {

	}
	click () {
		console.log(this);
		const controlArea = this.parentObj.controlArea;
		const stream = controlArea.activeStream;
		stream.site = this.site;
		stream.channel = this.channel;
		controlArea.addStream(stream);
	}
	hover () {

	}
	update () {

	}
	pickColor (brightness) {
		const generateColor = () => '#' + '000000' + ( parseInt( parseInt( this.channel.replace('_', ''), 36 ).toExponential().slice(2, -5), 10 ) & 0xFFFFFF ).toString(16).toUpperCase().slice(-6);
	    const num = parseInt(generateColor().slice(1), 16),
        amt = Math.round(2.55 * brightness),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
	    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
	}
	applyBorder (el) {
		const highlight = this.pickColor(30);
		const shadow = this.pickColor(0);
		const borderStyle = {
			'border': '2px solid',
			'border-top-color': highlight,
			'border-right-color': highlight,
			'border-bottom-color': shadow,
			'border-left-color': shadow,
			'border-radius': '4px'
		};
		return $(el).css(borderStyle);
	}
}

class ChatArea extends PageElement {

}

class Chat {

}

class TickerArea extends PageElement {

}

class Ticker {

}

class InputArea extends PageElement {

}

class WaifuBox {

}

class BetArea extends PageElement {

}

class Bet {

}

class PollArea extends PageElement {

}

class Poll {

}