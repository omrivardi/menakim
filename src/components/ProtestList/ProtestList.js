import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import ProtestCard from '../ProtestCard';
import { Button } from '../elements';
import { useHistory, matchPath } from 'react-router-dom';
import { getFullUserData } from '../../api';
import { useTranslation } from 'react-i18next';

function ProtestListItem({ protestInfo }) {
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    (async () => {
      const protestAdmin = await getFullUserData(protestInfo?.roles?.leader[0]);
      setAdminName(protestAdmin?.displayName);
    })();
  }, [protestInfo]);

  return <ProtestCard protestInfo={{ ...protestInfo, adminName }} />;
}

function ProtestListItems({ protests, listTitle }) {
  if (protests.length > 0) {
    return (
      <>
        <ProtestListHeader>{listTitle}</ProtestListHeader>
        {protests.slice(0, 10).map((protest) => (
          <ProtestListItem key={protest.id} protestInfo={protest} />
        ))}
      </>
    );
  }

  return null;
}

function ProtestList({ loading, closeProtests, farProtests }) {
  const wrapper = useRef(null);
  const history = useHistory();
  const { t, i18n } = useTranslation('translations');

  useEffect(() => {
    wrapper.current.scrollTop = 0;
  }, [closeProtests]);

  return (
    <ProtestListWrapper ref={wrapper}>
      {loading ? (
        <p>טוען...</p>
      ) : (
        <>
          {closeProtests.length === 0 ? (
            <ProtestListHeader style={{ marginTop: 15 }}>
              על מנת להציג את מוקדי הניקיון על המפה יש לאשר לדפדפן את הגישה למיקום או לחילופין להכניס את הכתובת שלכם
              <br />
              <Button
                style={{ marginTop: '1rem' }}
                onClick={async () => {
                  history.push('/add-protest/');
                }}
              >
                פתחו מוקד ניקיון חדש!
              </Button>
            </ProtestListHeader>
          ) : (
            <ProtestListItems protests={closeProtests} listTitle={'עד קילומטר אחד ממך'} />
          )}
          <ProtestListItems protests={farProtests} listTitle={'קצת יותר רחוק'} />
        </>
      )}
    </ProtestListWrapper>
  );
}

const ProtestListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  gap: 15px;
  padding: 0 0 15px;

  @media (min-width: 768px) {
    max-height: 100vh;
    overflow: auto;
  }

  @media (min-width: 1700px) {
    padding: 15px 5px;
  }
  scrollbar-color: #5f6ffa #dde0ff;
  scrollbar-width: thin;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #dde0ff;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #5f6ffa;
    border-radius: 10px;
  }
`;

const ProtestListHeader = styled.h2`
  margin: 5px 0;
  text-align: center;
  font-weight: 600;
`;

export default ProtestList;
