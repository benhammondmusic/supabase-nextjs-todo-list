import type { Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { SingleItem, type ItemData } from "./SingleItem";
import { useCrudStuff } from "@/lib/useCrudStuff";
import { DndContext } from "@dnd-kit/core";

export default function ItemList({ session }: { session: Session }) {
	const [newItemText, setNewItemText] = useState("");
	const [errorText, setErrorText] = useState("");

	const [hoveredDroppableItem, setHoveredDroppableItem] =
		useState<ItemData | null>(null);

	const [activeDraggableItem, setActiveDraggableItem] =
		useState<ItemData | null>(null);

	const { items, deleteItem, addItem, addParentToItem } = useCrudStuff(
		session,
		setErrorText,
		setNewItemText,
	);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function handleDragEnd(event: any) {
		if (event?.over?.id && activeDraggableItem?.id) {
			addParentToItem(activeDraggableItem?.id, event.over.id);
		}
		setActiveDraggableItem(null);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function handleDragStart(event: any) {
		const activeItem = items.find(
			(item: ItemData) => item.id === event.active.id,
		);

		console.log("start", activeItem, activeItem?.id, activeItem?.name);
		activeItem && setActiveDraggableItem(activeItem);
	}

	return (
		<DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
			<div className="w-full">
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
				<div className="bg-white shadow overflow-hidden rounded-md p-10">
					<ul className="pr-10">
						{items.map((item) => (
							<SingleItem
								key={item.id}
								thisItemId={item.id}
								items={items}
								onDelete={() => deleteItem(item.id)}
								hoveredDroppableItem={hoveredDroppableItem}
								setHoveredDroppableItem={setHoveredDroppableItem}
								activeDraggableItem={activeDraggableItem}
							/>
						))}
					</ul>
				</div>
			</div>
		</DndContext>
	);
}

const Alert = ({ text }: { text: string }) => (
	<div className="rounded-md bg-red-100 p-4 my-3">
		<div className="text-sm leading-5 text-red-700">{text}</div>
	</div>
);
