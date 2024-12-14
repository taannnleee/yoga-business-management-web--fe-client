import React from "react";
import { Pagination } from "@nextui-org/pagination";

interface BottomContentProps {
    totalItems: number;
    page: number;
    pageSize: number;
    onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    setPage: (page: number) => void;
}

const BottomContent: React.FC<BottomContentProps> = ({
                                                         totalItems,
                                                         page,
                                                         pageSize,
                                                         onRowsPerPageChange,
                                                         onPreviousPage,
                                                         onNextPage,
                                                         setPage,
                                                     }) => {
    return (
        <div className="pr-2 pl-4 px-2 flex justify-between items-center my-20">
            <span className="w-[30%] text-small text-default-400">
                {"Tổng thông tin phù hợp : " + totalItems}
            </span>
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pageSize}
                onChange={setPage}
            />
            <div className="hidden sm:flex w-[30%] justify-end gap-2">
                <div className="flex justify-between items-center">
                    <label className="flex items-center text-default-400 text-small">
                        Số lượng:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="4">4</option>
                            <option value="8">8</option>
                            <option value="12">12</option>
                            <option value="16">16</option>
                            <option value="20">20</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default BottomContent;
