import { useRoute } from '@react-navigation/native';
import { Container, Title } from './styles';

type RouteParams = {
  id: string;
};

export const Arrival = () => {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  return (
    <Container>
      <Title>
        id: {id}
      </Title>
    </Container>
  )
};
