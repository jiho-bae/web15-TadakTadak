import styled, { css } from 'styled-components';
import { PROFILE } from '@utils/styleConstant';

export const Wrapper = styled.div`
  width: 100%;
  min-width: ${PROFILE.infoCardMinWidth};
  ${({ theme }) => theme.flexColumn};
`;

export const InfoWrapper = styled.div`
  ${({ theme }) => theme.flexColumn};
`;

export const Legend = styled.legend`
  font-size: ${PROFILE.legendFontSize};
  color: ${({ theme }) => theme.colors.bgGreen};
`;

export const Info = styled.div`
  font-size: ${PROFILE.infoFontSize};
  color: ${({ theme }) => theme.colors.bgGreen};
  word-break: break-all;
`;

export const InfoSet = styled.fieldset`
  ${({ theme }) => css`
    background-color: ${theme.colors.grey};
    padding: ${theme.paddings.sm};
    border: 1px solid ${theme.colors.borderGrey};
    border-radius: ${theme.borderRadius.base};
  `};
`;

export const ModalToggleBtn = styled.span`
  display: block;
  font-size: ${PROFILE.legendFontSize};
  ${({ theme }) => theme.flexCenter}
  margin-top:${({ theme }) => theme.margins.sm};
  background-color: ${({ theme }) => theme.colors.green};
  padding: ${({ theme }) => theme.paddings.sm};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 1rem;

  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
`;
