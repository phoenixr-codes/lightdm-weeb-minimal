/*
    Mock data for testing your LightDM theme in the browser
*/
if (!("lightdm" in window)) {
  window.lightdm = {}
  lightdm.hostname = "test-host"
  lightdm.languages = [
    {
      code: "en_US",
      name: "English(US)",
      territory: "USA",
    },
    {
      code: "en_UK",
      name: "English(UK)",
      territory: "UK",
    },
  ]
  lightdm.default_language = lightdm.languages[0]
  lightdm.layouts = [
    {
      name: "test",
      short_description: "test description",
      short_description: "really long epic description",
    },
  ]
  lightdm.default_layout = lightdm.layouts[0]
  lightdm.layout = lightdm.layouts[0]
  lightdm.sessions = [
    {
      key: "key1",
      name: "session 1",
      comment: "no comment",
    },
    {
      key: "key2",
      name: "session 2",
      comment: "no comment",
    },
    {
      key: "key3",
      name: "bspwm",
      comment: "no comment",
    },
  ]

  lightdm.default_session = lightdm.sessions[0]
  lightdm.authentication_user = null
  lightdm.is_authenticated = false
  lightdm.can_suspend = true
  lightdm.can_hibernate = true
  lightdm.can_restart = true
  lightdm.can_shutdown = true
  lightdm.authentication_complete_callback = () => {}
  lightdm.authentication_complete = {
    connect: callback => {
      lightdm.authentication_complete_callback = callback
    },
  }

  lightdm.users = [
    {
      username: "mob",
      real_name: "mob",
      display_name: "Kageyama Shigeo",
      image: "static/img/profile.jpg",
      language: "en_US",
      layout: null,
      session: null,
      logged_in: false,
    },
    {
      username: "zerotwo",
      realname: "ZeroTwo",
      display_name: "Zero Two",
      image: "static/img/zerotwo.png",
      layout: null,
      session: "bspwm",
      logged_in: false,
    },
  ]

  lightdm.num_users = lightdm.users.length
  lightdm.timed_login_delay = 0 // increase to simulate timed_login_delay
  lightdm.timed_login_user = lightdm.timed_login_delay > 0 ? lightdm.users[0] : null

  lightdm.get_string_property = function () {}
  lightdm.get_integer_property = function () {}
  lightdm.get_boolean_property = function () {}
  lightdm.cancel_autologin = function () {
    _lightdm_mock_check_argument_length(arguments, 0)

    lightdm._timed_login_cancelled = true
  }

  lightdm.respond = function (secret) {
    if (typeof lightdm.authentication_user === "undefined" || !lightdm.authentication_user) {
      throw "must call authenticate first"
    }
    _lightdm_mock_check_argument_length(arguments, 1)

    var user = _lightdm_mock_get_user(lightdm.username)

    // That's right, passwords are the same as the username's!
    if (!user && secret === lightdm.authentication_user) {
      lightdm.is_authenticated = true
      lightdm.authentication_user = user
    } else {
      lightdm.is_authenticated = false
      lightdm.authentication_user = null
      lightdm.authentication_user = null
    }

    lightdm.authentication_complete_callback()
  }

  lightdm.authenticate = function (username) {
    _lightdm_mock_check_argument_length(arguments, 1)

    if (lightdm.authentication_user) {
      throw "Already authenticating!"
    }
    var user = _lightdm_mock_get_user(username)
    if (!user) {
      show_error(username + " is an invalid user")
    }
    //show_prompt("Password: ");
    lightdm.authentication_user = username
  }

  lightdm.cancel_authentication = function () {
    _lightdm_mock_check_argument_length(arguments, 0)

    if (!lightdm.authentication_user) {
      throw "we are not authenticating"
    }
    lightdm.authentication_user = null
  }

  lightdm.suspend = function () {
    alert("System Suspended. Bye Bye")
    document.location.reload(true)
  }

  lightdm.hibernate = function () {
    alert("System Hibernated. Bye Bye")
    document.location.reload(true)
  }

  lightdm.restart = function () {
    alert("System restart. Bye Bye")
    document.location.reload(true)
  }

  lightdm.shutdown = function () {
    alert("System Shutdown. Bye Bye")
    document.location.reload(true)
  }

  lightdm.start_session = function (session) {
    _lightdm_mock_check_argument_length(arguments, 1)

    if (!lightdm.is_authenticated) {
      throw "The system is not authenticated"
    }

    alert("logged in successfully!!")
    document.location.reload(true)
  }

  if (lightdm.timed_login_delay > 0) {
    setTimeout(function () {
      if (!lightdm._timed_login_cancelled()) timed_login()
    }, lightdm.timed_login_delay)
  }
}
// Helper functions
var _lightdm_mock_check_argument_length = function (args, length) {
  if (args.length != length) {
    throw "incorrect number of arguments in function call"
  }
}

var _lightdm_mock_get_user = function (username) {
  var user = null
  for (var i = 0; i < lightdm.users.length; ++i) {
    if (lightdm.users[i].username === username) {
      user = lightdm.users[i]
      break
    }
  }
  return user
}
