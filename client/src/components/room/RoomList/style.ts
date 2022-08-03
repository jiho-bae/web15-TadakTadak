import styled from 'styled-components';

export const RoomWrapper = styled.div``;

export const TabWrapper = styled.div`
  ${({ theme }) => theme.flexCenter}
  margin-top: ${({ theme }) => theme.margins.xl};
  width: 100%;
  position: relative;

  & div {
    transition: background-color 0.4s ease-in-out, border-color 0.3s ease-in-out;
  }

  & div:hover {
    background-color: ${({ theme }) => theme.colors.borderGrey};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;
