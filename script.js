/* DOKUWIKI:include raphael.js */

;style =
{
	margin:JSINFO['plugin_callflow']['margin'],
	txtsize:JSINFO['plugin_callflow']['txtsize'] ,
	titlesize:JSINFO['plugin_callflow']['titlesize'],
	linespacing:JSINFO['plugin_callflow']['linespacing'],//note: MUST be bigger than txtsize
	colspacing:JSINFO['plugin_callflow']['colspacing'],
	strokewidth:JSINFO['plugin_callflow']['strokewidth'],//for arrows and breaks
	strokecolor:JSINFO['plugin_callflow']['strokecolor'] ,
	txtcolor:JSINFO['plugin_callflow']['txtcolor'] ,
	bgr:JSINFO['plugin_callflow']['bgr'],
	cols:
	{
		minlen:JSINFO['plugin_callflow']['cols_minlen'],
		height:JSINFO['plugin_callflow']['cols_height'],
		rectradius:JSINFO['plugin_callflow']['cols_rectradius'],
		fill:JSINFO['plugin_callflow']['cols_fill'],
		txtcolor:JSINFO['plugin_callflow']['cols_txtcolor']
	},
	note:
	{
		margin:JSINFO['plugin_callflow']['note_margin'],
		rectradius:JSINFO['plugin_callflow']['note_rectradius'],
		fill:JSINFO['plugin_callflow']['note_fill'],
		align:JSINFO['plugin_callflow']['note_align']
	},
	tooltip:
	{
		txtsize:JSINFO['plugin_callflow']['tooltip_txtsize'],
		txtcolor:JSINFO['plugin_callflow']['tooltip_txtcolor'],
		border:JSINFO['plugin_callflow']['tooltip_border'],
		bgr:JSINFO['plugin_callflow']['tooltip_background']
	}
};


iconfolder = "./lib/plugins/callflow";//would start at docuwiki/
var paper,typenum=-1;
var callActors = [];

Raphael.el.tooltip = function (paper,x,y,text) {
  // No tooltip if text is empty
  if (!text) {return this;}

  this.bb = paper.text(x,(y+style.txtsize/2)+10,text).attr({"font-size":style.tooltip.txtsize,"fill":style.tooltip.txtcolor, 'text-anchor': 'start'});
  var BB = this.bb.getBBox();
  // Translate of tooltip height/2 for multi line TT
  // BB.y is automatically updated
  this.bb.translate(0,BB.height/2);

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
		callActors[aParsedCommands[curCommand][0]] = (style.margin+l_colsminlen)/2+l_colspacing*curActor;
		curActor++;
	}
	if(!callActors[aParsedCommands[curCommand][1]]&&aParsedCommands[curCommand][1]!=null)
	{
		//fline[curActor] = aParsedCommands[curCommand][1];
		//callActors[fline[curActor]]=1;
		callActors[aParsedCommands[curCommand][1]] = (style.margin+l_colsminlen)/2+l_colspacing*curActor;
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
	// Local copy of default values
	l_colsminlen = style.cols.minlen;
	l_colspacing = style.colspacing;
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
		//--- Directive to force order
		/*
		 * B<-A still puts A in first position
		 * order allows to workaround that by having control on where items appear
		 * ex graph:

		    A
		 B<-A
		    A->C

		 * ex code:

		order:B
		order:A
		order:C
		A<>A:do something
		A->B:ask something
		A->C:send something


		 * or even the following only forces B in the first place, others use natural order:
		order:B
		A<>A:do something
		A->B:ask something
		A->C:send something

		*/
		else if(matched = aCommands[i].match(/^order:(.+)/))       //order
		{
			aParsedCommands[curCommand] = [matched[1], matched[1], "", "", "", i];

			checkActors();
			curCommand++;
		}
		/* ------ Allow to change colwidth for each callflow tag
		 * Must be in the first lines, ignored as after first actor is found
		 */
		else if(curActor == 0 && (matched = aCommands[i].match(/colwidth:(.+)/)))     //colwidth
		{
			l_colsminlen = parseInt(matched[1]);
			l_colspacing = l_colsminlen + 40;
		}
	}
	if(bInNote) aParsedCommands[curCommand] = [0,0,"note-stop",aCommands.length];

