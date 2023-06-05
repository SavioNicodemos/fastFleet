import { Container, Content } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { useNavigation } from '@react-navigation/native';

export function Home() {
  const navigation = useNavigation();

  const handleRegisterMovement = () => {
    navigation.navigate('departure');
  };
  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus onPress={handleRegisterMovement} />
      </Content>
    </Container>
  )
};
