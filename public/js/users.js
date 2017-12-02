'use strict';

function initUsers () {

  // check for valid jwt and path
  const cookieExists = Cookies.get('singWithMe');
  const currentPath = window.location.pathname;

  // if token found
  if (cookieExists !== undefined) {

    // get user info
    const token = Cookies.get('singWithMe').split('|')[0];

    // validate token
    validateToken(token)
      .then( user => {

        // send to user home page
        redirectUser(cookieExists);

      })
      .fail( err => {
        console.log(err);
      });

  }

  // if not
  else {

    // if on the home or login pages
    if (currentPath === '/' || currentPath === '/login') {

      // for new users
      listenForSingerRegistrations();
      listenForHostRegistrations();

      // validate stage name on change
      validateStageName();

      // validate email on focus/change
      validateUserEmail();

      // validate password on focus/change
      validateUserPassword();

      // listen for logins
      listenForLogins();

    }

    // if not on the home page already, send them there
    else {
      window.location.assign('/');
    }

  }

}

// validate user token from cookie
function validateToken (token) {

  const settings = {
    type: 'GET',
    url: '/api/users/current/',
    headers: {"Authorization": `Bearer ${token}`}
  }

  return $.ajax(settings);
}

// watch for stage name "change" events, check entry
function validateStageName () {

  // on singer change, check user name
  $('.js-singer-userName').change( event => {

    // send to api
    $.get(`/api/users/userName/${event.target.value}`)
        .then( res => {

          // if userName already taken
          if (res.totalUsers > 0) {

            // add error class to input
            $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

            // send reason
            $('.js-singer-userName-help-block').html('This Stage Name is already in use, please try another.');

          }

          // if not
          else {

            // make sure error class is removed
            $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

            // send reason
            $('.js-singer-userName-help-block').html('');

          }

        });

  });

  // on host change, check user name
  $('.js-host-userName').change( event => {

    // send to api
    $.get(`/api/users/userName/${event.target.value}`)
        .then( res => {

          // if userName already taken
          if (res.totalUsers > 0) {

            // add error class to input
            $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

            // send reason
            $('.js-host-userName-help-block').html('This Stage Name is already in use, please try another.');

          }

          // if not
          else {

            // make sure error class is removed
            $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

            // send reason
            $('.js-host-userName-help-block').html('');

          }

        });

  });

}

// watch for user email "change" events, check entry
function validateUserEmail () {

  // on singer change, check user name
  $('.js-singer-email').change( event => {

    // validate email format
    const validEmail = validateEmail($(`#${event.target.id}`).val());

    // if valid
    if (validEmail) {

      // make sure error class is removed
      $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

      // send reason
      $('.js-singer-email-help-block').html('');

      // send to api
      $.get(`/api/users/email/${event.target.value}`)
        .then( res => {

          // if email already taken
          if (res.totalUsers > 0) {

            // add error class to input
            $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

            // send reason
            $('.js-singer-email-help-block').html('This email is already in use, please try another.');

          }

          // if not
          else {

            // make sure error class is removed
            $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

            // send reason
            $('.js-singer-email-help-block').html('');

          }

        });

    }

    // if not
    else {

      // add error class to input
      $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

      // send reason
      $('.js-singer-email-help-block').html('Check your email entry, it is not valid.');

    }

  });

  // on host change, check user name
  $('.js-host-email').change( event => {

    // validate email format
    const validEmail = validateEmail($(`#${event.target.id}`).val());

    // if valid
    if (validEmail) {

      // make sure error class is removed
      $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

      // send reason
      $('.js-host-email-help-block').html('');

      // send to api
      $.get(`/api/users/email/${event.target.value}`)
        .then( res => {

          // if email already taken
          if (res.totalUsers > 0) {

            // add error class to input
            $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

            // send reason
            $('.js-host-email-help-block').html('This email is already in use, please try another.');

          }

          // if not
          else {

            // make sure error class is removed
            $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

            // send reason
            $('.js-host-email-help-block').html('');

          }

        });

    }

    // if not
    else {

      // add error class to input
      $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

      // send reason
      $('.js-host-email-help-block').html('Check your email entry, it is not valid.');

    }

  });

}

