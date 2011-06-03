var highlighted={
'jan':[],'feb':[],'mar':[],'apr':[],'may':[],'jun':[],'jul':[],'aug':[],'sep':[],'oct':[],'nov':[],'dec':[]
};
var months_days = [31,28,31,30,31,30,31,31,30,31,30,31];
var months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']; 
var abc, today, yesterday, curr_title;

var updateStreak=function(dates){
	
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
	
	var start_month=parseInt(start[0]), start_day=parseInt(start[1]);
	while(start_month<=end_month)
	{
		if(start_month==end_month){
			end_day=endD;}
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
	
	var possible= [$('div.'+months[today.getMonth()]).children('div.'+today.getDate()).not('.highlight')];
	
	//Day before start_date shouldn't be editable
	if(!($('div.'+months[today.getMonth()]).children('div.'+today.getDate()).hasClass('start')))
		possible.push($('div.'+months[yesterday.getMonth()]).children('div.'+yesterday.getDate()).not('.highlight'));
	
	$.each(possible, function(idx, el){
		if(el.length!=0) {
			el.removeClass('miss');
			el.addClass('editable');
		}
	});

// Function for clicking on editable div
$("div.editable").click(function(event){
		$divs = $(this);
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
		$('#mask').css({'width':maskWidth,'height':maskHeight});
		$('#mask').fadeIn(1);	
		var winH = $(window).height();
		var winW = $(window).width();
		$('.window').css('top',  winH/2-$('.window').height()/2);
		$('.window').css('left', winW/2-$('.window').width()/2);
		$('.window').fadeIn(1000); 		
    });
};

var onClickDay = function($curr_day){

	($curr_day).unbind('click');
	($curr_day).removeClass('editable');
	($curr_day).addClass('highlight');
	
	$('.demo').html("Once you mark a day, it turns red. Repeat it for successive days and you begin to form a link. In case you miss a day, the link gets broken. To see what the calendar may look like in a few days, <a href='dummy' class='enddemo'>click here</a>");
	}



function cancel_edit(){
		$('#title').val(curr_title);
		$('#tools').hide();
		$('#title').removeClass('editing');
		$('#title').blur();
	}
	
function save(){
	$('#tools').hide();
	$('#title').removeClass('editing');
	$('#title').blur();
	
	$("div.highlight").removeClass('highlight');
	$("div.start").removeClass('start');
	$("div.miss").removeClass('miss');
	$("div.editable").removeClass('editable');
	$('.'+months[today.getMonth()]).children('.'+today.getDate()).addClass('start');
	makeCurrentEditable();
	$('.demo').html("Great! Your task has been set. The box with green border indicates the starting date. Once you complete the activity for a day, click that day's box, and set your task to completed. You can only set your task to be completed for either today or the day before.");
		
}

var setDisplay = function(){
		var width = $(window).width();
	if(width<1024)
	width = 1024;
	width = width -100;
	
	quo = width + 32- (width%32);
	
	boxWidth = (quo/32)-4;
	$('.wrap').width(quo+2);
	$('.daylabel').width(boxWidth+4);
	$('.monthlabel').width(boxWidth);
	$('.day').width(boxWidth);
	$('.day').height(boxWidth);
	$('#title').attr('value', 'Holy Smokes! No task set!');

	}


    
$(document).ready(function(){
	
	$('.jserror').toggle();
	$('.wrap').toggle();
	
	setDisplay();

	 $('.wrap').fadeTo(1000, 1);
	//Setting today's and yesterday's date
	today = new Date();
	yesterday = new Date();
	yesterday.setDate(today.getDate()-1);
	
	$(".next").click(function (e) {
		$('.demo').html("First, set the the task by either clicking on the title or the 'set task' link. This will set the start date for your task.");
		e.preventDefault();
	});
	
	$('.enddemo').live('click', function(ev) {
		ev.preventDefault();
		$('.demo').html("This is the calendar when the user started on March 11. The grey boxes represent the days when he missed the task. Set this as your homepage, so that you're always reminded of your task. That's it. Want to <a href='../signup'>sign up?</a>");
		$('.day').removeClass('highlight');
		$('.day').removeClass('start');
		
		
		$('.mar').children('.11').addClass('start');
		var dates ={'start_date':'03/11', 'end_date':'03/15'};
		updateStreak(dates);
		dates ={'start_date':'03/19', 'end_date':'03/24'};
		updateStreak(dates);
		dates ={'start_date':'03/26', 'end_date':'03/29'};
		updateStreak(dates);
		dates ={'start_date':'04/02', 'end_date':'04/18'};
		updateStreak(dates);
		dates ={'start_date':'04/21', 'end_date':'05/04'};
		updateStreak(dates);
		dates ={'start_date':'05/06', 'end_date':'05/18'};
		updateStreak(dates);
		dates ={'start_date':'05/20', 'end_date':'05/29'};
		updateStreak(dates);
		setMissed('03/11', today);
		makeCurrentEditable();
		
	});

   
	$('.window .close').click(function () {
		//Cancel the link behavior	
			$('#mask').hide();
			$('.window').hide();
			onClickDay($divs);
			});	

	$('#mask').click(function () {
		$('#mask').hide();
		$('.window').hide();
	});

	$('.window .cancel').click(function () {
		$('#mask').hide();
		$('.window').hide();
	});

	$(".pointable").click(function (e) {
		e.preventDefault();

		if(!($('#title').hasClass('editing'))){
			$('#title').addClass('editing');
			$('#title').select();
			$('#tools').show();
		}
		curr_title=$('#title').val();	
		
	});

	$("#title").click(function(event) {

		event.preventDefault();
		if(!($('#title').hasClass('editing'))){
			$('#title').addClass('editing');
			$('#title').select();
			$('#tools').show();
		}

		curr_title=$('#title').val();	
		
	});

});

