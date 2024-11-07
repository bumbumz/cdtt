import React, { useEffect, useState } from 'react';
import { PostHomeService } from '../Api';

function PostHome() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    PostHomeService.getList()
      .then(response => {
        setData(response.postshome);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-5 space-y-5">
      {data.map(post => (
        <div key={post.id} className="flex items-center justify-center bg-white  ">

          <div className=" m-5 w-1/2">

            <h2 className="text-5xl font-bold text-gray-800">{post.name}</h2>
            <p className="text-2xl text-gray-600 ">{post.conten}</p>
          </div>
          <img src={post.image} alt={post.name} className="w-80 h-80 object-cover rounded-lg mr-5" />
        </div>
      ))}
    </div>
  );
}

export default PostHome;