// watch for user password "change" events, check entry
function validateUserPassword () {

  // on singer password change, check user name
  $('.js-singer-password').change( event => {

    // if password not long enough
    if ($(`#${event.target.id}`).val().length < 6) {

      // add error class to input
      $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

      // send reason
      $('.js-singer-password-help-block').html('Your password must be at least 6 characters.');

    }

    // if not
    else {

      // make sure error class is removed
      $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

      // send reason
      $('.js-singer-password-help-block').html('');

    }

  });

  // on host password change, check user name
  $('.js-host-password').change( event => {

    // if password not long enough
    if ($(`#${event.target.id}`).val().length < 6) {

      // add error class to input
      $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

      // send reason
      $('.js-host-password-help-block').html('Your password must be at least 6 characters.');

    }

    // if not
    else {

      // make sure error class is removed
      $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

      // send reason
      $('.js-host-password-help-block').html('');

    }

  });

}

// listens for singer registration form submit event
function listenForSingerRegistrations () {

  $('.js-singer-registration-form').submit( event => {
    event.preventDefault();

    // if no validation errors
    if ($('.has-error').length === 0) {

      // add error class to input
      $(`input[type=submit]`).closest('.form-group').removeClass('has-error');

      // send reason
      $('.js-singer-submit-help-block').html('');

      // gather user data from form inputs
      const userData = {
        type: 'Singer',
        userName: $('.js-singer-userName').val(),
        email: $('.js-singer-email').val(),
        password: $('.js-singer-password').val()
      }

      // trigger create new user event
      createNewUser(userData)
        .then( res => {

          // login singer
          loginUser(userData.userName, userData.password)
            .then ( loginResult => {
              registerAndRedirectUser(loginResult);
            });

        })
        .fail( err => {
          console.log(err);
        });

    }

    // if errors
    else {

      // add error class to input
      $(`input[type=submit]`).closest('.form-group').addClass('has-error');

      // send reason
      $('.js-singer-submit-help-block').html('Fix above errors before submitting this form.');

    }

  });

}

// listens for host registration form submit event
function listenForHostRegistrations () {

  $('.js-host-registration-form').submit( event => {
    event.preventDefault();

    // if validation errors
    if ($('.has-error').length === 0) {

      // add error class to input
      $(`input[type=submit]`).closest('.form-group').removeClass('has-error');

      // send reason
      $('.js-host-submit-help-block').html('');

      // gather user data from form inputs
      const userData = {
        type: 'Host',
        userName: $('.js-host-userName').val(),
        email: $('.js-host-email').val(),
        password: $('.js-host-password').val()
      }

      // trigger create new user event
      createNewUser(userData)
        .then( res => {

          // login host
          loginUser(userData.userName, userData.password)
            .then ( loginResult => {

              registerAndRedirectUser(loginResult);

            });

        })
        .fail( err => {
          console.log(err);
        });

    }

    // if not
    else {

      // add error class to input
      $(`input[type=submit]`).closest('.form-group').addClass('has-error');

      // send reason
      $('.js-host-submit-help-block').html('Fix above errors before submitting this form.');

    }

  });

}

// catch users logging in
function listenForLogins () {

  $('.js-login-form').submit( event => {
    event.preventDefault();

    loginUser($('#userName').val(), $('#userPassword').val())
      .then (res => registerAndRedirectUser(res))
      .fail(err => $('.js-login-submit-help-block').html(err.responseText));

  });

}

// set cookie and redirect user based on type
function registerAndRedirectUser (userInfo) {

  // set cookie with user info
  Cookies.set("singWithMe", `${userInfo.token}|${userInfo.userType}|${userInfo.userName}`);

  // get the cookie
  const newUserInfo = Cookies.get('singWithMe');

  // take to host/singer home
  redirectUser(newUserInfo);

}

// set cookie and redirect user based on type
function redirectUser (infoHolder) {

  // set cookie with user info
  const userInfo = infoHolder.split('|');
  const token = userInfo[0];
  const userType = userInfo[1];
  const userName = decodeURIComponent(userInfo[2]);

  // set path name
  const currentUrl = decodeURIComponent(window.location.pathname);

  // take to host/singer home
  if (userType === 'Host' && currentUrl !== `/hosts/${userName}`) {
    window.location.assign(`/hosts/${userName}`);
  }
  else if (userType === 'Singer' && currentUrl !== `/singers/${userName}`) {
    window.location.assign(`/singers/${userName}`);
  }

  // if validated and on home page
  else {

    // check for complete profile
    checkUserProfileComplete(userName, userType, token);

  }

}

