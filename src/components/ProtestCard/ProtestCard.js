import React from 'react';
import styled from 'styled-components/macro';
import { useStore } from '../../stores';
import { deleteLocation } from '../../api';
import { analytics } from '../../firebase';
// import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistance, dateToDayOfWeek, formatDate, getUpcomingDate } from '../../utils';
import { Link, useHistory } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';

function FormattedDate({ date }) {
  const { t } = useTranslation('card');
  if (!date) {
    return null;
  }

  return `${t('day')} ${dateToDayOfWeek(date.date)} ${formatDate(date.date)} ${t('atHour')} ${date.time}`;
}

function ProtestCard({ protestInfo, showAction = false, style }) {
  const {
    displayName,
    streetAddress,
    distance,
    meeting_time: meetingTime,
    dateTimeList,
    owner,
    whatsAppLink,
    notes,
    adminId,
    updatedAt,
    id,
  } = protestInfo;
  const history = useHistory();
  const store = useStore();

  // const history = useHistory();
  const { t } = useTranslation('card');
  const mailSubject = `${t('reportMail.subject')}${id}`;
  const mailBody = `${t('reportMail.body')}${id}`;
  const contactLink = isMobile
    ? `mailto:info@menakimethabait.com?subject=${mailSubject}&body=${mailBody}`
    : `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=info@menakimethabait.com&su=${mailSubject}&body=${mailBody}`;

  const upcomingDate = getUpcomingDate(dateTimeList);

  function handleWhatsappClick() {
    // log analytics event
    analytics.logEvent('whatsapp_join', { name: displayName });
  }

  return (
    <ProtestCardWrapper
      tabIndex="0"
      style={style}
      onMouseOver={() => store.mapStore.setHoveredProtestId(protestInfo.id)}
      onMouseOut={() => store.mapStore.setHoveredProtestId(null)}
      data-testid="protestCard"
    >
      {store?.userStore?.user?.uid === adminId ? (
        <ButtonsWrapper>
          <DeleteButton
            onClick={async () => {
              await deleteLocation(id);
              window.location.reload();
            }}
          />
          <EditButton onClick={() => history.push(`/protest/${id}/edit`)} />
        </ButtonsWrapper>
      ) : null}
      <ProtestCardTitle>{displayName}</ProtestCardTitle>
      <ProtestCardInfo>
        <ProtestCardDetail data-testid="protestCard__owner">
          {t('admin')}:<span style={{ fontWeight: '700', marginLeft: '5px', fontSize: '16px' }}>&nbsp;{owner}</span>
        </ProtestCardDetail>

        <NotesWrapper>{notes}</NotesWrapper>
        <DistanceWrapper>{distance ? formatDistance(distance) : formatDistance(0)}</DistanceWrapper>
        {whatsAppLink ? (
          <>
            <Button href={whatsAppLink} onClick={handleWhatsappClick} target="_blank" rel="noreferrer noopener">
              {t('whatsappLink')}
            </Button>
            <TermsInfo>
              <p>{t('responsibility')}</p>
              <Link to="/terms-of-use" className="bm-item" style={{ textDecoration: 'underline' }}>
                {t('terms')}
              </Link>
            </TermsInfo>
          </>
        ) : null}

        {streetAddress && (
          <ProtestCardDetail data-testid="protestCard__streetAddress">
            <ProtestCardIcon src="/icons/location.svg" alt="" aria-hidden="true" title={t('location')} />
            {streetAddress}
          </ProtestCardDetail>
        )}

        {upcomingDate && (
          <ProtestCardDetail key={upcomingDate.id}>
            <ProtestCardIcon src="/icons/time.svg" alt="meeting time" aria-hidden="true" title={t('time')} />
            <FormattedDate date={upcomingDate} />
          </ProtestCardDetail>
        )}
        {!upcomingDate && meetingTime && (
          <ProtestCardDetail>
            <ProtestCardIcon src="/icons/time.svg" alt="meeting time" aria-hidden="true" title={t('time')} />
            {meetingTime}
          </ProtestCardDetail>
        )}
        <ProtestCardDetail>
          <Link to="" className="bm-item" style={{ textDecoration: 'underline' }}>
            <ProtestReportWrapper onClick={() => window.open(contactLink)}>{t('report')}</ProtestReportWrapper>
          </Link>
        </ProtestCardDetail>
        {updatedAt ? (
          <LastUpdated>
            {t('lastUpdated')}:<span style={{ marginLeft: '5px' }}>&nbsp;{updatedAt.toDate().toLocaleString()}</span>
          </LastUpdated>
        ) : null}
      </ProtestCardInfo>
    </ProtestCardWrapper>
  );
}

const ProtestCardWrapper = styled.div`
  padding: 16px;
  margin: 0 10px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0px #00000026;
  // cursor: pointer;
  border-radius: 12px;
  transition: box-shadow 175ms ease-out;
  font-family: almoni;
  &:last-child {
    margin-bottom: 10px;
  }

  &:hover,
  &:focus,
  &:focus-within {
    outline: none;
    box-sizing: border-box;
    box-shadow: 0 0 0 1px #6e7dff, 0px 4px 6px -1px #00000026;
  }

  display: flex;
  flex-direction: column;
  justify-items: center;
`;

const ProtestCardTitle = styled.h2`
  margin: 0;
  color: #000;
  font-size: 22px;
  font-weight: 700;
`;

const ProtestCardInfo = styled.div`
  margin-bottom: 7.5px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

const ProtestCardDetail = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 100;
  margin-bottom: 5px;
`;

const ProtestCardIcon = styled.img`
  width: 17.5px;
  margin-inline-end: 5px;
  user-select: none;
`;

const ProtestReportWrapper = styled.div`
  font-size: 14px;
  transition: 0.3s;
  cursor: pointer;
`;

const TermsInfo = styled.div`
  text-align: center;
  line-height: 0;
  font-weight: 400;
  font-size: 14px;
  color: #8393a7;
  margin-bottom: 10px;
`;

const LastUpdated = styled.div`
  align-items: flex-end;
  line-height: 0;
  font-weight: 400;
  font-size: 14px;
  color: #8393a7;
`;

const DistanceWrapper = styled.span`
  color: #8393a7;
  font-weight: 400;
  font-size: 16px;
`;

const NotesWrapper = styled.span`
  font-weight: 400;
  font-size: 18px;
`;

const Button = styled.a`
  width: 100%;
  height: 32px;
  background: #26d367;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 18px;
  color: white !important; 
  font-size: 18px;
  text-align: center
  font-weight: 700;
`;

const DeleteButton = styled(DeleteOutlined)`
  align-self: flex-end;
  font-size: 18px;
  color: #b41f25;
`;

const EditButton = styled(EditOutlined)`
  align-self: flex-end;
  font-size: 18px;
  color: #b41f25;
  margin-right: 10px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
export default ProtestCard;
