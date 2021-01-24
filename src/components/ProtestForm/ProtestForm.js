import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
// import PlacesAutocomplete from '../PlacesAutocomplete';
import { useForm } from 'react-hook-form';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import Button from '../elements/Button';
import { validateLatLng, isValidUrl } from '../../utils';
import { fetchNearbyProtests } from '../../api';
import L from 'leaflet';
// import DateTimeList from '../DateTimeList';

const protestMarker = new L.Icon({
  iconUrl: '/icons/marker-purple.svg',
  iconRetinaUrl: '/icons/marker-purple.svg',
  iconSize: [50, 48],
  iconAnchor: [25, 48],
});

const areas = ['north', 'south', 'center', 'golan', 'arava', 'yehuda', 'other'];
const placeTypes = ['river', 'viewpoint', 'parking', 'settlement', 'underwater', 'beach', 'other'];

const OpeningText = () => {
  const { t } = useTranslation('addCleanup');
  return (
    <div>
      <p>{t('opening.one')}</p>
      <p>{t('opening.two')}</p>
      <p>
        {t('opening.three')}{' '}
        <div role="button" tabindex="0">
          Some clickable text
        </div>
        <a
          href="#0"
          role="button"
          tabindex="0"
          onClick={() => window.open('https://drive.google.com/file/d/1b4pSIEgJ021VDZyuPZwa2ANZAv19KIJh/view?usp=sharing')}
        >
          {t('opening.link')}
        </a>
      </p>
      <p>{t('opening.four')}</p>
      <p>{t('opening.five')}</p>
      <ul>
        <li>{t('opening.bullets.one')}</li>
        <li>{t('opening.bullets.two')}</li>
        <li>{t('opening.bullets.three')}</li>
        <li>{t('opening.bullets.four')}</li>
      </ul>
      <p>{t('opening.six')}</p>
    </div>
  );
};

