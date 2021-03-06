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
          <tfoot>
            <tr>
              <td>
                <button type="button" id="editList_${list.id}" class="btn btn-primary js-edit-list-btn">
                  Edit List
                </button>
              </td>
              <td>
                <button type="button" id="deleteList_${list.id}" class="btn btn-danger js-delete-list-btn">
                  Delete List
                </button>
              </td>
            </tr>
          </tfoot>
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
    <input type="hidden" id="userId" value="${userId}">
  `;

  // send all markup to view
  $('.js-song-list-content').append(tabNavContainer);

  // init listeners
  listenForSongActions(userId);

}

// create song list form HTML
function addSongFormMarkup (userId) {
  const template = `
    <form class="js-song-list-form">
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr id="songRow_1">
            <td>
              <label for="songTitle_1" class="sr-only">Song Title:</label>
              <input type="text" id="songTitle_1" name="songTitle" placeholder="Imagine" class="form-control js-song-title">
            </td>
            <td>
              <label for="songArtist_1" class="sr-only">Song Artist:</label>
              <input type="text" id="songArtist_1" name="songArtist" placeholder="John Lennon" class="form-control">
            </td>
            <td>
              <a id="clearSong_1" class="btn btn-default">
                <span id="clearSongIcon_1" class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <div class="col-xs-6 col-sm-6 col-md-6">
          <div class="form-group">
            <input type="submit" id="songListSubmit" value="Add Song List" class="btn btn-default btn-block">
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-6">
          <div class="form-group">
            <input type="button" id="cancelBtn" value="Cancel" class="btn btn-warning btn-block">
          </div>
        </div>
      </div>

      <input type="hidden" id="userId" value="${userId}">
      <input type="hidden" id="songCounter" value="1">
    </form>
  `;

  return template;
}

// if no lists yet, this adds the create list interface
function loadAddSongListForm (userId) {

  // start fresh
  $('.js-song-list-content').empty();

  const template = addSongFormMarkup(userId);

  // send to view
  $('.js-song-list-content').append(template);

  // init listeners
  listenForSongActions(userId);

}

// loads edit song list form with values
function loadEditSongListForm (listId, userId) {

  getSongList(listId)
    .then( list => {

      // start fresh
      $('.js-song-list-content').empty();

      // loop over songs array
      let songRows = '';
      list.songs.map( (song, i) => {

        // fix 0 based index
        i = i + 1;

        // markup rows
        songRows = `${songRows}
          <tr id="songRow_${i}">
            <td>
              <label for="songTitle_${i}" class="sr-only">Song Title:</label>
              <input type="text" id="songTitle_${i}" name="songTitle" value="${song.songTitle}" class="form-control js-song-title">
            </td>
            <td>
              <label for="songArtist_${i}" class="sr-only">Song Artist:</label>
              <input type="text" id="songArtist_${i}" name="songArtist" value="${song.songArtist}" class="form-control">
            </td>
            <td>
              <a id="clearSong_${i}" class="btn btn-default">
                <span id="clearSongIcon_${i}" class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </a>
            </td>
          </tr>
        `;

      });

      // get next song index
      const nextRowIndex = Number(list.songs.length) + 1;

      // markup form
      const template = `
        <form class="js-song-list-form">
          <div class="row">
            <div class="col-sm-12 col-md-12">
              <div class="js-notification hidden"></div>
              <div class="form-group">
                <label for="songListTitle">Song List Title:</label>
                <input type="text" id="songListTitle" value="${list.title}" required class="form-control">
                <span class="help-block js-song-list-title-help-block"></span>
              </div>
            </div>
          </div>
          <table class="table table-striped js-song-list-table">
            <thead>
              <tr>
                <th>Songs</th>
                <th>Artists</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              ${songRows}
              <tr id="songRow_${nextRowIndex}">
                <td>
                  <label for="songTitle_${nextRowIndex}" class="sr-only">Song Title:</label>
                  <input type="text" id="songTitle_${nextRowIndex}" name="songTitle" placeholder="New Song Title" class="form-control js-song-title">
                </td>
                <td>
                  <label for="songArtist_${nextRowIndex}" class="sr-only">Song Artist:</label>
                  <input type="text" id="songArtist_${nextRowIndex}" name="songArtist" placeholder="New Song Artist" class="form-control">
                </td>
                <td>
                  <a id="clearSong_${nextRowIndex}" class="btn btn-default">
                    <span id="clearSongIcon_${nextRowIndex}" class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="row">
            <div class="col-xs-6 col-sm-6 col-md-6">
              <div class="form-group">
                <input type="submit" id="songListSubmit" value="Save List" class="btn btn-default btn-block">
              </div>
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6">
              <div class="form-group">
                <input type="button" id="cancelBtn" value="Cancel" class="btn btn-warning btn-block">
              </div>
            </div>
          </div>

          <input type="hidden" id="userId" value="${userId}">
          <input type="hidden" id="listId" value="${list.id}">
          <input type="hidden" id="songCounter" value="${nextRowIndex}">
        </form>
      `;

      // send to view
      $('.js-song-list-content').append(template);

      // init listeners
      listenForSongActions(userId);

    });

}

// listener that presides over the song list component
function listenForSongActions (userId) {

  // add new input events
  $('.js-song-list-form')
    .click( event => {
      event.preventDefault();

      // if adding song list
      if (event.target.id === 'songListSubmit' && event.target.value === 'Add Song List') {
        handleSongListAddFormSubmit();
      }

      // if editing song list
      else if (event.target.id === 'songListSubmit' && event.target.value === 'Save List') {
        handleSongListEditFormSubmit();
      }

      // if cancelling edit
      else if (event.target.id === 'cancelBtn') {
        songListComponent($('#userId').val(), false);
      }

      // if clearing a song
      else if (event.target.id.search('clearSong') !== -1) {
        const songIndex = event.target.id.split('_');
        clearSongInputs(songIndex[1]);
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

  // edit list events
  $('.js-edit-list-btn')
    .click( event => {
      event.preventDefault();

      // isolate song list id
      const listId = event.target.id.split('_');

      // init update
      loadEditSongListForm(listId[1], userId);

    });

  // delete list events
  $('.js-delete-list-btn')
    .click( event => {
      event.preventDefault();

      // isolate song list id
      const listId = event.target.id.split('_');

      // init delete
      confirmSongListDelete(listId[1]);

    });

}


// loads edit song list form with values
function confirmSongListDelete (listId) {

  // confirm delete
  const confirmDelete = confirm('Delete this List?');

  // on confirm
  if (confirmDelete) {

    // send to delete api endpoint
    deleteSongList(listId)
      .then( res => songListComponent($('#userId').val(), false))
      .fail( err => {
        const msg = {
          type: 'error',
          content: err.responseJSON.message
        }
        showMsg(msg);
      });

  }

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
        <tr id="songRow_${nextStep}">
          <td>
            <label for="songTitle_${nextStep}" class="sr-only">Song Title:</label>
            <input type="text" id="songTitle_${nextStep}" name="songs[songTitle]" placeholder="Imagine" class="form-control js-song-title">
          </td>
          <td>
            <label for="songArtist_${nextStep}" class="sr-only">Song Artist:</label>
            <input type="text" id="songArtist_${nextStep}" name="songs[songArtist]" placeholder="John Lennon" class="form-control js-song-artist">
          </td>
          <td>
            <a id="clearSong_${nextStep}" class="btn btn-default">
              <span id="clearSongIcon_${nextStep}" class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </a>
          </td>
        </tr>
      `;

      // send it to view
      $('.js-song-list-table tbody').append(template);

    }

  }

}

// clears a song's input values to "delete" the song
function clearSongInputs (songIndex) {
  $(`#songTitle_${songIndex}`).val('');
  $(`#songArtist_${songIndex}`).val('');
  $(`#songRow_${songIndex}`).hide();
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

// handles song list edit form submissions
function handleSongListEditFormSubmit () {

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
      id: $('#listId').val(),
      title: $('#songListTitle').val(),
      songs: songsArray
    }

    // post to create api endpoint
    editSongList(data)
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

// edit song post to API
function editSongList (data) {

  const settings = {
    url: `/api/songLists/${data.id}`,
    type: 'PUT',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(data)
  }

  return $.ajax(settings);

}

// returns all song lists by user ID
function getSongLists (userId) {
  const settings = {
    url: `/api/songLists/${userId}`,
    method: 'GET'
  }
  return $.ajax(settings);
}

// get song list
function getSongList (listId) {

  const settings = {
    url: `/api/songLists/id/${listId}`,
    type: 'GET'
  }

  return $.ajax(settings);

}

// delete song list
function deleteSongList (listId) {

  const settings = {
    url: `/api/songLists/${listId}`,
    type: 'DELETE'
  }

  return $.ajax(settings);

}
