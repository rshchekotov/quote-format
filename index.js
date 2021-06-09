const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cclear = () => ctx.clearRect(0,0,canvas.width,canvas.height);
const COLOR_CONF = {
	"bg_first": "#008744",
	"bg_second": "#008888",
	"quote": "#ffffff",
	"dk": "#64CEF6",
	"number": "#C5DCF2",
};
let state = {
	day: Math.floor(new Date().getTime()/(1000*60*60*24))-18706,
	theme: { index: -1, cached: false },
	quote: null
};
let gradients = [];

async function loadGradients() {
	let doc = await fetch('https://raw.githubusercontent.com/ghosh/uiGradients/master/gradients.json');
	let res = await doc.json();
	res = res.filter(gradient => gradient.colors.length === 2);
	gradients = res.map(gradient => gradient.colors);
}

function choose(array) {
	return array[Math.floor(Math.random()*array.length)];
}

function weightedChoose(array) {
  let counter = array.reduce((prev, cur) => {
    return { w: prev.w + cur.w, obj: prev.obj };
  }).w;

  let rand = Math.floor(Math.random() * counter);

  counter = 0;
  let val = undefined;
  array.every((elem) => {
    counter += elem.w;
    if (counter > rand) {
      val = elem.obj;
      return false;
    }
    return true;
  });
  return val;
}

function breakText(text, len) {
	let lines = [];
	let buffer = '';
	
	for(let line of text.split('\n')) {
		for(let word of line.split(/\s+/g)) {
			let tw = ctx.measureText(`${buffer} ${word}`);
			if(tw.width > len) {
				lines.push(buffer);
				buffer = word;
			} else {
				if(buffer.length > 0) buffer += ` ${word}`;
				else buffer = word;
			}
		}
		lines.push(buffer);
		buffer = '';
	}
	return lines;
}

function dk(x, y, r) {
	let defW = ctx.lineWidth;
	let defC = ctx.lineCap;
	let defS = ctx.strokeStyle
	
	ctx.lineWidth = 5;
	ctx.lineCap = 'round';
	ctx.strokeStyle = COLOR_CONF['dk'];
	
	ctx.beginPath();
	ctx.moveTo(x + r*Math.sqrt(2)*Math.cos(Math.PI/4), y - r*Math.sqrt(2)*Math.sin(Math.PI/4));
	ctx.lineTo(x,y);
	ctx.lineTo(x,y+r);
	ctx.arc(x,y,r,Math.PI/2,3*Math.PI/2,false);
	ctx.lineTo(x,y);
	ctx.lineTo(x + r*Math.sqrt(2)*Math.cos(Math.PI/4), y + r*Math.sqrt(2)*Math.sin(Math.PI/4));
	ctx.stroke();
	
	ctx.lineWidth = defW;
	ctx.lineCap = defC;
	ctx.strokeStyle = defS;
}

function gear(x, y, radius) {
	let prev = ctx.fillStyle;
	ctx.fillStyle = '#808080';
	ctx.beginPath();
	for(let i = 0; i < 8; i++) {
		let arcEndAngle = Math.PI/24 + i * Math.PI/4;
		ctx.arc(x, y, radius, arcEndAngle - 2*Math.PI/12, arcEndAngle, false);
		
		// Some Magic Math
		let cx = x + 1.2*radius*Math.cos(arcEndAngle);
		let cy = y + 1.2*radius*Math.sin(arcEndAngle);
		let nx = x + 1.2*radius*Math.cos(arcEndAngle + Math.PI/12);
		let ny = y + 1.2*radius*Math.sin(arcEndAngle + Math.PI/12);
		let mx = (nx+cx)/2;
		let my = (ny+cy)/2;
		let ul = Math.sqrt(Math.pow(mx-x,2) + Math.pow(my-y,2));
		
		ctx.lineTo(cx+0.1*radius*(mx-x)/ul, cy+0.1*radius*(my-y)/ul);
		ctx.lineTo(nx+0.1*radius*(mx-x)/ul, ny+0.1*radius*(my-y)/ul);
		ctx.lineTo(5 * (nx - x) / 6 + x, 5 * (ny - y) / 6 + y);
	}
	ctx.fill();
	
	ctx.fillStyle = prev;
	ctx.beginPath();
	ctx.arc(x, y, 0.6*radius, 0, 2*Math.PI, false);
	ctx.fill();
}

