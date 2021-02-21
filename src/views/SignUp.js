import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStore } from '../stores';
import { Button, PageWrapper, PageContentWrapper, LoadingSpinner } from '../components';
import { Modal, Button as AntButton, Form, Input, Typography } from 'antd';
import { extractUserData, getUserFromRedirect, handleSignIn, emailSignIn, saveUserInFirestore, updateUserData } from '../api';
import styled from 'styled-components/macro';
import queryString from 'query-string';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import GoogleButton from 'react-google-button';

const { Title } = Typography;

const reg = /^[0-9-]+$/;
const emailReg = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

// A basic validation for now, can extend later
const validateFields = (firstName, lastName, phone) =>
  firstName.length >= 2 &&
  firstName.length < 20 &&
  lastName.length >= 2 &&
  lastName.length < 20 &&
  phone.length >= 10 &&
  reg.test(phone);

const validateEmailLogin = (email, pass) => {
  return emailReg.test(email) && pass.length >= 6;
};

function EmailSignIn({ cancel, updateUserAndRedirect }) {
  const { t } = useTranslation('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validatePassword, setValidatePassword] = useState('');

  return (
    <>
      <SignUpFormItem label={t('form.email')} required style={{ flexDirection: 'column' }}>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </SignUpFormItem>
      <SignUpFormItem label={t('form.password')} extra={t('form.minimumCharacters')} required style={{ flexDirection: 'column' }}>
        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
      </SignUpFormItem>
      <SignUpFormItem label={t('form.validatePassword')} required style={{ flexDirection: 'column' }}>
        <Input.Password value={validatePassword} onChange={(e) => setValidatePassword(e.target.value)} />
      </SignUpFormItem>
      <Buttons>
        <AntButton
          disabled={!validateEmailLogin(email, password) || password !== validatePassword}
          className="bg-success"
          type="primary"
          size="large"
          style={{ width: 150, marginLeft: 10 }}
          onClick={() =>
            emailSignIn(email, password).then((userCredential) => {
              updateUserAndRedirect(userCredential);
            })
          }
        >
          {t('noUser.action')}
        </AntButton>
        <AntButton type="default" size="large" style={{ width: 150 }} onClick={cancel}>
          {t('form.cancel')}
        </AntButton>
      </Buttons>
    </>
  );
}

const stages = {
  UNKNOWN: 'unkonwn',
  BEFORE_FACEBOOK_AUTH: 'beforeFacebookAuth',
  AFTER_FACEBOOK_AUTH: 'afterFacebookAuth',
};

function SignUpBeforeRedirect({ updateUserAndRedirect }) {
  const { t } = useTranslation('signup');
  const [emailSignIn, setEmailSignIn] = useState(false);
  const openKit = () => window.open('https://drive.google.com/file/d/1arCs67WnAwWU02KvSrw0Mo7EV_IO9ofz/view?usp=drivesdk');

  return (
    <PageContentWrapper style={{ maxWidth: '100%' }}>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <Lines>{t('one')}</Lines>
      <Lines>{t('two')}</Lines>
      <MobLines>
        <Bold>{t('notice')}</Bold> {t('three_mob')}
      </MobLines>
      <DeskLines>
        <Bold>{t('notice')}</Bold> {t('three')}
      </DeskLines>
      <MobLines>
        <br />
        <a href="#0" onClick={() => openKit()}>
          {t('link')}
        </a>
      </MobLines>
      <DeskLines>
        {t('four')}
        <a href="#0" onClick={() => openKit()}>
          {t('link')}
        </a>
      </DeskLines>
      <br />
      <BoldLines>{t('five')}</BoldLines>
      <BoldLines>{t('six')}</BoldLines>
      <br />
      <div id="iconsWrapper">
        <img className="icons" src="/icons/create-group.png" alt="create-group" />
        <img className="icons" src="/icons/fill-in-form.png" alt="fill-in-form" />
        <img className="icons" src="/icons/share.png" alt="share" />
      </div>
      <br />
      <p style={{ width: '300px' }}>{t('content')} </p>

      <GoogleButton onClick={() => handleSignIn()} style={{ marginBottom: 10, width: 300 }} />
      {emailSignIn ? (
        <EmailSignIn cancel={() => setEmailSignIn(false)} updateUserAndRedirect={updateUserAndRedirect} />
      ) : (
        <Button onClick={() => setEmailSignIn(true)} style={{ marginBottom: 10, background: '#39B578' }}>
          {t('emailSignup')}
        </Button>
      )}
    </PageContentWrapper>
  );
}

let userId = '';
let pictureUrl = '';

export default function SignUp(props) {
  const { t } = useTranslation('signup');
  const [stage, setStage] = useState(stages.UNKNOWN);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const history = useHistory();
  const store = useStore();

  const redirectToReturnURL = () => {
    const { returnUrl } = queryString.parse(window.location.search);
    if (returnUrl) {
      history.push(returnUrl);
    } else {
      history.push('/add-position');
    }
  };

  const onSignUpSubmit = async () => {
    store.userStore.setUserName(firstName, lastName);
    store.userStore.setUserPicture(pictureUrl);
    store.userStore.setUserPhone(phone);
    await updateUserData({ userId, firstName, lastName, phone });

    Modal.success({
      title: t('success'),
      okText: t('next'),
      onOk: () => {
        redirectToReturnURL();
      },
    });
  };

  const updateUserAndRedirect = (userCredential) => {
    if (!userCredential) {
      setStage(stages.BEFORE_FACEBOOK_AUTH);
      return;
    }

    if (!userCredential.additionalUserInfo.isNewUser) {
      redirectToReturnURL();
      return;
    }

    const userData = extractUserData(userCredential);

    saveUserInFirestore(userData).then((userDoc) => {
      setStage(stages.AFTER_FACEBOOK_AUTH);
      userId = userDoc.uid;
      pictureUrl = userDoc.pictureUrl;
    });
  };

  useEffect(() => {
    getUserFromRedirect()
      .then((result) => {
        updateUserAndRedirect(result);
      })
      .catch((error) => {
        console.log(error);
      });

    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.pathname]);

  if (stage === stages.UNKNOWN) {
    return (
      <PageWrapper>
        <p style={{ marginTop: 25 }}>{t('waiting')}</p>
        <LoadingSpinner />
      </PageWrapper>
    );
  }

  if (stage === stages.BEFORE_FACEBOOK_AUTH) {
    return (
      <PageWrapper style={{ maxWidth: '80%' }}>
        <SignUpBeforeRedirect updateUserAndRedirect={updateUserAndRedirect} />
      </PageWrapper>
    );
  }

  if (stage === stages.AFTER_FACEBOOK_AUTH) {
    return (
      <PageWrapper>
        <Helmet>
          <title>{t('form.title')}</title>
        </Helmet>

        <PageContentWrapper>
          <Title level={3}>{t('form.subtitle')}</Title>
          <p style={{ fontSize: 16 }}>{t('form.content')}</p>
          <SignUpFormItem label={t('form.firstName')} required style={{ flexDirection: 'column', marginBottom: 10 }}>
            <Input autoFocus value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </SignUpFormItem>
          <SignUpFormItem label={t('form.lastName')} required style={{ flexDirection: 'column' }}>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </SignUpFormItem>
          <SignUpFormItem label={t('form.phone')} required style={{ flexDirection: 'column' }}>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </SignUpFormItem>
          <SignUpFormItem>
            <AntButton
              disabled={!validateFields(firstName, lastName, phone)}
              className="bg-success"
              type="primary"
              size="large"
              style={{ width: 300 }}
              onClick={() => onSignUpSubmit()}
            >
              {t('form.submit')}
            </AntButton>
          </SignUpFormItem>
        </PageContentWrapper>
      </PageWrapper>
    );
  }
}

const SignUpFormItem = styled(Form.Item)`
  min-width: 100%;
  max-width: 290px;
`;

const Buttons = styled.div`
  display: flex;
  align-content: space-between;
`;

const Lines = styled.p`
  margin: 0;
  width: 100vw;
`;

const BoldLines = styled.p`
  margin: 0;
  width: 100vw;
  font-weight: 900;
`;

const MobLines = styled.p`
  display: none;
  @media (max-width: 768px) {
    display: block;
    margin: 0;
  }
`;

const DeskLines = styled.p`
  display: block;
  margin: 0;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Bold = styled.span`
  font-weight: 900;
`;
