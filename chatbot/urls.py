# urls.py
from django.urls import path
from .views import home, chat, new_chat, delete_conversation, delete_all, view_history_all, health, loader

urlpatterns = [
    path("", home),
    path("new-chat/", new_chat),
    path("chat/<uuid:convo_id>/", chat),
    path("delete/<uuid:convo_id>/", delete_conversation),
    path("delete-all/", delete_all),
    path("history-all/", view_history_all),   
    # path("home/", home, name="home"),
    path("health/", health, name="health"),
    path("", loader, name="loader"),
]
