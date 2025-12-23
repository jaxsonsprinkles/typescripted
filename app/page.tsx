'use client';

import useKeyPress from '@/hooks/useKeyPress';
import { useState } from 'react';

export default function Home() {
	const words = ['hello', 'world', 'typescript', 'react', 'javascript'];
	// [word index, letter index]
	const [index, setIndex] = useState<Array<number>>([0, 0]);

	const onClick = (key: string) => {
		let [word, letter] = index;
		let nextLetter = letter + 1;
		let nextWord = word;
		console.log('key pressed:' + key);
		if (key === 'Backspace') {
			// if word is 0 and letter is 0
			if (word === 0 && letter === 0) {
				console.log('cant backspace');
				return;
			}
			// if letter is 0
			if (letter === 0) {
				nextWord -= 1;
				nextLetter = words[nextWord].length - 1;
				console.log(
					'returned to prev word. current key:' + words[nextWord][nextLetter]
				);
				// traditional backspace
			} else {
				console.log('backspaced');
				nextLetter -= 2;
			}
		} else {
			if (words[word] && words[word][letter + 1] === undefined) {
				nextWord += 1;
				nextLetter = 0;
				console.log('next word');
			}
		}
		console.log('next index: ' + nextWord + ' ' + nextLetter);
		setIndex([nextWord, nextLetter]);
	};

	const listener = useKeyPress(words[index[0]][index[1]], onClick);

	return (
		<div className='flex flex-col space-y-3 items-center justify-center h-screen'>
			<div className='flex flex-row gap-4'>
				<div className='join'>
					<input
						className='join-item btn'
						type='radio'
						name='time'
						aria-label='15'
					/>
					<input
						className='join-item btn'
						type='radio'
						name='time'
						aria-label='30'
					/>
					<input
						className='join-item btn'
						type='radio'
						name='time'
						aria-label='45'
					/>
				</div>
			</div>
			<code className='p-8 rounded-xl bg-base-200 w-5/6 lg:w-2/3'>
				{words.map((word, i) => {
					return <span key={i}>{word} </span>;
				})}
			</code>
		</div>
	);
}
