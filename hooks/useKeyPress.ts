import { useEffect } from 'react';

const useKeyPress = (key: string, correct: Function, incorrect: Function) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Backspace') {
				correct('Backspace');
			} else if (e.key === ' ') {
				correct(' ');
			} else {
				{
					if (e.key === key) {
						correct(key);
					} else {
						incorrect(key);
					}
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [key, correct, incorrect]);
};

export default useKeyPress;
