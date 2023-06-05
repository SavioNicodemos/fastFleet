import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { Container, Content } from './styles';

export function Departure() {
  return (
    <Container>
      <Header title='Departure' />

      <Content>
        <LicensePlateInput
          label='License Plate'
          placeholder='ABC-1234'
        />
      </Content>
    </Container>
  )
};
