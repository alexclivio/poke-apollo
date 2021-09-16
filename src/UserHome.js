import React from 'react'
import {Star} from './Star'
import { useQuery, useMutation, gql } from '@apollo/client';

const STAR_RATING = gql`
  mutation setStar($titleName: String!, $starValue: Int!) {
    setStar(title: $titleName, value: $starValue) {
      title
      value
    }
  }
`

const ENROLLED_LESSON = gql`
  mutation enrolled($title: String!) {
    enrolled(title: $title) {
      title
      value
    }
  }
`

const UNENROLLED_LESSON = gql`
  mutation unenrolled($title: String!) {
    unenrolled(title: $title) {
      title
      value
    }
  }
`
const GET_LESSONS = gql`
  query Lessons {
    lessons {
      title
      value
    }
  }
`

const UserHome = (props) => {
  const { loading, error, data: { lessons } = {} } = useQuery(GET_LESSONS);
  const [enrolled, setEnrolled] = React.useState(props.login['lessons'] || [])
  const [mutateStarRating] = useMutation(STAR_RATING)
  const [enrolledMutation, {data: enrolledData}] = useMutation(ENROLLED_LESSON, {
    onCompleted(enrolledData) {
      setEnrolled(enrolledData.enrolled)
    }
  })
  const [unenrolledMutation, {data: unenrolledData}] = useMutation(UNENROLLED_LESSON, {
    onCompleted(unenrolledData) {
      setEnrolled(unenrolledData.unenrolled)
    }
  })

  const enrolledMap = enrolled.reduce((acc, lesson) => {
    acc[lesson.title] = true
    return acc
  }, {})

  if (loading) {
    return <h1>Loading...</h1>;
  }
  const unenrolled = lessons.filter((lesson) => {
    if(enrolledMap[lesson.title]) {
      return false
    }
    return true
  })

  const starRating = (starValue, titleName) => {
    mutateStarRating({
      variables: {
        titleName,
        starValue
      }
    })
  }

  const loadEnrolled = (e) => {
    enrolledMutation({
      variables: {
        title: e.target.textContent
      }
    })
  }

  const removeEnrolled = (e) => {
    unenrolledMutation({
      variables: {
        title: e.target.textContent
      }
    })
  }

  const lessonsList = unenrolled.map((lesson, i) => {
    return <h4 onClick={loadEnrolled} key={i}>{lesson.title}</h4>
  })

  const enrolledList = enrolled.map((enroll, i) => { 
    return (
      <div>
        <h4 onClick={removeEnrolled} key={i}>{enroll.title}</h4>
        <Star 
          onClick={(starValue)=>starRating(starValue, enroll.title)}
          presetValue={enroll.value}
        />
      </div>
    )
  })

  return (
    <div>
      <h1>{props.login.name}</h1>
      <img src={props.login.image} alt=""/>
      <hr/>
      {enrolled.length !== 0 && <h1>Enrolled</h1>}
      {enrolled.length !== 0 && <h2>Click to Unenroll</h2>}
      {enrolledList}
      <hr/>
      <h1>Not Enrolled</h1>
      <h2>Click to enroll</h2>
      {lessonsList}
    </div>
  ) 
}

export default UserHome