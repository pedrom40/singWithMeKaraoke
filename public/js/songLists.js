// init song lists
function songListComponent (userId, loadContainer=true) {

  // load main container
  if (loadContainer) {
    loadSongListContainer();
  }

  // get singer lists
  getSongLists(userId)
    .then( lists => {

      // if user has no lists
      if (lists.length === 0) {
        loadAddSongListForm(userId);
      }

      // if lists found
      else {
        loadSongListsTabs(lists, userId);
      }

    })
    .fail( err => console.log(err));

}

// this loads the initial container to the view
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

// if user has lists, this function loads them into tabs
function loadSongListsTabs (lists, userId) {

  // start fresh
  $('.js-song-list-content').empty();

  // init vars for markup
  let listTabs = '';
  let songsContainer = '';

  // create tabs markup
  lists.map( (list, i) => {

    // set active status of tab
    let activeTab = '';
    if (i === 0) {
      activeTab = 'active';
    }

    // add tab nav by list index
    listTabs = `${listTabs}
      <li role="presentation" class="${activeTab}">
        <a href="#list_${i}" aria-controls="list_${i}" role="tab" data-toggle="tab">
          ${list.title}
        </a>
      </li>
    `;

    // create table rows for songs
    let songRows = ``;
    list.songs.map(song => {

      songRows = `${songRows}
        <tr>
          <td>${song.songTitle}</td>
          <td>${song.songArtist}</td>
        </tr>
      `;

    });

    // create song container
    songsContainer = `${songsContainer}
      <div role="tabpanel" class="tab-pane ${activeTab}" id="list_${i}">
        <table class="table table-striped js-song-list-table">
          <thead>
            <tr>
              <th>Songs</th>
              <th>Artists</th>
            </tr>
          </thead>
          <tbody>
            ${songRows}
          </tbody>
        </table>
      </div>
    `;

  });

  // add new song list tab
  listTabs = `${listTabs}
    <li role="presentation">
      <a href="#createList" aria-controls="createList" role="tab" data-toggle="tab">
        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
      </a>
    </li>
  `;

  // add new song form to songsContainer
  songsContainer = `${songsContainer}
    <div role="tabpanel" class="tab-pane" id="createList">
      ${addSongFormMarkup(userId)}
    </div>
  `;

  // combine all markup
  const tabNavContainer = `
    <ul class="nav nav-tabs" role="tablist">
      ${listTabs}
    </ul>
    <div class="tab-content">
      ${songsContainer}
    </div>
  `;

  // send all markup to view
  $('.js-song-list-content').append(tabNavContainer);

  // init listeners
  listenForSongActions();

}

// returns all song lists by user ID
function getSongLists (userId) {
  const settings = {
    url: `/api/songLists/${userId}`,
    method: 'GET'
  }
  return $.ajax(settings);
}

// if no lists yet, this adds the create list interface
function loadAddSongListForm (userId) {

  // start fresh
  $('.js-song-list-content').empty();

  const template = addSongFormMarkup(userId);

  // send to view
  $('.js-song-list-content').append(template);

  // init listeners
  listenForSongActions();

}

// create song list form HTML
function addSongFormMarkup (userId) {
  const template = `
    <form class="js-add-song-list-form">
      <div class="row">
        <div class="col-sm-12 col-md-12">
          <div class="js-notification hidden"></div>
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

      <input type="hidden" id="userId" value="${userId}">
      <input type="hidden" id="songCounter" value="1">
    </form>
  `;

  return template;
}

// listener that presides over the song list component
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

// adds a new row of song title/artists inputs during list creation
function addNewSongInput (inputId) {

  if (inputId.search('songTitle_') !== -1) {

    // get the id of the item focuses on
    const currentStep = inputId.split('_')[1];
    const nextStep = Number(currentStep) + 1;

    // looks for new input
    const inputExists = document.getElementById(`songTitle_${nextStep}`);

    // if the next step input exists
    if (inputExists) {

      // don't do anything

    }

    // if not
    else {

      // increment the counter number
      let currentCounterVal = $('#songCounter').val();
      let newCounterVal = Number(currentCounterVal) + 1;
      $('#songCounter').val(newCounterVal);

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

// handles the create song list form submissions
function handleSongListAddFormSubmit () {

  // check for a song list title
  if ($('#songListTitle').val() !== '') {

    // build songs array of objects
    const numOfLoops = $('#songCounter').val();
    let songsArray = []

    // loop thru each song
    for (let i=1; i < numOfLoops; i++) {

      // make sure it's not an empty field
      if ($(`#songTitle_${i}`).val() !== '') {

        // song title / artist
        const songObj = {
          songTitle: $(`#songTitle_${i}`).val(),
          songArtist: $(`#songArtist_${i}`).val()
        }

        // add to songs array
        songsArray.push(songObj);

      }

    }

    // create main song list object
    const data = {
      userId: $('#userId').val(),
      title: $('#songListTitle').val(),
      songs: songsArray
    }

    // post to create api endpoint
    createSongList(data)
      .then(res => songListComponent($('#userId').val(), false))
      .fail(err => {
        const msg = {
          type: 'error',
          content: err.responseJSON.message
        }
        showMsg(msg);
      });

  }

  // if song list title blank
  else {

    // send alert to user
    const msg = {
      type: 'error',
      content: 'Please enter a Song List Title'
    }
    showMsg(msg);

  }

}

// create song post to API
function createSongList (data) {

  const settings = {
    url: '/api/songLists',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(data)
  }

  return $.ajax(settings);

  }
