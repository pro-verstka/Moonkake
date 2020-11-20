import React, { useState } from 'react'

const App = () => {
	const [name] = useState('React')

	return <div>Hello from {name}!</div>
}

export default App
