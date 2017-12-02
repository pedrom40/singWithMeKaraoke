// load all singer features
function loadSingerFeatures (userName, token) {

  // get userId
  getUserId(userName, token)
    .then( res => {

      // reset main content
      $('.js-main-content').empty();

      // load singer components
      upcomingShows(res.userId);
      songListComponent(res.userId);
      hostsFinder(res.userId);

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
