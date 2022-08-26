import Nav from 'react-bootstrap/Nav';

import './MenuBar.css';

function MenuBar(props) {
	const menubarClass = "MenuBar fixed-top justify-content-center"
	return(
		<>
			<Nav fill className={props.bottom ? menubarClass : menubarClass + " MenuBarBottom"}>
				<Nav.Item>
					{props.leftIcon &&
					<img className="MenuBarLeftIcon" src={props.leftIcon} onClick={props.leftClick} />
					}
					{props.leftTitle &&
					<div className="MenuBarTitle">
						{props.leftTitle}
					</div>
					}
				</Nav.Item>
				<Nav.Item>
					{props.title &&
					<div className="MenuBarTitle">
						{props.title}
					</div>
					}
				</Nav.Item>
				<Nav.Item>
					{props.rightIcon &&
					<img className="MenuBarRightIcon" src={props.rightIcon} onClick={props.rightClick} />
					}
				</Nav.Item>
			</Nav>
			<div className="MenuBarBuffer"></div>
		</>
	);
}

export default MenuBar;
