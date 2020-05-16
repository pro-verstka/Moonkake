import React, { useState } from 'react'

const App = () => {
	const [name, setName] = useState('React')

	return <div>Hello from {name}!</div>
}

export default App
