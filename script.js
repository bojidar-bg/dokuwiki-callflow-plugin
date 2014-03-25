/* DOKUWIKI:include raphael.js */

;style = 
{
	margin:70,
	txtsize:15,
	titlesize:20,
	linespacing:30,//note: MUST be bigger than txtsize
	colspacing:120,
	strokewidth:1.5,//for arrows and breaks
	strokecolor:"#000",
	txtcolor:"#000",
	bgr:"#FFF",
	cols:
	{
		minlen:80,
		height:30,
		rectradius:0,
		fill:"#FFF",
		txtcolor:"#000"
	},
	note:
	{
		margin:8,
		rectradius:5,
		fill:"180-#FFFFCC-#FFFFFF",
		align:"center"
	},
	tooltip:
	{
		txtsize:12,
		txtcolor:"#000",
		border:"#FFFF99",
		bgr:"#FFFF99"
	}
};


iconfolder = "./lib/plugins/callflow";//would start at docuwiki/
var paper,typenum=-1;
var callActors = [];

Raphael.el.tooltip = function (paper,x,y,text) {
  this.bb = paper.text((x+x/4),(y-y/16),text).attr({"font-size":style.tooltip.txtsize,"fill":style.tooltip.txtcolor});
  BB = this.bb.getBBox();
  this.tp = paper.rect(BB.x-4,BB.y-2,BB.width+8,BB.height+4).attr({"fill":style.tooltip.bgr,"stroke":style.tooltip.border});
  this.tp.ox = 0;
  this.tp.oy = 0;
  this.tp.hide();
  this.bb.hide();
  this.hover(
    function(event) { 
      this.tp.show().toFront();
      this.bb.show().toFront();
    }, 
    function(event) {
      this.tp.hide();
      this.bb.hide();
    }
  );
  return this;
};

//from here to END1 the code is from:
//http://stackoverflow.com/questions/1229518/javascript-regex-replace-html-chars
var replaceHtmlEntites = (function() {
  var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  var translate = {
    "nbsp": " ", 
    "amp" : "&", 
    "quot": "\"",
    "lt"  : "<", 
    "gt"  : ">"
  };
  return function(s) {
    return ( s.replace(translate_re, function(match, entity) { 
      return translate[entity]; 
    }) );
  }
})();
//END1
//from here to END2 the code is from:
//http://stackoverflow.com/
if (!String.prototype.trim) String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, '');};
String.prototype.ltrim = function(){return this.replace(/^\s+/,'');};
String.prototype.rtrim = function(){return this.replace(/\s+$/,'');};
//END3

getElementsByAttribute = function(a,b)
{
	var output = [],j=0;
	//from here to END4 the code is from:
	//http://stackoverflow.com/questions/8396541/javascript-to-get-elements-by-its-attribute
	var arr_elms = [];
	arr_elms = document.getElementsByTagName("pre");
	var elms_len = arr_elms.length;
	for (var i = 0; i < elms_len; i++) {
		if(arr_elms[i].getAttribute(a) == b)//changed this line to suite my needs from:
		//if(arr_elms[i].getAttribute("someAttribute") != null)
		{
			output[j++] = arr_elms[i]//changed this line to suite my needs from:
		}
	}
	//END4
	return output;
};

String.prototype.ssplit = function(by)
{
	posDelimiter = this.indexOf(by);
	if(posDelimiter>0)return [this.substring(0, posDelimiter),this.substring(posDelimiter+by.length)];
	else return [this];
};
checkActors = function()
{
	aParsedCommands[curCommand][0]+=" ";
	aParsedCommands[curCommand][1]+=" ";
	if(!callActors[aParsedCommands[curCommand][0]] && aParsedCommands[curCommand][0]!=null)
	{
		//fline[curActor] = aParsedCommands[curCommand][0];
		//callActors[fline[curActor]]=1;
		callActors[aParsedCommands[curCommand][0]] = (style.margin+style.cols.minlen)/2+style.colspacing*curActor;
		curActor++;
	}
	if(!callActors[aParsedCommands[curCommand][1]]&&aParsedCommands[curCommand][1]!=null)
	{
		//fline[curActor] = aParsedCommands[curCommand][1];
		//callActors[fline[curActor]]=1;
		callActors[aParsedCommands[curCommand][1]] = (style.margin+style.cols.minlen)/2+style.colspacing*curActor;
		curActor++;
	}
};

