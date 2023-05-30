import { Container, Slogan, Title } from './styles';

import backgroundImg from '../../assets/background.png'

export function SignIn() {
  return (
    <Container source={backgroundImg}>
      <Title>Fast Fleet</Title>
      <Slogan>Vehicle use management</Slogan>
    </Container>
  );
}
