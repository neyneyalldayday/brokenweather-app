//set up global variables
$(document).ready(function () {
  
    /* APPLICATION VARIABLES */
    var APIkey = "e37669453cb2f31f17855c4bb977dcf2";
  
  var currentCity = $(".hometown"); 
  var clearSearches = $("#clear-button");
  var currentUvindex = $("#uvIndex");
  var currentClimate = $("#currentClimate");
  var currentHumidity = $("#currentHumid");
  var currentWindSpeed = $("#windSpeed");
  //only real citys will run
  var realCity = [];


  


    /* APPLICATION LOGIC */

  function getcurrentClimate(location) {
    let {lat} = location
    let { lon } = location
    let city = location.name
    
      var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}` ;
      $.ajax({
          url: queryURL,
          method: "GET"
      }).then(serverResponded(city, data[0]))
      console.log(serverResponded);
  }

    function serverResponded(response) {
      console.log(response, "yo");

      // display the icons that correspond with the weather output
      var weatherIcon = response.weather[0].icon;
      var iconURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
      var date = new Date(response.dt * 1000).toLocaleDateString();
      $(currentCity).html(response.name + "(" + date + ") " + "<img src=" + iconURL + ">");
      var tempF = (response.main.temp - 273.15) * 1.80 + 32;
      $(currentClimate).html((tempF).toFixed(2) + "&#8457");
      //get the humidity level for the city searched
      $(currentHumidity).html(response.main.humidity + "%");
      //get the wind speed for the city searched
      var wS = response.wind.speed;
      var windsMph = (wS * 2.237).toFixed(1);
      $(currentWindSpeed).html(windsMph + "MPH");

      UVIndex(response.coord.lon, response.coord.lat);
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
      var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lt + "&lon=" + ln;
      $.ajax({
          url: uvqURL,
          method: "GET"
      }).then(function (response) {
          $(currentUvindex).html(response.value);
      });

  }


    //5 day forecast
  function forecast(cityid) {
      var dayOver = false;
      var queryForcastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIkey;
      $.ajax({
          url: queryForcastUrl,
          method: "GET"
      }).then(function (response) {
          for (let i = 0; i < 5; i++) {
              var date = new Date((respose.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
              var iconCode = response.list[((i + 1) * 8) - 1].weatyher[0].icon;
              var iconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
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