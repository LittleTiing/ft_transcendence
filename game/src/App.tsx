import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Accueil from './components/Accueil';
import Chat from './components/Chat/Chat';
import Page404 from './components/Page404';
// import Canvas from './components/Canvas'

function App() {
  return (
	<div id="wholepage">
		<BrowserRouter>
			<span style={{ color: 'white' }}>This is single page application</span>
			<Routes>
				<Route path="/" element={<Accueil />} />
				<Route path="/chat" element={<Chat />} />
				{/* If no route match, then return 404 page */}
				<Route path="*" element={<Page404 />} />
			</Routes>
		</BrowserRouter>
		{/* <Canvas /> */}
	</div>
  );
}

export default App;
