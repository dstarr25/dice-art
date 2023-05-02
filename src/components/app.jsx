import React from 'react';
import {
    BrowserRouter, Routes, Route, NavLink, useParams,
} from 'react-router-dom';
import Counter from './counter';
import Controls from './controls';

const App = (props) => {
    return (
        <BrowserRouter>
            <div>
                <Nav />
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/test/:id" element={<Test />} />
                    <Route path="*" element={<FallBack />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

const Nav = (props) => {
    return (
        <nav>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/test/id1">test id1</NavLink></li>
                <li><NavLink to="/test/id2">test id2</NavLink></li>
            </ul>
        </nav>
    );
};

const FallBack = (props) => {
    return <div>URL Not Found</div>;
};

const About = (props) => {
    return <div> All there is to know about me </div>;
};
const Welcome = (props) => {
    return (
        <div>
            <div>Welcome</div>
            <Controls />
            <Counter />
        </div>
    );
};

const Test = (props) => {
    const { id } = useParams();
    return <div> ID: {id} </div>;
};

export default App;
