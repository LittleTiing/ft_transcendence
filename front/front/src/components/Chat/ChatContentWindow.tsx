/* eslint-disable react-hooks/exhaustive-deps */
import './Chat.css';
import { Avatar, Button, Input, message as antdMessage } from 'antd';
import { SendOutlined, TeamOutlined } from '@ant-design/icons';
import { BACK_URL } from '../../global';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { ChannelType, MessageType, MuteOrBanUser } from './const';
import './ProfilPlayer.css';
import UserPopover from '../utils/UserPopover';
import ChannelListUserModal from './ChannelListUserModal';
import checkMuteOrBan from '../utils/checkMuteOrBan';

const MessageContent = ({
  item,
  users,
  currentUser,
}: {
  item: MessageType;
  users: any;
  currentUser: any;
}) => {
  const findUser = users.find((user: any) => user.id === item.senderId);
  if (!findUser || currentUser.blacklist.includes(findUser.id)) {
    return null;
  }
  if (findUser.id === currentUser.id) {
    return (
      <div className="chat-window-mymessage-wrapper">
        <div className="chat-window-mymessage-username">
          <Avatar src={BACK_URL + '/account/avatar/' + findUser.avatar} />
          <span className="chat-window-message-username">
            {findUser.accountUsername}:
          </span>
        </div>
        <div className="chat-window-mymessage-content">{item.message}</div>
      </div>
    );
  }

  return (
    <div className="chat-window-othermessage-wrapper">
      <div className="chat-window-othermessage-username">
        <UserPopover currentUser={currentUser} user={findUser} />
        <span className="chat-window-message-username">
          {findUser.accountUsername}:
        </span>
      </div>
      <div className="chat-window-othermessage-content">{item.message}</div>
    </div>
  );
};

const ChatContentWindow = ({
  currentUser,
  selectUser,
  users,
  socket,
  selectedChannel,
}: ChatContentWindowProps) => {
  const [message, setMessage] = useState<string>('');
  const [history, setHistory] = useState<any>([]);
  const [isListUserModalOpen, setIsListUserModalOpen] = useState(false);
  const [userMutedUntil, setUserMutedUntil] = useState('');
  const [userIsBanned, setUserIsBanned] = useState<boolean>(false);
  const historyEndRef: any = useRef(null);
  const isUser: boolean = !!selectUser;

  useEffect(() => {
    const getHistory = async () => {
      try {
        const getHistoryUrl = isUser
          ? `${BACK_URL}/chat/${selectUser?.id}`
          : `${BACK_URL}/chat/channel/${selectedChannel?.id}`;
        const res = await axios.get(getHistoryUrl, { withCredentials: true });
        if (res.data) {
          const history = res.data.filter(
            (obj: any) => !currentUser.blacklist.includes(obj.senderId)
          );
          setHistory(history);
          scrollToBottom();
        }
      } catch (e) {
        antdMessage.error(`Une erreur s'est pass?? ${e}`);
      }
    };

    if (selectUser || selectedChannel) {
      getHistory();
      setMessage('');
    } else {
      setHistory([]);
    }
  }, [currentUser, selectUser, selectedChannel]);

  useEffect(() => {
    if (!currentUser || (!selectUser && !selectedChannel)) {
      return;
    }

    const socketMessage = isUser
      ? `receiveMessage:${currentUser.id}:${selectUser.id}`
      : `receiveMessage:${selectedChannel?.id}`;

    socket.on(socketMessage, (message: any) => {
      if (currentUser.blacklist.includes(message.senderId)) {
        return;
      }
      setHistory((oldHistory: any) => [...oldHistory, message]);
      scrollToBottom();
    });

    return () => {
      socket.off(socketMessage);
    };
  }, [currentUser, selectUser, selectedChannel]);

  useEffect(() => {
    if (currentUser && selectedChannel) {
      const userMuted = selectedChannel.muteList.find(
        (muteUser: MuteOrBanUser) => muteUser.userId === currentUser.id
      );
      if (checkMuteOrBan(userMuted) && userMuted) {
        setUserMutedUntil(userMuted.until);
      } else {
        setUserMutedUntil('');
      }

      const userBanned = selectedChannel.banList.find(
        (banUser: MuteOrBanUser) => banUser.userId === currentUser.id
      );
      if (checkMuteOrBan(userBanned) && userBanned) {
        setUserIsBanned(true);
      } else {
        setUserIsBanned(false);
      }
    } else {
      setUserMutedUntil('');
      setUserIsBanned(false);
    }
  }, [currentUser, selectedChannel]);

  const sendMessage = async () => {
    if (message.trim() === '') {
      antdMessage.error("Can't send empty message!");
      return;
    }

    try {
      const receiveId = isUser ? selectUser.id : selectedChannel?.id;
      const res = await axios.post(
        `${BACK_URL}/chat/${receiveId}`,
        { message: message },
        { withCredentials: true }
      );
      if (res.data) {
        setHistory([...history, res.data]);
        scrollToBottom();
      }
      setMessage('');
    } catch (e) {
      antdMessage.error(`Une erreur s'est pass?? ${e}`);
    }
  };

  const scrollToBottom = () => {
    if (historyEndRef.current) {
      setTimeout(() => {
        historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const showListUserModal = () => {
    setIsListUserModalOpen(true);
  };

  const chatWindowName = () => {
    if (isUser) {
      return (
        <>
          <Avatar src={BACK_URL + '/account/avatar/' + selectUser.avatar} />
          <span className='chat-window-name'>
          {selectUser.accountUsername}
          </span>
        </>
      );
    } else {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>{selectedChannel?.channelName}</span>
          <Button
            icon={<TeamOutlined />}
            onClick={showListUserModal}
            className="chat-button-style"
          />
          <ChannelListUserModal
            isListUserModalOpen={isListUserModalOpen}
            setIsListUserModalOpen={setIsListUserModalOpen}
            users={users}
            currentUser={currentUser}
            selectedChannel={selectedChannel}
          />
        </div>
      );
    }
  };

  const chatWindowInput = () => {
    const isMuted = userMutedUntil !== '';

    return (
      <Input
        className="chat-window-input"
        onChange={(e) => setMessage(e.target.value)}
        value={isMuted ? `You are muted until ${userMutedUntil}` : message}
        disabled={isMuted}
        onPressEnter={sendMessage}
        suffix={
          <Button
            type="link"
            icon={<SendOutlined />}
            onClick={sendMessage}
            disabled={isMuted}
          />
        }
      />
    );
  };

  if (!selectUser && !selectedChannel) {
    return null;
  }

  if (selectedChannel && !selectedChannel.usersId.includes(currentUser.id)) {
    return null;
  }

  if (userIsBanned) return null;

  return (
    <div className="chat-window-wrapper">
      <div className="chat-window-header">
        {chatWindowName()}
        <hr
          style={{ height: 2, backgroundColor: 'var(--light)', border: 'none' }}
        />
      </div>
      <div className="chat-window-content">
        {history.map((item: MessageType, index: number) => (
          <MessageContent
            key={index}
            item={item}
            users={users}
            currentUser={currentUser}
          />
        ))}
        <div ref={historyEndRef} />
      </div>
      <div>{chatWindowInput()}</div>
    </div>
  );
};

type ChatContentWindowProps = {
  currentUser: any;
  selectUser: any | null;
  users: any;
  socket: any;
  selectedChannel: ChannelType | null;
};

export default ChatContentWindow;
