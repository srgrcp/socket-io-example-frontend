import React, { useEffect, useState } from 'react'

export type DomainViewProps = {
  updateDomain: (domain: string | undefined) => void
  initSocket: () => void
}

export default function DomainView({ updateDomain, initSocket }: DomainViewProps) {
  const [domain, setDomain] = useState<string | undefined>('http://localhost:7070')

  useEffect(() => {
    updateDomain(domain)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <div>
      <h4>Dominio</h4>
      <input type="text" defaultValue={domain} onChange={e => updateDomain(e.target.value)} />
      <button onClick={initSocket}>Siguiente</button>
    </div>
  )
}
