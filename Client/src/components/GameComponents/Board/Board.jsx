import styles from './Board.module.css';
import PropTypes from 'prop-types';

// type Props = {
// 	children: ReactNode,
// };


export default function Board(props) {
    return <div className={styles.board}>{props.children}</div>;
}

Board.propTypes = {
	children: PropTypes.node,
};
