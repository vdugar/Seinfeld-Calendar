from django.db import models

class MyUser(models.Model):
	user_name=models.CharField(max_length=20, default='user')
	password=models.CharField(max_length=40)
	join_date=models.CharField(max_length=8)
	
class Streak(models.Model):
	user=models.ForeignKey(MyUser)
	start_date=models.CharField(max_length=4)
	end_date=models.CharField(max_length=4)