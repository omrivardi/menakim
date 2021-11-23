import React from 'react';
import { getLocalStorage, setLocalStorage } from '../../localStorage';
import styled from 'styled-components/macro';
import { Modal, Carousel } from 'antd';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../stores';

export default function TutorialModal(params) {
  const { t } = useTranslation('tutorialPopup');
  const store = useStore();
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
            <Logo src={t('logo')} alt="tut1" />
            <Paragraph>{t('slide1.paragraph1', { eventDate: store.eventDate })}</Paragraph>
            <Paragraph>{t('slide1.paragraph2')}</Paragraph>
            <Paragraph>{t('slide1.paragraph3')}</Paragraph>
            <SecondaryTitle>{t('slide1.secondTitle')}</SecondaryTitle>
            <CardsWrapper>
              <ModalCard>
                <IconWrapper>
                  <img src={'/icons/pin.png'} alt="tut1" />
                </IconWrapper>
                {t('slide1.findLocation')}
              </ModalCard>
              <ModalCard>
                <IconWrapper>
                  <img src={'/icons/whatsapp.png'} alt="tut1" />
                </IconWrapper>
                {t('slide1.joinGroup')}
              </ModalCard>
              <ModalCard>
                <IconWrapper>
                  <img src={'/icons/calendar.png'} alt="tut1" />
                </IconWrapper>
                {t('slide1.schedule')}
              </ModalCard>
            </CardsWrapper>
            <ContinueButton onClick={() => carouselRef.current.prev()}>
              <span>{t('slide1.nextButton')}</span>
            </ContinueButton>
          </TabWrapper>
        </div>
        <div>
          <TabWrapper>
            <Logo src={t('logo')} alt="tut2" />
            <Paragraph bold={true}>{t('slide2.paragraph1')}</Paragraph>
            <Paragraph bold={true}>{t('slide2.paragraph2')}</Paragraph>
            <TutorialImages>
              <img src={'/images/tut2.png'} alt="tut2" />
              <img src={'/images/tut1.png'} alt="tut1" />
            </TutorialImages>
            <ContinueButton onClick={handleCloseModal}>{t('slide2.finishButton')}</ContinueButton>
          </TabWrapper>
        </div>
      </Carousel>
    </StyledModal>
  );
}

const Paragraph = styled.p`
  font-size: 21px;
  font-weight: ${({ bold }) => (bold ? 'bold' : 500)};
  color: #333333;
  margin: 0;
`;

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

  @media (max-width: 767px) {
    top: 20px;
    ${Paragraph} {
      font-size: 18px;
    }
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
    align-items: center;
    & img {
      max-height: 350px;
      width: 50%;
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

const SecondaryTitle = styled.p`
  color: #03a483;
  font-size: 26.5px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const Logo = styled.img`
  object-fit: contain;
  align-self: center;
  margin-bottom: 28px;
  width: 20vw;
  @media (max-width: 767px) {
    width: 45vw;
  }
`;