function box(x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x, y+r);
	ctx.quadraticCurveTo(x, y, x+r, y);
	ctx.lineTo(x+w-r, y);
	ctx.quadraticCurveTo(x+w, y, x+w, y+r);
	ctx.lineTo(x+w, y+h-r);
	ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
	ctx.lineTo(x+r, y+h);
	ctx.quadraticCurveTo(x, y+h, x, y+h-r);
	ctx.lineTo(x, y+r);
	ctx.fill();
}

function cacheQuote() {
	if(state.quote) {
		state.quote.cached = true;
	}
}

function cacheTheme() {
	if(state.theme) {
		state.theme.cached = true;
	}
}

function formatQuote(args) {
	if(!args || !args.quote || !args.author || !args.number) {
		console.error("Couldn't find required properties in argument!");
		return;
	}
	
	cclear();
	let linear = ctx.createLinearGradient(0, 200, 600, 200);
	let grad;
	if(state.theme && state.theme.cached) grad = gradients[state.theme.index];
	else {
		grad = choose(gradients);
		state.theme = { index: gradients.indexOf(grad), cached: false };
	}
	
	linear.addColorStop(0, grad[0] || COLOR_CONF['bg_first']);
	linear.addColorStop(1, grad[1] || COLOR_CONF['bg_second']);
	ctx.fillStyle = linear;
	box(10, 10, 580, 380, 50);
	
	args.quote = `"${args.quote}"\n\n~ ${args.author}`;
	let lines = [];
	let base = 34;
	let lh = base;
	
	do {
		if(base < 32) console.log(`Downscaling to ${base}`);
		
		if(base < 0) {
			lines = ['Formatting Error'];
			console.error('Failed Loading: ' + JSON.stringify(args));
			base = 32;
			lh = 32;
			break;
		}
		base -= 2;
		ctx.font = `${base}px Indie Flower, cursive`;
		ctx.fillStyle = COLOR_CONF['quote'];
		
		let dim = ctx.measureText(args.quote);
		lh = dim.width/args.quote.length;
		
		lines = breakText(args.quote, 540);	
	} while(lines.length > 8 && lh * 16 > 130);
	
	for(let i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], 37, 60 + i * (2.5*lh + 8));
	}
	
	ctx.fillStyle = COLOR_CONF['number'];
	ctx.strokeStyle = COLOR_CONF['number'];
	let nw = ctx.measureText(args.number).width;
	ctx.fillText(args.number, 30, 360);
	ctx.beginPath();
	ctx.moveTo(30, 365);
	ctx.lineTo(30+nw, 365);
	ctx.stroke();
	dk(540,340,20);
}

async function loadRandom(num) {	
	let urls = [
		{ w: 1, obj: 'http://quotes.stormconsultancy.co.uk/random.json'},
		{ w: 9, obj: 'https://type.fit/api/quotes'}
	];
	
	let url = weightedChoose(urls);
	
	let res = await fetch(url);
	if(!res || !res.ok) return -1;
	let body = await res.json();
	
	// Data Parsing
	let data;
	if(url === urls[0].obj) data = { quote: body.quote, author: body.author || 'Unknown' };
	else if(url === urls[1].obj) {
		let q = Math.floor(Math.random()*body.length);
		data = { quote: body[q].text, author: body[q].author || 'Unknown' }
	}
	
	if(!state.quote || !state.quote.cached) state.quote = data;
	else data = state.quote;
	await formatQuote(Object.assign({ number: num }, data));
}

loadGradients();
loadRandom(state.day);
canvas.addEventListener('click', () => loadRandom(state.day));
