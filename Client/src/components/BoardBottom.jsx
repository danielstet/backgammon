import PropTypes from 'prop-types';
import Game from '../logic/models/game';
import Player from '../logic/models/player';
import ThisMove from '../logic/models/this-move';
import OutBar from './GameComponents/OutBar/OutBar';
import Piece from './GameComponents/Piece/Piece';
import './Board.css';

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function BoardBottom(props) {
	// Define PropTypes for the components
	// CreateOutBar.propTypes = {
	// 	player: PropTypes.instanceOf(Player),
	// 	isLeft: PropTypes.bool,
	// 	fill: PropTypes.string,
	// 	select: PropTypes.func,
	// 	game: PropTypes.instanceOf(Game),
	// 	thisMove: PropTypes.instanceOf(ThisMove),
	// };

	// CreatePiece.propTypes = {
	// 	player: PropTypes.instanceOf(Player),
	// 	piece: PropTypes.string,
	// 	pieceIdx: PropTypes.number,
	// 	selectedPiece: PropTypes.bool,
	// 	thisMove: PropTypes.instanceOf(ThisMove),
	// 	game: PropTypes.instanceOf(Game),
	// };

	const { user } = useContext(AuthContext);
	
	// if (socketGameData) {
	// 	console.log("socketGameData:" ,socketGameData);

	// 	props.game = socketGameData;
	// 	console.log('changed socket game data');
	// }
	// if (socketThisTurn) {
	// 	props.thisTurn = socketThisTurn;
	// 	console.log('changed socket game data');
	// }

	// console.log('DOM RENDER BoardBottom props:', props);

	return (
		<div className="board-bottom">
			<CreateOutBar
				player={props.game._whitePlayer}
				isLeft={true}
				fill={'#e0ded7'}
				{...props}
			/>

			<CreateButton
			// thisTurn={props._thisTurn}
			// game={props.game}
			// rollDice={props.rollDice}
			// startGame={props.startGame}
			/>

			<CreateOutBar
				player={props.game._blackPlayer}
				isLeft={false}
				fill={'#232937'}
				{...props}
			/>
		</div>
	);

	function CreateButton() {
		if (props.thisTurn._turnPlayer._playerId === undefined) {
			return <button onClick={props.startGame}>⚪ Begin Game ⚫</button>;
		} else {
			// console.log('This turn:', props.thisTurn._turnPlayer);
			if (props.thisTurn._turnPlayer._playerId === user?._id) {
				return (
					<button onClick={props.rollDice}>🎲 roll Dice 🎲</button>
				);
			} else {
				return (
					<button onClick={props.rollDice}>
						🎲 opponent Move 🎲
					</button>
				);
			}
		}
	}

	function CreateOutBar(props) {
		return (
			<OutBar
				isLeft={props.isLeft}
				onClick={() => props.select(props.player._outBarIdx)}
				key={props.player._outBarIdx}
				fill={props.fill}
			>
				{props.player._outBar.map(
					(piece, pieceIdx) =>
						pieceIdx < 6 && (
							<CreatePiece
								key={`${props.player._outBarIdx}-${pieceIdx}-temp`}
								piece={piece}
								pieceIdx={pieceIdx}
								selectedPiece={
									props.player._name === 'White'
										? pieceIdx ===
										  props.player.outBar.length - 1
										: pieceIdx === 0
								}
								{...props}
							/>
						)
				)}
			</OutBar>
		);
	}

	function CreatePiece(props) {
		return (
			<Piece
				key={`${props.player._outBarIdx}-${props._pieceIdx}`}
				border={
					(props.thisMove._fromBarIdx === props.player._outBarIdx &&
						props.selectedPiece &&
						'3px solid #671010') ||
					props.player.pieceBorderColor
				}
				color={props.piece}
			>
				{props.player._outBar.length > 6 &&
					((props.pieceIdx === 5 && props.player._name === 'White') ||
						(props.pieceIdx === 0 &&
							props.player._name === 'Black')) && (
						<>{props.player._outBar.length - 6}</>
					)}
			</Piece>
		);
	}
}
// BoardBottom.propTypes = {
// 	game: PropTypes.instanceOf(Game),
// 	thisMove: PropTypes.instanceOf(ThisMove),
// 	rollDice: PropTypes.func,
// 	startGame: PropTypes.func,
// 	select: PropTypes.func,
// 	thisTurn: PropTypes.any,
// };
export default BoardBottom;
