import authenticatedRequest from '../utils/authenticatedRequest';

export const UPDATEPROFILE_FUL = 'UPDATEPROFILE_FUL';
export const UPDATEPROFILE_REJ = 'UPDATEPROFILE_REJ';

export const GETPROFILE_FUL = 'GETPROFILE_FUL';
export const GETPROFILE_REJ = 'GETPROFILE_REJ';

export const FAVUNFAV_FUL = 'FAVUNFAV_FUL';
export const FAVUNFAV_REJ = 'FAVUNFAV_REJ';

export function updateProfile(data) {
  // will send a POST  request  to /api/profile/edit with the data passed into it
  // this request will need to be an authenticated request (ref the import at the
  // top of the file
  // Note that this action creator is asynchronous. Look back at lecture to see
  // how you should  structure this function in light of that fact
  // From the response, grab the name, species, and image
  // dispatch an UPDATEPROFILE_FUL action with additional properties `profile`
  // and `message: 'You have updated your profile and can now check it'` In the
  // `profile` preoperty of the action, set its value equal to an object with
  // properties name, species, and image
  // If the request fails/errors, send an action of type UPDATEPROFILE_REJ and
  // add an additional property `error` containing the error itself
  return (dispatch) => {
    authenticatedRequest('POST', '/api/profile/edit', data)
      .then(res => res.json())
      .then((resp) => {
        const data = resp.data;
        let obj = {name: data.name, species: data.species, image: data.image }; 
        dispatch({
          type: UPDATEPROFILE_FUL,
          message: 'You have updated your profile and can now check it',
          profile: obj
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATEPROFILE_REJ,
          error,
        });
      });
  };
}


export function getUser(id) {
  // async action creator again
  // make an authenticated request to the route  that allows us to get profile
  // information. (you can ref your express files for this to see what type  of
  // request it is and the url pattern (note that you need to handle the case where
  // id is empty/undefined and adjust the url accordingly
  // When the request is successful, dispatch a GETPROFILE_FUL action with additional
  // property `profile` containing  the result of the request relevant (ref your express
  // method for what is returned)
  // if there's  an error, dispatch a GETPROFILE_REJ action with an addition property `error`
  // equal to the error
  let url = id ? `/api/profile/${id}/info` : `/api/profile/info`;
  return dispatch => authenticatedRequest('GET', url)
  .then(res => {
    return res.json()
  })
  .then((res) => {
    const data = res.data;
    let profile = {name: data.name, species: data.species, image: data.image,
                  followers: data.followers, following: data.following, isFollowing: data.isFollowing};
    dispatch({
      type: GETPROFILE_FUL,
      profile: profile
    });
  })
  .catch((error) => {
    dispatch({
      type: GETPROFILE_REJ,
      error,
    });
  });
}


export function favUnfav(id) {
  // async action creator again
  // make an authenticated request to the route that allows us to follow
  // a user. when this returns, dispatch  a new FAVUNFAV_FUL action with properties
  // profile equal to the response data and also  a message property that says
  // 'You are now ' + following or unfollowing + ' this person'
  // else if there is an  error
  // dispatch an action FAVUNFAV_REJ  with an error equal  to the error of the
  // request
  return (dispatch) => {
    authenticatedRequest('POST', `/api/profile/${id}/follow`)
      .then(res => res.json())
      .then((resp) => {
        const data = resp.data;
        const following = data.isFollowing ? 'following' : 'unfollowing';
        dispatch({
          type: FAVUNFAV_FUL,
          message: 'You are now ' + following + ' this person',
          profile: data,
        });
      })
      .catch((error) => {
        dispatch({
          type: FAVUNFAV_REJ,
          error,
        });
      });
  };
}
