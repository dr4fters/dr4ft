import React from "react"

const NewsPanel = ({motd}) => (
  <fieldset className='fieldset'>
    <legend className='legend'>News</legend>
    {motd}
  </fieldset>
)

export default NewsPanel
