import {atom} from "jotai";
import type { User } from "@/app/types/user";

export const usersAtom = atom<User[]>([])
export const currentUserAtom = atom<User | null>(null)
export const userLoadingAtom = atom<boolean>(false)
export const userErrorAtom = atom<string| null>(null)