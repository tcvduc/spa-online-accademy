import {
  Box,
  Button,
  Container,
  FormControl,
  makeStyles,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import * as env from '../../config/env.config';
import { swal2Timing } from '../../config/swal2.config';
import Navbar from '../Navbar/Navbar';
import Footer from './../Footer/Footer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const common_spacing = 32;

const CdnFileInput = () => {
  return <div></div>;
};

const styles = makeStyles((theme) => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '1em',
      display: 'initial'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: `#455a64`,
      outline: '1px solid slategrey'
    }
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  container: {
    backgroundColor: '#fafafa'
  },
  cdn: {},
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(12, 0, 12),
    boxShadow: '0 4px 8px rgb(0 1 1 / 10%)'
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
    flexGrow: 1,
    display: 'flex'
  },

  btn_sign_in: {
    color: 'inherit',
    textDecoration: 'none',
    textTransform: 'capitalize',
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
  nav_typo: {
    margin: 12
  },
  btn_si: {
    textTransform: 'capitalize'
  },
  outstanding_course_wrapper: {
    marginTop: 100,
    marginBottom: 100
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    '&:visited': {
      color: 'inherit',
      textDecoration: 'none'
    }
  },
  btn: {
    textTransform: 'capitalize'
  },
  cart_css: {
    color: 'white'
  },
  header: {
    marginTop: 100,
    marginBottom: 100
  },
  list_cat_container: {
    display: 'flex',
    justifyContent: 'center'
  },
  table: {
    '&.MuiTableContainer-root': {
      width: 'unset'
    }
  },
  box_cat: {
    display: 'flex;',
    justifyContent: 'center;',
    alignItems: 'center;',
    width: '100%'
  },
  opa05: {
    opacity: 0.5
  }
}));

