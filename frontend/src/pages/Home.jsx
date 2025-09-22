import React from 'react';
import Header from '../components/Header';
import Post from '../components/Post';
import Feed from "../components/Feed";

const Home = () => {
  return (
    <div>
      <Header />  
      <Post />
      <Feed />
    </div>
  );
};

export default Home;
