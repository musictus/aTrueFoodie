console.log('js online');
var loginStatus = sessionStorage.getItem("login_status");
// console.log("login status: " + loginStatus);
var sessionUsername = sessionStorage.getItem("username");
// console.log("session user: " + sessionUsername);

$(document).ready(function () {
    if (loginStatus === true || loginStatus === "true") {
        $("#session-signup").hide();
        $("#session-login").hide();
        var sessionUserHtml = $("<button id='personal-ID'><span>").text("You're signed in as " + "\"" + sessionUsername);
        $("#nav").append(sessionUserHtml)
    }


    $("#personal-ID").on("click", function () {
        console.log("Hello World");
        //Redirect to new HTML PAGE user.html
    });
});

function getLocation() {
    $("#knife").css("display", "inline");
    var geolocation = navigator.geolocation;
    geolocation.getCurrentPosition(showLocation, geoErrorHandler);
}

function showLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var location = [latitude, longitude];

    var searchTerm = $('#search-keyword').val();

    $.ajax('/api/search/', {
        type: 'POST',
        data: {
            searchTerm: searchTerm,
            location: location
        },
        dataType: 'json'
    }).then(function (res) {
        $(".box-ours").css("display", "block");
        $("#true-result").empty();
        // a true foodie result here
        var restaurantFound = ("<h3>" + "Best " + "\"" + searchTerm + "\"" + " in your area" + "</h3><br>");

        var imageUrl = res.yelpData.image_url;
        var restaurantImage = $("<img>");
        restaurantImage.attr('class', "restaurantImg");
        restaurantImage.attr('src', imageUrl);
        restaurantImage.attr('alt', "Doctor Image");
        // restaurantImage.css('width', "50%");

        var restaurantName = ("<span id='restaurant-Name'>" + res.yelpData.name + "</span><br>");
        var restaurantLocation = ("<span id='restaurant-Location'>" + res.yelpData.location + "</span><br>");
        var restaurantPhone = ("<span id='restaurant-Phone'>" + res.yelpData.phone + "</span><br>");


        // yelp and google ratings here
        var yelpData = ("<span id='yelp-rating'>" + "Yelp Rating <i class='fab fa-yelp'></i>: " + res.yelpData.rating + "</span><br>");
        var googleData = ("<span id='google-rating'>" + "Google Rating <i class='fab fa-google'></i>" + res.googleData.rating + "</span><br>");

        // our true rating here
        var trueDataRating = ("<span id='true-rating'>" + "True Foodie's Aggregate Rating <i class='fas fa-crown'></i>" + res.trueReview.trueRating + "</span><br>");
        var trueDataCount = ("<span id='true-count'>" + "Total Review Count: " + res.trueReview.total_review_count + "</span><br>");

        // NYC health department grade here
        if (res.food_rating === undefined) {
            var healthGrade = ("<span id='health-grade'>" + "NYC Health Department Grade: No rating at this time" + "</span><br><br><br>");
        } else {
            var healthGrade = ("<span id='health-grade'>" + "NYC Health Department Grade: " + res.food_rating.grade + "</span><br><br><br>");
        }

        $("#true-result").prepend(healthGrade);
        $("#true-result").prepend(trueDataCount);
        $("#true-result").prepend(trueDataRating);
        $("#true-result").prepend(yelpData);
        $("#true-result").prepend(googleData);

        $("#true-result").prepend(restaurantPhone);
        $("#true-result").prepend(restaurantLocation);
        $("#true-result").prepend(restaurantName);


        $("#true-result").prepend(restaurantImage);
        $("#true-result").prepend(restaurantFound);

        $("#searchSubmit").css("display", "inline");
        $("#knife").css("display", "none");

    })
}

function geoErrorHandler(error) {
    console.log(error);
}

$(document).on('click', '#searchSubmit', function (e) {
    $("#searchSubmit").css("display", "none");
    getLocation();
});