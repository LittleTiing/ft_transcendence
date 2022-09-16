import BallCustom from "./BallCustom";
import PaddleCustom from "./PaddleCustom";
import './Customization.css'
import BackgroundCustom from "./BackgroundCustom";
import { useState } from "react";

const Customization = ({ownPaddleColor, setOwnPaddleColor, opponentPaddleColor, setOpponentPaddleColor,
ballColor, setBallColor, gameBackground, setGameBackground} : customProps) => {
	const [ownPicker, setOwnPicker] = useState(false);
	const [opponentPicker, setOpponentPicker] = useState(false);
	const [ballPicker, setBallPicker] = useState(false);
	const [backgroundPicker, setBackgroundPicker] = useState(false);
	console.log("own", ownPicker)
	console.log("opp", opponentPicker)
	return (
		<div className="customization-grid">
			<PaddleCustom others={!opponentPicker && !ballPicker && backgroundPicker} compPicker={ownPicker} setCompPicker={setOwnPicker} owner={'Your'} color={ownPaddleColor} setColor={setOwnPaddleColor}/>
			<PaddleCustom others={!ownPicker && !ballPicker && backgroundPicker} compPicker={opponentPicker} setCompPicker={setOpponentPicker} owner={'Enemy'} color={opponentPaddleColor} setColor={setOpponentPaddleColor}/>
			<BallCustom color={ballColor} setColor={setBallColor}/>
			<BackgroundCustom color={gameBackground} setColor={setGameBackground} />
		</div>
	)
}

type customProps = {
	ownPaddleColor: string,
	setOwnPaddleColor: any,
	opponentPaddleColor: string,
	setOpponentPaddleColor: any,
	ballColor: string,
	setBallColor: any,
	gameBackground: string,
	setGameBackground: any
}

export default Customization;