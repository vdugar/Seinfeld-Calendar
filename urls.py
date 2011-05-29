from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('seincal.views',
    (r'^$','landing'),
	(r'^get_streaks/$','get_streaks'),
	(r'^post_streak/$','post_streak'),
	(r'^admin/', include(admin.site.urls)),
)
