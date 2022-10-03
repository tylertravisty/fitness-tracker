import React, {useState} from 'react';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import {Navigate} from 'react-router-dom';

import arrowleft from '../assets/icons/arrow-90deg-left.svg';
import grid from '../assets/icons/grid.svg';
import gridfill from '../assets/icons/grid-fill.svg';
import gear from '../assets/icons/gear.svg';
import gearfill from '../assets/icons/gear-fill.svg';
import housedoor from '../assets/icons/house-door.svg';
import housedoorfill from '../assets/icons/house-door-fill.svg';
import list from '../assets/icons/list.svg';
import listactive from '../assets/icons/list-active.svg';
import pluscircle from '../assets/icons/plus-circle.svg';
import "./Navigation.css";

export const NavHome = "/"
export const NavMainMenu = "/mainmenu"

function Navigation(props) {
	const [home, setHome] = useState(false);
	const [mainMenu, setMainMenu] = useState(false);

	const toHome = () => {
		setHome(true);
	}

	const toMainMenu = () => {
		setMainMenu(true);
	}

	if (home) {
		return (
			<Navigate to={NavHome} />
		);
	}

	if (mainMenu) {
		return (
			<Navigate to={NavMainMenu} />
		);
	}

	return(
		<>
			<Nav fill className="NavigationBar fixed-bottom justify-content-center">
				<Nav.Item className={props.parent === NavHome ? "NavigationButtonActive" : "NavigationButton"}>
					<img className={props.parent === NavHome ? "NavigationIconActive" : "NavigationIcon"} src={props.parent === NavHome ? housedoorfill : housedoor} onClick={props.parent === NavHome ? props.reset : toHome}/>
				</Nav.Item>
				<Nav.Item className={props.parent === NavMainMenu ? "NavigationButtonActive" : "NavigationButton"}>
					<img className={props.parent === NavMainMenu ? "NavigationIconActive" : "NavigationIcon"} src={props.parent === NavMainMenu ? gridfill : grid} onClick={props.parent === NavMainMenu ? props.reset : toMainMenu}/>
				</Nav.Item>
			</Nav>
			<div className="NavigationBuffer"></div>
		</>
	);
}

export default Navigation;
