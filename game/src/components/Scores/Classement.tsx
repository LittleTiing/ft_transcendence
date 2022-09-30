import axios from 'axios';
import { useEffect, useState } from 'react';
import handleErrors from '../RequestErrors/handleErrors';
import { Stats } from './Stats';
import './ScoresHistory.css';
import UserPopover from '../utils/UserPopover';

const BACK_URL = 'http://localhost:4000';

const UserDto = [
  {
    account_id: '',
    id: '',
    username: '',
    name: '',
    accountUsername: '',
    isTwoFactorAuthenticationEnabled: '',
    authConfirmToken: '',
    isVerified: '',
    twoFactorAuthenticationSecret: '',
    email: '',
    avatar: '',
    points: '',
	rank: undefined,
  },
];

export function ClassementTab(props: any) {
  const [Classement, getClassement] = useState(UserDto);
  const [classementLen, getClassementLen] = useState(0);
  const [ok, setOk] = useState(false);
  const [user, getUser] = useState({
    account_id: '',
    name: '',
    username: '',
    avatar: '',
    accountUsername: '',
    isTwoFactorAuthenticationEnabled: false,
    email: null,
  });

	useEffect(() => {
		axios.get(`${BACK_URL}/account`,  {withCredentials:true })
			.then((response) => {
				getUser(response.data);
				axios.get(`${BACK_URL}/scores/classement`,  {withCredentials:true })
					.then((response) => {
					getClassement(response.data);
					getClassementLen(response.data.length);
					setOk(true);
				})
			})
			.catch((error) => {
				handleErrors(error)
			})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return(
		ok && classementLen?
	<div className='tab'>
	<ul className="classement-tab">
		<li className='raw' > Username 
		{Classement.map((classement) => (
		<i key={classement.account_id} className="data">
		{classement.account_id !== user.account_id ?
		<UserPopover currentUser={user} user={classement} avatarOrUsername={'username'}/>
		:
		<i>{user.accountUsername}</i>
		}
		</i>
	  ))}
		</li>
		<li className='raw'> Points
		{Classement.map((classement) => (
		<i key={classement.account_id} className="data">
		{classement.points}
		</i>
	  ))}
	  	</li>
		<li className='raw'> Stats
	{Classement.map((classement) => (
		<i key={classement.account_id} className="data">
		<Stats id={classement.account_id} tabFormat={1}/>
		</i>
	  ))}
		</li>
	</ul>
	</div>
		: 
	<div>No score yet</div>
	)
}
