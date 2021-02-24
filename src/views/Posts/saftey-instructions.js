import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';

const Instructions = () => {
  const { t } = useTranslation('tutorialPopup');

  return (
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
    </TabWrapper>
  );
};

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 606px;
  margin-top: 20px;
`;

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

const Logo = styled.img`
  object-fit: none;
  align-self: center;
  margin-bottom: 20px;
`;

const Title = styled.p`
  color: #03a483;
  font-weight: bold;
  margin-bottom: 14px;
  line-height: 11px;
  font-size: ${({ size }) => (size === 'small' ? '23px' : '24px')};
  @media (max-width: 600px) {
    line-height: 24px;
  }
`;

const List = styled.ol`
  margin-top: 1em;
  & li {
    line-height: 21px;
    margin-bottom: 1em;
  }
`;

export default Instructions;
