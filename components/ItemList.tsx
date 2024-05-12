import type { Database } from "@/lib/schema";
import { type Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { ItemBlock, type ItemData } from "./ItemBlock";

export default function ItemList({ session }: { session: Session }) {
	const supabase = useSupabaseClient<Database>();
	const [items, setItems] = useState<ItemData[]>([]);
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
				.insert({
					name,
					child_items: null,
					parent_item: null,
					user_id: user.id,
				})
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
	const addParentToItem = async (itemId: number, parentItemId: number) => {
		try {
			// Fetch the existing item
			const { data: existingItem, error } = await supabase
				.from("items")
				.select("*")
				.eq("id", itemId)
				.single();

			if (error) {
				throw error;
			}

			if (existingItem) {
				// Merge the updated parent_item with existing item's other properties
				const updatedItem = {
					...existingItem,
					parent_item: parentItemId,
				};

				// Update the item with the merged object
				const { error: updateError } = await supabase
					.from("items")
					.update(updatedItem)
					.eq("id", itemId);

				if (updateError) {
					throw updateError;
				}

				// Optimistically update the new item in the state array
				setItems((prevItems) => {
					return prevItems.map((item) => {
						return item.id === itemId ? updatedItem : item;
					});
				});

				console.log(`Parent item added successfully to item with id ${itemId}`);
				// Optionally, you can return the updated item if needed
				return updatedItem;
			}

			console.log(`Item with id ${itemId} not found`);
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
						<ItemBlock
							key={item.id}
							thisItemId={item.id}
							items={items}
							onDelete={() => deleteItem(item.id)}
							onAddParent={() => addParentToItem(item.id, item.id)}
						/>
					))}
				</ul>
			</div>
		</div>
	);
}

const Alert = ({ text }: { text: string }) => (
	<div className="rounded-md bg-red-100 p-4 my-3">
		<div className="text-sm leading-5 text-red-700">{text}</div>
	</div>
);
