import LoginForm from '@components/form/Login';
import JoinForm from '@components/form/Join';
import Modal from '@components/modal/Modal';
import { MODAL_NAME } from '@utils/constant';
import useToggle from '@src/hooks/useToggle';

interface LoginProps {
  modal: boolean;
  toggleModal: () => void;
}

const Login = ({ modal, toggleModal }: LoginProps): JSX.Element => {
  const [isLogin, toggleIsLogin] = useToggle(true);

  return (
    <>
      {modal && (
        <Modal title={isLogin ? MODAL_NAME.login : MODAL_NAME.join} onClickBlackBackground={toggleModal}>
          {isLogin ? (
            <LoginForm toggleModal={toggleModal} toggleIsLogin={toggleIsLogin} />
          ) : (
            <JoinForm toggleModal={toggleModal} toggleIsLogin={toggleIsLogin} />
          )}
        </Modal>
      )}
    </>
  );
};

export default Login;
