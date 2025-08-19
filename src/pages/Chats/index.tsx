import { useParams } from 'react-router-dom';

const Chats = () => {
  const { id } = useParams();
  return <div>Chats:{id}</div>;
};

export default Chats;