function ProtestForm({
  initialCoords,
  submitCallback,
  defaultValues = {},
  afterSubmitCallback = () => {},
  editMode = null,
  isAdmin,
}) {
  const { t } = useTranslation('addCleanup');

  const coordinatesUpdater = useCallback(() => {
    let initialState = [31.7749837, 35.219797];
    if (validateLatLng(initialCoords)) initialState = initialCoords;
    return initialState;
  }, [initialCoords]);

  // eslint-disable-next-line no-unused-vars
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues,
  });

  // const [streetAddressDefaultValue, setStreetAddressDefaultValue] = useState(defaultValues.streetAddress);

  // These two are separate so that onMoveEnd isn't called on every map move
  const [mapCenter, setMapCenter] = useState(coordinatesUpdater);
  // Marker position
  const [markerPostion, setMarkerPosition] = useState(coordinatesUpdater);

  const [dateTimeList, setDateTimeList] = useState(defaultValues.dateTimeList || [{ id: 0, date: '2020-10-24', time: '17:30' }]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [nearbyProtests, setNearbyProtests] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(14);
  // const { recaptcha } = useRef(null);

  // const setStreetAddress = React.useCallback((value) => setValue('streetAddress', value), [setValue]);

  // useEffect(() => {
  //   reset({});
  //   setStreetAddressDefaultValue('');
  //   setStreetAddress('');
  // }, [editMode, reset, setStreetAddress]);

  // The two useEffects below this are in order to deal with the defaultValues & Places Autocomplete
  useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      reset(defaultValues);
      setSubmitMessage('');
      setSubmitSuccess(false);
      // setStreetAddressDefaultValue(defaultValues.streetAddress);
      // setStreetAddress(defaultValues.streetAddress);
      // setStreetAddress(defaultValues.streetAddress);
      setDateTimeList(defaultValues.dateTimeList || [{ id: 0, date: '2020-10-24', time: '17:30' }]);

      if (validateLatLng(defaultValues.latlng)) {
        setMapCenter(defaultValues.latlng);
        setMarkerPosition(defaultValues.latlng);
      }
    }
  }, [defaultValues, reset, /* setStreetAddress,*/ setDateTimeList]);

  // Load nearby protests on mount
  useEffect(() => {
    const coords = coordinatesUpdater();
    async function nearbyProtests() {
      const protests = await fetchNearbyProtests(coords);
      setNearbyProtests(protests);
    }
    nearbyProtests();
  }, [coordinatesUpdater]);

  const onSubmit = async (params) => {
    // if (!editMode && !params.streetAddress) {
    //   alert('אנא הזינו את כתובת ההפגנה');
    //   return;
    // } else {
    if (!params.displayName) {
      alert(t('validations.name'));
      return;
    }
    if (!mapCenter) {
      alert(t('validations.map'));
      return;
    }

    // if (params.telegramLink && !isValidUrl(params.telegramLink)) {
    //   alert('לינק לקבוצת הטלגרם אינו תקין');
    //   return;
    // }

    if (!params.whatsAppLink || !isValidUrl(params.whatsAppLink)) {
      alert(t('validations.link'));
      return;
    }

    if (!params.userApproved) {
      alert(t('validations.approved'));
      return;
    }

    try {
      params.coords = mapCenter;
      params.dateTimeList = dateTimeList;
      if (defaultValues.protestRef) {
        params.protestRef = defaultValues.protestRef;
      }
      delete params.userApproved;

      let protest = await submitCallback(params);

      if (editMode) {
        setSubmitSuccess(true);
        setSubmitMessage(t('messages.ok'));
        afterSubmitCallback();
        return;
      }

      if (protest._document) {
        setSubmitSuccess(true);
        setSubmitMessage(t('messages.ok'));
        afterSubmitCallback();
      } else {
        throw new Error('protest._document was null.');
      }
    } catch (err) {
      console.error(err);
      setSubmitSuccess(true);
      setSubmitMessage(t('messages.error'));
    }
    // }
  };

  // useEffect(() => {
  //   loadReCaptcha(process.env.REACT_APP_RECAPTCHA_KEY);
  // }, []);

  // const verifyCallback = (recaptchaToken) => {
  //   setRecaptchaToken(recaptchaToken);
  // };

  return (
    <ProtestFormWrapper onSubmit={handleSubmit(onSubmit)}>
      {submitSuccess && !editMode ? (
        <>
          <SuccessMessage>{submitMessage}</SuccessMessage>
          <Link to="/">
            <Button>{t('mainPage')}</Button>
          </Link>
        </>
      ) : (
        <>
          {(!editMode || isAdmin) && (
            <>
              <OpeningText />
              <ProtestFormLabel>
                {t('place.title')}
                <ProtestFormInput
                  type="text"
                  name="displayName"
                  ref={register}
                  placeholder={t('place.placeholder')}
                ></ProtestFormInput>
                <ProtestFormInputDetails>{t('place.details')}</ProtestFormInputDetails>
              </ProtestFormLabel>
              <ProtestFormLabel>
                {t('area.title')}
                <ProtestFormSelect name="area" ref={register}>
                  {areas.map((area) => (
                    <option value={area} key={area}>
                      {t(`area.values.${area}`)}
                    </option>
                  ))}
                </ProtestFormSelect>
                <ProtestFormInputDetails>{t('area.details')}</ProtestFormInputDetails>
              </ProtestFormLabel>
              <ProtestFormLabel>
                {t('placeType.title')}
                <ProtestFormSelect name="placeType" ref={register}>
                  {placeTypes.map((placeType) => (
                    <option value={placeType} key={placeType}>
                      {t(`placeType.values.${placeType}`)}
                    </option>
                  ))}
                </ProtestFormSelect>
                <ProtestFormInputDetails>{t('placeType.details')}</ProtestFormInputDetails>
              </ProtestFormLabel>

              {/* <ProtestFormLabel>
                כתובת
                <PlacesAutocomplete
                  setManualAddress={setMapCenter}
                  setStreetAddress={setStreetAddress}
                  inputRef={register}
                  defaultValue={streetAddressDefaultValue}
                />
                <ProtestFormInputDetails>לאחר בחירת הכתובת, הזיזו את הסמן למיקום המדויק:</ProtestFormInputDetails>
              </ProtestFormLabel> */}
              <MapWrapper
                center={mapCenter}
                zoom={zoomLevel}
                scrollWheelZoom={'center'}
                onMove={(t) => {
                  setMarkerPosition([t.target.getCenter().lat, t.target.getCenter().lng]);
                  setZoomLevel(t.target._zoom);
                }}
                onMoveEnd={async (t) => {
                  const newPosition = [t.target.getCenter().lat, t.target.getCenter().lng];
                  setMapCenter(newPosition);
                  setMarkerPosition(newPosition);
                  setZoomLevel(t.target._zoom);

                  // Fetch protests on move end
                  if (mapCenter) {
                    const protests = await fetchNearbyProtests(mapCenter);
                    setNearbyProtests(protests);
                  }
                }}
                onZoom={(event) => {
                  setZoomLevel(event.target._zoom);
                }}
              >
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={markerPostion}></Marker>
                {nearbyProtests.map((protest) => (
                  <Marker
                    position={[protest.coordinates.latitude, protest.coordinates.longitude]}
                    icon={protestMarker}
                    key={protest.id}
                  ></Marker>
                ))}
              </MapWrapper>

              <hr />
            </>
          )}
          {/* <ProtestFormSectionTitle>תאריך ושעה</ProtestFormSectionTitle>
          <DateTimeList dateTimeList={dateTimeList} setDateTimeList={setDateTimeList} /> */}

          <hr />
          <ProtestFormSectionTitle>{t('contact')}</ProtestFormSectionTitle>
          <ProtestFormLabel>
            {t('whatsapp.title')}
            <ProtestFormInput placeholder={t('whatsapp.placeholder')} name="whatsAppLink" ref={register}></ProtestFormInput>
          </ProtestFormLabel>
          {/* <ProtestFormLabel>
            קבוצת טלגרם
            <ProtestFormInput placeholder="לינק לקבוצה" name="telegramLink" ref={register}></ProtestFormInput>
          </ProtestFormLabel> */}
          <ProtestFormLabel>
            {t('remarks.title')}
            <ProtestFormInput placeholder={t('remarks.title')} name="notes" ref={register}></ProtestFormInput>
            <ProtestFormInputDetails>{t('remarks.details')}</ProtestFormInputDetails>
          </ProtestFormLabel>
          {!editMode ? (
            <>
              <ProtestFormInputDetails margin="10px 0">
                {t('legal.one')}
                <br />
                {t('legal.two')}
                <br />
                {t('legal.three')}
                <br />
                {t('legal.four')}
                <br />
                {t('legal.five')}
              </ProtestFormInputDetails>
              <ProtestFormCheckboxWrapper>
                <ProtestFormCheckbox type="checkbox" id="contact-approve" name="userApproved" ref={register} />
                <label htmlFor="contact-approve">{t('legal.agree')}</label>
              </ProtestFormCheckboxWrapper>

              <Button type="submit" color="#1ED96E">
                {t('add')}
              </Button>
            </>
          ) : (
            <>
              {defaultValues.protestRef ? (
                <>
                  <p style={{ textAlign: 'center' }}>.ההפגנה כבר נוצרה, רק צריך לאשר שהיא תקינה</p>
                  <Button type="submit" color="#1ED96E">
                    אישור הפגנה
                  </Button>
                </>
              ) : (
                <Button type="submit" color="#1ED96E">
                  {editMode === 'pending' ? 'יצירת הפגנה' : 'עריכת הפגנה'}
                </Button>
              )}
            </>
          )}
        </>
      )}
    </ProtestFormWrapper>
  );
}

