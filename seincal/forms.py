from django import forms
from django.contrib.auth.models import User
from django.contrib import auth

class SignupForm(forms.Form):
	username = forms.RegexField(max_length=30, regex=r'^[\w.@+-]+$',required=True, widget=forms.TextInput(attrs={'class':'inputtext2'}),
        error_messages = {'invalid': "Username may contain only letters, numbers and @/./+/-/_ characters."})
	password=forms.CharField(max_length=30, required=True, widget=forms.PasswordInput(attrs={'class':'inputtext2'}))
	email=forms.EmailField(max_length=30, required=True, widget=forms.TextInput(attrs={'class':'inputtext2'}))
	
	def clean_username(self):
		username = self.cleaned_data["username"]
		try:
			User.objects.get(username=username)
		except User.DoesNotExist:
			return username
		raise forms.ValidationError("A user with that username already exists.")

class LoginForm(forms.Form):
	username = forms.CharField(max_length=30, required=True, widget=forms.TextInput(attrs={'class':'textinput'}))
	password = forms.CharField(max_length=30 ,required=True, widget=forms.PasswordInput(attrs={'class':'textinput'}))
	
	def clean(self):
		username=self.cleaned_data.get('username')
		password=self.cleaned_data.get('password')
		
		if username and password:
			user=auth.authenticate(username=username, password=password)
			if user is None:
				raise forms.ValidationError("Invalid username or password")
			else:
				return self.cleaned_data		
				