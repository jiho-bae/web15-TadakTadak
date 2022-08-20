import React from 'react';
import { Container, BlackBackground, Content, Title } from './style';

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onClickBlackBackground: () => void;
}

const Modal = ({ onClickBlackBackground, children, title }: ModalProps): JSX.Element => {
  const onClickContent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation();

  return (
    <Container>
      <BlackBackground onClick={onClickBlackBackground}>
        <Content onClick={onClickContent}>
          {title && <Title>{title}</Title>}
          {children}
        </Content>
      </BlackBackground>
    </Container>
  );
};

export default Modal;
