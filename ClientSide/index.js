function ajaxCall(method, api, data, successCB, errorCB) {
    $.ajax({
        type: method,
        url: api,
        data: data,
        cache: false,
        contentType: "application/json",
        dataType: "json",
        success: successCB,
        error: errorCB
    });
}

function SuccessCallBack(data) {
    console.log(data);
}

function ErrorCallBack(err) {
    console.log(err);
}

const apiMovies = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies";
const apiRating = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies/rating/";
const apiDuration = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Movies/GetByDuration?duration=";
const apiCast = "https://proj.ruppin.ac.il/bgroup2/test2/tar1/api/Casts";

function init() {
    allMoviesStr = AllMovies();
    document.getElementById("AllMovies").innerHTML = allMoviesStr;
    ajaxCall('GET', apiCast, null, SuccessCBGetAllCast, ErrorCallBack);
    document.getElementById("bdC").max = new Date().toISOString().split('T')[0];
    $("#filter").hide();
    $("#castRow").hide();
}

function AllMovies() {
    let strMovies = "";
    for (let i = 0; i < movies.length; i++) {
        console.log(movies[i].title);

        strMovies += `<div class="col-md-6 col-lg-4 card" id="m${movies[i].id}">
                <div class="row">
                    <div class="col-4 col-md-6 cardPart">
                        <img class="image-container" src="${movies[i].photoUrl}" onerror="handleImageError(this)">
                        <span class="rating"><i class="fas fa-star"></i> ${movies[i].rating}</span>
                    </div>
                    <div class="col-8 col-md-6 cardPart">
                        <h3 class="MovieName">${movies[i].title}</h3>
                        <p><i class="fa fa-clock-o"></i>${movies[i].duration} minutes</p>
                        <p><i class="fa fa-dollar"></i>${movies[i].income / 1000000}M$</p>
                        <span class="tag-cloud genre">${movies[i].genre}</span>
                        <span class="tag-cloud language">${movies[i].language}</span>
                    </div>
                    <div class="col-12 desc">
                        ${movies[i].description}
                    </div>
                    <div class="col-12 wishD">
                        <button class="btnATWish" onclick="AddToWishList(${i})">Add to Wish List</button>
                    </div>
                </div>
            </div>`;
    }
    return strMovies;
}

function SuccessCBGetAllCast(data) {
    console.log(data);
    let allCasrStr = "";
    for (let i=0;i<data.length;i++) {
        allCasrStr += `<div class="col-12 col-md-4 col-lg-3 player-card">
                        <img src="${data[i].photoUrl}">
                        <div class="player-info">
                            <span><strong>id:</strong> ${data[i].id}</span>
                            <span><strong>name:</strong> ${data[i].name}</span>
                            <span><strong>role:</strong> ${data[i].role}</span>
                            <span><strong>date of birth:</strong> ${data[i].dateOfBirth.toString().split('T')[0]}</span>
                            <span><strong>country:</strong> ${data[i].country}</span>
                        </div>
                    </div>`;
    }
    document.getElementById("CMrow").innerHTML = allCasrStr;
}

function AddToWishList(i) {
    ajaxCall('POST', apiMovies, JSON.stringify(movies[i]), SuccessCallBack, ErrorCallBack);
    console.log(movies[i]);
}

function ShowWishList() {
    $(".wishD").hide();
    $(".card").hide();
    $("#castRow").hide();
    $("#filter").show();
    $("#filterRating").val('');
    $("#filterDuration").val('');
    ajaxCall('GET', apiMovies, null, SuccessCBWish, ErrorCallBack);
}

function SuccessCBWish(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        $(`#m${data[i].id}`).show();
    }
}

function ShowAllMovies() {
    $(".card").show();
    $(".wishD").show();
    $("#filter").hide();
    $("#castRow").hide();
}

function FilterByDur() {
    duration = $("#filterDuration").val();
    $("#filterRating").val('');
    $(".card").hide();
    ajaxCall('GET', apiDuration + duration, null, SuccessCBWish, ErrorCallBack);

}

function FilterByRate() {
    rating = $("#filterRating").val();
    $("#filterDuration").val('');
    $(".card").hide();
    ajaxCall('GET', apiRating + rating, null, SuccessCBWish, ErrorCallBack);

}

function handleImageError(imgElement) {
    imgElement.src = "pics/Xpic.png";
}

function ShowCastForm() {
    $(".card").hide();
    $("#filter").hide();
    $("#castRow").show();
}

$(document).ready(function () {
    $("#castForm").submit(function (event) {
        event.preventDefault();

        cast = {
            Id: $("#idC").val(),
            Name: $("#nameC").val(),
            Role: $("#roleC").val(),
            DateOfBirth: $("#bdC").val(),
            Country: $("#countryC").val(),
            PhotoUrl: $("#phuC").val(),
        }
        ajaxCall('POST', apiCast, JSON.stringify(cast), SuccessCBCast, ErrorCallBack);
    });
});

function SuccessCBCast(data) {
    console.log(data);
    if (!data) {
        alert("Something went wrong! Check if this ID is already taken!");
    }
    else {
        $("#castForm")[0].reset();
        ajaxCall('GET', apiCast, null, SuccessCBGetCast, ErrorCallBack);
    }
}

function SuccessCBGetCast(data) {
    console.log(data);
    castMember = data[data.length - 1];
    document.getElementById("CMrow").innerHTML +=
        `<div class="col-12 col-md-4 col-lg-3 player-card">
                        <img src="${castMember.photoUrl}">
                        <div class="player-info">
                            <span><strong>id:</strong> ${castMember.id}</span>
                            <span><strong>name:</strong> ${castMember.name}</span>
                            <span><strong>role:</strong> ${castMember.role}</span>
                            <span><strong>date of birth:</strong> ${castMember.dateOfBirth.toString().split('T')[0]}</span>
                            <span><strong>country:</strong> ${castMember.country}</span>
                        </div>
                    </div>`;
}

