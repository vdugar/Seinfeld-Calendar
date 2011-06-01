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
		query={}
		if 'task_id' in request.session:
			query['task']=request.session['task_message']
			query['task_start']=request.session['task_start']
			streaks=Streak.objects.filter(task=request.session['task_id']).values('start_date','end_date')
		else:
			streaks=[]
		query['data']=[]
		for streak in streaks:
			query['data'].append({'start_date':streak['start_date'], 'end_date':streak['end_date']})
		return HttpResponse(json.dumps(query))
		
def post_streak(request):
	if request.is_ajax():
		if request.method=='POST':
			data=json.loads(request.raw_post_data)
			if 'old_streak' in data:
				#Updating the end date
				streak=Streak.objects.get(task=request.session['task_id'], end_date=data['old_streak']['old_end'])
				streak.end_date=data['old_streak']['new_end']
				streak.save()
				
			elif 'new_streak' in data:
				#Creating a new streak
				Streak.objects.create(task=Task.objects.get(id=request.session['task_id']), start_date=data['new_streak']['today'], end_date=data['new_streak']['today'])
				
			return HttpResponse('OK')
		
def set_task(request):
	if request.is_ajax():
		if request.method=='POST':
			data=json.loads(request.raw_post_data)
			user=request.user
			#Setting previous task to inactive, if it exists
			try:
				prev=Task.objects.get(user=user, status=1)
			except Task.DoesNotExist:
				pass
			else:		
				prev.status=0
				prev.save()
			
			#Setting up new task, and storing it in session
			task=Task.objects.create(user=user, task=data['task_message'], start_date=data['start_date'], status=1)
			request.session['task_id']=task.id
			request.session['task_message']=task.task
			request.session['task_start']=task.start_date
			
			return HttpResponse('OK')		
		
def signup(request):
	
	user=None
	if request.method=='POST':
		if 'signup' in request.POST:
			signupForm=SignupForm(request.POST)
			loginForm=LoginForm()
			if signupForm.is_valid():
				response=signupForm.cleaned_data
				user=User.objects.create(username=response['username'], email=response['email'])
				user.set_password(response['password'])
				user.save()
				user=auth.authenticate(username=response['username'], password=response['password'])
		elif 'login' in request.POST:
			loginForm=LoginForm(request.POST)
			signupForm=SignupForm()
			if loginForm.is_valid():
				response=loginForm.cleaned_data
				user=auth.authenticate(username=response['username'], password=response['password'])
		
		if user is not None and user.is_active:
			auth.login(request, user)
			#Setting task information in session
			if 'login' in request.POST:
				try:
					task=Task.objects.get(user=user, status=1)
				except Task.DoesNotExist:
					pass
				else:
					request.session['task_id']=task.id
					request.session['task_message']=task.task
					request.session['task_start']=task.start_date
						
			return HttpResponseRedirect('/')
	else:
		signupForm=SignupForm()
		loginForm=LoginForm(auto_id=False)
	return render_to_response('registration/login.html',{'loginForm':loginForm, 'signupForm':signupForm},context_instance=RequestContext(request))
		

def logout(request):
	auth.logout(request)
	return HttpResponseRedirect('/signup/')

def demo(request):
	return render_to_response('demo.html',{})									
