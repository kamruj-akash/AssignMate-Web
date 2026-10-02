import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const btnArray = (
  totalPages: number,
  page: number,
): (number | "ellipsis")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 5) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }
  if (page >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
};

export default function TablePagination({
  setPage,
  totalPages,
  currentPage,
}: {
  setPage: (page: number) => void;
  totalPages: number;
  currentPage: number;
}) {
  // const [currentPage, setCurrentPage] = useState(currentPage);
  const handlePageChange = (page: number) => {
    // setCurrentPage(page);
    setPage(page);
  };
  console.log(currentPage);
  return (
    <Pagination>
      <PaginationContent>
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        )}

        {btnArray(totalPages, currentPage).map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                key={page}
                isActive={currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              aria-disabled={currentPage === totalPages}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
