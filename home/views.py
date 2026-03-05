from django.shortcuts import render
from django.contrib import messages
import requests



def home(request):
    if request.method == "POST":
        city=request.POST.get('city')
        if not city:
            messages.error(request,"Invalid city")
            return render(request,'index.html')
        try:
            api_key='c84c3ce39e006519dd4de2a9129a8e04'
            url=f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
            response=requests.get(url,timeout=5)
            if response.status_code != 200:
                messages.error(request, "City not found or API error")
                return render(request, 'index.html')
            data=response.json()
            weather_data={
                'temperature': data['main']['temp'],
                'description': data['weather'][0]['description'].title(),
                'humidity': data['main']['humidity'],
                'wind_speed': data['wind']['speed'] 
            }
            return render(request,'index.html',{'weather':weather_data,'city':city})
        except:
            messages.error(request,"City is invalid")
            return render(request,'index.html')
    else:
        return render(request,'index.html') 