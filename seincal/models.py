from django.db import models
from django.contrib.auth.models import User

class Streak(models.Model):
	user=models.ForeignKey(User)
	start_date=models.CharField(max_length=4)
	end_date=models.CharField(max_length=4)