// console.log(sessionStorage);
let author
$(document).ready(function() {

  $('#result').hide();
  $('.adminPage').hide();

  $('#home').click(function() {
    $('#result').hide();
    $('.adminPage').hide();
    $('.homePage').show();
  });

  $('#admin').click(function() {
    $('.homePage').hide();
    $('#result').hide();
    $('.adminPage').show();
  });

  let url; //declare url as a variable in es6
  $.ajax({
    url: 'config.json',
    type: 'GET',
    dataType: 'json',
    success: function(configData) {
      console.log(configData.SERVER_URL, configData.SERVER_PORT);
      url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
      console.log(url);
    },
    error: function(error) {
      console.log(error);
    }

  }) //ajax

// Projects Controls::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
$('#addProject').click(function() {
  event.preventDefault();
  let projectTitle = $('#projectTitle').val();
  let projectDecription = $('#projectDecription').val();
  let projectImg = $('#projectImg').val();
  let userid = sessionStorage.getItem('userID');
  let author = sessionStorage.getItem('userName')
  console.log(userid);
  console.log(projectImg);
  if (projectTitle == ' ' || projectDecription == ' ' || projectImg ==
    ' ') {
    alert('Please enter all details');
  } else {
    $.ajax({
      url: `${url}/addProject`,
      type: 'POST',
      data: {
        title: projectTitle,
        description: projectDecription,
        image_url: projectImg,
        author: author,
        user_id: userid,

      },
      success: function(project) {
        console.log(project);
        alert('project added');
      },
      error: function() {
        console.log('error: cannot call api');
      } //error
    }) //ajax
  } //else
}); //addProduct


// display users projects in list on admin page::::::::::::::::::::::::::::::::
$('#submit').click(function() {
  $.ajax({
    url: `${url}/allProjectsFromDB`,
    type: 'GET',
    dataType: 'json',
    success: function(projectsFromMongo) {

      var i;
      // document.getElementById('projectList').innerHTML ="";
      for (i = 0; i < projectsFromMongo.length; i++) {
        // flex parent
        var projectStrip = document.createElement('div');
        projectStrip.classList.add('project-strip');
        $('#projectList').append(projectStrip);

        // flex children::::::::::::::::::::::::::::::::::::::
        // Title
        var projectListTitle = document.createElement('div');
        projectListTitle.classList.add('project-list-title');
        projectStrip.append(projectListTitle);
        projectListTitle.textContent = projectsFromMongo[i]
          .title
        // Date Added
        var projectListDate = document.createElement('div');
        projectListDate.classList.add('project-list-author');
        projectStrip.append(projectListDate);
        projectListDate.textContent = projectsFromMongo[i]
          .author

        // Controls
        var projectListControl = document.createElement('div');
        projectListControl.classList.add('up-del');
        projectListControl.innerHTML = `<i class='fas fa-pen control edit' value=${projectsFromMongo[i].title}></i>
        <i class='fas fa-trash delete'></i>`
        projectStrip.append(projectListControl);
        projectListControl.value = projectsFromMongo[i].title;

      }
      // Update Event Listener::::::::::::::::::::::::::::::::::::::::::::::::
      document.addEventListener('click', function(e) {
        // define the target objects by class name
        if (e.target.classList[3] === 'edit') {
          // find a match between a button value and project name
          for (var i = 0; i < projectsFromMongo
            .length; i++) {
            if (projectsFromMongo[i].title === e.target
              .parentNode.value) {
              selection = i;
              console.log(projectsFromMongo[selection]
                .title);
              $('#addProjectForm').fadeOut(0)
              $('#updateProjectForm').fadeIn(500)
              // e.target.parentNode.parentNode.remove()
              updateProject()
              $('.oldTitle').text(projectsFromMongo[
                  selection]
                .title)
            }
          }
        }
      }); // Event listner ends

      // Delete Event Listener:::::::::::::::::::::::::::::::::::::::::::::::::
      document.addEventListener('click', function(e) {
        // define the target objects by class name

        if (e.target.classList[2] === 'delete') {
          // find a match between a button value and project name
          for (var i = 0; i < projectsFromMongo
            .length; i++) {
            if (projectsFromMongo[i].title === e.target
              .parentNode.value) {
              selection = i;
              console.log(projectsFromMongo[selection]);
            } //if valaue matched object ends
          } // loop ends

          $('.delete-modal').modal('show')
          $('#closeDelOverlay').click(function() {
            $('.delete-modal').modal('hide')
          })
          $("#confirmDelete").click(function() {
            $('.delete-modal').modal('hide')
            e.target.parentNode.parentNode.remove()
            deleteProject()
          })
        } // if target ends
      }); // Event listner ends


// Delete Project Ajax Call:::::::::::::::::::::::::::::::::::::::::::::::

      function deleteProject() {
        event.preventDefault();
        // if (!sessionStorage['userID']) {
        //   alert('401 permission denied');
        //   return;
        // };
        let projectId = projectsFromMongo[selection]._id;
        $.ajax({
          url: `${url}/deleteProject/${projectId}`,
          type: 'DELETE',
          data: {
            user_id: sessionStorage['userID']
          },
          success: function(data) {
            console.log(data);
            if (data == 'deleted') {
              // alert('deleted');
            } else {
              alert('Enter a valid id');
            } //else
          }, //success
          error: function() {
            console.log('error: cannot call api');
          } //error
        }) //ajax
      } // Delete Project Funtion ENDS

//update the product:::::::::::::::::::::::::::::::::::::::::::::::::::
      function updateProject() {
           $('#upProjectTitle').val(projectsFromMongo[selection].title)
           $('#upProjectDecription').val(projectsFromMongo[selection].description)
           $('#upProjectImg').val(projectsFromMongo[selection].image_url)



        $('#confirmUpdate').click(function() {
          event.preventDefault();
          let projectId = projectsFromMongo[selection]._id;
          let projectTitle = $('#upProjectTitle').val();
          let projectDecription = $('#upProjectDecription')
            .val();
          let projectImg = $('#upProjectImg').val();
          let userid = sessionStorage.getItem('userID');
          let author = sessionStorage.getItem('userName')
          // console.log(productId, productName, productPrice, imageurl, userid);
          // if (productId == '') {
          //   alert('Please enter product id for updating');
          // } else {
          $.ajax({
            url: `${url}/updateProject/${projectId}`,
            type: 'PATCH',
            data: {
              title: projectTitle,
              description: projectDecription,
              image_url: projectImg,
              author: author,
              user_id: userid,
            },
            success: function(data) {
              console.log(data);
              if (data ==
                '401 error: user has no permission to update'
              ) {
                alert(
                  '401 error: user has no permission to update'
                );
              } else {
                alert('updated');
              } //else
              $('#projectId').val('');
              $('#projectTitle').val('');
              $('#projectDecription').val('');
              $('#projectImg').val('');
            }, //success
            error: function() {
              console.log('error:cannot call api');
            } //error
          }) //ajax
          // } //if
        }) //updateProduct click function
      } //update product function
    }, // submit success fuction ends
    error: function() {
    }
  }) //ajax
}) // Submit/all projects from mongo call ends


// Create project button
$("#createBtn").click(function() {
  $('#addProjectForm').fadeIn(500)
  $('#updateProjectForm').fadeOut(0)
  // $('.admin-proj-section').fadeOut()
})

// Project controls ends


// User Registration:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//  register button opens register Overlay
$('#register').click(function() {
  $('#registerOverlay').css('display', 'block');
  return false;
})

$('#registerExit').click(function() {
  $('#registerOverlay').css('display', 'none');
})


$('#r-submit').click(function() {
  //event.preventDefault()//this prevents code breaking when no data is found
  let username = $('#r-username').val();
  let email = $('#r-email').val();
  let password = $('#r-password').val();
  console.log(username, email, password);

  if (username == '' || email == '' || password == '') {
    alert('Please enter all details');

  } else {
    $.ajax({
      url: `${url}/registerUser`,
      type: 'POST',
      data: {
        username: username,
        email: email,
        password: password
      },
      success: function(user) {
        console.log(user); //remove when development is finished
        if (!user ==
          'username taken already. Please try another name') {
          alert('Please login to manipulate the products data');

        } else {
          alert('success');
          $('#r-username').val('');
          $('#r-email').val('');
          $('#r-password').val('');
          $('#registerOverlay').css('display', 'none')
        } //else

      }, //success
      error: function() {
        console.log('error: cannot call api');
      } //error
    }) //ajax post
  } //if

}) //r-submit click

// User login::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
$('#submit').click(function() {
  event.preventDefault();
  let username = $('#username').val();
  let password = $('#password').val();

  console.log(username,
    password); //remove after development for security

  if (username == '' || password == '') {
    alert('Please enter all details');
  } else {
    $.ajax({
      url: `${url}/loginUser`,
      type: 'POST',
      data: {
        username: username,
        password: password
      },
      success: function(user) {
        console.log(user);

        if (user == 'user not found. Please register') {
          alert(
            'user not found. Please enter correct data or register as a new user'
          );
        } else if (user == 'not authorized') {
          alert('Please  try with correct details');
          $('#username').val('');
          $('#password').val('');
        } else {
          sessionStorage.setItem('userID', user['_id']);
          sessionStorage.setItem('userName', user['username']);
          sessionStorage.setItem('userEmail', user['email']);
          $('#loginOverlay').css('display', 'none')
        }
      }, //success
      error: function() {
        console.log('error: cannot call api');
      } //errror

    }) //ajax
  } //if else
})

//logout
$('#logout').click(function() {
  sessionStorage.clear();
  console.log('You are logged out');
  console.log(sessionStorage);
  $('#loginOverlay').css('display', 'flex')
  location.href = "index.html";
});
$('.header-user').text(sessionStorage.getItem('userName'));


// Update Home Page Starts::::::::::::::::::::::::::::::::::::::::::::::::::::::
$('#home').one("click", function() {
  console.log("clicked window");
  $.ajax({
    url: `${url}/allProjectsFromDB`,
    type: 'GET',
    dataType: 'json',
    success: function(projectsFromMongo) {

      var i;
      // document.getElementById('projectList').innerHTML ="";
      for (i = 0; i < projectsFromMongo.length; i++) {
        console.log(projectsFromMongo[i].author);

        function updateProjectsHome() {
            var project = document.createElement('div');
            project.classList.add('project');
            adminSpace.append(project);
            project.innerHTML = `
              <h2 class="project-name">${projectsFromMongo[i].title}</h2>
              <p class="description">${projectsFromMongo[i].description}</p>
              <div class="item1">
            <img src = ${projectsFromMongo[i].image_url}>
              </div>`
          }

        var adminSpace
        if (projectsFromMongo[i].author == "kris") {
          adminSpace = document.querySelector('#kris');
          updateProjectsHome()

        } else if (projectsFromMongo[i].author == "ambar") {
          adminSpace = document.querySelector('#ambar');
          updateProjectsHome()

        } else if (projectsFromMongo[i].author == "toby") {
          adminSpace = document.querySelector('#toby')
          updateProjectsHome()
        }

      } // Loop ends
    },
    error: function() {

    }
  }) //ajax


}); // home click function ends

}); //document.ready
