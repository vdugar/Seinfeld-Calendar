from django.shortcuts import redirect, render_to_response, HttpResponse
from django.http import Http404,HttpResponseRedirect
from django.template import RequestContext
from django.utils import simplejson as json
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.template import RequestContext
from django.contrib import auth
from seincal.models import *
from seincal.forms import *

month_days=[31,28,31,30,31,30,31,31,30,31,30,31]

def landing(request):
	if not request.user.is_authenticated():
		return HttpResponseRedirect('signup/')
	else:
		return render_to_response('index.html',{})
	
def get_streaks(request):
	if request.is_ajax():
		user=request.user
		streaks={'data':Streak.objects.filter(user=user).values('start_date','end_date')}
		query={'data':[]}
		for streak in streaks['data']:
			query['data'].append({'start_date':streak['start_date'], 'end_date':streak['end_date']})
		return HttpResponse(json.dumps(query))
		
def post_streak(request):
	if request.is_ajax():
		if request.method=='POST':
			data=json.loads(request.raw_post_data)
			user=request.user
			if 'old_streak' in data.keys():
				#Updating the end date
				streak=Streak.objects.get(user=user, end_date=data['old_streak']['old_end'])
				streak.end_date=data['old_streak']['new_end']
				streak.save()
				
			elif 'new_streak' in data.keys():
				#Creating a new streak
				Streak.objects.create(user=user, start_date=data['new_streak']['today'], end_date=data['new_streak']['today'])
				
		return HttpResponse('OK')	
		
def signup(request):
	if request.method=='POST':
		if 'signup' in request.POST:
			form=SignupForm(request.POST)
			if form.is_valid():
				response=form.cleaned_data
				user=User.objects.create(username=response['username'], email=response['email'])
				user.set_password(response['password'])
				user.save()
				user=auth.authenticate(username=response['username'], password=response['password'])
		elif 'login' in request.POST:
			form=LoginForm(request.POST)
			if form.is_valid():
				response=form.cleaned_data
				user=auth.authenticate(username=response['username'], password=response['password'])
		
		if user is not None and user.is_active:
			auth.login(request, user)
			return HttpResponseRedirect('/')
		else:
			return render_to_response('registration/login.html',{},context_instance=RequestContext(request))
	else:
		signupForm=SignupForm()
		loginForm=LoginForm()
		return render_to_response('registration/login.html',{'loginForm':loginForm, 'signupForm':signupForm},context_instance=RequestContext(request))

def logout(request):
	auth.logout(request)
	return HttpResponseRedirect('/signup/')									