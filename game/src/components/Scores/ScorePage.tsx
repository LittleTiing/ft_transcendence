import { HomeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ClassementTab } from "./Classement";
import { ScoreTab } from "./ScoresHistory";
import { Stats } from "./Stats";
import { Tabs, Tab, Box } from '@mui/material';
import { useEffect, useState } from "react";
import React from 'react';
import '../Account/PublicAccount.css'
import axios from "axios";
import { BACK_URL } from "../../global";
import handleErrors from "../RequestErrors/handleErrors";

const UserDto = {
	account_id:"",
	id: "",
	username: "",
	name: "",
	accountUsername: "",
	isTwoFactorAuthenticationEnabled: "",
	authConfirmToken: "",
	isVerified: "",
	twoFactorAuthenticationSecret: "",
	email: "",
	avatar: "",
	points: "",
	rank: undefined,
	status: undefined,
  };

export function ScoresPage({currentUser}:{currentUser : typeof UserDto}){
	const params = useParams();
	const id= params.id;
	const nav = useNavigate();
	const [tabIndex, setTabIndex] = useState(0);
	const [ok, setOk] = useState(false);
	const handleTabChange = (event :any, newTabIndex: any) => {
	  setTabIndex(newTabIndex);
	};

	const [user, getUser] = useState({...UserDto});
	useEffect(() => {
		axios.get(`${BACK_URL}/account/id/${id}`,  {withCredentials:true })
			.then((response) => {
				console.log("aaazzzs", response.data);
				getUser(response.data);
			})
			.catch((error) => {
				handleErrors(error)
			})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return (
		ok?
		<div className='score-page'>
			<Button className='home-button' shape="circle" icon={<HomeOutlined />} onClick={() => nav('/')} />
			<div className='score-page' >
			<i className='title-scores'>Scores page of user {user.accountUsername} </i>
			<Tabs className="box-tab" value={tabIndex} onChange={handleTabChange} variant="fullWidth" centered 
					  sx={{
						'& .MuiTabs-indicator': { backgroundColor: '#536dfe' },
						'& .MuiTab-root': { color: '#7986cb', fontSize:' min(3vw, 15px)'},
					  }}>
				<Tab label="Historique" />
        	  	<Tab label="Leaderboard" />
			</Tabs>
			<Box sx={{ padding: 2 }}>
        	{tabIndex === 0 && (
        	  <Box >
        	    <ScoreTab user={user} id={id} currentUser={currentUser}/>
				<Stats id={id} tabFormat={1}/>
        	  </Box>
        	)}
        	{tabIndex === 1 && (
        	  <Box>
        	    <ClassementTab user={user} currentUser={currentUser}/>
        	  </Box>
        	)}
      		</Box>
			</div>
		</div>
		: 
		null
	  );

}