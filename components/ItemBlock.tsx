import type { Database } from "@/lib/schema";

export type ItemData = Database["public"]["Tables"]["items"]["Row"];

interface ItemProps {
	items: ItemData[];
	thisItemId: number;
	onDelete: () => void;
	onAddParent: () => void;
}
export const ItemBlock = ({
	items,
	thisItemId,
	onDelete,
	onAddParent,
}: ItemProps) => {
	const item = items.find((item: ItemData) => item.id === thisItemId);
	if (!item) return null;
	return (
		<li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
			<div className="flex items-center px-4 py-4 sm:px-6">
				<div className="min-w-0 flex-1 flex items-center">
					<div className="text-sm leading-5 font-medium truncate">
						<p className="font-thin italic">Parent: {item.parent_item}</p>
						<p className="font-thin italic">
							Item: <b>{item.name}</b>
						</p>
						<p className="font-thin italic">
							Children: {item.child_items?.map((child) => child)}
						</p>
					</div>
				</div>

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
			</div>
		</li>
	);
};
