import React from 'react';
import { Search } from './Search'
import UserHome from './UserHome'
import { useQuery, gql } from '@apollo/client';

const USER_INFO = gql`
  query Usercheck {
    user {
      name
      image
      lessons {
        title
        value
      }
    }
  }
`

const Pokemon = () => {
  const [login, setLogin] = React.useState({})
  const { loading, error, data } = useQuery(USER_INFO);

  React.useEffect(() => {
    if(data) {
      setLogin({...data.user})
    }
  }, [data]) 

  if (loading) return <p>Loading...</p>

  if(login.name) {
    return (
      <UserHome login={login}/> 
    )
  }

  return (
    <Search setLogin={setLogin}/>
  )
}

export default Pokemon