export default function UploadCourse({ match }) {
  const classes = styles();
  const [is_logged_in, set_is_logged_in] = React.useState(true);
  const [is_verified, set_is_verified] = useState(false);
  const [isLogout, setisLogout] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);

  const [shortDes, setShortDes] = useState('');
  const [fullDes, setFullDes] = useState('');

  const [subCatChoosen, setSubCatChoosen] = useState('');
  const [subCatArr, setSubCatArr] = useState([1, 2, 3]);

  const [course_state, set_course_state] = useState({
    course_name: '',
    course_title: '',
    course_avatar_url: '',
    course_fee: ''
  });

  //---------------------------
  // file input handle
  //---------------------------
  // const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  // const fileInput = useRef(null);
  // const handleFileInput = (e) => {
  //   onFileSel;
  // };
  const [file, setfile] = useState('');
  const [image, setimage] = useState('');
  const [image_name, setimage_name] = useState('');
  const [isComponentUpdate, setisComponentUpdate] = React.useState(false);
  const [base64Image, setBase64Image] = useState('');
  const [img_upload, setImg_upload] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isCourseNameError, setIsCourseNameError] = useState(false);
  const [isTittleError, setIsTittleError] = useState(false);
  const [isFeeError, setIsFeeError] = useState(false);
  const [isFullDesError, setIsFullDesError] = useState(false);
  const [isShortDesError, setIsShortDesError] = useState(false);

  const onUploadAva = (e) => {
    let count = 0;
    const file_one = e.target.files[0];

    if (!file_one) {
      return;
    }

    for (const file of e.target.files) {
      const reader = new FileReader();

      reader.fileName = file.name;
      reader.onloadstart = () => {
        setImg_upload([]);
      };

      reader.onloadend = (readerEvt) => {
        var base64Ret = reader.result.split(',')[1];
        const new_upload = [
          ...img_upload,
          {
            imageUrl: reader.result,
            enc: base64Ret,
            fileName: readerEvt.target.fileName
          }
        ];

        const new_img = reader.result;
        setimage(new_img);
      };
      if (file) {
        reader.readAsDataURL(file);
        count++;
      }
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (er) => {
        reject(er);
      };
    });
  };

  const uploadImageChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBase64Image(base64);
  };

  const handleFileInputChange = (e) => {
    setfile(e.target.files[0]);
    let reader = new FileReader();

    let file = e.target.files[0];

    reader.onload = () => {
      setSelectedFile(file);
    };

    reader.readAsDataURL(file);
  };

  //---------------------------
  // end file input handle
  //---------------------------

  function getSubCat() {
    const url = `${env.DEV_URL}/api/sub-category`;
    const config = {};
    axios
      .get(url, config)
      .then((ret) => {
        setSubCatArr(ret.data.all_sub_cats);
      })
      .catch((er) => {
        console.log(er.response);
      });
  }

  const handleSubCatChange = (e) => {
    setSubCatChoosen(e.target.value);
  };

  const handleKeypress = (e) => {
    setIsUpdate(!isUpdate);
    if (e.which === 13) {
      handleSubmit(e);
    }
  };

  const handleCourseStateChange = (ev) => {
    const value = ev.target.value;
    set_course_state({
      ...course_state,
      [ev.target.name]: value
    });

    if (ev.target.value === '' && ev.target.name === 'course_name') {
      setIsCourseNameError(true);
    } else {
      setIsCourseNameError(false);
    }

    if (ev.target.value === '' && ev.target.name === 'course_title') {
      setIsTittleError(true);
    } else {
      setIsTittleError(false);
    }

    if (
      (+ev.target.value < 0 && ev.target.name === 'course_fee') ||
      (ev.target.name === 'course_fee' && isNaN(+ev.target.value)) ||
      (ev.target.value === '' && ev.target.name === 'course_fee')
    ) {
      setIsFeeError(true);
    } else {
      setIsFeeError(false);
    }
  };

  const handleSubmit = (ev) => {
    // alert(
    //   `${course_state.course_name}\n${course_state.course_title}\n${course_state.course_fee}\n${fullDes}\n${shortDes}`
    // );

    if (isTittleError || isCourseNameError || isFeeError) {
      const title = 'error!';
      const html = 'error!';
      const timer = 2500;
      const icon = 'error';
      swal2Timing(title, html, timer, icon);
      return;
    }

    if (
      course_state.course_name.length === 0 ||
      course_state.course_title.length === 0
    ) {
      const title = 'error!';
      const html = 'error!';
      const timer = 2500;
      const icon = 'error';
      swal2Timing(title, html, timer, icon);
      return;
    }

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    const formAvaData = new FormData();

    console.log('full des', fullDes);

    // formAvaData.append("ava", image);
    // formAvaData.append("ava", base64Image);
    formAvaData.append('ava', selectedFile);
    formAvaData.append('course_name', course_state.course_name);
    formAvaData.append('course_title', course_state.course_title);
    formAvaData.append('course_fee', course_state.course_fee);
    formAvaData.append('course_full_description', fullDes);
    formAvaData.append('course_short_description', shortDes);
    formAvaData.append('subject_id', subCatChoosen);
    formAvaData.append('user_id', +sessionStorage.getItem('user_login_id'));

    const upload_course_url = `${env.DEV_URL}/api/instructor/upload-course`;
    setLoading(true);
    axios
      .post(upload_course_url, formAvaData, config)
      .then((ret) => {
        // alert("ok");
        setLoading(false);
        setisComponentUpdate(!isComponentUpdate);
        const title = 'Success!';
        const html = 'Course add success!';
        const timer = 2500;
        const icon = 'success';
        swal2Timing(title, html, timer, icon);
      })
      .catch((er) => {
        // alert("not ok");
        setLoading(false);

        setisComponentUpdate(!isComponentUpdate);

        if (er.response !== undefined) {
          const title = 'error!';
          const html = 'Something broke!';
          const timer = 2500;
          const icon = 'error';
          swal2Timing(title, html, timer, icon);
        } else {
          const title = 'error!';
          const html = 'Something broke!';
          const timer = 2500;
          const icon = 'error';
          swal2Timing(title, html, timer, icon);
        }
      });
  };
  const handleClick = (ev) => {
    handleSubmit(ev);
  };

  const CdnFileInput = () => {
    return (
      <Box className={classes.cdn}>
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css'
          crossorigin='anonymous'
        />
        <link
          href='https://cdn.jsdelivr.net/gh/kartik-v/bootstrap-fileinput@5.2.0/css/fileinput.min.css'
          media='all'
          rel='stylesheet'
          type='text/css'
        />
        <link
          rel='stylesheet'
          href='https://use.fontawesome.com/releases/v5.5.0/css/all.css'
          crossorigin='anonymous'
        />

        <script
          src='https://code.jquery.com/jquery-3.5.1.min.js'
          crossorigin='anonymous'
        ></script>
        <script
          src='https://cdn.jsdelivr.net/gh/kartik-v/bootstrap-fileinput@5.2.0/js/plugins/piexif.min.js'
          type='text/javascript'
        ></script>
        <script
          src='https://cdn.jsdelivr.net/gh/kartik-v/bootstrap-fileinput@5.2.0/js/plugins/sortable.min.js'
          type='text/javascript'
        ></script>
        <script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js'></script>
        <script
          src='https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js'
          crossorigin='anonymous'
        ></script>
        <script src='https://cdn.jsdelivr.net/gh/kartik-v/bootstrap-fileinput@5.2.0/js/fileinput.min.js'></script>
        <script src='https://cdn.jsdelivr.net/gh/kartik-v/bootstrap-fileinput@5.2.0/themes/fas/theme.min.js'></script>
        <script src='https://cdn.jsdelivr.net/gh/kartik-v/bootstrap-fileinput@5.2.0/js/locales/LANG.js'></script>
      </Box>
    );
  };

  React.useEffect(() => {
    // check is verify account
    let email = sessionStorage.getItem('email');

    if (email !== null) {
      set_is_logged_in(true);
      email = email.substring(1, email.length - 1);
      const config = {};
      const verified_url = `${env.DEV_URL}/api/user/check-verify-account/${email}`;
      axios
        .get(verified_url, config)
        .then((ret) => {
          set_is_verified(ret.data.isVerified);
          if (ret.data.isVerified === false) {
            const icon = 'warning';
            const title = 'Verify!';
            const html = 'Please verify your email account!';
            const timer = 3500;
            swal2Timing(title, html, timer, icon);
          }
        })
        .catch((er) => {
          console.log(er.response);
        });
    }

    const isLg = sessionStorage.getItem('isLogout', false);

    if (isLg !== null) {
      setisLogout(isLg);
    } else {
      setisLogout(isLg);
    }

    // get subcat
    getSubCat();
  }, [match.path, isUpdate, isComponentUpdate, loading]);

  return (
    <React.Fragment>
      <Box className={classes.container}>
        <Navbar setisLogout={setisLogout} />
        <Container maxWidth='sm'>
          <Box my={12} p={3} component={Paper}>
            <form
              encType='multipart/form-data'
              onSubmit={handleSubmit}
              onKeyPress={handleKeypress}
            >
              <Box my={3}>
                <Typography variant='h5'>Upload course</Typography>
              </Box>
              <Box my={3}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    type='text'
                    label='Course name'
                    name='course_name'
                    id='course_name'
                    error={isCourseNameError}
                    helperText={isCourseNameError ? 'Cannot empty' : ''}
                    value={course_state.course_name}
                    onChange={handleCourseStateChange}
                  />
                </FormControl>
              </Box>
              <Box my={3}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    type='text'
                    label='Title'
                    name='course_title'
                    id='course_title'
                    error={isTittleError}
                    helperText={isTittleError ? 'Cannot empty' : ''}
                    value={course_state.course_title}
                    onChange={handleCourseStateChange}
                  />
                </FormControl>
              </Box>

              <Box my={3}>
                <Box my={3}>
                  <Typography variant='h5' component='p'>
                    Category
                  </Typography>
                </Box>
                <FormControl
                  fullWidth
                  variant='filled'
                  className={classes.formControl}
                >
                  <InputLabel id='demo-simple-select-filled-label'>
                    Category
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId='demo-simple-select-filled-label'
                    id='demo-simple-select-filled'
                    value={subCatChoosen}
                    onChange={handleSubCatChange}
                  >
                    {subCatArr.length > 0
                      ? subCatArr.map((ele) => {
                          return (
                            <MenuItem
                              key={ele.subject_id}
                              value={ele.subject_id}
                            >
                              {ele.subject_name}
                            </MenuItem>
                          );
                        })
                      : ''}
                  </Select>
                </FormControl>
              </Box>

              <Box my={3}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    type='number'
                    label='Fee'
                    name='course_fee'
                    id='course_fee'
                    error={isFeeError}
                    helperText={isFeeError ? 'Fee error' : ''}
                    value={course_state.course_fee}
                    onChange={handleCourseStateChange}
                  />
                </FormControl>
              </Box>

              <Box my={3}>
                <Box my={3}>
                  <Typography variant='h5' component='p'>
                    Full description
                  </Typography>
                </Box>
                <FormControl fullWidth>
                  <ReactQuill
                    theme='snow'
                    value={fullDes}
                    onChange={setFullDes}
                  />
                </FormControl>
              </Box>

              <Box my={3}>
                <Box my={3}>
                  <Typography variant='h5' component='p'>
                    Short description
                  </Typography>
                </Box>
                <FormControl fullWidth>
                  <ReactQuill
                    theme='snow'
                    value={shortDes}
                    onChange={setShortDes}
                  />
                </FormControl>
              </Box>

              <Box my={3}>
                <Box my={3}>
                  <Typography variant='h5' component='p'>
                    Avatar
                  </Typography>
                </Box>

                <input
                  id='input-b1'
                  name='input-b1'
                  type='file'
                  className='file'
                  onChange={(e) => handleFileInputChange(e)}
                  data-browse-on-zone-click='true'
                ></input>
              </Box>

              <Box my={3}>
                {loading ? (
                  <Button
                    fullWidth
                    onClick={handleClick}
                    className={classes.btn}
                    variant='outlined'
                    color='primary'
                  >
                    Loading ...
                  </Button>
                ) : (
                  <Button
                    onClick={handleClick}
                    className={classes.btn}
                    variant='contained'
                    color='primary'
                  >
                    Upload
                  </Button>
                )}
              </Box>
            </form>{' '}
          </Box>
          <Box className={classes.cdn}></Box>
        </Container>
        <Footer />
      </Box>
    </React.Fragment>
  );
}
