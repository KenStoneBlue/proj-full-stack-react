import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import {listPublished} from './../course/api-course'
import {listEnrolled, listCompleted} from './../enrollment/api-enrollment'
import Typography from '@material-ui/core/Typography'
import unicornbikeImg from './../assets/images/unicornbike.jpg'
import Grid from '@material-ui/core/Grid'
import auth from './../auth/auth-helper'
import FindPeople from './../user/FindPeople'
import Newsfeed from './../post/Newsfeed'
import Courses from './../course/Courses'
import Enrollments from '../enrollment/Enrollments'


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    width:'90%',
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(20),
    marginBottom: theme.spacing(2),
    padding: 20,
    backgroundColor: '#ffffff' 
  },
  extraTop: {
    marginTop: theme.spacing(12)
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  media: {
    minHeight: 400
  },
  credit: {
    padding: 10,
    textAlign: 'right',
    backgroundColor: '#ededed',
    borderBottom: '1px solid #d0d0d0',
    '& a':{
      color: '#3f4771'
    } 
  },
  gridList: {
    width: '100%',
    minHeight: 200,
    padding: '16px 0 10px'
  },
  tile: {
    textAlign: 'center'
  },
  image: {
    height: '100%'
  },
  tileBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    textAlign: 'left'
  },
  enrolledTitle: {
    color:'#efefef',
    marginBottom: 5
  },
  action:{
    margin: '0 10px'
  },
  enrolledCard: {
    backgroundColor: '#616161',
  },
  divider: {
    marginBottom: 16,
    backgroundColor: 'rgb(157, 157, 157)'
  },
  noTitle: {
    color: 'lightgrey',
    marginBottom: 12,
    marginLeft: 8
  }
}))

export default function Home({history}){
  const classes = useStyles()
  const jwt = auth.isAuthenticated()
  const [courses, setCourses] = useState([])
  const [enrolled, setEnrolled] = useState([])
  const [defaultPage, setDefaultPage] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listEnrolled({t: jwt.token}, signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setEnrolled(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listPublished(signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setCourses(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
  useEffect(() => {
    setDefaultPage(auth.isAuthenticated())
    const unlisten = history.listen (() => {
      setDefaultPage(auth.isAuthenticated())
    })
    return () => {
      unlisten()
    }
  }, [])

    return (<div className={classes.extraTop}>
      {auth.isAuthenticated().user && (
      <Card className={`${classes.card} ${classes.enrolledCard}`}>
        <Typography variant="h6" component="h2" className={classes.enrolledTitle}>
            Courses you are enrolled in
        </Typography>
        {enrolled.length != 0 ? (<Enrollments enrollments={enrolled}/>)
                             : (<Typography variant="body1" className={classes.noTitle}>No courses.</Typography>)
        }
      </Card>
      )}
      <Card className={classes.card}>
        <Typography variant="h5" component="h2">
            All Courses
        </Typography>
        {(courses.length != 0 && courses.length != enrolled.length) ? (<Courses courses={courses} common={enrolled}/>) 
                             : (<Typography variant="body1" className={classes.noTitle}>No new courses.</Typography>)
        }
      </Card>
        { !defaultPage &&
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Card className={classes.card}>
                <Typography variant="h6" className={classes.title}>
                  Home Page
                </Typography>
                <CardMedia className={classes.media} image={unicornbikeImg} title="Unicorn Bicycle"/>
                <Typography variant="body2" component="p" className={classes.credit} color="textSecondary">Photo by <a href="https://unsplash.com/@boudewijn_huysmans" target="_blank" rel="noopener noreferrer">Boudewijn Huysmans</a> on Unsplash</Typography>
                <CardContent>
                  <Typography type="body1" component="p">
                    Welcome to the MERN Social home page. 
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        }
        {defaultPage &&
          <Grid container spacing={8}>
            <Grid item xs={8} sm={7}>
              <Newsfeed/>
            </Grid>
            <Grid item xs={6} sm={5}>
              <FindPeople/>
            </Grid>
          </Grid>
        }
      </div>
    )
}
