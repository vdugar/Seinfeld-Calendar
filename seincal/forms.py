from django import forms

class SignupForm(forms.Form):
	username=forms.CharField(max_length=30, required=True)
	password=forms.CharField(max_length=30, required=True, widget=forms.PasswordInput(render_value=False))
	email=forms.EmailField(max_length=30, required=True)

class LoginForm(forms.Form):
	username=forms.CharField(max_length=30, required=True)
	password=forms.CharField(max_length=30, required=True, widget=forms.PasswordInput(render_value=False))	