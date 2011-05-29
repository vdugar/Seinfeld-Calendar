from django.shortcuts import redirect, render_to_response, HttpResponse
from django.http import Http404,HttpResponseRedirect
from django.template import RequestContext
from django.utils import simplejson as json
from seincal.models import *

month_days=[31,28,31,30,31,30,31,31,30,31,30,31]

def landing(request):
	return render_to_response('index.html',{})
	
def get_streaks(request):
	if request.is_ajax():
		user=MyUser.objects.get(pk=1)
		streaks={'data':Streak.objects.filter(user=user).values('start_date','end_date')}
		query={'data':[]}
		for streak in streaks['data']:
			query['data'].append({'start_date':streak['start_date'], 'end_date':streak['end_date']})
		return HttpResponse(json.dumps(query))
		
def post_streak(request):
	if request.is_ajax():
		if request.method=='POST':
			data=json.loads(request.raw_post_data)
			user=MyUser.objects.get(pk=1)
			if 'old_streak' in data.keys():
				#Updating the end date
				streak=Streak.objects.filter(user=user, end_date=data['old_streak']['old_end'])
				streak.end_date=data['old_streak']['new_end']
				#streak.save()
				
			elif 'new_streak' in data.keys():
				#Creating a new streak
				Streak.objects.create(user=user, start_date=data['new_streak']['today'], end_date=data['new_streak']['today'])
				
		return HttpResponse('OK')			