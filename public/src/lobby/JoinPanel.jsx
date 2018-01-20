import React from "react"

export default function JoinPanel({roomInfo}) {
  return (
    <fieldset className='fieldset'>
      <legend className='legend'>Join a room</legend>
      {roomInfo.length
        ? <table className='join-room-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Format</th>
                <th>Players</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {roomInfo.map(room => <tr key={room}>
                <td>{room.title}</td>
                <td>{room.format}</td>
                <td>{room.usedSeats}/{room.totalSeats}</td>
                <td>
                  <a href={`#g/${room.id}`} className='join-room-link'>
                    Join room
                  </a>
                </td>
              </tr>)}
            </tbody>
          </table>
        : 'There are no rooms currently open.'}
    </fieldset>
  )
}
