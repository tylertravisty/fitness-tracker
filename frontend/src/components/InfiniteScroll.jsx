import { useState, useEffect } from 'react';

const InfiniteScroll = (callback) => {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		window.addEventListener('resize', handleScroll);
		return () => window.removeEventListener('resize', handleScroll);
	}, []);

	useEffect(() => {
		if (!loading) return;
		callback(() => {
		});
	}, [loading]);

	const handleScroll = () => {
		if (window.innerHeight + document.scrollingElement.scrollTop !== document.documentElement.offsetHeight) return;
		setLoading(true);
	}

	return [loading, setLoading];
}

export default InfiniteScroll;
