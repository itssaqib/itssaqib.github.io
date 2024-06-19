
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="simple gallery">
    <title>{{ TITLE }}</title>
    <link rel="icon" href="/favicon.ico">
    <style type="text/css" media="screen">
      html, body {
        height: 100%;
        margin: 0;
      }

      body {
        background-color: #191919;
        display: flex;
        flex-flow: column;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      #gallery {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      #photos {
        flex: 1;
        display: flex;
        overflow: hidden;
        position:relative;
        -khtml-user-select: none;
        -o-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;
      }

      #photos > img {
        margin: auto;
        max-height: 95%;
        max-width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        color: grey;
        text-align: center;
      }

      .hidden {
        display: none;
      }

      .active {
        display: block;
      }

      .clickable-icon {
        cursor: pointer;
      }

      #controls {
        text-align: center;
        color: grey;
        margin-bottom: 10px;
      }

      #img-counter {
        vertical-align: top;
        display: inline-block;
        margin-top: 7px;
        width: 80px;
      }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script type="text/javascript">
      $(document).ready(function(){

          function updateCounter(){
              // Set index number of current active image
              var imgIndex = $("#gallery img").index($("#gallery img.active")) + 1
              $('#current-img').text(imgIndex + "/")
          };

          function loadImg(){
              var active = $('#gallery img.active')
              if (! active.attr('src')) {
                  active.attr('src', function (){ return active.attr('data-src')})
              }
          };

          function toggleActiveImg(button, callback){
              var active = $('#gallery img.active')

              if (button.id == "next") {
                  var next = active.next()
                  active.removeClass('active').addClass('hidden')

                  if (next.length == 0){
                      $('#gallery img:first-child').removeClass('hidden').addClass('active')
                  } else if (next.is('img')) {
                      next.removeClass('hidden').addClass('active')
                  }

              } else if (button.id == "back") {
                  var prev = active.prev()
                  active.removeClass('active').addClass('hidden')

                  if (prev.length == 0){
                      $('#gallery img:last-child').removeClass('hidden').addClass('active')
                  } else {
                      prev.removeClass('hidden').addClass('active')
                  }
              }

              callback()
          };

          // Make the first image of the gallery visible
          $('#gallery img:first-child').removeClass('hidden').addClass('active');

          // Set total number of images
          $('#total-count').text($("#gallery img").length);

          loadImg()
          updateCounter()

          // Cycle through images with 'next' and 'back'
          $('#next, #back').click(function() {
              toggleActiveImg(this, function(){
                  loadImg()
                  updateCounter()
              });
          });

          // Capture left and right arrow key presses to cycle through images
          $(document).keypress(function(e){
              if(e.keyCode == 39){
                  $("#next").click();
              }
              if(e.keyCode == 37){
                  $("#back").click();
              }
          });
      });
    </script>
  </head>
  <body>
    <div id="gallery">
      <div id="photos">
{{ PHOTOS }}
      </div>
    </div>
    <div id="controls">
      <span id="back">
        <img class="clickable-icon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiBoZWlnaHQ9IjMycHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik03LjcwMSwxNC4yNzZsOS41ODYtOS41ODVjMC44NzktMC44NzgsMi4zMTctMC44NzgsMy4xOTUsMGwwLjgwMSwwLjhjMC44NzgsMC44NzcsMC44NzgsMi4zMTYsMCwzLjE5NCAgTDEzLjk2OCwxNmw3LjMxNSw3LjMxNWMwLjg3OCwwLjg3OCwwLjg3OCwyLjMxNywwLDMuMTk0bC0wLjgwMSwwLjhjLTAuODc4LDAuODc5LTIuMzE2LDAuODc5LTMuMTk1LDBsLTkuNTg2LTkuNTg3ICBDNy4yMjksMTcuMjUyLDcuMDIsMTYuNjIsNy4wNTQsMTZDNy4wMiwxNS4zOCw3LjIyOSwxNC43NDgsNy43MDEsMTQuMjc2eiIgZmlsbD0iIzUxNTE1MSIvPjwvc3ZnPg==">
      </span>
      <span id="img-counter"><span id="current-img"></span><span id="total-count"></span></span>
      <span id="next">
        <img class="clickable-icon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiBoZWlnaHQ9IjMycHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0yNC4yOTEsMTQuMjc2TDE0LjcwNSw0LjY5Yy0wLjg3OC0wLjg3OC0yLjMxNy0wLjg3OC0zLjE5NSwwbC0wLjgsMC44Yy0wLjg3OCwwLjg3Ny0wLjg3OCwyLjMxNiwwLDMuMTk0ICBMMTguMDI0LDE2bC03LjMxNSw3LjMxNWMtMC44NzgsMC44NzgtMC44NzgsMi4zMTcsMCwzLjE5NGwwLjgsMC44YzAuODc4LDAuODc5LDIuMzE3LDAuODc5LDMuMTk1LDBsOS41ODYtOS41ODcgIGMwLjQ3Mi0wLjQ3MSwwLjY4Mi0xLjEwMywwLjY0Ny0xLjcyM0MyNC45NzMsMTUuMzgsMjQuNzYzLDE0Ljc0OCwyNC4yOTEsMTQuMjc2eiIgZmlsbD0iIzUxNTE1MSIvPjwvc3ZnPg==">
      </span>
    </div>
  </body>
</html>
