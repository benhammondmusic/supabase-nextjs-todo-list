import type { Database } from "@/lib/schema";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { Dispatch, SetStateAction } from "react";

export type ItemData = Database["public"]["Tables"]["items"]["Row"];

interface SingleItemProps {
	items: ItemData[];
	thisItemId: number;
	onDelete: () => void;
	hoveredDroppableItem: ItemData | null;
	setHoveredDroppableItem: Dispatch<SetStateAction<ItemData | null>>;
	activeDraggableItem: ItemData | null;
}
export const SingleItem = ({
	items,
	thisItemId,
	onDelete,
	hoveredDroppableItem,
	setHoveredDroppableItem,
	activeDraggableItem,
}: SingleItemProps) => {
	// make this item draggable
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: thisItemId,
		});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	// make this item droppable
	const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
		id: thisItemId,
	});

	const thisItem = items.find((item: ItemData) => item.id === thisItemId);
	if (!thisItem) return null;
	const parentItem = items.find((x: ItemData) => x.id === thisItem.parent_item);
	const childItems = items.filter(
		(x: ItemData) => x.parent_item === thisItem.id,
	);

	if (isOver) {
		setHoveredDroppableItem(thisItem);
	}

	return (
		<li
			ref={setDroppableNodeRef}
			className={`p-5 w-full block bg-opacity-95 m-5  rounded-xl focus:bg-gray-200 transition duration-150 ease-in-out ${
				isOver && activeDraggableItem?.name !== hoveredDroppableItem?.name
					? "bg-green-200 "
					: "bg-blue-200 "
			}`}
			style={style}
		>
			<div className="flex items-center px-4 py-4 sm:px-6 justify-between">
				<div>
					<div className="min-w-0 flex-1 flex items-center">
						<div className="text-sm leading-5 font-medium truncate">
							<p className="font-thin italic">Is In: {parentItem?.name}</p>
							<p className="text-2xl font-thin italic">
								<b>{thisItem.name}</b>
							</p>
							<p className="font-thin italic">
								Contains: {childItems.map((x) => x.name).join(", ")}
							</p>

							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onDelete();
								}}
								className="hover:bg-red-500 hover:cursor-pointer rounded font-thin italic"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
				<button
					ref={setNodeRef}
					{...listeners}
					{...attributes}
					className="cursor-move"
				>
					<svg viewBox="0 0 20 20" width="12">
						<path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z">
							<title>Drag Handle</title>
						</path>
					</svg>
				</button>
			</div>
		</li>
	);
};
