//set up global variables
$(document).ready(function () {
    var APIkey = "e37669453cb2f31f17855c4bb977dcf2";
    var clearSearches = $("#clear-button");
    var savedCity = []; 

  function getcurrentClimate(location) {
    console.log(location, "location:")
    let { lat } = location
    let { lon } = location
    let city = location.name

    
      var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}` ;
      $.ajax({
          url: queryURL,
          method: "GET"
      }).then(function (response) {            
        let iconDaddy = response.list[0].weather[0].icon
        let iconDaddyUrl = `https://openweathermap.org/img/w/${iconDaddy}.png`
        let iconDescription = response.list[0].weather[0].description      

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
      getUvDaddy(location)    
  }


  function getUvDaddy(location){
  let {lat} = location
  let {lon} = location
    
    var uvqURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`;
        $.ajax({
            url: uvqURL,
            method: "GET"
        }).then(function (response) {
            let uvIndexThinggy = $(`
            <p class="uv-index-color">uv Index be like: ${response.value}</p>
            `)

            $(".card-info").append(uvIndexThinggy)

            if(response.value < 3){
              $(".uv-index-color").css("background-color", "green");
            }
            else if (response.value < 6){
              $(".uv-index-color").css("background-color", "yellow");
            }
            else if (response.value < 9){
              $(".uv-index-color").css("background-color", "orange");
            }
            else if (response.value < 11){
              $(".uv-index-color").css("background-color", "red");
            }
            else{
              $(".uv-index-color").css("background-color", "purple");
            }
      });    
  }

    function serverResponded(response) {
      forecast(response.city.id); 

      let storedSearch = $("#search").val();         
      let searchedCity = response.city.name;  
      savedCity.push(searchedCity) 
      localStorage.setItem(searchedCity, storedSearch)

      var listEl = $(`
         <li class="list-group-item">${storedSearch}</li>      
      `);     
       $(".list-group").append(listEl);      
  }

  function fetchCoords(city) {
    let apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIkey}`

    $.ajax({
      url: apiUrl,
      method: "GET"
    }).then(function (data) {      
      getcurrentClimate(data[0])
    })
  }
    //5 day forecast
  function forecast(cityid) {
      var dayOver = false;
      var queryForcastUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityid}&appid=${APIkey}`;
      $.ajax({
          url: queryForcastUrl,
          method: "GET"
      }).then(function (response) {
        $(".five-day-cards").empty();
          for (let i = 0; i < 5; i++) {
              let date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
              var iconCode = response.list[((i + 1) * 8) - 1].weather[0].icon;
              var iconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
              var tempF = response.list[((i + 1) * 8) - 1].main.humidity;
              //adding dynamic html
               
              let fiveDayCards = $(`
              
              <div class="five-day-card">
                  <div class"five-day-info">
                  <p>${date}</p>
                  <p>temp: ${tempF}</p>
                  <p>humidity: ${response.list[0].main.humidity} %</p>
                  <img src="${iconURL}"/>
                  </div>
              </div>
              
              `)

              $(".five-day-cards").append(fiveDayCards)
           
          }
      });
  }  
  
        function displayWeather(event) {
        $(".ajax-section").empty();     
        event.preventDefault();
        let search = $("#search").val();
        if (search !== "") {
            fetchCoords(search);
            console.log(search, "yoyuoy");
        }        
    }
  
      function invokePastSearch(event) {      
        $(".list-group") = event.target;
        if (event.target.matches("li")) {
          let  city = $(".list-group").textContent;
          console.log(city)
            loadLastCity(city);
        }
    }
  
     
      function loadLastCity() {
        $(".ajax-section").empty();
        var realCity = JSON.parse(localStorage.getItem(storedSearch));
        if (realCity !== null) {
         let city = realCity;
            fetchCoords(city);            
        }       
    }  
     
    function clearSearches(event) {
        event.preventDefault();
        realCity = [];
        localStorage.removeItem("cityname");
        document.location.reload();
    }
  
     /* EVENT LISTENERS */
    //click events
    $(".button-dad").on("click", displayWeather);
    $(".list-group").on("click", invokePastSearch);
    $(window).on("load", loadLastCity);
    $("#clear-button").on("click", clearSearches);
});