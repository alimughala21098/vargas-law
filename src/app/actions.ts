"use server";
import { cookies } from "next/headers"; import { revalidatePath } from "next/cache";
export async function setLang(f: FormData) { cookies().set("lang", f.get("lang") === "es" ? "es" : "en", { path: "/", maxAge: 31536000 }); revalidatePath("/", "layout"); }
