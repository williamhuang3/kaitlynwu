"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const places = [
	{
		name: "Seaside",
		src: "/places/place1.jpg",
		emojis: ["🌊", "🏖️", "🐚"],
	},
	{
		name: "Sawtelle",
		src: "/places/place2.jpg",
		emojis: ["🍜", "🍣", "🧋"],
	},
	{
		name: "Santa Monica",
		src: "/places/place3.jpg",
		emojis: ["🎡", "🌴", "🎠"],
	},
	{
		name: "Ktown",
		src: "/places/place4.jpg",
		emojis: ["🍗", "🎤", "🍶"],
	},
	{
		name: "Brooklyn",
		src: "/places/place5.jpg",
		emojis: ["🌆", "🏙️", "🚗"],
	},
	{
		name: "Hollywood",
		src: "/places/place6.jpg",
		emojis: ["🎬", "🌟", "🎤"],
	},
	{
		name: "Cincinnati Airport (briefly)",
		src: "/places/place7.jpg",
		emojis: ["✈️", "🛫", "🧳"],
	},
	{
		name: "The Roblox Server",
		src: "/places/place8.jpg",
		emojis: ["🕹️", "👾", "💻"],
	},
	{
		name: "New York",
		src: "/places/place9.jpg",
		emojis: ["🗽", "🍎", "🚕"],
	},
  {
    name: "NOS Event Center LMAO",
    src: "/places/place10.jpg",
    emojis: ["🏟️", "🎉", "🌈"],
  },
	// Temecula will be handled separately for suspense
];

const temecula = {
	name: "Temecula",
	src: "/places/place11.jpg",
	emojis: ["🍇", "🍷", "✨"],
};

export default function ElevenPlaces() {
	const [showTemecula, setShowTemecula] = useState(false);
	const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
	const [hoveredTemecula, setHoveredTemecula] = useState(false);

	// Show Temecula after suspense
	const handleShowTemecula = () => setShowTemecula(true);

	return (
		<section className="bg-white py-20 px-6 relative">
			<div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
				{places.map((place, idx) => {
					const isLastRow = idx >= 9;
					const delay = idx * 0.15;
					return (
						<motion.div
							key={place.name}
							initial={{ opacity: 0, x: idx % 2 === 0 ? -80 : 80 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay }}
							viewport={{ once: true, amount: 0.4 }}
							className={`rounded-xl overflow-hidden shadow-lg relative group bg-white ${
								isLastRow ? "col-span-3 flex justify-center" : ""
							}`}
							onMouseEnter={() => setHoveredIdx(idx)}
							onMouseLeave={() => setHoveredIdx(null)}
							style={{ minHeight: 220 }}
						>
							<img
								src={place.src}
								alt={place.name}
								className="w-full h-full object-cover max-w-xs"
							/>
							{/* Caption appears from bottom on hover */}
							<AnimatePresence>
								{hoveredIdx === idx && (
									<motion.div
										initial={{ opacity: 0, y: 40 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 40 }}
										transition={{ duration: 0.35 }}
										className="absolute bottom-0 left-0 w-full flex justify-center"
										style={{ pointerEvents: "none" }}
									>
										<div className="bg-white/90 rounded-t-lg px-6 py-3 text-xl font-bold text-lavender-dark shadow-lg mb-0 w-full text-center">
											{place.name}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
							{/* Emojis float across the grid cell on hover */}
							<AnimatePresence>
								{hoveredIdx === idx && (
									<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
										{place.emojis.map((emoji, i) => (
											<motion.span
												key={emoji}
												initial={{ x: -40, opacity: 0, scale: 0.7 }}
												animate={{ x: 120, opacity: 1, scale: 1.2 }}
												exit={{ x: 120, opacity: 0, scale: 0.7 }}
												transition={{
													delay: 0.15 * i,
													duration: 1.2,
												}}
												className="text-4xl mx-1 absolute"
												style={{
													top: `calc(50% + ${i * 22 - 22}px)`,
													left: 0,
													filter: "drop-shadow(0 2px 8px #fff)",
												}}
											>
												{emoji}
											</motion.span>
										))}
									</div>
								)}
							</AnimatePresence>
						</motion.div>
					);
				})}
			</div>
			{/* Temecula suspense and card */}
			<div className="w-full flex flex-col items-center mt-16">
				{!showTemecula && (
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.8 }}
						className="text-3xl font-bold text-lavender-dark text-center mb-8"
					>
						...and of course,
						<motion.button
							onClick={handleShowTemecula}
							className="ml-3 px-6 py-2 rounded-full bg-lavender-dark text-white font-extrabold text-3xl shadow-lg hover:bg-lavender"
							whileHover={{ scale: 1.08 }}
							whileTap={{ scale: 0.95 }}
							style={{ marginLeft: 16 }}
						>
							Reveal
						</motion.button>
					</motion.div>
				)}
				<AnimatePresence>
					{showTemecula && (
						<motion.div
							initial={{ opacity: 0, scale: 0.7 }}
							animate={{ opacity: 1, scale: 1.08 }}
							exit={{ opacity: 0, scale: 0.7 }}
							transition={{ duration: 0.7 }}
							className="rounded-xl overflow-hidden shadow-2xl relative group bg-white flex flex-col items-center border-4 border-yellow-300"
							style={{
								maxWidth: 400,
								filter:
									"drop-shadow(0 0 32px #fde68a) drop-shadow(0 0 64px #fde68a)",
								animation: "shineTemecula 1.2s infinite alternate",
							}}
							onMouseEnter={() => setHoveredTemecula(true)}
							onMouseLeave={() => setHoveredTemecula(false)}
						>
							<img
								src={temecula.src}
								alt={temecula.name}
								className="w-full h-72 object-cover"
							/>
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 rounded px-6 py-2 text-2xl font-extrabold text-yellow-700 shadow-lg border-2 border-yellow-300">
								{temecula.name}
							</div>
							{/* Emojis fly across on hover */}
							<AnimatePresence>
								{hoveredTemecula && (
									<motion.div
										initial={{ opacity: 0, y: 30 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -30 }}
										className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
									>
										{temecula.emojis.map((emoji, i) => (
											<motion.span
												key={emoji}
												initial={{ x: -60, opacity: 0, scale: 0.7 }}
												animate={{ x: 180, opacity: 1, scale: 1.2 }}
												exit={{ x: 240, opacity: 0, scale: 0.7 }}
												transition={{
													delay: 0.1 * i,
													duration: 1.2,
													repeat: Infinity,
													repeatType: "loop",
												}}
												className="text-4xl mx-2"
												style={{ filter: "drop-shadow(0 2px 8px #fff)" }}
											>
												{emoji}
											</motion.span>
										))}
									</motion.div>
								)}
							</AnimatePresence>
							<style>{`
                @keyframes shineTemecula {
                  0% { filter: drop-shadow(0 0 16px #fde68a) drop-shadow(0 0 32px #fde68a) brightness(1.1);}
                  100% { filter: drop-shadow(0 0 48px #fde68a) drop-shadow(0 0 96px #fde68a) brightness(1.4);}
                }
              `}</style>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
}
