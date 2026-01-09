import os, json
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
from groq import Groq
from .models import Conversation, Message

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_INSTRUCTION = SYSTEM_INSTRUCTION = """
You are a Python Instructor.
ALWAYS wrap code inside triple backticks like:

```python
code here
Never write code outside code blocks.
Answer only Python-related questions.
Use simple language.
"""


def home(request):
    conversations = Conversation.objects.all().order_by("-created_at")
    active_id = request.GET.get("c")

    active_conversation = None
    messages = []

    if active_id:
        active_conversation = Conversation.objects.get(id=active_id)
        messages = active_conversation.messages.all().order_by("created_at")
    else:
        # 🔥 AUTO CREATE NEW CHAT
        active_conversation = Conversation.objects.create()

    return render(request, "index.html", {
        "conversations": conversations,
        "active": active_conversation,
        "messages": messages
    })



@csrf_exempt
def new_chat(request):
    convo = Conversation.objects.create()
    return JsonResponse({"id": str(convo.id)})


@csrf_exempt
def chat(request, convo_id):
    data = json.loads(request.body)
    user_msg = data.get("message", "").strip()

    conversation = get_object_or_404(Conversation, id=convo_id)

    # save user message
    Message.objects.create(
        conversation=conversation,
        role="user",
        content=user_msg
    )

    # 🔥 AUTO TITLE (only first message)
    if conversation.messages.count() == 1:
        conversation.title = generate_title(user_msg)
        conversation.save()

    def stream():
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            stream=True,
            messages=[
                {"role": "system", "content": SYSTEM_INSTRUCTION},
                {"role": "user", "content": user_msg}
            ]
        )

        full = ""
        for chunk in response:
            if chunk.choices[0].delta.content:
                text = chunk.choices[0].delta.content
                full += text
                yield text

        Message.objects.create(
            conversation=conversation,
            role="bot",
            content=full
        )

    return StreamingHttpResponse(stream(), content_type="text/plain")

# views.py (add helper)
def generate_title(user_message):
    try:
        r = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "Generate a short chat title (max 5 words). No quotes."
                },
                {"role": "user", "content": user_message}
            ]
        )
        return r.choices[0].message.content[:30]
    except:
        return "Python Chat"



@csrf_exempt
def delete_conversation(request, convo_id):
    Conversation.objects.filter(id=convo_id).delete()
    return JsonResponse({"status": "deleted"})


@csrf_exempt
def delete_all(request):
    Conversation.objects.all().delete()
    return JsonResponse({"status": "all_deleted"})

def view_history_all(request):
    conversations = Conversation.objects.prefetch_related("messages") \
        .order_by("-created_at")
    return render(request, "history_all.html", {
        "conversations": conversations
    })
