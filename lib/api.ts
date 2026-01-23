import axios from "axios";
import type { Note, NewNote, FetchNotesResponse } from "../types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export const fetchNotes = async (
  page: number,
  query: string,
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    perPage: 12,
    page,
  };

  if (query.trim() !== "") {
    params.search = query;
  }

  const response = await axios.get<FetchNotesResponse>("/notes", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const { data } = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const addNote = async (noteData: NewNote): Promise<Note> => {
  const res = await axios.post<Note>("/notes", noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteNote = async (noteId: number): Promise<Note> => {
  const res = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
