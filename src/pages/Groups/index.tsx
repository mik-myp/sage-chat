import React from 'react';
import { useParams } from 'react-router-dom';

const Groups = () => {
  const { id } = useParams();
  return <div>Groups:{id}</div>;
};

export default Groups;
