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

    // if validation errors
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
          //loginSinger();

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
          //loginHost();

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
