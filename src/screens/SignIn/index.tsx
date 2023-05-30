import { Container, Slogan, Title } from './styles';

import backgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button';

export function SignIn() {
  return (
    <Container source={backgroundImg}>
      <Title>Fast Fleet</Title>

      <Slogan>Vehicle use management</Slogan>

      <Button title='Login with Google' />

    </Container>
  );
}
