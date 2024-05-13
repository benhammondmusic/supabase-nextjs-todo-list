import ItemList from "@/components/ItemList";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import Head from "next/head";

export default function Home() {
	const session = useSession();
	const supabase = useSupabaseClient();

	return (
		<>
			<Head>
				<title>Where Is It?</title>
				<meta
					name="description"
					content="An app to help you keep track of where you put your stuff"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="w-full h-full bg-gray-200">
				{!session ? (
					<div className="min-w-full min-h-screen flex items-center justify-center">
						<div className="w-full h-full flex justify-center items-center p-4">
							<div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col text-base">
								<span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
									Login
								</span>
								<Auth
									supabaseClient={supabase}
									appearance={{ theme: ThemeSupa }}
									theme="dark"
								/>
							</div>
						</div>
					</div>
				) : (
					<div className="w-full h-full flex flex-col justify-center items-center p-4">
						<h1>Where Is It?</h1>

						<div className="w-full flex gap-10">
							<ItemList session={session} />
						</div>

						<button
							type="button"
							className="btn-black w-full mt-12"
							onClick={async () => {
								const { error } = await supabase.auth.signOut();
								if (error) console.log("Error logging out:", error.message);
							}}
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</>
	);
}
