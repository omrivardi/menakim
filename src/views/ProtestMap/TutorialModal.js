import React from 'react';
import { getLocalStorage, setLocalStorage } from '../../localStorage';
import styled from 'styled-components/macro';
import { Modal, Carousel } from 'antd';
import { WhatsAppOutlined, EnvironmentOutlined, ScheduleOutlined } from '@ant-design/icons';

export default function TutorialModal(params) {
  const carouselRef = React.useRef();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  React.useEffect(() => {
    const hasSeenTutorial = getLocalStorage('seenTutorial');
    if (!hasSeenTutorial) {
      setIsModalVisible(true);
    }
  }, []);

  function handleCloseModal() {
    setIsModalVisible(false);
  }

  return (
    <StyledModal visible={isModalVisible} footer={null} closable={false} afterClose={() => setLocalStorage('seenTutorial', true)}>
      <Carousel ref={carouselRef}>
        <div>
          <p>ברוכים הבאים וברוכות הבאות</p>
          <p>למפת מוקדי הניקיון של "מנקים את הבית"</p>
          <p>---</p>
          <p>ב 19/3/2021 אלפי משתתפים ומשתתפות יצאו אל</p>
          <p>האתרים ומוקדי הטבע המסומנים במפה ויערכו בהם ניקיון יסודי לקראת האביב</p>
          <p>---</p>
          <p>איך מצטרפים?</p>
          <CardsWrapper>
            <ModalCard>
              <EnvironmentOutlined style={{ fontSize: '50px' }} />
              בוחרים מוקד להצטרף אליו
            </ModalCard>
            <ModalCard>
              <WhatsAppOutlined style={{ fontSize: '50px' }} />
              מצטרפים לקבוצה
            </ModalCard>
            <ModalCard>
              <ScheduleOutlined style={{ fontSize: '50px' }} />
              משריינים ומשתתפים
            </ModalCard>
          </CardsWrapper>
          <ContinueButton onClick={() => carouselRef.current.next()}>אני בפנים</ContinueButton>
        </div>
        <div>
          <p>רוצה לפתוח ולנהל מוקד חדש?</p>
          <p>ככה עושים את זה:</p>
          <TutorialImages>
            <img src={'/images/tut2.png'} alt="tut2" />
            <img src={'/images/tut1.png'} alt="tut1" />
          </TutorialImages>
          <ContinueButton onClick={handleCloseModal}>קחו אותי למפה !</ContinueButton>
        </div>
      </Carousel>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 100px;
    border: 3px solid;
  }

  .slick-slide {
    text-align: center;
    font-size: 20px;
    direction: rtl;
  }

  .slick-slide p {
    margin-bottom: 0;
  }

  .ant-carousel .slick-dots-bottom {
    bottom: -20px;
  }

  .ant-carousel .slick-dots li button {
    background-color: cadetblue;
  }
`;

const ModalCard = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  border: 3px solid;
  width: 100px;
  height: 110px;
  font-size: 15px;
  padding: 5px;
  margin-bottom: 15px;
`;

const CardsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  @media (max-width: 375px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ContinueButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 3px solid;
  width: 150px;
  height: 40px;
  margin: 20px auto;
  cursor: pointer;
`;

const TutorialImages = styled.div`
  display: flex;
  overflow: hidden;
  & img {
    width: 50%;
  }

  @media (max-width: 375px) {
    flex-direction: column;
    align-items: center;
    & img {
      max-height: 350px;
      width: 100%;
    }
  }
`;
