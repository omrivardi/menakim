import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStore } from '../stores';
import { Button, PageWrapper, PageContentWrapper, LoadingSpinner } from '../components';
import { Modal, Button as AntButton, Form, Input, Typography } from 'antd';
import { extractUserData, getUserFromRedirect, handleSignIn, saveUserInFirestore, updateUserData } from '../api';
import styled from 'styled-components/macro';
import queryString from 'query-string';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const reg = /^[0-9-]+$/;

// A basic validation for now, can extend later
const validateFields = (firstName, lastName, phone) =>
  firstName.length >= 2 &&
  firstName.length < 20 &&
  lastName.length >= 2 &&
  lastName.length < 20 &&
  phone.length >= 10 &&
  reg.test(phone);

function SignUpBeforeRedirect({ returnUrl }) {
  const { t } = useTranslation('signup');
  return (
    <PageContentWrapper>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <p>{t('content')} </p>

      <Button onClick={() => handleSignIn()} style={{ marginBottom: 10 }}>
        {t('signup')}
      </Button>
      {/* keeping it here in case we want to redirect in the furture */}
      {/* {returnUrl === '/add-protest' && (
        <Link to="/add-protest">
          <>
            <Button
              style={{
                background:
                  'radial-gradient(100.6% 793.82% at 9.54% -0.6%, rgb(166, 145, 145) 0%, rgb(119, 95, 95) 100%) repeat scroll 0% 0%',
              }}
            >
              יצירת הפגנה אנונימית
            </Button>
          </>
        </Link>
      )} */}
    </PageContentWrapper>
  );
}

function getReturnUrl(path) {
  return queryString.parse(path).returnUrl;
}

const stages = {
  UNKNOWN: 'unkonwn',
  BEFORE_FACEBOOK_AUTH: 'beforeFacebookAuth',
  AFTER_FACEBOOK_AUTH: 'afterFacebookAuth',
};

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
      history.push('/');
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

  useEffect(() => {
    getUserFromRedirect()
      .then((result) => {
        if (!result) {
          setStage(stages.BEFORE_FACEBOOK_AUTH);
          return;
        }

        if (!result.additionalUserInfo.isNewUser) {
          redirectToReturnURL();
          return;
        }

        const userData = extractUserData(result);

        saveUserInFirestore(userData).then((userDoc) => {
          setStage(stages.AFTER_FACEBOOK_AUTH);
          userId = userDoc.uid;
          pictureUrl = userDoc.pictureUrl;
        });
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
      <PageWrapper>
        <SignUpBeforeRedirect returnUrl={getReturnUrl(window.location.search)} />
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
