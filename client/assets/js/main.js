// AUTH VARIABLES
let authSection = $('#auth')
let loginContainer = $('#login-container')
let loginLink = $('#login-link a')
let loginBtn = $('#login-btn')
let registerContainer = $('#register-container')
let registerLink = $('#register-link a')
let registerBtn = $('#register-btn')
let logoutBtn = $('#logout-btn')

// BASE URL
let baseUrl = 'http://localhost:3000'

// TODO VARIABLES
let mainTodoSection = $('#main-todo')
let newsContainer = $('#get-news')
let tasksContainer = $('#get-tasks')
let tasksDoneContainer = $('#get-tasks-done')
let addTaskBtn = $('#add-task-btn')

registerContainer.hide()
mainTodoSection.hide()

$(document).ready(() => {
  checkAuth()
})

// Auth 

const checkAuth = () => {
  if(localStorage.getItem('access_token')){
    showTodo()
    $('#userEmail a').empty()
    $('#userEmail a').append(localStorage.getItem('email'))
  }else{
    showAuth()
  }
}

const showTodo = () => {
  authSection.hide()
  mainTodoSection.show()
  getTasks()
  getNews()
  getWeather()
}

const showAuth = () => {
  authSection.show()
  mainTodoSection.hide()
}

const showRegister = () => {
  loginContainer.hide()
  registerContainer.show()
}

const showLogin = () => {
  loginContainer.show()
  registerContainer.hide()
}

loginLink.click(() => {
  showLogin()
})

registerLink.click(() => {
  showRegister()
})

loginBtn.click((e) => {
  e.preventDefault()
  let email = $('#email').val()
  let password = $('#password').val()
  $.ajax({
    method: 'POST',
    url: `${baseUrl}/login`,
    data:{
      email,
      password
    }
  })
    .done(res => {
      localStorage.setItem('access_token', res.jwtToken)
      localStorage.setItem('email', res.userData.email)
      showTodo()
      console.log(res, 'res')
    })
    .fail(err => {
      console.log(err.responseJSON, 'err')
      alert(err.responseJSON.message)
    })
    .always(_ => {
      console.log('always')
      $('#email').val('')
      $('#password').val('')
    })
})

registerBtn.click((e) => {
  e.preventDefault()
  let email = $('#register-email').val()
  let password = $('#register-password').val()
  $.ajax({
    method: 'POST',
    url: `${baseUrl}/register`,
    data:{
      email,
      password
    }
  })
    .done(res => {
      console.log(res, 'res')
    })
    .fail(err => {
      console.log(err.responseJSON, 'err')
    })
    .always(_ => {
      console.log('always')
      $('#register-email').val('')
      $('#register-password').val('')
    })
})

logoutBtn.click((e) => {
  localStorage.clear()
  checkAuth()
})

// Todo
const getTasks = () => {
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/todos`,
    headers:{
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(res => {
      let tasks = res
      let done = []
      let undone = []
      tasksContainer.empty('')
      if(res.length){
        tasks.forEach(task => {
          if(task.status){
            done.push(task)
          }else{
            undone.push(task)
          }
        })
        done.forEach(task => {
          tasksDoneContainer.append(`<div class="card mb-3" style="width: 20rem;">
            <div class="card-body">
              <h5 class="card-title">${task.title}</h5>
              <p class="card-text">${task.description}</p>
              <p class="card-text">due date : ${task.due_date.slice(0,10)}</p>
              <a href="#" id="markBtn" onclick="updateStatus(${task.id}, ${task.status})" class="btn btn-outline-primary">Mark as Done</a>
              <a href="#" id="editBtn" class="btn btn-warning">Edit</a>
              <a href="#" id="deleteBtn" class="btn btn-danger">Delete</a>
            </div>
          </div>`)
        })
        undone.forEach(task => {
          tasksContainer.append(`<div class="card mb-3" style="width: 20rem;">
            <div class="card-body">
              <h5 class="card-title">${task.title}</h5>
              <p class="card-text">${task.description}</p>
              <p class="card-text">due date : ${task.due_date.slice(0,10)}</p>
              <a href="#" id="markBtn" onclick="updateStatus(${task.id}, ${task.status})" class="btn btn-outline-primary">Mark as Done</a>
              <a href="#" id="editBtn" class="btn btn-warning">Edit</a>
              <a href="#" id="deleteBtn" class="btn btn-danger">Delete</a>
            </div>
          </div>`)
        })
      }else{
        tasksContainer.append(`<h2>${res.message}</h2>`)
      }
    })
    .fail(err => {
      console.log(err.responseJSON, 'err')
    })
    .always(_ => {
      console.log('always')
    })
}

const getNews = () => {
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/todos/news`,
    headers:{
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(res => {
      let articles = res.articles
      newsContainer.empty('')
      articles.forEach(article => {
        newsContainer.append(`<div class="card mb-3" style="width: 18rem;">
          <img class="card-img-top" src=${article.urlToImage} alt="news thumbnail">
          <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <a href="${article.url}" target="_blank" class="btn btn-primary">Go to article</a>
          </div>
        </div>`)
      })
    })
    .fail(err => {
      console.log(err.responseJSON, 'err')
    })
    .always(_ => {
      console.log('always')
    })
}

const getWeather = () => {
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/todos/weather`,
    headers:{
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(res => {
      // console.log(res, 'res')
    })
    .fail(err => {
      console.log(err.responseJSON, 'err')
    })
    .always(_ => {
      console.log('always')
    })
}

addTaskBtn.click((e) => {
  e.preventDefault()
  $('#addTaskModal').modal('toggle')
  let title = $('#title').val()
  let description = $('#description').val()
  let due_date = $('#due_date').val()
  console.log(localStorage.getItem('access_token'))
  $.ajax({
    method: 'POST',
    url: `${baseUrl}/todos`,
    data:{
      title,
      description,
      status: false,
      due_date
    },
    headers:{
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(res => {
      // console.log(res)
      checkAuth()
    })
    .fail(err => {
      console.log(err.responseJSON, 'err')
    })
    .always(_ => {
      console.log('always')
    })
})

const updateStatus = (id, status) => {
  console.log(status)
  $.ajax({
    method: 'PATCH',
    url: `${baseUrl}/todos/${id}`,
    data:{
      status: !status,
    },
    headers:{
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(res => {
      checkAuth()
    })
    .fail(err => {
      console.log(err.responseJSON, 'err')
    })
    .always(_ => {
      console.log('always')
    })
}