import React from 'react'

export const Star = (props) => {
  const [value, setValue] = React.useState(props.presetValue || 0)
  const [isLocked, setIsLocked] = React.useState(false)

  const stars = [1,2,3,4,5].map(starValue => {
    const mouseMove = () => {
      if (isLocked) {
        return
      }
      setValue(starValue)
    }

    const onClick = () => {
      setIsLocked(true)
      setValue(starValue)
      props.onClick && props.onClick(starValue)
    }

    let iconVal = 'far'
    if (starValue <= value) {
      iconVal = 'fas'
    }

    return (
      <i 
        className={`${iconVal} fa-star`}
        key={starValue}
        onMouseMove={mouseMove}
        onClick={onClick}></i>
    )
  })
  
  const divMouseEnter = () => {
    setIsLocked(false)
  }

  let message = `You are giving ${value} stars!`

  if (isLocked) {
    message = `You have given ${value} stars!`
  }

  return (
    <div>
      <div onMouseEnter={divMouseEnter} style={{width: '95px'}}>
      {stars} 
      </div>
      <h1>{message}</h1>
    </div>
  )
}