"use client";
import { fetchNotes } from "@/lib/api";
import { FetchNotesResponse } from "@/types/note";
import { useState } from "react";
import styles from "./NotePage.module.css";

import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce, useDebouncedCallback } from "use-debounce";

type NotesClientProps = {
  initialPage: number;
  initialQuery: string;
};

export default function NotesClient({
  initialPage,
  initialQuery,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isModal, setIsModal] = useState(false);
  const updateSearchQuery = useDebouncedCallback(setSearchQuery, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, searchQuery),
    placeholderData: keepPreviousData,
  });
  const openModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

  const totalPages = data?.totalPages ?? 0;

  return (
    <>
      <NoteList notes={data.notes} />
      <SearchBox value={searchQuery} onSearch={updateSearchQuery} />
      {totalPages > 1 && (
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
        />
      )}
      <button className={styles.button} onClick={openModal}>
        Create note +
      </button>
      {isModal && (
        <Modal onClose={closeModal}>
          <NoteForm onCloseModal={closeModal} />
        </Modal>
      )}
    </>
  );
}
