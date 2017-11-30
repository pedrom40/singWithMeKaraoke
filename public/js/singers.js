// load all singer features
function loadSingerFeatures (userName, token) {

  // get userId
  getUserId(userName, token)
    .then( userId => {

      // reset main content
      $('.js-main-content').empty();

      // load singer components
      upcomingShows(userId);
      songListComponent(userId);
      hostsFinder(userId);

    })
    .fail( err => console.log(err));

}

// upcoming shows
function upcomingShows (userId) {

  $('.js-main-content').append(`
    <section class="blue-section">
      <div class="row">
        <div class="col-md-6">
          <div class="upcoming-shows js-upcoming-shows-container">
            <h3>Upcoming Shows</h3>
            <div class="js-upcoming-shows-content"></div>
          </div>
        </div>
      </div>
    </section>
  `);

}

// song lists
function songListComponent (userId) {

  // load main container
  loadSongListContainer();

  // get singer lists
  getSongLists(userId)
    .then( lists => {

      // if user has no lists
      if (lists.length === 0) {
        loadAddSongListForm(userId);
      }

      // if lists found
      else {
        console.log('load lists and add form in new tab');
      }

    })
    .fail( err => console.log(err));

}
function loadSongListContainer () {
  $('.js-main-content').append(`
    <section class="black-section">
      <div class="row">
        <div class="col-md-6">
          <div class="song-lists js-song-list-container">
            <h3>My Song Lists</h3>
            <div class="js-song-list-content"></div>
          </div>
        </div>
      </div>
    </section>
  `);
}
function getSongLists (userId) {
  const settings = {
    url: `/api/songLists/${userId}`,
    method: 'GET'
  }
  return $.ajax(settings);
}
function loadAddSongListForm (userId) {

  // start fresh
  $('.js-song-list-content').empty();

  const template = `
    <form class="js-add-song-list-form">
      <div class="row">
        <div class="col-sm-12 col-md-12">
          <div class="form-group">
            <label for="songListTitle">Song List Title:</label>
            <input type="text" id="songListTitle" placeholder="Classic Rock" required class="form-control">
            <span class="help-block js-song-list-title-help-block"></span>
          </div>
        </div>
      </div>
      <table class="table table-striped js-song-list-table">
        <thead>
          <tr>
            <th>Songs</th>
            <th>Artists</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <label for="songTitle_1" class="sr-only">Song Title:</label>
              <input type="text" id="songTitle_1" name="songTitle" placeholder="Imagine" class="form-control js-song-title">
            </td>
            <td>
              <label for="songArtist_1" class="sr-only">Song Artist:</label>
              <input type="text" id="songArtist_1" name="songArtist" placeholder="John Lennon" class="form-control">
            </td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <div class="col-sm-12 col-md-12">
          <div class="form-group">
            <input type="submit" id="songListSubmit" value="Save Song List" class="btn btn-default btn-block">
            <span class="help-block js-song-submit-help-block"></span>
          </div>
        </div>
      </div>

      <input type="hidden" id="userId">
    </form>
  `;

  // send to view
  $('.js-song-list-content').append(template);

  // init listeners
  listenForSongActions();

}
function listenForSongActions () {

  $('.js-add-song-list-form')
    .click( event => {
      event.preventDefault();

      // if submitting form
      if (event.target.id === 'songListSubmit') {
        handleSongListAddFormSubmit();
      }

      // if clicking into an input
      else {
        addNewSongInput(event.target.id);
      }

    })
    .focus( event => {
      event.preventDefault();
      addNewSongInput(event.target.id);
    })
    .keydown( event => {
      if (event.which === 9) {
        addNewSongInput(event.target.id);
      }
    });

}
function addNewSongInput (inputId) {

  if (inputId.search('songTitle_') !== -1) {

    // get the id of the item focuses on
    const currentStep = inputId.split('_')[1];
    const nextStep = Number(currentStep) + 1;

    // looks for new input
    const inputExists = document.getElementById(`songTitle_${nextStep}`);console.log(inputExists);

    // if the next step input exists
    if (inputExists) {

      // don't do anything

    }

    // if not
    else {

      // setup next row
      const template = `
        <tr>
          <td>
            <label for="songTitle_${nextStep}" class="sr-only">Song Title:</label>
            <input type="text" id="songTitle_${nextStep}" name="songs[songTitle]" placeholder="Imagine" class="form-control js-song-title">
          </td>
          <td>
            <label for="songArtist_${nextStep}" class="sr-only">Song Artist:</label>
            <input type="text" id="songArtist_${nextStep}" name="songs[songArtist]" placeholder="John Lennon" class="form-control js-song-artist">
          </td>
        </tr>
      `;

      // send it to view
      $('.js-song-list-table tbody').append(template);

    }

  }

}
function handleSongListAddFormSubmit () {

  const data = {
    userId: $('#userId').val(),
    title: $('#songListTitle').val(),
    songs: []
  }
  console.log(data);

}

// hosts finder
function hostsFinder () {

  $('.js-main-content').append(`
    <section class="grey-section">
      <div class="row">
        <div class="col-md-6">
          <div class="js-host-finder-container">
            <h3>Show Hosts</h3>
            <div class="js-host-finder-content"></div>
          </div>
        </div>
      </div>
    </section>
  `);

}
