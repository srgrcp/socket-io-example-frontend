import React from 'react'

export type UsernameViewProps = {
  updateUsername: (username: string) => void
  join: () => void
}

export default function UsernameView({ updateUsername, join}: UsernameViewProps) {
  return (
    <div>
      <h4>Username</h4>
      <input type="text" onChange={e => updateUsername(e.target.value)} />
      <button onClick={join}>Siguiente</button>
    </div>
  )
}
