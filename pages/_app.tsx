import { supabase } from "@/lib/initSupabase";
import "@/styles/app.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";

import { DndContext } from "@dnd-kit/core";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<DndContext>
			<SessionContextProvider supabaseClient={supabase}>
				<Component {...pageProps} />
			</SessionContextProvider>
		</DndContext>
	);
}
