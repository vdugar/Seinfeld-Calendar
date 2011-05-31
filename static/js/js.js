var highlighted={
'jan':[],'feb':[],'mar':[],'apr':[],'may':[],'jun':[],'jul':[],'aug':[],'sep':[],'oct':[],'nov':[],'dec':[]
};
var months_days = [31,28,31,30,31,30,31,31,30,31,30,31];
var months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']; 
var abc, today, yesterday;

var updateStreak=function(dates){
	console.log(dates);
	var start=dates['start_date'].split('/') ,end=dates['end_date'].split('/');
	var start_month=parseInt(start[0]), end_month=parseInt(end[0]), start_day=parseInt(start[1]), end_day,i;

	while(start_month<=end_month)
	{
		if(start_month==end_month)
			end_day=parseInt(end[1]);
		else end_day=months_days[start_month-1];
		for(i=start_day;i<=end_day;i++)
		{
			$('.'+months[start_month-1]).children('.'+i).addClass('highlight');
		}
		start_month++;
		start_day=1;	
	}
};

var setMissed = function(startDate,today){
	var start = startDate.split('/');
	
	$('.'+months[start[0]-1]).children('.'+start[1]).addClass('start');

	var endD = today.getDate();
	var end_month = today.getMonth()+1;

	console.log(end_month);
	
	var start_month=parseInt(start[0]), start_day=parseInt(start[1]);
	while(start_month<=end_month)
	{
		if(start_month==end_month){
			end_day=endD;
			console.log(end_day);
			console.log(end_month);}
		else end_day=months_days[start_month-1];
		for(i=start_day;i<=end_day;i++)
		{
			$('.'+months[start_month-1]).children('.'+i).not('.highlight').addClass('miss');
		}
		start_month++;
		start_day=1;	
	}
};
var makeCurrentEditable=function(){
	//Makes the curerent and previous days editable, provided they aren't previously highlighted
	
	var possible= [$('div.'+months[today.getMonth()]).children('div.'+today.getDate()).not('.highlight'), $('div.'+months[yesterday.getMonth()]).children('div.'+yesterday.getDate()).not('.highlight')];
	
	$.each(possible, function(idx, el){
		if(el.length!=0) {
			el.removeClass('miss');
			el.addClass('editable');
		}
	})
	$("div.editable").click(function(event){
		var $divs = $(this);
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
	
		//Set heigth and width to mask to fill up the whole screen
		$('#mask').css({'width':maskWidth,'height':maskHeight});
		
		//transition effect		
		$('#mask').fadeIn(1000);	
		$('#mask').fadeTo("slow",0.8);	
	
		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();
              
		//Set the popup window to center
		$('.window').css('top',  winH/2-$('.window').height()/2);
		$('.window').css('left', winW/2-$('.window').width()/2);
	
		//transition effect
		$('.window').fadeIn(2000); 
		
		$('.window .close').click(function () {
		//Cancel the link behavior
			
			$('#mask').hide();
			$('.window').hide();
			onClickDay($divs);
			
		});		

		//if mask is clicked
			$('#mask').click(function () {
			$('#mask').hide();
			$('.window').hide();
		});
		
		
    });
};

var onClickDay = function($curr_day){
	var streak={}, $prevDiv, curr_date, prev_date, streak_string;
	
	//Getting the previous div in the streak
	if($curr_day.hasClass('1'))
		$prevDiv=$curr_day.parent().prev().children(':last');
	else $prevDiv=$curr_day.prev();
	
	//Figuring out the date on the div that's been clicked
	if($curr_day.hasClass(today.getDate().toString())){
		//today's div has been clicked
		curr_date=today;
		prev_date=yesterday;
	}
	else {
		curr_date=yesterday;
		prev_date=new Date();
		prev_date.setDate(curr_date.getDate()-1);
	}
	
	//Figuring out if it's an old streak or a new one
	if($prevDiv.hasClass('highlight')){
		//This is an old streak
		streak['old_streak']={'old_end':(prev_date.getMonth()+1)+'/'+prev_date.getDate(), 'new_end':(curr_date.getMonth()+1)+'/'+curr_date.getDate()};
	}
	else {
		//This is a new streak
		streak['new_streak']={'today':(curr_date.getMonth()+1)+'/'+curr_date.getDate()}
	}
	//Posting data to the server
	console.log(streak);
	streak_string=JSON.stringify(streak);
	console.log(streak_string);
	$.ajax({
		url:'post_streak/',
		data:streak_string,
		type:'POST',
		success: function(value) {
		($curr_day).unbind('click');
		($curr_day).addClass('highlight');
		
		//Get the screen height and width
			
		}
	});
};	

function toggle_editor(){
	if(!($('#title').hasClass('editing'))){
		$('#title').addClass('editing');
		$('#title').select();
		$('#tools').show();
	}
}

function cancel_edit(){
		$('#title').val("Click to set your message");
		$('#tools').hide();
		$('#title').removeClass('editing');
		$('#title').blur();
	}
	
function save(){
	new_title = $('#title').val();
	$('#title').val(new_title);
	$('#tools').hide();
	$('#title').removeClass('editing');
	$('#title').blur();
}


$(document).ready(function(){

	//CSRF stuff
	$(document).ajaxSend(function(event, xhr, settings) {
	    function getCookie(name) {
	        var cookieValue = null;
	        if (document.cookie && document.cookie != '') {
	            var cookies = document.cookie.split(';');
	            for (var i = 0; i < cookies.length; i++) {
	                var cookie = jQuery.trim(cookies[i]);
	                // Does this cookie string begin with the name we want?
	                if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                    break;
	                }
	            }
	        }
	        return cookieValue;
	    }
	    function sameOrigin(url) {
	        // url could be relative or scheme relative or absolute
	        var host = document.location.host; // host + port
	        var protocol = document.location.protocol;
	        var sr_origin = '//' + host;
	        var origin = protocol + sr_origin;
	        // Allow absolute or scheme relative URLs to same origin
	        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
	            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
	            // or any other URL that isn't scheme relative or absolute i.e relative.
	            !(/^(\/\/|http:|https:).*/.test(url));
	    }
	    function safeMethod(method) {
	        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	    }

	    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
	        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	    }
	});
	//end of CSRF stuff
	
	
	var width = $(window).width();
	if(width<1024)
	width = 1024;
	width = width -100;
	
	quo = width + 32- (width%32);
	
	boxWidth = (quo/32)-4;
	$('.wrap').width(quo+2);
	$('.daylabel').width(boxWidth+4);
	$('.label').width(boxWidth);
	$('.day').width(boxWidth);
	$('.day').height(boxWidth);
	

	
	$.ajax({
		url:'get_streaks/',
		dataType:'json',
		async:false,
		success: function(query) {
			
			$.each(query['data'],function(idx,el) {
				updateStreak(el);
			
			});
		}
	});
	
	//Setting today's and yesterday's date
	today=new Date();
	yesterday=new Date();
	yesterday.setDate(today.getDate()-1);
	
	setMissed('02/24', today);
	makeCurrentEditable();

   
});

