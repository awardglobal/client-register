import { useState } from 'react';

interface PropsType {
  maxPage: number;
}

export default function usePage({ maxPage }: PropsType) {
  const [page, setPage] = useState(1);

  const isFirstPage = page === 1;
  const isLastPage = page === maxPage;
  const nextPage = () => {
    if (page < maxPage) {
      setPage(page + 1);
    }
  };
  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  return {
    page,
    isFirstPage,
    isLastPage,
    nextPage,
    previousPage,
  };
}
