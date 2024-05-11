import type { Database } from "@/lib/schema";
import { type Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

type Places = Database["public"]["Tables"]["places"]["Row"];

export default function PlaceList({ session }: { session: Session }) {
	const supabase = useSupabaseClient<Database>();
	const [places, setPlaces] = useState<Places[]>([]);
	const [newPlaceText, setNewPlaceText] = useState("");
	const [errorText, setErrorText] = useState("");

	const user = session.user;

	useEffect(() => {
		const fetchPlaces = async () => {
			const { data: places, error } = await supabase
				.from("places")
				.select("*")
				.order("id", { ascending: true });

			if (error) console.log("error", error);
			else setPlaces(places);
		};

		fetchPlaces();
	}, [supabase]);

	const addPlace = async (placeText: string) => {
		const name = placeText.trim();
		if (name.length) {
			const { data: place, error } = await supabase
				.from("places")
				.insert({ name, user_id: user.id })
				.select()
				.single();

			if (error) {
				setErrorText(error.message);
			} else {
				setPlaces([...places, place]);
				setNewPlaceText("");
			}
		}
	};

	const deletePlace = async (id: number) => {
		try {
			await supabase.from("places").delete().eq("id", id).throwOnError();
			setPlaces(places.filter((x) => x.id !== id));
		} catch (error) {
			console.log("error", error);
		}
	};

	return (
		<div className="w-full">
			<h2 className="mb-12">Places</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					addPlace(newPlaceText);
				}}
				className="flex gap-2 my-2"
			>
				<input
					className="rounded w-full p-2"
					type="text"
					placeholder="make coffee"
					value={newPlaceText}
					onChange={(e) => {
						setErrorText("");
						setNewPlaceText(e.target.value);
					}}
				/>
				<button className="btn-black" type="submit">
					Add
				</button>
			</form>
			{!!errorText && <Alert text={errorText} />}
			<div className="bg-white shadow overflow-hidden rounded-md">
				<ul>
					{places.map((place) => (
						<Place
							key={place.id}
							place={place}
							onDelete={() => deletePlace(place.id)}
						/>
					))}
				</ul>
			</div>
		</div>
	);
}

const Place = ({
	place,
	onDelete,
}: { place: Places; onDelete: () => void }) => {
	const supabase = useSupabaseClient<Database>();
	const [isCompleted, setIsCompleted] = useState(place.is_complete);

	const toggle = async () => {
		try {
			const { data } = await supabase
				.from("places")
				.update({ is_complete: !isCompleted })
				.eq("id", place.id)
				.throwOnError()
				.select()
				.single();

			if (data) setIsCompleted(data.is_complete);
		} catch (error) {
			console.log("error", error);
		}
	};

	return (
		<li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
			<div className="flex places-center px-4 py-4 sm:px-6">
				<div className="min-w-0 flex-1 flex places-center">
					<div className="text-sm leading-5 font-medium truncate">
						{place.name}
					</div>
				</div>
				<div>
					<input
						className="cursor-pointer"
						onChange={(e) => toggle()}
						type="checkbox"
						checked={!!isCompleted}
					/>
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onDelete();
					}}
					className="w-4 h-8 ml-2 border-2 hover:border-black hover:bg-red-500 hover:cursor-pointer rounded"
				>
					X
				</button>
			</div>
		</li>
	);
};

const Alert = ({ text }: { text: string }) => (
	<div className="rounded-md bg-red-100 p-4 my-3">
		<div className="text-sm leading-5 text-red-700">{text}</div>
	</div>
);
