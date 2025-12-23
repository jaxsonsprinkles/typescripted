'use client';

import useKeyPress from '@/hooks/useKeyPress';
import { useState } from 'react';

export default function Home() {
	const words = ['hello', 'world', 'typescript', 'react', 'javascript'];
	// [word index, letter index]
	const [index, setIndex] = useState<Array<number>>([0, 0]);

	const correct = (key: string) => {
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
		} else if (key === ' ') {
			console.log('space pressed, moving to next word');
			nextWord += 1; // Move to the next word
			nextLetter = 0; // Reset letter index
		} else {
			if (words[word] && words[word][letter + 1] === undefined) {
				console.log('end of word, press space');
			}
		}
		console.log('next index: ' + nextWord + ' ' + nextLetter);
		setIndex([nextWord, nextLetter]);
	};

	const incorrect = (key: string) => {
		console.log('incorrect key pressed. you were supposed to press ' + key);
	};

	const listener = useKeyPress(words[index[0]][index[1]], correct, incorrect);

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
					return (
						<span key={i}>
							{word.split('').map((letter, j) => {
								return (
									<span
										key={`${i}-${j}`}
										className={
											i < index[0] || (i === index[0] && j <= index[1] - 1)
												? 'text-white-500'
												: 'text-base-content/30'
										}
									>
										{letter}
									</span>
								);
							})}{' '}
						</span>
					);
				})}
			</code>
		</div>
	);
}
