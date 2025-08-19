import { Button } from '@/components/ui/button';
import { Result } from '@/components/ui/result';
import { useNavigate } from 'react-router-dom';

const Page403 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <Result
      status={403}
      title='403'
      subTitle='抱歉，您无权访问此页面。'
      extra={<Button onClick={handleGoBack}>返回首页</Button>}
    />
  );
};

export default Page403;
