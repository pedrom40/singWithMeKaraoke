function initUsers () {

  // check for valid jwt
  checkForCurrentSession()
    .then( res => {

      // if found
      if (res.validated) {

        console.log('user validated');

        // get user type
          // if singer, go to /singers
          // if host, go to /hosts

      }

      // if not, listen for user registrations
      else {

        // for new users
        listenForUserRegistrations();

        // validate stage name on change
        validateStageName();

        // validate email on focus/change
        validateUserEmail();

        // validate password on focus/change
        validateUserPassword();

        // listen for logins
        listenForLogins();

      }

    });

}

// checks for existing valid jwt; returns authToken
function checkForCurrentSession () {

  // check if jwt cookie exists
    // if it does, pass cookie value to current user endpoint
      // if valid, send user to "type" home page
      // if not, send user to login form

  return $.get('/api/users/session');
}

// watch for stage name "change" events, check entry
function validateStageName () {

  // on change, check user name
  $('.js-user-name').change( event => {

    // send to api
    $.get(`/api/users/userName/${event.target.value}`)
        .then( res => {

          // if userName already taken
          if (res.totalUsers > 0) {

            // add error class to input
            $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

            // send reason
            $('.js-user-name-help-block').html('This Stage Name is already in use, please try another.');

          }

          // if not
          else {

            // make sure error class is removed
            $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

            // send reason
            $('.js-user-name-help-block').html('');

          }

        });

  });

}

// watch for user email "change" events, check entry
function validateUserEmail () {

  // on change, check user name
  $('.js-user-email').change( event => {

    // validate email format
    const validEmail = validateEmail($(`#${event.target.id}`).val());

    // if valid
    if (validEmail) {

      // make sure error class is removed
      $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

      // send reason
      $('.js-user-email-help-block').html('');

      // send to api
      $.get(`/api/users/email/${event.target.value}`)
        .then( res => {

          // if email already taken
          if (res.totalUsers > 0) {

            // add error class to input
            $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

            // send reason
            $('.js-user-email-help-block').html('This email is already in use, please try another.');

          }

          // if not
          else {

            // make sure error class is removed
            $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

            // send reason
            $('.js-user-email-help-block').html('');

          }

        });

    }

    // if not
    else {

      // add error class to input
      $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

      // send reason
      $('.js-user-email-help-block').html('Check your email entry, it is not valid.');

    }

  });

}

// watch for user password "change" events, check entry
function validateUserPassword () {

  // on change, check user name
  $('.js-user-password').change( event => {

    // if password not long enough
    if ($(`#${event.target.id}`).val().length < 6) {

      // add error class to input
      $(`#${event.target.id}`).closest('.form-group').addClass('has-error');

      // send reason
      $('.js-user-password-help-block').html('Your password must be at least 6 characters.');

    }

    // if not
    else {

      // make sure error class is removed
      $(`#${event.target.id}`).closest('.form-group').removeClass('has-error');

      // send reason
      $('.js-user-password-help-block').html('');

    }

  });
}

// listens for singer/host registration form submit event
function listenForUserRegistrations () {

  $('.js-registration-form').submit( event => {
    event.preventDefault();

    // if validation errors
    if ($('.has-error').length === 0) {

      // add error class to input
      $(`input[type=submit]`).closest('.form-group').removeClass('has-error');

      // send reason
      $('.js-submit-help-block').html('');

      // gather user data from form inputs
      const userData = {
        type: $('.js-user-type').val(),
        userName: $('.js-user-name').val(),
        email: $('.js-user-email').val(),
        password: $('.js-user-password').val()
      }

      // trigger create new user event
      createNewUser(userData)
        .then( res => {console.log(res);

          // send to singer's home page
          //window.location.assign(`/singers/${res.userName}`);

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
      $('.js-submit-help-block').html('Fix above errors before submitting this form.');

    }

  });

}

// catch users logging in
function listenForLogins () {

  $('.js-login-form').submit( event => {
    event.preventDefault();

    console.log('login attempt');
  });

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
