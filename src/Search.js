import React from 'react';
import { useLazyQuery, useMutation, gql, useQuery } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($pokemon: String!) {
    login(pokemon: $pokemon) {
      name
      image
      lessons {
        title
      }
    }
  } 
`

const GET_POKEMON = gql`
  query SelectPokemon($str: String!) {
    getPokemon(str: $str) {
      name
      image
    }
  }
`

const SEARCH_POKEMON = gql`
  query SearchPokemon($str: String!) {
    search(str: $str) {
      name
      image
    }
  }
`

const PokemonSelected = (props) => {
  const [login, {loading, error, data = {} }] = useMutation(LOGIN_MUTATION, {
    onCompleted(data){
      props.setLogin(data.login)
    }
  })

  const loginData = (pokemonName) => {
    login({variables: {pokemon: pokemonName}})
    // sendQuery(`mutation {login(pokemon: "${pokemonName}"){name, image, lessons{title}}}`).then(data => {
    //   props.setLogin(data.login)
    // })
  }

  return (
    <div className="pokeInfo">
      <h2>{props.pokeInfo.name}</h2>
      <img src={props.pokeInfo.image} alt=""/>
      <button className="loginBtn" onClick={()=>loginData(props.pokeInfo.name)}>Login</button>
    </div>
  )
}


export const Search = (props) => {
  const [pokemonList, setPokemonList] = React.useState([])
  const [selectedPokemon, setSelectedPokemon] = React.useState({})
  const [poke, {called, loading, error, data}] = useLazyQuery(GET_POKEMON)
  const [searchPoke, {loading: loadingTwo, error: errorTwo, data: searchData}] = useLazyQuery(SEARCH_POKEMON)

  React.useEffect(() => {
    if(called && !loading && !error) {
      setSelectedPokemon({
        name: data.getPokemon.name,
        image: data.getPokemon.image
      })
      setPokemonList([])
    }
  },[data])

  React.useEffect(()=> {
    if(searchData) {
      setPokemonList(searchData ? searchData.search : [])
      setSelectedPokemon({})
    }
  }, [searchData])

  const handleSearchTerm = (e) => {
    searchPoke({
      variables: {
        str: e.target.value
      }
    })
  }

  const loadSelection = (e) => {
    if(e.key === 'Enter') {
      poke({
        variables: {
          str: e.target.value
        }
      })
    }
   }

  const handleClickSelection = (e) => {
    poke({
      variables: {
        str: e.target.textContent
      }
    })
  }

  const pokemonFound = pokemonList.map((pokemon, i) => {
    return <h3 style={{cursor: "pointer"}} onClick={handleClickSelection} key={i}>{pokemon.name}</h3>
  })


  return (
    <div className="mainContainer">
      <div className="app">
        <h1 className="pokeMain">Pokemon Search</h1>
        <input className="pokeInput" type="text" onChange={handleSearchTerm} onKeyUp={loadSelection}/>
      </div>
      <div className="searchResults-container">
        {pokemonFound}
      </div>
      {selectedPokemon.name && <PokemonSelected setLogin={props.setLogin} pokeInfo={selectedPokemon}/>}
    </div>
  )
}
