import PropTypes from 'prop-types';
import Game from '../logic/models/game';
import Player from '../logic/models/player';
import ThisMove from '../logic/models/this-move';
import Bar from './GameComponents/Bar/Bar';
import Board from './GameComponents/Board/Board';
import EndBar from './GameComponents/EndBar/EndBar';
import Piece from './GameComponents/Piece/Piece';
import './Board.css'

export default function BoardTop(props) {
	CreateBar.propTypes = {
		bar: PropTypes.arrayOf(PropTypes.string),
		barIdx: PropTypes.number,
		game: PropTypes.instanceOf(Game),
		thisMove: PropTypes.instanceOf(ThisMove),
		select: PropTypes.func,
	};

	CreateEndBar.propTypes = {
		player: PropTypes.instanceOf(Player),
		select: PropTypes.func,
	};

	CreatePiece.propTypes = {
		bar: PropTypes.arrayOf(PropTypes.string),
		barIdx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		piece: PropTypes.string,
		pieceIdx: PropTypes.number,
		border: PropTypes.string,
	};

	return (
		<div className="board-top">
			<CreateEndBar
				player={props.game.whitePlayer}
				key={'left-bar'}
				game={props.game}
				thisMove={props.thisMove}
				select={props.select}
			/>

			<CreateBoard />

			<CreateEndBar
				player={props.game.blackPlayer}
				key={'right-bar'}
				game={props.game}
				thisMove={props.thisMove}
				select={props.select}
			/>
		</div>
	);


	function CreateBoard() {
		return (
			<Board>
				{props.game.board.map((bar, barIdx) => (
					<CreateBar
						bar={bar}
						barIdx={barIdx}
						key={`${barIdx}-temp`}
						game={props.game}
						thisMove={props.thisMove}
						select={props.select}
					/>
				))}
			</Board>
		);
	}

	function CreateBar(props) {
		return (
			<Bar
				isTopRow={props.barIdx > 11}
				onClick={() => props.select(props.barIdx)}
				key={props.barIdx}
				fill={
					(props.thisMove.canGoTo.includes(props.barIdx) &&
						'#671010') ||
					(props.barIdx % 2 === 0 &&
						props.barIdx > 11 &&
						'#232937') ||
					(props.barIdx % 2 !== 0 &&
						props.barIdx <= 11 &&
						'#232937') ||
					(props.barIdx % 2 === 0 &&
						props.barIdx <= 11 &&
						'#e0ded7') ||
					(props.barIdx % 2 !== 0 &&
						props.barIdx > 11 &&
						'#e0ded7') ||
					'Red'
				}
			>
				{props.bar.map(
					(piece, pieceIdx) =>
						pieceIdx < 6 && (
							<CreatePiece
								piece={piece}
								pieceIdx={pieceIdx}
								key={`${props.barIdx}-${pieceIdx}-temp`}
								border={
									(props.thisMove.fromBarIdx ===
										props.barIdx &&
										((pieceIdx === 0 &&
											props.barIdx > 11) ||
											(pieceIdx ===
												props.bar.length - 1 &&
												props.barIdx <= 11)) &&
										'2px solid #671010') ||
									(piece === 'White'
										? props.game.whitePlayer
												.pieceBorderColor
										: props.game.blackPlayer
												.pieceBorderColor)
								}
								{...props}
							/>
						)
				)}
			</Bar>
		);
	}

	function CreateEndBar(props) {
		// console.log("Create end bar Props format:", props);
		
		// console.log(`player:`, props.player);
		// console.log('player endbar', props.player.endBar);

		// console.log('player.endBarIdx:', props.player.endBarIdx);

		return (
			<EndBar
				onClick={() => props.select(props.player._endBarIdx)}
				key={props.player._endBarIdx}
				fill={props.player._name === 'White' ? '#e0ded7' : '#232937'}
			>
				{Array.isArray(props.player.endBar) &&
				props.player.endBar.length > 0
					? props.player.endBar.map((piece, pieceIdx) => (
							// console.log("piece part of map: ",piece, "pieceId part of map:", pieceIdx),

							<CreatePiece
								key={`${props.player.endBarIdx}-${pieceIdx}-temp`}
								bar={props.player.endBar}
								barIdx={props.player.endBarIdx}
								piece={piece}
								pieceIdx={pieceIdx}
								border={props.player.pieceBorderColor}
							/>
					  ))
					: null}
			</EndBar>
		);
	}

	function CreatePiece(props) {
		// console.log(
		// 	// `bar: ${pieceProps.bar}, barIdx: ${pieceProps.barIdx}, piece: ${piece}, pieceIdx: ${pieceIdx}, border: ${border}`
		// 	'pieceProps:',
		// 	props
		// );

		return (
			<Piece
				key={`${props.barIdx}-${props.pieceIdx}`}
				border={props.border}
				color={props.piece}
			>
				{props.bar.length > 6 &&
					((props.pieceIdx === 0 && props.barIdx > 11) ||
						(props.pieceIdx === 5 && props.barIdx <= 11)) && (
						<>{props.bar.length - 6}</>
					)}
			</Piece>
		);
	}

}

BoardTop.propTypes = {
	game: PropTypes.instanceOf(Game),
	thisMove: PropTypes.instanceOf(ThisMove),
	select: PropTypes.func,
};
