import dispatcher from "../dispatcher";
import axios from 'axios';
//const server='http://localhost:3000/api';
const server='http://194.225.14.164/api';
//const server='http://sanatik.ir:3000/api';

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
  var email = data.email
  var password = data.password
  axios.get(server + '/login?email='+ email +'&password='+ password)
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

export function getArticles(data) {
  axios.get(server + '/dashboard?page='+data.page,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + data.token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_ARTICLES",
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

export function getArticle(id, token) {
  axios.get(server + '/article/'+id,  { headers: {'Content-Type': 'application/json', 'Authorization': "bearer " + token }})
  .then(function (response) {
    console.log(response);
    dispatcher.dispatch({
      type: "SHOW_ARTICLE",
      article: response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}
