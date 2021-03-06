import dispatcher from "../dispatcher";
import axios from 'axios';
//const server='http://localhost:3000/api/v2';
const server='https://sn.ut.ac.ir/api/v2';

export function updateFCM(token, uuid) {
  window.FirebasePlugin.getToken(function (fcm_token) {
    console.log(fcm_token);
    axios.get(server + '/update_token?fcm_token='+fcm_token + '&device_uuid='+uuid, { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token } })
    .then(function (response) {
      console.log(response);
      if (response.data.result) {
        dispatcher.dispatch({
          type: "TOKEN_UPDATED",
          data: response.data,
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  });
}



export function login(data) {
  var username = data.username
  var password = data.password
  axios.get(server + '/login?username='+ username +'&password='+ password)
  .then(function (response) {
    console.log(response);
    if (response.data.result == 'ERROR'){
      dispatcher.dispatch({
        type: "LOGIN_FAIL",
        error: response.data.error,
      });
    } else {
      dispatcher.dispatch({
        type: "LOGIN_SUCCESS",
        token: response.data.token,
      });
    }

  })
  .catch(function (error) {
    console.log(error);
  });
}


export function sign_up(data) {
  axios.post(server + '/sign_up', data )
  .then(function (response) {
    console.log(response);
    if (response.data.result == 'ERROR'){
      console.log('fail');
      dispatcher.dispatch({
        type: "SIGNUP_FAIL",
        error: response.data.error,
      });
    } else {
      dispatcher.dispatch({
        type: "SIGNUP_SUCCESS",
        token: response.data.token,
      });
    }

  })
  .catch(function (error) {
    console.log(error);
  });
}

export function getShares(data) {
  axios.get(server + '/wall?page='+data.page,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + data.token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_SHARES",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function getStreams(data) {
  axios.get(server + '/streams?page='+data.page,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + data.token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_STREAMS",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}


export function getUserStreams(token) {
  axios.get(server + '/streams',  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_USER_STREAMS",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}



export function getRoles(data) {
  axios.get(server + '/roles',  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + data.token }})
  .then(function (response) {
    dispatcher.dispatch({
      type: "GOT_ROLES",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function changeRole(data) {
  axios.get(server + '/change_role?role_id='+data.current_role_id,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + data.token }})
  .then(function (response) {
    dispatcher.dispatch({
      type: "CHANGED_ROLE",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function getShare(id, token) {
  axios.get(server + '/view_share/'+id,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_SHARE",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function share(stream_id, type, id ,token) {
  axios.get(server + '/share?id='+id+'&type='+type+'&stream='+stream_id,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_SHARE",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function getStream(id, token) {
  axios.get(server + '/view_stream/'+id,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_STREAM",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function getDiscussion(id, token) {
  axios.get(server + '/view_discussion/'+id,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_DISCUSSION",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function getProfile(id, token) {
  axios.get(server + '/view_profile/'+id,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_PROFILE",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function getEducations(id, token) {
  axios.get(server + '/view_educations/'+id,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_EDUCATIONS",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function getProfileBookmarks(id, token) {
  axios.get(server + '/view_profile_bookmarks/'+id,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_PROFILE_BOOKMARKS",
      data: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}


export function likes(id, token) {
  axios.get(server + '/likes/'+id,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    if (response.data.result){
      dispatcher.dispatch({
        type: "LIKE",
        likes: response.data.likes,
      });
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function like(id, type, token) {
  axios.get(server + '/like?id='+id+'&type='+type,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    if (response.data.result){
      dispatcher.dispatch({
        type: "LIKE",
        data: response.data,
      });
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function bookmark(id, type, token) {
  axios.get(server + '/bookmark?id='+id+'&type='+type,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    if (response.data.result){
      dispatcher.dispatch({
        type: "BOOKMARK",
        data: response.data,
      });
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function follow(id, type, token) {
  axios.get(server + '/follow?id='+id+'&type='+type,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    if (response.data.result){
      dispatcher.dispatch({
        type: "FOLLOW",
        data: response.data,
      });
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}
