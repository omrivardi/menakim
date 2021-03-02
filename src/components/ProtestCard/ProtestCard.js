import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import styled from 'styled-components/macro';
import { useStore } from '../../stores';
import { updateProtest } from '../../api';
import { analytics } from '../../firebase';
// import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistance, dateToDayOfWeek, formatDate, getUpcomingDate } from '../../utils';
import SocialButton from '../elements/Button/SocialButton';
import { Form, Switch } from 'antd';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import { useHistory } from 'react-router-dom';

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
    adminName,
    coordinates,
    whatsAppLink,
    whatsappVisible,
    adminId,
    notes,
    id,
  } = protestInfo;

  const store = useStore();
  const [whatsappToggleValue, setWhatsappToggleValue] = useState(whatsappVisible === undefined || whatsappVisible);

  const history = useHistory();

  const { t } = useTranslation('card');
  const mailSubject = `${t('reportMail.subject')}${id}`;
  const mailBody = `${t('reportMail.body')}${id}`;
  const contactLink = isMobile
    ? `mailto:info@menakimethabait.com?subject=${mailSubject}&body=${mailBody}`
    : `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=info@menakimethabait.com&su=${mailSubject}&body=${mailBody}`;

  const { loading: isWhatsappToggleLoading, run } = useRequest(updateProtest, {
    manual: true,
    onSuccess: () => {
      setWhatsappToggleValue((prev) => !prev);
    },
  });

  const upcomingDate = getUpcomingDate(dateTimeList);

  function handleWhatsappClick() {
    // call webhook with event details.
    fetch('https://hook.integromat.com/leu403u1xmcwoamaojg69m6usbhcnm49', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ displayName, adminId, protestId: id, coordinates, origin: window.location.href }),
    });

    // log analytics event
    analytics.logEvent('whatsapp_join', { name: displayName });
  }

  function toggleWhatsappChange() {
    run({
      protestId: id,
      params: { coords: protestInfo?.latlng, whatsappVisible: !whatsappToggleValue },
    });
  }

  return (
    <ProtestCardWrapper
      tabIndex="0"
      style={style}
      onMouseOver={() => store.mapStore.setHoveredProtestId(protestInfo.id)}
      onMouseOut={() => store.mapStore.setHoveredProtestId(null)}
      // onClick={() => {
      //   history.push(`/protest/${id}`);
      // }}
      data-testid="protestCard"
    >
      {store?.userStore?.user?.uid === adminId ? <EditButton onClick={() => history.push(`/protest/${id}/edit`)} /> : null}
      <ProtestCardTitle>{displayName}</ProtestCardTitle>
      <ProtestCardInfo>
        {adminName && (
          <ProtestCardDetail data-testid="protestCard__adminName">
            <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>{t('admin')}:</span> {adminName}
          </ProtestCardDetail>
        )}

        {store?.userStore?.user?.uid === adminId ? (
          <FormItem label={t('showWhatsappButton')}>
            <Switch loading={isWhatsappToggleLoading} checked={whatsappToggleValue} onChange={toggleWhatsappChange} />
          </FormItem>
        ) : null}

        {whatsappToggleValue ? (
          <div onClick={handleWhatsappClick}>
            <SocialButton type="whatsapp" link={whatsAppLink}>
              <span style={{ marginRight: window.screen.width > 1080 ? '1.2vw' : '5vw' }}>{t('whatsappLink')}</span>
            </SocialButton>
            <TermsInfo>
              <p>{t('responsibility')}</p>
              <Link to="/terms-of-use" className="bm-item" style={{ textDecoration: 'underline' }}>
                {t('terms')}
              </Link>
            </TermsInfo>
          </div>
        ) : (
          <ProtestCardDetail>{t('whatsappNotAvailable')}</ProtestCardDetail>
        )}

        <NotesWrapper>{notes}</NotesWrapper>
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
        {/* <WazeButton link={`https://www.waze.com/ul?ll=${coordinates?.latitude}%2C${coordinates?.longitude}&navigate=yes&zoom=17`}>
          {t('navigate')}
        </WazeButton> */}
        <ProtestCardDetail>
          <ProtestCardIcon src="/icons/ruler.svg" alt="" aria-hidden="true" title={t('distance')} />
          {distance ? formatDistance(distance) : 0}
        </ProtestCardDetail>
        <ProtestCardDetail>
          <ProtestReportWrapper onClick={() => window.open(contactLink)}>
            <ExclamationCircleOutlined style={{ marginLeft: '6px', fontSize: '13px' }} />
            {t('report')}
          </ProtestReportWrapper>
        </ProtestCardDetail>
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
  border-radius: 4px;
  transition: box-shadow 175ms ease-out;

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
`;

const ProtestCardTitle = styled.h2`
  margin: 0;
  margin-bottom: 7.5px;
  font-size: 22px;
  font-weight: 600;
`;

const ProtestCardInfo = styled.div`
  margin-bottom: 7.5px;
`;

const ProtestCardDetail = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 100;
  margin-bottom: 5px;
`;

const ProtestCardIcon = styled.img`
  width: 17.5px;
  margin-inline-end: 5px;
  user-select: none;
`;

const ProtestReportWrapper = styled.div`
  font-size: 15px;
  transition: 0.3s;
  cursor: pointer;
`;

const FormItem = styled(Form.Item)`
  margin-bottom: 10px;
`;

const TermsInfo = styled(Form.Item)`
  text-align: center;
  line-height: 0;
`;

const NotesWrapper = styled.span`
  font-weight: 400;
  font-size: 18px;
`;

const EditButton = styled(EditOutlined)`
  align-self: flex-end;
  font-size: 18px;
  color: #b41f25;
  margin-right: 10px;
`;

export default ProtestCard;