//==============================================Drawing==============================================
	for(i in callActors)
	{
		paper.rect(
			callActors[i]-l_colsminlen/2,// x
			20+(title?style.titlesize:0),	// y
			l_colsminlen,		// width
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
		if(cmd[4] == "arrow" || cmd[4] == "double-arrow")
		{
			// if start and dest are the same, skip the arrow
			if (cmd[0] != cmd[1]) {
				// Draw a blank line where the line will be to clearly cut columns marker
				var adjStart = style.strokewidth/2;
				var adjEnd = -style.strokewidth/2;
				if (callActors[cmd[0]] > callActors[cmd[1]]) {
					adjStart = -style.strokewidth/2;
					adjEnd = style.strokewidth/2;
				}
				paper.path(
					"M"+(callActors[cmd[0]]+adjStart)+","+y+ // from
					"L"+(callActors[cmd[1]]+adjEnd)+","+y  // to
				).attr({
					"stroke-width":style.strokewidth+5,
					"stroke":"#ffffff",
					"stroke-linecap":"butt"
				});

				// Factorized arrow and double-arrow
				var arrstart = "none";
				if (cmd[4] == "double-arrow") {
					arrstart = "block-wide-long";
				}
				paper.path(
					"M"+callActors[cmd[0]]+","+y+ // from
					"L"+callActors[cmd[1]]+","+y  // to
				).attr({
					"arrow-start":arrstart,
					"arrow-end":"block-wide-long",
					"stroke-width":style.strokewidth,
					"stroke":style.strokecolor
				});
			}
			var txt = paper.text(	//text above arrow
				(callActors[cmd[0]]+callActors[cmd[1]])/2,
				 y-style.txtsize/2-2,
				cmd[2]
			).tooltip(		//show text tooltip on hover
				paper,
				(callActors[cmd[0]]+callActors[cmd[1]])/2,
				y-style.txtsize/2-2,
				cmd[3].replace(/\\n/g,"\n")
			).attr({
				"font-size":style.txtsize,
				"fill":style.txtcolor
			});
			// Add visual hint there is a tooltip
			if (cmd[3] && txt.node) {
				jQuery(txt.node).css('text-decoration','underline').css('text-decoration-style','dashed');
			}
			var BB = txt.getBBox();
			paper.rect(BB.x,BB.y,BB.width,BB.height).attr({"stroke":"none","fill":style.bgr}).toBack();//background box
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
					if(typeof(aParsedCommands[curCommand][4]) == 'string' &&
					   aParsedCommands[curCommand][4].match("arrow"))
					{
						midx = (callActors[aParsedCommands[curCommand][0]]+callActors[aParsedCommands[curCommand][1]])/2;
						break;
					}
				}
			}
			else if(cmd[3]=="note-over")
			{
				midx = (callActors[cmd[0]]+callActors[cmd[1]])/2;
				ml = l_colspacing;
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
	cactLen = 0;
	for(i in callActors)//find max(callActors) and draw bottom rects and paths
	{
		cactLen++;
		paper.path("M"+callActors[i]+","+y+ // from
		"L"+callActors[i]+","+(20+(title?style.titlesize:0))) // to
		.attr("stroke",style.strokecolor).toBack();
		paper.rect(
			callActors[i]-l_colsminlen/2,
			y,
			l_colsminlen,
			style.cols.height,
			style.cols.rectradius)
			.attr("fill", style.cols.fill);
		paper.text(
			callActors[i],
			y+style.cols.height/2,
			i)
			.attr({"font-size":style.txtsize, "fill":style.cols.txtcolor});
	}
	maxx = cactLen*l_colspacing-style.margin/2;
	for(i in breaks)//draw breaks
	{
		paper.path(
			"M"+(breaks[i][1]?0:style.margin/2)+","+breaks[i][0]+ // from
			"L"+(breaks[i][1]?(maxx+style.margin):(maxx+style.margin-l_colsminlen/2))+","+breaks[i][0]) // to
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
