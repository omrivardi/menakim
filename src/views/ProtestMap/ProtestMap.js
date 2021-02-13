import React, { useEffect, useMemo, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { getCurrentPosition } from '../../utils';
import { useStore } from '../../stores';
import { getLocalStorage, setLocalStorage } from '../../localStorage';
import {
  Map,
  // ProtestList
} from '../../components';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import { Modal, Carousel } from 'antd';
import { WhatsAppOutlined, EnvironmentOutlined, ScheduleOutlined } from '@ant-design/icons';

function ProtestMap() {
  const store = useStore();
  const { mapStore, protestStore, userCoordinates } = store;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const carouselRef = useRef();

  const hoveredProtest = useMemo(() => {
    if (!mapStore.hoveredProtestId) {
      return null;
    }

    return protestStore.nearbyProtests.find((protest) => protest.id === mapStore.hoveredProtestId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStore.hoveredProtestId]);

  // Ask for user location on map initial load
  useEffect(() => {
    const setCoordinates = async () => {
      try {
        if (userCoordinates.length === 0) {
          const coordinates = await getCurrentPosition();
          store.setCoordinates(coordinates);
        }
      } catch (err) {}
      protestStore.fetchProtests({ onlyMarkers: false });
    };

    setCoordinates();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const hasSeenTutorial = getLocalStorage('seenTutorial');
    if (!hasSeenTutorial) {
      setIsModalVisible(true);
    }
  }, []);

  function handleCloseModal() {
    setIsModalVisible(false);
  }

  return (
    <>
      <Helmet>
        <title>מנקים את הבית</title>
      </Helmet>
      <HomepageWrapper>
        {/* <ProtestListWrapper>
          <ProtestList
            closeProtests={protestStore.closeProtests}
            farProtests={protestStore.farProtests}
            loading={protestStore.protests?.length === 0 && protestStore.state === 'pending'}
          />
        </ProtestListWrapper> */}
        <StyledModal
          visible={isModalVisible}
          footer={null}
          closable={false}
          afterClose={() => setLocalStorage('seenTutorial', true)}
        >
          <Carousel ref={carouselRef}>
            <div>
              <p>ברוכים הבאים וברוכות הבאות</p>
              <p>למפת מוקדי הניקיון של "מנקים את הבית"</p>
              <p>---</p>
              <p>ב 19/3/2021 אלפי משתתפים ומשתתפות יצאו אל</p>
              <p>האתרים ומוקדי הטבע המסומנים במפה ויערכו בהם ניקיון יסודי לקראת האביב</p>
              <p>ברוכים הבאים וברוכות הבאות</p>
              <p>---</p>
              <p>איך מצטרפים?</p>
              <CardsWrapper>
                <ModalCard>
                  <EnvironmentOutlined style={{ fontSize: '50px' }} />
                  בוחרים מוקד להצטרף אליו
                </ModalCard>
                <ModalCard>
                  <WhatsAppOutlined style={{ fontSize: '50px' }} />
                  מצטרפים לקבוצה
                </ModalCard>
                <ModalCard>
                  <ScheduleOutlined style={{ fontSize: '50px' }} />
                  משריינים ומשתתפים
                </ModalCard>
              </CardsWrapper>
              <ContinueButton onClick={() => carouselRef.current.next()}>אני בפנים</ContinueButton>
            </div>
            <div>
              <p>רוצה לפתוח ולנהל מוקד חדש?</p>
              <p>ככה עושים את זה:</p>
              <ContinueButton onClick={handleCloseModal}>! קחו אותי למפה</ContinueButton>
            </div>
          </Carousel>
        </StyledModal>
        <Map hoveredProtest={hoveredProtest} />
      </HomepageWrapper>
    </>
  );
}

export default observer(ProtestMap);

const HomepageWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-row: 2;
  z-index: 0;

  // @media (min-width: 768px) {
  //   grid-template-columns: 280px 1fr;
  //   grid-template-rows: 1fr;
  // }

  // @media (min-width: 1024px) {
  //   grid-template-columns: 300px 1fr;
  // }

  // @media (min-width: 1280px) {
  //   grid-template-columns: 330px 1fr;
  // }

  // @media (min-width: 1700px) {
  //   grid-template-columns: 375px 1fr;
  // }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 100px;
    border: 3px solid;
  }

  .slick-slide {
    text-align: center;
    font-size: 20px;
  }

  .slick-slide p {
    margin-bottom: 0;
  }

  .ant-carousel .slick-dots-bottom {
    bottom: -20px;
  }

  .ant-carousel .slick-dots li button {
    background-color: cadetblue;
  }
`;

const ModalCard = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  border: 3px solid;
  width: 100px;
  height: 110px;
  font-size: 15px;
  padding: 5px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 3px solid;
  width: 150px;
  height: 40px;
  margin: 20px auto;
  cursor: pointer;
`;

// const ProtestListWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   grid-column: 1 / 2;
//   grid-row: 2;

//   @media (min-width: 768px) {
//     grid-row: 1;
//     padding: 10px 15px 0;
//     max-height: calc(100vh - 60px);
//   }
// `;