const ProtestFormWrapper = styled.form`
  width: 300px;
  margin: 25px auto;
  justify-items: center;

  @media (min-width: 768px) {
    grid-column: 1 / -1;
    width: 500px;
  }
`;

export const ProtestFormLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  font-weight: 600;
`;

export const ProtestFormInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 16px;
  border: 1px solid #d2d2d2;
  -webkit-appearance: none;
`;

const ProtestFormInputDetails = styled.span.attrs((props) => ({
  textAlign: props.textAlign || 'initial',
  margin: props.margin || '0',
}))`
  display: block;
  font-size: 14px;
  font-weight: 300;
  margin: ${(props) => props.margin};
  text-align: ${(props) => props.textAlign};
`;

const ProtestFormCheckbox = styled.input``;

const ProtestFormSelect = styled.select``;

const MapWrapper = styled(Map)`
  width: 100%;
  height: 250px;
  margin-bottom: 10px;
  z-index: 0;
`;

const ProtestFormSectionTitle = styled.h3`
  margin: 3px 0;
`;

const ProtestFormCheckboxWrapper = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: start;
  margin: 7.5px 0;
  font-size: 14px;
  font-weight: 100;
`;

const SuccessMessage = styled.h2`
  text-align: center;
`;

export default ProtestForm;
