import { useRoute } from '@react-navigation/native';
import { X } from 'phosphor-react-native';

import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';

import { Container, Content, Description, Footer, Label, LicensePlate } from './styles';

type RouteParams = {
  id: string;
};

export const Arrival = () => {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  return (
    <Container>
      <Header title="Arrival" />

      <Content>
        <Label>
          License plate
        </Label>

        <LicensePlate>
          XXX-1234
        </LicensePlate>

        <Label>
          Purpose
        </Label>

        <Description>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, quod eaque eius minus distinctio quae, eum, tempore labore aliquam facere illum aperiam laudantium esse. Iure necessitatibus magnam corporis unde voluptas.
        </Description>

        <Footer>
          <ButtonIcon icon={X} />
          <Button title="Register Arrival" />
        </Footer>
      </Content>
    </Container>
  )
};
