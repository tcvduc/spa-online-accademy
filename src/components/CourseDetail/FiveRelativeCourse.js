import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as env from '../../config/env.config';
import CardCourse from '../CardCourse/CardCourse';
import CommonCarousel from '../Carousel/CommonCarousel';

const common_fontsize = 18;
const styles = makeStyles((theme) => ({
  course_detail_wrapper: {},
  ava_course: {},
  section_header: {
    minHeight: 100,
    marginTop: 100
  },
  course_name: {
    fontWeight: 'bold'
  },
  course_header_title: {
    textAlign: 'left',
    paddingTop: 12,
    paddingBottom: 12,
    color: 'white'
  },
  section_short_des: {
    minHeight: 100,
    fontSize: common_fontsize
  },
  des: {
    fontWeight: 'bold'
  },
  section_description: {
    minHeight: 100,
    fontSize: common_fontsize
  },
  section_syllabus: {
    minHeight: 100,
    fontSize: common_fontsize
  },
  section_rating: {},
  section_feedback: {
    marginBottom: 16
  },
  paper: {
    padding: 32,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    marginBottom: 16
  },
  box_cat: {
    padding: 12,
    '& .MuiTypography-root': {
      fontSize: common_fontsize
    }
  },
  pb16: {
    paddingBottom: 16
  },
  title: {
    color: 'black',
    fontWeight: 500
  }
}));

export default function FiveRelativeCourse({
  match,
  setUpdateCourseDetail,
  purchased_id_list,
  updateCourseDetail
}) {
  const classes = styles();
  const { id } = useParams();

  const {
    params: { course_id }
  } = match;

  const [is_empty, set_is_empty] = useState(false);
  const [first_4_courses, set_first_4_courses] = useState([]);
  const [second_1_course, set_second_1_course] = useState([]);

  function getFiveRelativeCourseCatBoughtMost() {
    if (course_id !== undefined) {
      const five_rel_url = `${env.DEV_URL}/api/course/detail/five-relative-bought-most/${course_id}`;
      const config = {};
      axios
        .get(five_rel_url, config)
        .then((ret) => {
          let first_4 = [];
          let sec_1 = [];

          if (
            ret.data.five_relative_cat_course.length === 0 ||
            ret.data.five_relative_cat_course === undefined
          ) {
            set_is_empty(true);
            return;
          }

          if (ret.data.five_relative_cat_course.length <= 4) {
            for (let i = 0; i < ret.data.five_relative_cat_course.length; ++i) {
              first_4.push(ret.data.five_relative_cat_course[i]);
            }
            set_first_4_courses(first_4);

            set_second_1_course(undefined);
            return;
          } else {
            for (let i = 0; i < 4; ++i) {
              first_4.push(ret.data.five_relative_cat_course[i]);
            }
            set_first_4_courses(first_4);

            for (let i = 4; i < 5; ++i) {
              sec_1.push(ret.data.five_relative_cat_course[i]);
            }
            set_second_1_course(sec_1);
          }
        })
        .catch((er) => {
          console.log(er.response);
        });
    }
    return;
  }

  useEffect(() => {
    getFiveRelativeCourseCatBoughtMost();
  }, [course_id]);

  return (
    <Paper className={classes.paper}>
      <Box mb={3}>
        <Typography className={classes.title} variant='h5'>
          Courses relative category
        </Typography>
      </Box>
      {is_empty ? (
        <Box>There is no course</Box>
      ) : (
        <div>
          {second_1_course === undefined ? (
            <CommonCarousel>
              <Grid container spacing={4}>
                {first_4_courses.map((ele, i) => {
                  return (
                    <Grid key={ele.course_id} item xs={12} sm={12} md={3}>
                      <CardCourse
                        purchased_id_list={purchased_id_list}
                        setUpdateCourseDetail={setUpdateCourseDetail}
                        updateCourseDetail={updateCourseDetail}
                        {...ele}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </CommonCarousel>
          ) : (
            <CommonCarousel>
              <Grid container spacing={4}>
                {first_4_courses.map((ele, i) => {
                  return (
                    <Grid key={ele.course_id} item xs={12} sm={12} md={3}>
                      <CardCourse
                        purchased_id_list={purchased_id_list}
                        setUpdateCourseDetail={setUpdateCourseDetail}
                        updateCourseDetail={updateCourseDetail}
                        {...ele}
                      />
                    </Grid>
                  );
                })}
              </Grid>

              <Grid container spacing={4}>
                {second_1_course.map((ele, i) => {
                  return (
                    <Grid key={ele.course_id} item xs={12} sm={12} md={3}>
                      <CardCourse
                        purchased_id_list={purchased_id_list}
                        updateCourseDetail={updateCourseDetail}
                        updateCourseDetail={updateCourseDetail}
                        {...ele}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </CommonCarousel>
          )}
        </div>
      )}
    </Paper>
  );
}
