import type { Database } from "@/lib/schema";
import { useDraggable, useDroppable } from "@dnd-kit/core";

export type ItemData = Database["public"]["Tables"]["items"]["Row"];

interface ItemProps {
	items: ItemData[];
	thisItemId: number;
	onDelete: () => void;
	onAddParent: () => void;
	hoveredDroppableItem: ItemData | null;
	setHoveredDroppableItem: (item: ItemData | null) => void;
}
export const ItemBlock = ({
	items,
	thisItemId,
	onDelete,
	onAddParent,
	hoveredDroppableItem,
	setHoveredDroppableItem,
}: ItemProps) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: thisItemId,
	});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
		id: thisItemId,
	});

	const thisItem = items.find((item: ItemData) => item.id === thisItemId);
	if (!thisItem) return null;
	const parentItem = items.find((x: ItemData) => x.id === thisItem.parent_item);

	if (isOver) {
		setHoveredDroppableItem(thisItem);
	}

	return (
		<li
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className="w-full block cursor-pointer focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out"
			style={style}
		>
			<div
				ref={setDroppableNodeRef}
				className={`flex items-center px-4 py-4 sm:px-6 ${
					isOver ? "bg-green-200" : ""
				}`}
			>
				<div className="min-w-0 flex-1 flex items-center">
					<div className="text-sm leading-5 font-medium truncate">
						{!transform && (
							<p className="font-thin italic">Parent: {parentItem?.name}</p>
						)}
						<p className="font-thin italic">
							Item: <b>{thisItem.name}</b>
						</p>
						{!transform && (
							<p className="font-thin italic">
								Children: {thisItem.child_items?.map((child) => child)}
							</p>
						)}
					</div>
				</div>

				{!transform && (
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onAddParent();
						}}
						className="p-1 h-8 ml-2 border-2 hover:border-black hover:bg-green-500 hover:cursor-pointer rounded"
					>
						Add Parent
					</button>
				)}
				{!transform && (
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onDelete();
						}}
						className="p-1 h-8 ml-2 border-2 hover:border-black hover:bg-red-500 hover:cursor-pointer rounded"
					>
						Delete
					</button>
				)}
				{transform && (
					<b>
						Moving ≪{thisItem.name}≫ into{" "}
						{hoveredDroppableItem?.name
							? `≪${hoveredDroppableItem?.name}≫`
							: "?"}
					</b>
				)}
			</div>
		</li>
	);
};
