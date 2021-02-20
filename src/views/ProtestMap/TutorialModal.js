import React from 'react';
import { getLocalStorage, setLocalStorage } from '../../localStorage';
import styled from 'styled-components/macro';
import { Modal, Carousel } from 'antd';

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
          <TabWrapper>
            <Logo src={'/images/logo.png'} alt="tut1" />
            <Title>ברוכים הבאים וברוכות הבאות</Title>
            <Paragraph>ב 19/3/2021 אלפי משתתפים ומשתתפות </Paragraph>
            <Paragraph>יצאו אל האתרים ומוקדי הטבע המסומנים</Paragraph>
            <Paragraph>במפה ויערכו בהם ניקיון יסודי</Paragraph>
            <SecondaryTitle>איך בוחרים ומצטרפים למוקד?</SecondaryTitle>
            <CardsWrapper>
              <ModalCard>
                <IconWrapper>
                  <img src={'/icons/pin.png'} alt="tut1" />
                </IconWrapper>
                מוצאים במפה מוקד קרוב/רצוי
              </ModalCard>
              <ModalCard>
                <IconWrapper>
                  <img src={'/icons/whatsapp.png'} alt="tut1" />
                </IconWrapper>
                מצטרפים לקבוצה
              </ModalCard>
              <ModalCard>
                <IconWrapper>
                  <img src={'/icons/calendar.png'} alt="tut1" />
                </IconWrapper>
                משריינים ומשתפים
              </ModalCard>
            </CardsWrapper>
            <ContinueButton onClick={() => carouselRef.current.next()}>
              <span>יאלה, מתחילים</span>
            </ContinueButton>
          </TabWrapper>
        </div>
        <div>
          <TabWrapper>
            <Logo src={'/images/logo.png'} alt="tut2" />
            <Paragraph bold={true}>רוצה לפתוח ולנהל מוקד חדש?</Paragraph>
            <Paragraph bold={true}>ככה עושים את זה:</Paragraph>
            <TutorialImages>
              <img src={'/images/tut2.png'} alt="tut2" />
              <img src={'/images/tut1.png'} alt="tut1" />
            </TutorialImages>
            <ContinueButton onClick={handleCloseModal}>קחו אותי למפה !</ContinueButton>
          </TabWrapper>
        </div>
      </Carousel>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-image: url('/images/menakim-popup-bg.jpg');
  }

  .slick-slide {
    text-align: center;
    font-size: 20px;
    direction: rtl;
  }

  .ant-carousel .slick-dots-bottom {
    bottom: -10px;
  }

  .ant-carousel .slick-dots li {
    width: 64px;
    margin: 0;
  }

  .ant-carousel .slick-dots li button {
    background-color: #3aafc9;
    height: 12px;
    border: solid 2px #333333;
  }
`;

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ModalCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  width: 110px;
  font-size: 16px;
  font-weight: bold;
  color: #333333;
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
  background-image: url('/icons/button.png');
  background-size: cover;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 45px;
  min-width: 200px;
  margin: 20px auto;
  padding-right: 60px;
  padding-left: 30px;
  cursor: pointer;
  font-size: 19.5px;
`;

const TutorialImages = styled.div`
  display: flex;
  overflow: hidden;
  margin-top: 10px;
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

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 90px;
`;

const Title = styled.p`
  color: #03a483;
  font-size: 27.5px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const SecondaryTitle = styled.p`
  color: #03a483;
  font-size: 26.5px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const Paragraph = styled.p`
  font-size: 21px;
  font-weight: ${({ bold }) => (bold ? 'bold' : 500)};
  color: #333333;
  margin: 0;
`;

const Logo = styled.img`
  object-fit: none;
  align-self: center;
`;
