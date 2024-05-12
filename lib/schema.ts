export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface Database {
	public: {
		Tables: {
			items: {
				Row: {
					id: number;
					inserted_at: string;
					name: string | null;
					child_items: number[] | null;
					parent_item: number | null;
					user_id: string;
				};
				Insert: {
					id?: number;
					inserted_at?: string;
					name?: string | null;
					child_items: number[] | null;
					parent_item: number | null;
					user_id: string;
				};
				Update: {
					id?: number;
					inserted_at?: string;
					name?: string | null;
					child_items: number[] | null;
					parent_item: number | null;
					user_id?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
