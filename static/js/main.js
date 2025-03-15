let currentUserIndex = 0
let selectedUser = null
let currentSessionIndex = 0
let selectedSession = null
let password = null
const userField = document.getElementById("name")
const sessionField = document.getElementById("session")
const passwordField = document.getElementById("login-password")
const loginPicture = document.getElementById("login-picture")
const nextUserButton = document.getElementById("next-user")
const lastUserButton = document.getElementById("last-user")
const nextSessionButton = document.getElementById("next-session")
const lastSessionButton = document.getElementById("last-session")
const usernameToIndex =
  lightdm.users?.reduce((acc, { name }, index) => ({ ...acc, [name]: index }), {}) || {}
const sessionToIndex =
  lightdm.sessions?.reduce((acc, { name }, index) => ({ ...acc, [name]: index }), {}) || {}

const show_error = error => console.error(error)

const showMessage = msg => {
  document.getElementById("login-response").innerHTML = msg
}

const setupUserList = () => {
  lightdm.users?.forEach(user => {
    const userOption = document.createElement("option")
    userOption.setAttribute("value", user.username)
    userOption.innerText = user.display_name
    userField.appendChild(userOption)
  })
  if (userField.childElementCount <= 1) {
    nextUserButton.style.visibility = "hidden"
    lastUserButton.style.visibility = "hidden"
  }
  
  lightdm.sessions?.forEach(session => {
    const sessionOption = document.createElement("option")
    sessionOption.setAttribute("value", session.name)
    sessionOption.innerText = session.name
    sessionField.appendChild(sessionOption)
  })
  if (sessionField.childElementCount <= 1) {
    nextSessionButton.style.visibility = "hidden"
    lastSessionButton.style.visibility = "hidden"
  }
}

const selectSessionByUser = ({ userIndex }) => {
  const previousSession = lightdm.users[userIndex]?.session
  return sessionToIndex[previousSession]
}

// Selection by GUI
const selectUserFromList = ({ userIndex = 0, err, fromKeyboard }) => {
  if (!err) displayUserPicture(userIndex)
  if (lightdm.authentication_user) lightdm.cancel_authentication()
  startAuthentication(lightdm.users[userIndex]?.username)
  if (fromKeyboard) return
  userField.value = lightdm.users[userIndex]?.username
  passwordField.focus()
}

const selectSessionFromList = ({ sessionIndex, fromKeyboard }) => {
  if (fromKeyboard) return;
  sessionField.value = lightdm.sessions[currentSessionIndex]?.name
  passwordField.focus()
}

// Selection by tabs
userField.addEventListener("change", e => {
  const userIndex = usernameToIndex[e.target.value]
  selectUserFromList({ userIndex, fromKeyboard: true })
})

const startAuthentication = username => {
  lightdm.cancel_autologin()
  selectedUser = username
  lightdm.authenticate(username)
  showMessage("&nbsp")
}

const authenticationComplete = () => {
  if (lightdm.is_authenticated)
    lightdm.start_session(sessionField.value)
  else {
    selectUserFromList({ userIndex: currentUserIndex, err: true })
    showMessage("Wrong password!")
  }
}

const displayUserPicture = userIndex =>
  loginPicture.setAttribute("src", lightdm.users[userIndex]?.image)

const provideSecret = () => {
  if (passwordField.value !== null) lightdm.respond(passwordField.value)
}

// Start the greeter
lightdm.authentication_complete.connect(authenticationComplete)
setupUserList()
selectUserFromList({ userIndex: 0 })
showMessage("&nbsp")
lastUserButton.addEventListener("click", () => {
  currentUserIndex--
  if (currentUserIndex < 0) currentUserIndex = userField.childElementCount - 1
  if (userField.childElementCount != 1) selectUserFromList({ userIndex: currentUserIndex })
  currentSessionIndex = selectSessionByUser({ userIndex: currentUserIndex }) || currentSessionIndex
  selectSessionFromList({ sessionIndex: currentSessionIndex })
  showMessage("&nbsp")
})
nextUserButton.addEventListener("click", () => {
  currentUserIndex++
  if (currentUserIndex >= userField.childElementCount) currentUserIndex = 0
  if (userField.childElementCount != 1) selectUserFromList({ userIndex: currentUserIndex })
  currentSessionIndex = selectSessionByUser({ userIndex: currentUserIndex }) || currentSessionIndex
  selectSessionFromList({ sessionIndex: currentSessionIndex })
  showMessage("&nbsp")
})
lastSessionButton.addEventListener("click", () => {
  currentSessionIndex--
  if (currentSessionIndex < 0) currentSessionIndex = sessionField.childElementCount - 1
  if (sessionField.childElementCount != 1) selectSessionFromList({ sessionIndex: currentSessionIndex })
  showMessage("&nbsp")
})
nextSessionButton.addEventListener("click", () => {
  currentSessionIndex++
  if (currentSessionIndex >= sessionField.childElementCount) currentSessionIndex = 0
  if (sessionField.childElementCount != 1) selectSessionFromList({ sessionIndex: currentSessionIndex })
  showMessage("&nbsp")
})
