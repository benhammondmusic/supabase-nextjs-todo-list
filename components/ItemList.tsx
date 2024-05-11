import type { Database } from "@/lib/schema";
import { type Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

type Items = Database["public"]["Tables"]["items"]["Row"];

export default function ItemList({ session }: { session: Session }) {
	const supabase = useSupabaseClient<Database>();
	const [items, setItems] = useState<Items[]>([]);
	const [newItemText, setNewItemText] = useState("");
	const [errorText, setErrorText] = useState("");

	const user = session.user;

	useEffect(() => {
		const fetchItems = async () => {
			const { data: items, error } = await supabase
				.from("items")
				.select("*")
				.order("id", { ascending: true });

			if (error) console.log("error", error);
			else setItems(items);
		};

		fetchItems();
	}, [supabase]);

	const addItem = async (itemText: string) => {
		const name = itemText.trim();
		if (name.length) {
			const { data: item, error } = await supabase
				.from("items")
				.insert({ name, user_id: user.id })
				.select()
				.single();

			if (error) {
				setErrorText(error.message);
			} else {
				setItems([...items, item]);
				setNewItemText("");
			}
		}
	};

	const deleteItem = async (id: number) => {
		try {
			await supabase.from("items").delete().eq("id", id).throwOnError();
			setItems(items.filter((x) => x.id !== id));
		} catch (error) {
			console.log("error", error);
		}
	};

	return (
		<div className="w-full">
			<h2 className="mb-12">Items</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					addItem(newItemText);
				}}
				className="flex gap-2 my-2"
			>
				<input
					className="rounded w-full p-2"
					type="text"
					placeholder="passport, wallet, etc."
					value={newItemText}
					onChange={(e) => {
						setErrorText("");
						setNewItemText(e.target.value);
					}}
				/>
				<button className="btn-black" type="submit">
					Add
				</button>
			</form>
			{!!errorText && <Alert text={errorText} />}
			<div className="bg-white shadow overflow-hidden rounded-md">
				<ul>
					{items.map((item) => (
						<Item
							key={item.id}
							item={item}
							onDelete={() => deleteItem(item.id)}
						/>
					))}
				</ul>
			</div>
		</div>
	);
}

const Item = ({ item, onDelete }: { item: Items; onDelete: () => void }) => {
	return (
		<li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
			<div className="flex items-center px-4 py-4 sm:px-6">
				<div className="min-w-0 flex-1 flex items-center">
					<div className="text-sm leading-5 font-medium truncate">
						{item.name}
					</div>
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
