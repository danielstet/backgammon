import styles from './Piece.module.css'
import PropTypes from 'prop-types';

// type Props = {
// 	color: string,
// 	border: string,
// 	children: ReactNode,
// };

Piece.propTypes = {
    color: PropTypes.string,
    border: PropTypes.string,
    children: PropTypes.node
}

export default function Piece(props ) {
	return (
		<div
			className={styles.piece}
			style={{
				background: props.color !== 'White' ? 'black' : '#f8f7f3',
				border: props.border,
				color: props.color === 'White' ? 'black' : '#f8f7f3',
			}}
			{...props}
		/>
	);
}
