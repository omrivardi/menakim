import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import styled from 'styled-components/macro';
import { useStore } from '../../stores';
import { updateProtest, deleteLocation } from '../../api';
import { analytics } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { dateToDayOfWeek, formatDate, getUpcomingDate } from '../../utils';
import SocialButton from '../elements/Button/SocialButton';
import { Form, Switch } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';

const actionTypes = {
  WHATSAPP_CLICK: 'WHATSAPP_CLICK',
  EDIT_LOCATION: 'EDIT_LOCATION',
  DELETE_LOCATION: 'DELETE_LOCATION',
};

const actionMap = {
  [actionTypes.WHATSAPP_CLICK]: {
    integtomatHook: 'leu403u1xmcwoamaojg69m6usbhcnm49',
    analyticsEvent: 'whatsapp_join',
  },
  [actionTypes.EDIT_LOCATION]: {
    integtomatHook: 'nq3eh09k9mkgd94aocclyaxb0y0r9bow',
    analyticsEvent: 'edit_location',
  },
  [actionTypes.DELETE_LOCATION]: {
    integtomatHook: 'jbsyt79m6iwpy339iwccmmelyl9tila2',
    analyticsEvent: 'delete_location',
  },
};
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
  async function handleCardAction(cardAction) {
    if (!actionMap[cardAction]) {
      console.error('unkown action in card', cardAction);
      return;
    }
    // call webhook with event details.
    await fetch(`https://hook.integromat.com/${actionMap[cardAction].integtomatHook}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ displayName, adminId, protestId: id, coordinates, origin: window.location.href }),
    });

    // log analytics event
    analytics.logEvent(actionMap[cardAction].whatsAppLink, { name: displayName });
  }
  const mailSubject = `${t('reportMail.subject')}${id}`;
  const mailBody = `${t('reportMail.body')}${id}`;
  const contactLink = isMobile
    ? `mailto:info@menakimethabait.com?subject=${mailSubject}&body=${mailBody}`
    : `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=info@menakimethabait.com&su=${mailSubject}&body=${mailBody}`;

  const { loading: isWhatsappToggleLoading, run } = useRequest(updateProtest, {
    manual: true,
    onSuccess: () => {
      setWhatsappToggleValue((prev) => !prev);
      fetch('https://hook.integromat.com/hljlb9rf0d7wknpgo82if97pqa2qoqj6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toggleStatus: whatsappToggleValue ? 'hidden' : 'visible',
          locationID: id,
          locationName: displayName,
        }),
      });
    },
  });

  const upcomingDate = getUpcomingDate(dateTimeList);

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
      data-testid="protestCard"
    >
      {store?.userStore?.user?.uid === adminId ? (
        <ButtonsWrapper>
          <DeleteButton
            onClick={async () => {
              await deleteLocation(id);
              await handleCardAction(actionTypes.DELETE_LOCATION);
              window.location.reload();
            }}
          />
          <EditButton onClick={() => history.push(`/protest/${id}/edit`)} />
        </ButtonsWrapper>
      ) : null}
      <ProtestCardTitle>{displayName}</ProtestCardTitle>
      <ProtestCardInfo>
        {adminName && (
          <ProtestCardDetail data-testid="protestCard__adminName">
            <span style={{ fontWeight: '700', marginLeft: '5px', fontSize: '16px' }}>{t('admin')}:</span> {adminName}
          </ProtestCardDetail>
        )}

        {store?.userStore?.user?.uid === adminId ? (
          <FormItem label={t('showWhatsappButton')}>
            <Switch loading={isWhatsappToggleLoading} checked={whatsappToggleValue} onChange={toggleWhatsappChange} />
          </FormItem>
        ) : null}

        <NotesWrapper>{notes}</NotesWrapper>

        {whatsappToggleValue ? (
          <>
            <div onClick={() => handleCardAction(actionTypes.WHATSAPP_CLICK)}>
              <SocialButton type="whatsapp" link={whatsAppLink}>
                <span>{t('whatsappLink')}</span>
              </SocialButton>
            </div>
            <TermsInfo>
              <p>{t('responsibility')}</p>
              <Link to="/terms-of-use" className="bm-item" style={{ textDecoration: 'underline' }}>
                {t('terms')}
              </Link>
            </TermsInfo>
          </>
        ) : (
          <ProtestCardDetail>{t('whatsappNotAvailable')}</ProtestCardDetail>
        )}

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
        {/*         <ProtestCardDetail>
          <ProtestCardIcon src="/icons/ruler.svg" alt="" aria-hidden="true" title={t('distance')} />
          {distance ? formatDistance(distance) : 0}
        </ProtestCardDetail> */}
        <ProtestCardDetail>
          <Link to="" className="bm-item" style={{ textDecoration: 'underline' }}>
            <ProtestReportWrapper onClick={() => window.open(contactLink)}>{t('report')}</ProtestReportWrapper>
          </Link>
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

const FormItem = styled(Form.Item)`
  margin-bottom: 10px;
`;

const TermsInfo = styled.div`
  text-align: center;
  line-height: 0;
  font-weight: 400;
  font-size: 14px;
  color: #8393a7;
  margin-bottom: 10px;
`;

const NotesWrapper = styled.span`
  font-weight: 400;
  font-size: 18px;
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
