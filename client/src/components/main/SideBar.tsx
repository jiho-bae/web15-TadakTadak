import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import LoginModal from '../LoginModal';
import { useUser, useUserFns } from '@contexts/userContext';
import { IoLogOutOutline } from 'react-icons/io5';
import Modal from '@components/common/Modal';
import CreateForm from './CreateForm';
import { getDevField, postLogout } from '@src/apis';
import { FieldName } from '@src/contexts/userContext';
import { useDevFieldFns } from '@src/contexts/devFieldContext';

const SIDEBAR_MIN_WIDTH = '29rem';

const CreateBtn = styled.button`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.borderGrey};
    padding: ${theme.paddings.sm};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.fontSizes.lg};
  `};
  width: 100%;
  text-align: center;
  &:hover {
    background-color: ${({ theme }) => theme.colors.bgGreen};
    color: ${({ theme }) => theme.colors.white};
  }
  ${({ theme }) => theme.active};
`;

const SideBarContainer = styled.div`
  padding: ${({ theme }) => theme.paddings.lg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${SIDEBAR_MIN_WIDTH};
  min-width: ${SIDEBAR_MIN_WIDTH};
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.borderGrey};
`;

const SideBarTopMenus = styled.div``;

const SideBarBottomMenus = styled.div``;

const LoginBtn = styled.button`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.borderGrey};
    padding: ${theme.paddings.sm};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.fontSizes.xl};
  `};
  width: 100%;
  text-align: center;
  :hover {
    background-color: ${({ theme }) => theme.colors.bgGreen};
    color: ${({ theme }) => theme.colors.white};
  }
  ${({ theme }) => theme.active};
  ${({ theme }) => theme.transition};
`;

const UserInfoDiv = styled.div`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.borderGrey};
    padding: ${theme.paddings.sm};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.fontSizes.lg};
    ${theme.flexCenter};
  `};
  width: 100%;
  text-align: center;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.colors.bgGreen};
    color: ${({ theme }) => theme.colors.white};
  }
  ${({ theme }) => theme.active};
  ${({ theme }) => theme.transition};
`;

const LogoutBtn = styled.button`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.borderGrey};
    margin-top: ${theme.margins.lg};
    padding: ${theme.paddings.sm};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.fontSizes.lg};
  `};
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  ${({ theme }) => theme.active};
  & span {
    margin-right: 20px;
  }
  ${({ theme }) => theme.transition};
`;

const UserAvatar = styled.img`
  margin-right: ${({ theme }) => theme.margins.base};
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
`;

const UserNickname = styled.span``;

const UserDevField = styled.div<{ bgColor: FieldName }>`
  ${({ theme, bgColor }) => css`
    margin-left: ${theme.margins.base};
    background-color: ${theme.tagColors[bgColor]};
    padding: ${theme.paddings.xs};
    border-radius: ${theme.borderRadius.sm};
  `}
`;

const SideBar = (): JSX.Element => {
  const [loginModal, setLoginModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const user = useUser();
  const { logUserOut } = useUserFns();
  const { registerDevField } = useDevFieldFns();

  const onClickLoginBtn = () => setLoginModal(!loginModal);
  const onClickCreateBtn = () => setCreateModal(true);
  const onClickUserInfoBtn = () => {};
  const onClickLogoutBtn = async () => {
    const { isOk } = await postLogout();
    if (isOk) {
      logUserOut();
    }
  };

  useEffect(() => {
    async function initDevField() {
      const { isOk, data } = await getDevField();
      if (isOk && data) {
        registerDevField(data);
      }
    }
    initDevField();
  }, [registerDevField]);

  return (
    <SideBarContainer>
      <SideBarTopMenus>
        {user.login ? (
          <>
            <UserInfoDiv onClick={onClickUserInfoBtn}>
              <UserAvatar src={user.imageUrl}></UserAvatar>
              <UserNickname>{user.nickname}</UserNickname>
              <UserDevField bgColor={user?.devField?.name ?? 'None'}>{user?.devField?.name}</UserDevField>
            </UserInfoDiv>
            <LogoutBtn onClick={onClickLogoutBtn}>
              <span>로그아웃</span>
              <IoLogOutOutline />
            </LogoutBtn>
          </>
        ) : (
          <LoginBtn onClick={onClickLoginBtn}>로그인</LoginBtn>
        )}
      </SideBarTopMenus>
      {loginModal && <LoginModal modal={loginModal} setModal={setLoginModal} />}
      <SideBarBottomMenus>
        {user.login && <CreateBtn onClick={onClickCreateBtn}>방 생성하기</CreateBtn>}
        {createModal && <Modal title="방 생성하기" children={<CreateForm />} setModal={setCreateModal} />}
      </SideBarBottomMenus>
    </SideBarContainer>
  );
};

export default SideBar;
