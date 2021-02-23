import React from 'react';
import { getLocalStorage, setLocalStorage } from '../../localStorage';
import styled from 'styled-components/macro';
import { Modal, Carousel } from 'antd';
import { useTranslation } from 'react-i18next';

export default function TutorialModal(params) {
  const { t } = useTranslation('tutorialPopup');
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
      <Carousel ref={carouselRef} dots={false}>
        <div>
          <TabWrapper>
            <Logo src={'/icons/globe_in_hand.svg'} alt="tut1" />
            <Title>{t('slide1.title')}</Title>
            <Paragraph size="large" bold>
              {t('slide1.paragraph1')}
            </Paragraph>
            <Paragraph size="large" bold>
              {t('slide1.paragraph2')}
            </Paragraph>
            <Paragraph size="medium" bold={true}>
              {t('slide1.paragraph3')}
            </Paragraph>
            <Paragraph size="medium" bold={true}>
              {t('slide1.paragraph4')}
            </Paragraph>
            <SecondaryTitle>{t('slide1.secondTitle')}</SecondaryTitle>
            <CardsWrapper>
              <ModalCard>
                <IconWrapper>
                  <img src={'/icons/safety_instructions.png'} alt="tut1" />
                </IconWrapper>
                {t('slide1.readSafety')}
              </ModalCard>
              <ModalCard>
                <IconWrapper>
                  <img src={'/icons/location_pin.png'} alt="tut1" />
                </IconWrapper>
                {t('slide1.findLocation')}
              </ModalCard>
              <ModalCard>
                <IconWrapper>
                  <img src={'/icons/join_location.png'} alt="tut1" />
                </IconWrapper>
                {t('slide1.joinLocation')}
              </ModalCard>
            </CardsWrapper>
            <ContinueButton onClick={() => carouselRef.current.prev()}>
              <span>{t('slide1.nextButton')}</span>
            </ContinueButton>
          </TabWrapper>
        </div>
        <div>
          <TabWrapper>
            <Logo src={'/icons/safety_instructions.svg'} alt="tut1" />
            <Title>{t('slide2.title')}</Title>
            <Title size="small">{t('slide2.subTitle')}</Title>
            <List style={{ textAlign: 'right' }}>
              <li>
                <Paragraph size="medium" bold={true}>
                  {t('slide2.li1Title')}
                </Paragraph>
                <Paragraph size="small">{t('slide2.li1Text')}</Paragraph>
              </li>
              <li>
                <Paragraph size="medium" bold={true}>
                  {t('slide2.li2Title')}
                </Paragraph>
                <Paragraph size="small">{t('slide2.li2Text')}</Paragraph>
              </li>
              <li>
                <Paragraph size="medium" bold={true}>
                  {t('slide2.li3Title')}
                </Paragraph>
                <Paragraph size="small">{t('slide2.li3Text')}</Paragraph>
              </li>
              <li>
                <Paragraph size="medium" bold={true}>
                  {t('slide2.li4Title')}
                </Paragraph>
                <Paragraph size="small">{t('slide2.li4Text')}</Paragraph>
              </li>
              <li>
                <Paragraph size="medium" bold={true}>
                  {t('slide2.li5Title')}
                </Paragraph>
                <Paragraph size="small">{t('slide2.li5Text')}</Paragraph>
              </li>
              <li>
                <Paragraph size="medium" bold={true}>
                  {t('slide2.li6Title')}
                </Paragraph>
                <Paragraph size="small">{t('slide2.li6Text')}</Paragraph>
              </li>
              <li>
                <Paragraph size="medium" bold={true}>
                  {t('slide2.li7Title')}
                </Paragraph>
              </li>
              <li>
                <Paragraph size="medium" bold={true}>
                  {t('slide2.li8Title')}
                </Paragraph>
              </li>
            </List>
            <ContinueButton onClick={handleCloseModal}>{t('slide2.finishButton')}</ContinueButton>
          </TabWrapper>
        </div>
      </Carousel>
    </StyledModal>
  );
}

const Paragraph = styled.p`
  /* font-size: 21px; */
  font-size: ${({ size }) => {
    switch (size) {
      case 'small':
        return '16px';
      case 'medium':
        return '18px';
      case 'large':
        return '22px';
      default:
        return '16px';
    }
  }};
  font-weight: ${({ bold }) => (bold ? 'bold' : 500)};
  color: #333333;
  margin: 0;
`;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    font-family: 'almoni';
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
    top: 10px;
    ${Paragraph} {
      font-size: 18px;
    }
  }
`;

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 606px;
`;

const ModalCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  width: 110px;
  font-size: 14px;
  font-weight: bold;
  color: #4f4f4f;
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

// const TutorialImages = styled.div`
//   display: flex;
//   overflow: hidden;
//   margin-top: 10px;
//   & img {
//     width: 50%;
//   }

//   @media (max-width: 375px) {
//     flex-direction: column;
//     align-items: center;
//     & img {
//       max-height: 350px;
//       width: 100%;
//     }
//   }
// `;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 90px;
`;

const SecondaryTitle = styled.p`
  color: #35a6bf;
  font-size: 28px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const Logo = styled.img`
  object-fit: none;
  align-self: center;
  margin-bottom: 20px;
`;

const Title = styled.p`
  color: #03a483;
  font-weight: bold;
  margin-bottom: 15px;
  line-height: 11px;
  font-size: ${({ size }) => (size === 'small' ? '23px' : '24px')};
  @media (max-width: 381px) {
    line-height: 24px;
  }
`;

const List = styled.ol`
  & li {
    line-height: 21px;
  }
`;
