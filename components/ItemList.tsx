import type { Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { ItemBlock } from "./ItemBlock";
import { useCrudStuff } from "@/lib/useCrudStuff";

export default function ItemList({ session }: { session: Session }) {
	const [newItemText, setNewItemText] = useState("");
	const [errorText, setErrorText] = useState("");

	const { items, deleteItem, addItem, addParentToItem } = useCrudStuff(
		session,
		setErrorText,
		setNewItemText,
	);

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
