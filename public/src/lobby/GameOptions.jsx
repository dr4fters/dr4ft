import React from "react"

import App from "../app"
import Set from "./Set"
import _ from "Lib/utils"
import {Checkbox, Select, Textarea} from "../utils"

const GameOptions = () => {
  const {sets, fourPack} = App.state

  switch (App.state.type) {
    case 'draft':
      return <DraftOptions sets={sets}/>
    case 'sealed':
      return <SealedOptions sets={sets} fourPack={fourPack}/>
    case 'cube draft':
      return <CubeDraft/>
    case 'cube sealed':
      return <CubeList/>
    case 'chaos':
      return <Chaos />
  }

}

const DraftOptions = ({sets}) => (<Sets sets={sets} from={0} to={3}/>)

const SealedOptions = ({sets, fourPack}) => {
  const pivot = fourPack
    ? 2
    : 3
  return (
    <div>
      <div>
        <Sets sets={sets} from={0} to={pivot}/>
      </div>
      <div>
        <Sets sets={sets} from={pivot}/>
      </div>
      <div>
        <Checkbox link='fourPack' side='right' text='4 Pack Sealed: '/>
      </div>
    </div>
  )
}

const Sets = ({ sets, from, to = sets.length }) => (
  sets
  .map((set, i) => <Set selectedSet={set} index={i} key={_.uid()}/>)
  .slice(from, to)
)

const CubeDraft = () => (
  <div>
    <CubeList />
    <CubeOptions/>
  </div>
)

const CubeList = () => (
  <div>
    <div>one card per line</div>
    <Textarea placeholder='cube list' link='list'/>
  </div>
)

const CubeOptions = () => (
  <div>
    <Select link="cards" opts={_.seq(15,8)} />
    {' '}cards
    <Select link="packs" opts={_.seq(12,3)} />
    {' '}packs
  </div>
)


const Chaos = () => (
  <div>
    <div>
      <Checkbox link='modernOnly' side='right' text='Only Modern Sets: '/>
    </div>
    <div>
      <Checkbox link='totalChaos' side='right' text='Total Chaos: '/>
    </div>
  </div>
)

export default GameOptions
