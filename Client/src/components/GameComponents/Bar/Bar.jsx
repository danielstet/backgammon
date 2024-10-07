import styles from './Bar.module.css' 
import PropTypes from 'prop-types';
// type Props = {
// 	fill: string,
// 	isTopRow: boolean,
// 	children: ReactNode,
// 	onClick: any,
// };

export default function Bar(props) {
	return (
		<div
			className={styles.barWrapper}
			style={{ fill: props.fill }}
			{...props}
		>
			<div
				className={styles.bar}
				style={{
					justifyContent: props.isTopRow ? 'flex-end' : 'initial',
				}}
			>
				{props.children}
			</div>
			<svg
				height="250"
				width="40"
			>
				<polygon
					points={
						props.isTopRow ? '20,0 0,250 40,250' : '0,0 20,250 40,0'
					}
					className={styles.polygon}
				/>
			</svg>
		</div>
	);
}

Bar.propTypes = {
	fill: PropTypes.string,
	isTopRow: PropTypes.bool, // Use 'bool' instead of 'boolean'
	children: PropTypes.node, // Use 'node' instead of 'ReactNode'
	onClick: PropTypes.func, // Specify a type for onClick
};