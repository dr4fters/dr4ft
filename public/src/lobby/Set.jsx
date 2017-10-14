import React from "react"

import App from "../app"
import _ from "../../lib/utils"
import sets from "../sets"

export default function Set({index, selectedSet}) {
    const onSetChange = (e) => {
        App.state.sets[index] = e.currentTarget.value
        App.save("sets", App.state.sets)
    }
    let groups = []
    for (let setType in sets) {
        const allSets = sets[setType]
        let options = []
        for (let name in allSets) {
            let code = allSets[name]
            options.push(
                <option value={code} key={_.uid()}>{name}</option>
            )
        }
        groups.push(
            <optgroup label={setType} key={_.uid()}>{options}</optgroup>
        )
    }
    return (
        <select value={selectedSet} onChange={onSetChange} key={_.uid()}>
            {groups}
        </select>
    )

}
