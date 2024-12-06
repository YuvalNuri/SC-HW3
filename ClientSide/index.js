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

const apiMovies = "https://localhost:7208/api/Movies";
const apiRating = "https://localhost:7208/api/Movies/rating/";
const apiDuration = "https://localhost:7208/api/Movies/GetByDuration?duration=";
const apiAddWish = "https://localhost:7208/api/Movies/AddToWishList";
const apiGetWish = "https://localhost:7208/api/Movies/GetWishList?id=";
const apiCast = "https://localhost:7208/api/Casts";
const apiUser = "https://localhost:7208/api/Users";
const apiLogName = "https://localhost:7208/api/Users/LogInName";
const apiLogEmail = "https://localhost:7208/api/Users/LogInEmail";

function init() {
    ajaxCall('Get', apiMovies, null, SuccessAllMovies, ErrorCallBack);
    ajaxCall('GET', apiCast, null, SuccessCBGetAllCast, ErrorCallBack);
    document.getElementById("bdC").max = new Date().toISOString().split('T')[0];
    $("#filter").hide();
    $("#castRow").hide();
    isLoggedIn = false;
    connectedUser = 0;
}

function SuccessAllMovies(data) {
    movies = data;
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
                        <button class="btnATWish" onclick="AddToWishList(${movies[i].id})">Add to Wish List</button>
                    </div>
                </div>
            </div>`;
    }
    document.getElementById("AllMovies").innerHTML = strMovies;
}

function SuccessCBGetAllCast(data) {
    console.log(data);
    let allCasrStr = "";
    for (let i = 0; i < data.length; i++) {
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

function AddToWishList(id) {
    id2 = `[${connectedUser},${id}]`;
    console.log(id2);
    ajaxCall('POST', apiAddWish, id2, SuccessCallBack, ErrorCallBack);
}

function ShowWishList() {
    $(".wishD").hide();
    $(".card").hide();
    $("#castRow").hide();
    $("#filter").show();
    $("#filterRating").val('');
    $("#filterDuration").val('');
    ajaxCall('GET', apiGetWish + connectedUser, null, SuccessCBWish, ErrorCBWish);
}

function SuccessCBWish(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        $(`#m${data[i]}`).show();
    }
}

function ErrorCBWish(err) {
    alert(err.responseText);
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
    ajaxCall('GET', apiDuration + duration + "&u=" + connectedUser, null, SuccessCBWish, ErrorCallBack);

}

function FilterByRate() {
    rating = $("#filterRating").val();
    $("#filterDuration").val('');
    $(".card").hide();
    ajaxCall('GET', apiRating + rating + "/user/" + connectedUser, null, SuccessCBWish, ErrorCallBack);

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
        ajaxCall('GET', apiCast, null, SuccessCBGetAllCast, ErrorCallBack);
    }
}

/*function SuccessCBGetCast(data) {
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
} כרגע לא בשימוש אבל הפונקציה הקודמת הולכת להצלחה פחות יעילה - לחשוב על זה */

// Open Modal
function openModal() {
    document.getElementById("authModal").style.display = "flex";
}

// Close Modal
function closeModal() {
    document.getElementById("authModal").style.display = "none";
}

// Switch to Signup Form
function switchToSignup() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
    document.getElementById("modalTitle").innerText = "Signup";
}

// Switch to Login Form
function switchToLogin() {
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("modalTitle").innerText = "Login";
}

function UserLogIn() {
    $("#loginForm").submit(function (event) {
        event.preventDefault();

        let user = [
            $("#userLogIn").val(),
            $("#passwordLogIn").val(),
        ]
        ajaxCall('POST', apiLogName, JSON.stringify(user), SuccessCBUser, ErrorCallBackUser);
    });
}

function registerUser() {
    $("#signupForm").submit(function (event) {
        event.preventDefault();

        let user = {
            UserName: $("#userNameReg").val(),
            Email: $("#emailReg").val(),
            Password: $("#passwordReg").val()
        };

        userLogInData = [
            user.UserName,
            user.Password
        ];


        ajaxCall('POST', apiUser, JSON.stringify(user), SuccessCBReg, ErrorCallBackUser);
    });
}

function SuccessCBReg(data) {
    if (data) {
        Swal.fire({
            title: 'Congratulations!',
            text: 'You have successfully registered. Welcome aboard! 🎉',
            icon: 'success'
        });

     

        ajaxCall('POST', apiLogName, JSON.stringify(userLogInData), SuccessCBUser, ErrorCallBackUser);
    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Registration failed. Please try again.',
            icon: 'error'
        });
    }
}

function SuccessCBUser(data) {
    if (data) {
        console.log(data);
        isLoggedIn = true;
        connectedUser = data["id"];
        closeModal();
        showLogin();
    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Failed to log in. Please try again.',
            icon: 'error'
        });
    }
}

function ErrorCallBackUser(err) {
    Swal.fire({
        title: 'Error!',
        text: 'An error occurred. Please try again later.',
        icon: 'error'
    });
    console.error(err);
}


function showLogin() {
    updateAuthButton();
    if (isLoggedIn) {
        ShowAllMovies();
        Swal.fire('Logged in successfully!', '', 'success');

    } else {
        openModal();
    }
}

function updateAuthButton() {
    const authButton = document.getElementById("logInBtn");
    if (isLoggedIn) {
        authButton.textContent = "Logout"; // שנה את הטקסט להתנתקות
    } else {
        Swal.fire('Logged out successfully!', '', 'info');
        authButton.textContent = "Login / Signup"; // שנה את הטקסט להתחברות  
    }
}

function CheckLogIn() {
    if (isLoggedIn) {
        isLoggedIn = false;
        connectedUser = 0;
        updateAuthButton();
    }
    else {
        openModal();
    }
}

