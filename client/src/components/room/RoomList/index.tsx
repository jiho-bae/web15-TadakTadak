import { useState, useEffect, useCallback, useRef } from 'react';
import { RoomWrapper, TabWrapper } from './style';
import ListGenerator from '@src/components/room/ListGenerator';
import Loader from '@components/common/Loader';
import Tab from '@components/common/Tab';
import SearchBar from '@components/SearchBar';
import TabInfo from '@components/room/TabInfo';
import RefreshButton from '@components/room/RefreshButton';
import useDebounce from '@hooks/useDebounce';
import useInput from '@hooks/useInput';
import { getRoom } from '@src/apis';
import { getRoomQueryObj } from '@src/apis/apiUtils';
import { DEBOUNCE, INFINITE_SCROLL, ROOM_DESCRIPTION } from '@utils/constant';
import { RoomInfoType, TabStateType } from '@src/types';

function RoomList(): JSX.Element {
  const [tabState, setTabState] = useState<TabStateType>({ tadak: true, campfire: false });
  const [rooms, setRooms] = useState<RoomInfoType[]>([]);
  const [search, onChangeSearch, onResetSearch] = useInput('');
  const debounceSearch = useDebounce(search, DEBOUNCE.time);
  const [isLoading, setLoading] = useState(false);
  const target = useRef<HTMLDivElement>(null);
  const page = useRef(1);

  const onClickTadakTap = () => setTabState({ tadak: true, campfire: false });
  const onClickCampFireTap = () => setTabState({ tadak: false, campfire: true });

  const getRoomList = useCallback(
    async (searchStr: string) => {
      setLoading(true);
      const type = tabState.tadak ? '타닥타닥' : '캠프파이어';
      const queryObj = getRoomQueryObj({ type, search: searchStr, page: page.current });
      const { isOk, data } = await getRoom(queryObj);
      if (isOk && data) {
        if (page.current === 1) setRooms([...data.results]);
        else setRooms((preRooms) => [...preRooms, ...data.results]);
      }
      setLoading(false);
    },
    [tabState],
  );

  const addNewPage = useCallback(() => {
    page.current += 1;
    getRoomList(debounceSearch);
  }, [getRoomList, debounceSearch]);

  const onIntersect: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && rooms.length === page.current * INFINITE_SCROLL.unit) {
          observer.unobserve(entry.target);
          addNewPage();
        }
      });
    },
    [addNewPage, rooms],
  );

  useEffect(() => {
    page.current = 1;
    getRoomList(debounceSearch);
  }, [getRoomList, debounceSearch, tabState]);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (target.current?.lastElementChild) {
      observer = new IntersectionObserver(onIntersect, { threshold: INFINITE_SCROLL.threshold });
      observer.observe(target.current.lastElementChild);
    }
    return () => observer && observer.disconnect();
  }, [onIntersect, rooms]);

  return (
    <>
      <TabWrapper>
        <Tab text="타닥타닥" isActive={tabState.tadak} onClick={onClickTadakTap}>
          <TabInfo text={ROOM_DESCRIPTION.tadak} />
        </Tab>
        <Tab text="캠프파이어" isActive={tabState.campfire} onClick={onClickCampFireTap}>
          <TabInfo text={ROOM_DESCRIPTION.campfire} />
        </Tab>
        <SearchBar search={search} onChange={onChangeSearch} onReset={onResetSearch} />
      </TabWrapper>
      <RoomWrapper ref={target}>{rooms && <ListGenerator list={rooms} />}</RoomWrapper>
      {isLoading && <Loader />}
      <RefreshButton page={page} search={search} getRoomList={getRoomList} />
    </>
  );
}

export default RoomList;
