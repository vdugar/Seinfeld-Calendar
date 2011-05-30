from django.conf.urls.defaults import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('seincal.views',
    (r'^$','landing'),
	(r'^get_streaks/$','get_streaks'),
	(r'^post_streak/$','post_streak'),
	(r'^admin/', include(admin.site.urls)),
	(r'^login/$',  'signup'),
	(r'^signup/$',  'signup'),
	(r'^logout/$', 'logout'),
)
