import React, { useState } from "react";
import axios from "axios";
import CommentInput from "@/components/atom/CommentInput";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import { apiURL } from "../../../constants";
import { formatDate } from "@/utils/dateUtils";
import StarRating from "@/components/molecules/StarRating";
import { CiCircleCheck } from "react-icons/ci";
import Button from "@/components/atom/Button";

// Định nghĩa kiểu cho các props
interface User {
    id: string;
    fullname: string;
    imagePath: string;
}

interface Variant {
    value: string;
}

interface Comment {
    id: string;
    ratePoint: number;
    content: string;
    user: User;
    replies: Comment[];
    createdAt: string;
    currentVariant: Record<string, Variant>; // Kiểu cho currentVariant
}

interface IProductCommentCardProps {
    comment: Comment;
    productDetail: any;
    onReplyingSuccess?: () => void;
}

type ICommentMode = "view" | "edit";

const CommentCard: React.FC<IProductCommentCardProps> = ({
    comment,
    productDetail,
    onReplyingSuccess,
}) => {
    const { register, control, handleSubmit, setValue, watch } = useForm();
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [isTurningOnReply, setIsTurningOnReply] = useState<boolean>(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isCommenting, setIsCommenting] = useState<boolean>(false);
    const [commentMode, setCommentMode] = useState<ICommentMode>("view");
    const toast = useToast();
    const accessToken = localStorage.getItem("accessToken");

    const handlePostReply = async (comment: Comment) => {
        try {
            setIsReplying(true);
            if (watch("reply")?.length > 0) {
                const response = await axios.post(
                    `${apiURL}/api/comment`,
                    {
                        content: watch("reply") || "",
                        parentCommentId: comment.id || null,
                        productId: productDetail.id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                if (response?.data?.status === 201) {
                    setIsTurningOnReply(false);
                    onReplyingSuccess?.();
                    toast?.sendToast("success", "Trả lời bình luận thành công");
                }
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                toast.sendToast("error", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
            }
        } finally {
            setIsReplying(false);
        }
    };

    const getVariantString = (currentVariant: Record<string, Variant>) => {
        if (!currentVariant) return ""; // Nếu không có currentVariant, trả về chuỗi rỗng

        return Object.values(currentVariant)
            .map((variant: Variant) => variant.value) // Đảm bảo variant là kiểu Variant
            .join(", "); // Nối chúng lại bằng dấu phẩy
    };

    const handleDeleteComment = async () => {
        try {
            setIsDeleting(true);
            const response = await axios.delete(
                `${apiURL}/products/${productDetail?.id}/comments/${comment.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response?.data?.success) {
                setIsDeleting(false);
                onReplyingSuccess?.();
                toast.sendToast("success", "Xóa bình luận thành công");
            }
        } catch (error) {
            setIsDeleting(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleTurnOnEdit = () => {
        setCommentMode("edit");
        setValue("edit", comment.content);
    };

    const handleSubmitEdit = async () => {
        try {
            setIsCommenting(true);
            const response = await axios.put(
                `${apiURL}/products/${productDetail?.id}/comments/${comment.id}`,
                {
                    comment: watch("edit") || "",
                    parentId: null,
                    productId: productDetail?.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response?.data?.success) {
                setIsCommenting(false);
                onReplyingSuccess?.();
                toast?.sendToast("success", "Chỉnh sửa bình luận thành công");
            }
        } catch (error: any) {
            setIsCommenting(false);
            if (error?.response?.status === 401) {
                toast.sendToast("error", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
            }
        } finally {
            setIsCommenting(false);
        }
    };

    const handleTurnOnReply = () => {
        setIsTurningOnReply(true);
    };

    return (
        <>
            {openConfirmDialog && (
                <ConfirmDialog
                    title="Bạn xác nhận sẽ xóa bình luận"
                    description="Hành động này không thể được hoàn tác"
                    open={openConfirmDialog}
                    onClose={() => setOpenConfirmDialog(false)}
                    onConfirm={handleDeleteComment}
                    isConfirmLoadingButton={isDeleting}
                />
            )}
            <div className="my-2 pl-4 rounded-xl bg-gray-200 h-fit">
                {commentMode === "view" ? (
                    <div className="flex justify-between w-full">
                        <div className="flex items-center gap-x-2">
                            {comment?.user.imagePath ? (
                                <img
                                    src={comment.user.imagePath}
                                    alt={comment.user.fullname || "User Avatar"}
                                    className="bg-primary-600 text-center text-secondary-500 cursor-pointer rounded-full w-[40px] h-[40px]"
                                />
                            ) : (
                                <div className="bg-primary-600 text-center text-secondary-500 w-[40px] h-[40px] cursor-pointer rounded-full flex items-center justify-center box-border">
                                    {comment?.user.fullname?.[0] || "U"}
                                </div>
                            )}
                            <div>
                                <div className="flex flex-col tablet:flex-col tablet:items-center">
                                    <p className="text-sm tablet:text-lg font-semibold text-secondary-900">
                                        {comment?.user.fullname}
                                    </p>
                                    <p className="text-secondary-800 text-[10px] tablet:text-xs text-sm tablet:ml-1">
                                        {/* {comment.ratePoint !== null && <StarRating rating={comment.ratePoint}/>} */}
                                    </p>
                                    <p className="text-black-500 text-[14px] font-bold tablet:text-xs text-sm tablet:ml-1 mt-5">
                                        {comment.ratePoint !== null && (
                                            <>
                                                {`vào lúc ${formatDate(comment.createdAt)} | Phân loại hàng: ${getVariantString(
                                                    comment.currentVariant
                                                )} `}
                                                <div className={"flex items-center space-x-2"}>
                                                    <CiCircleCheck className={"text-blue-500 w-6 h-6"} />
                                                    <div className={"text-blue-500 "}>Đã mua hàng tại cửa hàng của chúng tôi</div>
                                                </div>
                                            </>
                                        )}
                                    </p>

                                    <p className="text-secondary-800 text-[10px] tablet:text-xs text-sm tablet:ml-1 mt-5">
                                        {comment.ratePoint === null && `vào lúc ${formatDate(comment.createdAt)}`}
                                    </p>
                                </div>

                                <p className="text-secondary-900 text-sm">{comment.content}</p>
                                <div className="items-center flex mt-1">
                                    {!!accessToken && (
                                        <button
                                            className="text-secondary-900 hover:text-secondary-900 font-regular text-xs"
                                            onClick={handleTurnOnReply}
                                        >
                                            Trả lời
                                        </button>
                                    )}
                                    {comment.user?.id === productDetail?.user?.id && (
                                        <button
                                            className="text-secondary-900 hover:opacity-80 font-regular text-xs ml-2"
                                            onClick={() => setOpenConfirmDialog(true)}
                                        >
                                            Xóa bình luận
                                        </button>
                                    )}
                                    {comment.user?.id === productDetail?.user?.id && (
                                        <button
                                            className="text-secondary-900 hover:opacity-80 font-regular text-xs ml-2"
                                            onClick={handleTurnOnEdit}
                                        >
                                            Chỉnh sửa
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <CommentInput
                        {...register("edit", {
                            required: {
                                value: true,
                                message: "Không được để trống phần trả lời",
                            },
                        })}
                        control={control}
                        label="Chỉnh sửa bình luận"
                        onPostComment={handleSubmit(handleSubmitEdit)}
                        isPosting={isCommenting}
                        isClosable
                        onClose={() => setCommentMode("view")}
                    />
                )}

                {isTurningOnReply && commentMode === "view" && (
                    <div className="ml-12 mt-4 ease-in duration-300">
                        <CommentInput
                            {...register("reply", {
                                required: {
                                    value: true,
                                    message: "Không được để trống phần trả lời",
                                },
                            })}
                            control={control}
                            label="Bình luận của bạn"
                            onPostComment={handleSubmit(() => handlePostReply(comment))}
                            isPosting={isReplying}
                            isClosable
                            onClose={() => setIsTurningOnReply(false)}
                        />
                    </div>
                )}

                <div>
                    {comment.replies?.map((reply, replyIndex) => (
                        <div className="relative ml-2" key={`reply-${replyIndex}`}>
                            <svg className="absolute left-0 top-0 h-full" width="40" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0 v50 M10 50 h30" stroke="#cbd5e0" strokeWidth="0.5" />
                            </svg>
                            <div className="ml-8 mt-2 border-t border-secondary-200 pl-4">
                                <CommentCard
                                    comment={reply}
                                    productDetail={productDetail}
                                    onReplyingSuccess={onReplyingSuccess}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CommentCard;