// looks for location values in user profile
function checkUserProfileComplete (userName, userType, token) {

  getUserLocation(userName, token)
    .then( res => {

      // if user has a location, then load all features for type
      if (res.location.hasOwnProperty('city')) {
        loadAllFeatures(userName, userType, token);
      }
      else {
        loadProfileUpdateForm(userName, token);
      }

    })
    .fail(err => console.log(err));

}

// loads all the user features
function loadAllFeatures (userName, userType, token) {

  if (userType === 'Singer') {
    loadSingerFeatures(userName, token);
  }
  else {
    loadHostFeatures(userName, token);
  }

}

// returns user's location
function getUserLocation (userName, token) {
  const settings = {
    type: 'GET',
    url: `/api/users/location/${userName}`,
    headers: {"Authorization": `Bearer ${token}`}
  }
  return $.ajax(settings);
}

// load profile update form
function loadProfileUpdateForm (userName, token) {

  // start fresh
  $('.js-main-content').empty();

  // markup form
  const template = `
    <section class="black-section">
      <form class="js-user-update-form">
        <p>
          Please update your profile below. Your location is required so we can find shows
          and hosts near you. Your phone number is not required but necessary if you want to
          receive text updates about new activities. The rest is optional, but nice to have.
        </p>
        <div class="row">
          <div class="col-sm-12 col-md-12">
            <div class="form-group">
              <label for="firstName">Name:</label>
              <input type="text" id="firstName" placeholder="First" class="form-control js-firstName">
              <span class="help-block js-firstName-help-block"></span>

              <input type="text" id="lastName" placeholder="Last" class="form-control js-lastName">
              <span class="help-block js-lastName-help-block"></span>
            </div>
          </div>
          <div class="col-sm-12 col-md-12">
            <div class="form-group">
              <label for="city">Location:</label>
              <input type="text" id="city" placeholder="Austin" required class="form-control js-city">
              <span class="help-block js-city-help-block"></span>

              <select id="state" class="form-control js-state"></select>
              <span class="help-block js-state-help-block"></span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6 col-md-6">
            <div class="form-group">
              <label for="Phone">Phone:</label>
              <input type="tel" id="phone" placeholder="888.888.8888" class="form-control js-phone">
              <span class="help-block js-phone-help-block"></span>
            </div>
          </div>
          <div class="col-sm-12 col-md-12">
            <div class="form-group">
              <input type="submit" value="Update" class="btn btn-default btn-block">
              <span class="help-block js-update-submit-help-block"></span>
            </div>
          </div>
        </div>
        <input type="hidden" id="userName" value="${userName}">
      </form>
    </section>
  `;

  // send to view
  $('.js-main-content').append(template);

  // populate state menu
  populateStateSelect('.js-state');

  // listen for update
  listenForUpdate(token);

}
function listenForUpdate (token) {

  $('.js-user-update-form').submit( event => {
    event.preventDefault();

    // get the user's id
    getUserId($('#userName').val(), token)
      .then( res => {

        // gather update data
        const data = {
          id: res.userId,
          firstName: $('#firstName').val(),
          lastName: $('#lastName').val(),
          phone: $('#phone').val(),
          location: {
            city: $('#city').val(),
            state: $('#state').val()
          }
        }

        // call api to update user
        updateUser(data)
          .then(res => initUsers())
          .fail(err => console.log(err));

      });

  });

}

// returns user ID from userName
function getUserId (userName, token) {
  const settings = {
    type: 'GET',
    url: `/api/users/id/${userName}`,
    headers: {"Authorization": `Bearer ${token}`}
  }
  return $.ajax(settings);
}

// send put to user
function updateUser(data) {
  const settings = {
    url: `/api/users/${data.id}`,
    type: 'PUT',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(data)
  }
  return $.ajax(settings);
}

// login users
function loginUser (userName, password) {

  // setup vars for stringify
  const qData = {
    userName: userName,
    password: password
  }

  // post to login route
  const settings = {
    type: 'POST',
    url: '/api/auth/login',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(qData)
  }

  return $.ajax(settings);

}

// post to user API
function createNewUser (userData) {

  const settings = {
    url: '/api/users',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(userData),
    type: 'POST'
  }

  return $.ajax(settings);

}

$(initUsers)
