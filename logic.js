//set up global variables
$(document).ready(function () {
  
    /* APPLICATION VARIABLES */
    var APIkey = "e37669453cb2f31f17855c4bb977dcf2";
    var clearSearches = $("#clear-button");
    var currentUvindex = $("#uvIndex"); 
    var realCity = [];

 

  function getcurrentClimate(location) {
    console.log(location, "location:")
    let {lat} = location
    let { lon } = location
    let city = location.name
    
      var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}` ;
      $.ajax({
          url: queryURL,
          method: "GET"
      }).then(function (response) {
        console.log(response.list[0])
        console.log(response.list[0].weather)
        let iconDaddy = response.list[0].weather[0].icon
        let iconDaddyUrl = `https://openweathermap.org/img/w/${iconDaddy}.png`
        let iconDescription = response.list[0].weather[0].description
    
        console.log(iconDescription)

        let weatherShit = $(`
        <div class="main-card">
            <div class="card-heading">
               <h2>
               ${city} 
                 </h2>              
                 <img src="${iconDaddyUrl}" alt="${iconDescription}"/>  
                 <p>${iconDescription}</p>
                 <p>wind-speed: ${response.list[0].wind.speed} </p>
                 <p>wind-degree: ${response.list[0].wind.deg} </p>
                 <p>wind-gusts: ${response.list[0].wind.gust} </p>
             </div>
           <div  class="card-info"> 
                <h3>Weather</h3>                
                <p>temp: ${response.list[0].main.temp} degrees</p>
                <p>feels like: ${response.list[0].main.feels_like} degrees</p>               
                <p>humidity: ${response.list[0].main.humidity}%</p> 
          </div>       
        </div>
       
        `)

        $(".ajax-section").append(weatherShit)
        serverResponded(response)
      })



      var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lt + "&lon=" + ln;
      $.ajax({
          url: uvqURL,
          method: "GET"
      }).then(function (response) {
          $(currentUvindex).html(response.value);
      });
     
  }

    function serverResponded(response) {
      console.log(response, "yo dooot");      
    

     
      forecast(response.id);
      if (response.cod == 200) {
          realCity = JSON.parse(localStorage.getItem("cityname"));
          console.log(rCity);
          if (realCity == null) {
              realCity.push(city.toUpperCase());
              localStorage.setItem("cityname", JSON.stringify(rCity));
              addToList(city);
          } else {
              if (find(city) > 0) {
                  rCity.push(city.toUpperCase());
                  localStorage.setItem("cityname", JSON.stringify(rCity));
                  addTolist(city);

              }
          }
      }
  }

  function fetchCoords(city) {
    let apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIkey}`

    $.ajax({
      url: apiUrl,
      method: "GET"
    }).then(function (data) {
      console.log(data[0])
      getcurrentClimate(data[0])
    })
  }


    //get the uv index for searched city
  function UVIndex(ln, lt) {
     

  }


    //5 day forecast
  function forecast(cityid) {
      var dayOver = false;
      var queryForcastUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityid}&appid=${APIkey}`;
      $.ajax({
          url: queryForcastUrl,
          method: "GET"
      }).then(function (response) {
          for (let i = 0; i < 5; i++) {
              let date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
              // var iconCode = response.list[((i + 1) * 8) - 1].weatyher[0].icon;
              // var iconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
              var tempK = response.list[((i + 1) * 8) - 1].main.humidity;
              //adding dynamic html
              $(".col-sm-8" + i).html(date);
              $(".col-sm-8" + i).html("<img src=" + iconURL + ">");
              $(".col-sm-8" + i).html(tempF + "&#8457");
              $(".col-sm-8" + i).html(humidity + "%");
          }
      });
  }

  //placing searched citys on a list
  function addToList(realCity) {
      var listEl = $("<li>" + realCity.toUpperCase() + "</li>");
      $(listEl).attr("class", "list-group-item");
      $(listEl).attr("data-value", realCity.toUpperCase());
      $(".list-group").append(listEl);
  }


  
    /* EVENT LISTENERS */
    //click events
    $(".button-dad").on("click", displayWeather);
    $(document).on("click", invokePastSearch);
    $(window).on("load", loadLastCity);
    $("#clear-button").on("click", clearSearches);
  
  
      /* EVENT HANDLERS */
      function displayWeather(event) {     
        event.preventDefault();
       let search = $("#search").val();
        if (search !== "") {
            fetchCoords(search);
            console.log(search, "yoyuoy");
        }
    }
  
      function invokePastSearch(event) {
        var lisEl = event.target;
        if (event.target.matches("li")) {
            city = lisEl.textContent;
            getcurrentClimate(city);
        }
    }
  
      //saving searches so you can leave and refference the weather again
      function loadLastCity() {
        $(".cities").empty();
        var realCity = JSON.parse(localStorage.getItem("cityname"));
        if (realCity !== null) {
          city = realCity[realCity.length - 1];
          getcurrentClimate(city);
              //load the last city in the rCity array
            addToList(realCity[realCity.length-1]);
        }
       
    }
  
      //if in any case you want to clear the search history. you can do so.
    function clearSearches(event) {
        event.preventDefault();
        realCity = [];
        localStorage.removeItem("cityname");
        document.location.reload();
    }
  
  
  
  

});