draw = function(el)
{
	callCode = el.innerHTML;
	callCode = replaceHtmlEntites(callCode.replace(/<br>/gi,"\n"));
	callCode = callCode.replace(/\n[\n]+/gm,"\n");
	aCommands = callCode.split("\n");
	
	el.style.clear = "both";
	el.innerHTML = "";
	
	delete paper;
	paper = Raphael(el,0,0);
	
	callActors = [];
	
	callActors = [];
	aParsedCommands = [];
	curCommand = 0;
	curActor = 0;
	title = "";
	bInNote = 0;
//==============================================Parsing==============================================
	for(i = 0; i < aCommands.length; i++)
	{
		if(aCommands[i].match(/^\/\//)) continue;      //comment
		
		if(bInNote)//if in note it would not execute commands
		{
			if(matched = aCommands[i].match(/^\)/))//note stop
			{
				aParsedCommands[curCommand] = [];
				aParsedCommands[curCommand][3] = "note-stop";
				aParsedCommands[curCommand][4] = i;
				curCommand++;
				bInNote=0;
			}
			else continue;
		}
		//----------------------------------------------arrows
		else if(matched = aCommands[i].match(/^(.+)<-?>([^:]+):?([^:]+):?(.*)/))     //double arrow
		{
			aParsedCommands[curCommand] = [matched[1], matched[2], matched[3], matched[4], "double-arrow", i];
			
			checkActors();
			curCommand++;
		}
		else if(matched = aCommands[i].match(/^(.+)->([^:]+):?([^:]+):?(.*)/))       //arrow
		{
			aParsedCommands[curCommand] = [matched[1], matched[2], matched[3], matched[4], "arrow", i];
			
			checkActors();
			curCommand++;
		}
		else if(matched = aCommands[i].match(/^(.+)<-([^:]+):?([^:]+):?(.*)/))       //back arrow
		{
			aParsedCommands[curCommand] = [matched[2], matched[1], matched[3], matched[4], "arrow", i];
			
			checkActors();
			curCommand++;
		}
		//----------------------------------------------parallel
		else if(matched = aCommands[i].match(/parallel[ ]*\{/))          //start
		{
			aParsedCommands[curCommand] = [0, 0, 0, "parallel-start", i];
			curCommand++;
		}
		else if(matched = aCommands[i].match(/^}/))                       //stop
		{
			aParsedCommands[curCommand] = [0, 0, 0, "parallel-stop", i];
			curCommand++;
		}
		//----------------------------------------------notes
		else if(matched = aCommands[i].match(/note over ([^,]*),?([^(]*)\(/))  //note over start
		{
			actor2 = (matched[2] != '')?matched[2] : matched[1];
			aParsedCommands[curCommand] = [matched[1], actor2, 0, "note-over", i];
			checkActors();
			curCommand++;
			bInNote=1;
		}
		else if(matched = aCommands[i].match(/note ?\(/))            //note start
		{
			aParsedCommands[curCommand] = [0, 0, 0, "note", i];
			curCommand++;
			bInNote=1;
		}
		//----------------------------------------------break
		else if(matched = aCommands[i].match(/break:?(.*)/))           //break
		{
			aParsedCommands[curCommand] = [0, 0, matched[1], "break", i];
			curCommand++;
		}
		//----------------------------------------------title
		else if(matched = aCommands[i].match(/title:(.+)/))          //title
		{
			title = matched[1];
		}
	}
	if(bInNote) aParsedCommands[curCommand] = [0,0,"note-stop",aCommands.length];
	
//==============================================Drawing==============================================
	for(i in callActors)
	{
		paper.rect(
			callActors[i]-style.cols.minlen/2,// x
			20+(title?style.titlesize:0),	// y
			style.cols.minlen,		// width
			style.cols.height,		// height
			style.cols.rectradius)		// corner radius
		.attr("fill",style.cols.fill);
		
		paper.text(callActors[i],		// center x
			   5+style.cols.height+(title?style.titlesize:0),// center y
			   i)				// text
		.attr({"font-size":style.txtsize, "fill":style.cols.txtcolor});
	}
	y = style.cols.height*2+10;//starting y
	if (title) y += style.titlesize;
	isParallel = 0;
	n = 0;
	breaks = [];
	for(i = 0; i < aParsedCommands.length; i++)
	{
		bShouldIncrement = 1;
		cmd = aParsedCommands[i];
		if(cmd[4]=="arrow")
		{
			paper.path(
				"M"+callActors[cmd[0]]+","+y+ // from
				"L"+callActors[cmd[1]]+","+y  // to
			).attr({
				"arrow-end":"block-wide-long",
				"stroke-width":style.strokewidth,
				"stroke":style.strokecolor
			});
			BB = paper.text(	//text above arrow
				(callActors[cmd[0]]+callActors[cmd[1]])/2,
				 y-style.txtsize/2-2,
				cmd[2]
			).tooltip(		//show text tooltip on hover
				paper,
				(callActors[cmd[0]]+callActors[cmd[1]])/2,
				y-style.txtsize/2-2,
				cmd[3]
			).attr({
				"font-size":style.txtsize,
				"fill":style.txtcolor
			}).getBBox();
			paper.rect(BB.x,BB.y,BB.width,BB.height).attr({"stroke":"none","fill":style.bgr}).toBack();//background box
		}
		else if(cmd[4]=="double-arrow")
		{
			paper.path(
				"M"+callActors[cmd[0]]+","+y+ // from
				"L"+callActors[cmd[1]]+","+y  // to
			).attr({
				"arrow-end":"block-wide-long",
				"stroke-width":style.strokewidth,
				"stroke":style.strokecolor
			});
			paper.path(
				"M"+callActors[cmd[1]]+","+y+ // from
				"L"+callActors[cmd[0]]+","+y  // to
			).attr({
				"arrow-end":"block-wide-long",
				"stroke-width":style.strokewidth,
				"stroke":style.strokecolor
			});
			BB = paper.text(	//text above arrow
				(callActors[cmd[0]]+callActors[cmd[1]])/2,
				 y-style.txtsize/2-2,
				cmd[2]
			).tooltip(		//show text tooltip on hover
				paper,
				(callActors[cmd[0]]+callActors[cmd[1]])/2,
				y-style.txtsize/2-2,
				cmd[3]
			).attr({
				"font-size":style.txtsize,
				"fill":style.txtcolor
			}).getBBox();
			paper.rect(BB.x,BB.y,BB.width,BB.height).attr({"stroke":"none","fill":style.bgr}).toBack();
		}
		else if(cmd[3]=="parallel-start")
		{
			isParallel=1;
		}
		else if(cmd[3]=="parallel-stop")
		{
			if (!isParallel) bShouldIncrement = 0;
			isParallel = 0;
		}
		else if(cmd[3]=="note" || cmd[3]=="note-over")
		{
			midx=0;
			ml=0;
			if(cmd[3] == "note")//find the position of the note
			{
				for(curCommand = i;curCommand > -1;curCommand--)
				{
					if(aParsedCommands[curCommand][3].match("arrow"))
					{
						midx = (callActors[aParsedCommands[curCommand][0]]+callActors[aParsedCommands[curCommand][1]])/2;
						break;
					}
				}
			}
			else if(cmd[3]=="note-over")
			{
				midx = (callActors[cmd[0]]+callActors[cmd[1]])/2;
				ml = style.colspacing;
			}
			else 
			{
				midx = callActors[cmd[1]];
			}
			if(!midx)continue;
			lasti = i;
			while(i < aParsedCommands.length && aParsedCommands[i][3] != "note-stop")//find stop
			{
				i++;
			}
			note = "";
			noteHeight=0;
			for(curCommand = aParsedCommands[lasti][4]+1;curCommand<aParsedCommands[((i==aParsedCommands.length)?i-1:i)][4];curCommand++)//then text
			{
				note+=aCommands[curCommand]+"\n";
				noteHeight+=style.txtsize;
			}
			if(!note)continue;//if there is no text it won't draw anything
			t = paper.text(midx,y+noteHeight/2,note).attr("font-size",style.txtsize);//text
			BB = t.getBBox();//bounding box
			
			if(!style.note.align||style.note.align=="left")t.attr({"x":BB.x,"text-anchor":"start"});//left align
			
			else if(style.note.align=="right")t.attr({"x":BB.x+BB.width,"text-anchor":"end"});//right align
			
			paper.rect(
				BB.x-style.note.margin,
				BB.y-style.note.margin,
				BB.width+style.note.margin*2,
				BB.height+style.note.margin*2,
				style.note.rectradius)
				.attr("fill",style.note.fill);
			t.toFront();//gets the text in front of the rect
			y += noteHeight+style.txtsize;
		}
		else if(cmd[3]=="break")
		{
			breaks[n] = [];
			breaks[n][0] = y;
			breaks[n][1] = (cmd[2]?cmd[2]:"");//save for later
			n++;
		}
		else
		{
			bShouldIncrement = 0;//don't increment y
		}
		if(bShouldIncrement&&!isParallel)y+=style.linespacing;
	}
	y-=style.linespacing-10;
	maxx=0;
	for(i in callActors)//find max(callActors) and draw bottom rects and paths
	{
		maxx = Math.max(callActors[i],maxx);
		paper.path("M"+callActors[i]+","+y+ // from
		"L"+callActors[i]+","+(20+(title?style.titlesize:0))) // to
		.attr("stroke",style.strokecolor).toBack();
		paper.rect(
			callActors[i]-style.cols.minlen/2,
			y,
			style.cols.minlen,
			style.cols.height,
			style.cols.rectradius)
			.attr("fill", style.cols.fill);
		paper.text(
			callActors[i],
			y+style.cols.height/2,
			i)
			.attr({"font-size":style.txtsize, "fill":style.cols.txtcolor});
	}
	for(i in breaks)//draw breaks
	{
		paper.path(
			"M"+(breaks[i][1]?0:style.margin/2)+","+breaks[i][0]+ // from
			"L"+(breaks[i][1]?(maxx+style.margin):(maxx+style.margin-style.cols.minlen/2))+","+breaks[i][0]) // to
		.attr({"stroke-dasharray":"--", "stroke-width":style.strokewidth, "stroke":style.strokecolor});
		if(breaks[i][1])
		{
			paper.text(10,
				breaks[i][0]-style.txtsize/2,
				breaks[i][1])
				.attr({"font-size":style.txtsize,"text-anchor":"start","fill":style.txtcolor});
		}
	}
	if(title)//draw title
	{
		paper.text((maxx+style.margin)/2,
			10+style.titlesize/2,
			title)
			.attr({"font-size":style.titlesize, "fill":style.txtcolor});
	}
	paper.rect(0,  0,  maxx+style.margin,  y+(style.cols.height+20))
		.attr({"fill":style.bgr, "stroke-dasharray":"."}).toBack();//dashed border
	paper.setSize(maxx+style.margin,y+(style.cols.height+20))//resize paper so it fits
	
		
};
window.onload = function()
{
	callflows = getElementsByAttribute("callflow","true");
	for(var i = 0, max = callflows.length; i < max; i++)
	{
		draw(callflows[i]);
	}
};
