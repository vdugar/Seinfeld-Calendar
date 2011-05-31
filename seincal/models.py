from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
	user=models.ForeignKey(User)
	task=models.CharField(max_length=140)
	start_date=models.CharField(max_length=4)
	status=models.IntegerField(max_length=1)
	
	def __unicode__(self):
		return self.task

class Streak(models.Model):
	task=models.ForeignKey(Task)
	start_date=models.CharField(max_length=4)
	end_date=models.CharField(max_length=4)
	
	def __unicode__(self):
		return self.start_date + " to " + self.end_date
	
