import { Box } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ADD_COURSE_TO_CART } from '../../actionTypes/cart.type';

const common_spacing = 32;

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 8px rgb(0 1 1 / 10%)'
  },
  cardMedia: {
    paddingTop: '56.25%' // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  },
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  btn_sign_in: {
    color: 'inherit',
    textDecoration: 'none',
    '&:visited': {
      color: 'inherit',
      textDecoration: 'none'
    }
  },
  ten_most_newest_courses: {
    textAlign: 'center',
    marginTop: common_spacing,
    marginBottom: common_spacing
  },
  outstanding_courses: {
    textAlign: 'center',
    marginTop: common_spacing,
    marginBottom: common_spacing
  },
  card_wrapper: {
    // marginBottom: common_spacing * 2,
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    '&:visited': {
      color: 'inherit',
      textDecoration: 'none'
    }
  },
  typo: {
    textAlign: 'left'
  },
  card_action: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '100%'
  },
  badge: {
    '& .MuiBadge-anchorOriginBottomLeftRectangle': {
      width: '100px',
      backgroundColor: '#e2e27a'
    }
  }
}));

function CardNewestCourse(props) {
  const {
    course_avatar_url,
    course_fee,
    course_name,
    course_title,
    course_id,
    subject_name,
    user_name,
    user_id,
    avg_rate,
    dispatchAddToCart,
    cart_global_state,
    isLogout
  } = props;
  const [is_in_cart, set_is_in_cart] = useState(false);
  const [toggle_buy_click, set_toggle_buy_click] = useState(false);
  const [email, set_email] = useState(undefined);
  const [user_role, setUser_role] = useState(0);

  const handleBuyClick = (e) => {
    const curr_user_id = sessionStorage.getItem('user_login_id');

    dispatchAddToCart(
      course_id,
      +curr_user_id,
      course_fee,
      course_avatar_url,
      course_name,
      course_title
    );
  };

  useEffect(() => {
    // role
    const user_role = sessionStorage.getItem('user_role');
    setUser_role(+user_role);
    const email = sessionStorage.getItem('email');
    if (email === null) {
      return set_email(undefined);
    } else if (email === undefined) {
      return set_email(undefined);
    } else if (email === '') {
      return set_email(undefined);
    }
    set_email(email);

    if (cart_global_state !== undefined) {
      for (let i = 0; i < cart_global_state.length; ++i) {
        if (cart_global_state[i].course_id === course_id) {
          set_is_in_cart(true);
          set_toggle_buy_click(!toggle_buy_click);
          break;
        }
      }
    }
  }, [cart_global_state, email, isLogout]);

  const classes = useStyles();
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <Link className={classes.link} to={`/course/${course_id}`}>
          <CardActionArea>
            <CardMedia
              className={classes.cardMedia}
              image={`${course_avatar_url}`}
              title='Image title'
            />
            <Box display='flex' px={8} justifyContent='flex-start' width='100%'>
              <Badge
                className={classes.badge}
                variant='standard'
                badgeContent='New'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              />
            </Box>

            <CardContent className={classes.cardContent}>
              <Typography
                className={classes.typo}
                gutterBottom
                variant='h6'
                component='p'
              >
                {course_name}
              </Typography>
              <Typography className={classes.typo}>{subject_name}</Typography>
              <Typography className={classes.typo}> {user_name}</Typography>
              <Typography className={classes.typo}>{course_fee}$</Typography>
            </CardContent>
          </CardActionArea>
        </Link>

        {email !== undefined ? (
          <CardActions className={classes.card_action}>
            {user_role === 2 || user_role === 4 ? (
              <Button
                disabled={is_in_cart === true}
                onClick={handleBuyClick}
                variant='contained'
                size='small'
                color='primary'
              >
                Buy
              </Button>
            ) : (
              ''
            )}

            <Link className={classes.link} to={`/course/${course_id}`}>
              <Button variant='outlined' size='small' color='primary'>
                Detail
              </Button>
            </Link>
          </CardActions>
        ) : (
          <React.Fragment></React.Fragment>
        )}
      </Card>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    cart_global_state: state.cartReducer.cart
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchAddToCart: (
      course_id,
      user_id,
      course_price,
      course_ava,
      course_name,
      course_title
    ) => {
      dispatch({
        type: ADD_COURSE_TO_CART,
        payload: {
          course_id: course_id,
          course_price: course_price,
          course_ava: course_ava,
          course_name: course_name,
          course_title: course_title,
          user_id: user_id
        }
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardNewestCourse);
