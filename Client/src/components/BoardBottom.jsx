import PropTypes from 'prop-types';
import Game from '../logic/models/game';
import Player from '../logic/models/player';
import ThisMove from '../logic/models/this-move';
import OutBar from './GameComponents/OutBar/OutBar';
import Piece from './GameComponents/Piece/Piece';
import './Board.css';

function BoardBottom(props) {
	// Define PropTypes for the components
	CreateOutBar.propTypes = {
		player: PropTypes.instanceOf(Player),
		isLeft: PropTypes.bool,
		fill: PropTypes.string,
		select: PropTypes.func,
		game: PropTypes.instanceOf(Game),
		thisMove: PropTypes.instanceOf(ThisMove),
	};

	CreatePiece.propTypes = {
		player: PropTypes.instanceOf(Player),
		piece: PropTypes.string,
		pieceIdx: PropTypes.number,
		selectedPiece: PropTypes.bool,
		thisMove: PropTypes.instanceOf(ThisMove),
		game: PropTypes.instanceOf(Game),
	};

	return (
		<div className="board-bottom">
			<CreateOutBar
				player={props.game.whitePlayer}
				isLeft={true}
				fill={'#e0ded7'}
				{...props}
			/>

			<CreateButton />

			<CreateOutBar
				player={props.game.blackPlayer}
				isLeft={false}
				fill={'#232937'}
				{...props}
			/>
		</div>
	);

	function CreateButton() {
		return props.game.gameOn ? (
			<button onClick={props.rollDice}>🎲 roll Dice 🎲</button>
		) : (
			<button onClick={props.startGame}>⚪ Begin Game ⚫</button>
		);
	}

	function CreateOutBar(props) {
		return (
			<OutBar
				isLeft={props.isLeft}
				onClick={() => props.select(props.player.outBarIdx)}
				key={props.player.outBarIdx}
				fill={props.fill}
			>
				{props.player.outBar.map(
					(piece, pieceIdx) =>
						pieceIdx < 6 && (
							<CreatePiece
								key={`${props.player.outBarIdx}-${pieceIdx}-temp`}
								piece={piece}
								pieceIdx={pieceIdx}
								selectedPiece={
									props.player.name === 'White'
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
				key={`${props.player.outBarIdx}-${props.pieceIdx}`}
				border={
					(props.thisMove.fromBarIdx === props.player.outBarIdx &&
						props.selectedPiece &&
						'3px solid #671010') ||
					props.player.pieceBorderColor
				}
				color={props.piece}
			>
				{props.player.outBar.length > 6 &&
					((props.pieceIdx === 5 && props.player.name === 'White') ||
						(props.pieceIdx === 0 &&
							props.player.name === 'Black')) && (
						<>{props.player.outBar.length - 6}</>
					)}
			</Piece>
		);
	}
}
BoardBottom.propTypes = {
	game: PropTypes.instanceOf(Game),
	thisMove: PropTypes.instanceOf(ThisMove),
	rollDice: PropTypes.func,
	startGame: PropTypes.func,
	select: PropTypes.func,
};
export default BoardBottom;
