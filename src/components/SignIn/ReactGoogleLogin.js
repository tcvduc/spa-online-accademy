import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';
import * as env from '../../config/env.config';
import { swal2Timing } from '../../config/swal2.config';

const styles = makeStyles((theme) => ({
  google_button: {
    padding: '6px 50px 6px 50px!important'
  }
}));

export default function ReactGoogleLogin() {
  const history = useHistory();
  const classes = styles();
  const responseGoogle = (res) => {
    const url = `${env.DEV_URL}/api/user/google/sign-in`;
    const data = {
      user_name: `${res.profileObj.name}`,
      email: `${res.profileObj.email}`
    };
    axios
      .post(url, data, {})
      .then((ret) => {
        const user = ret.data.user_info;

        if (user !== null) {
          sessionStorage.setItem('user_name', JSON.stringify(user.user_name));
          sessionStorage.setItem('email', JSON.stringify(user.email));
          sessionStorage.setItem('isLogout', false);
          sessionStorage.setItem('user_login_id', ret.data.user_info.user_id);
          sessionStorage.setItem('user_role', ret.data.user_info.role_id);
          history.push(ret.data.href);
        }
      })
      .catch((er) => {
        const title = 'error!';
        const html = er.response.data.message || 'Something broke!';
        const timer = 2500;
        const icon = 'error';
        swal2Timing(title, html, timer, icon);
      });
  };

  return (
    <GoogleLogin
      clientId={`${env.GOOGLE_CLIENT_ID}`}
      buttonText='Sign in with Google'
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      className={classes.google_button}
      cookiePolicy={'single_host_origin'}
    />
  );
}
