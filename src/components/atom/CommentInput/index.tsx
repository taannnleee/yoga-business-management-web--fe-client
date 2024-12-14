"use client";

import { TextField, Button, Avatar, CircularProgress } from "@mui/material";
import React from "react";
import RichTextInput from "@/components/atom/RichTextInput";

interface ICommentInputProps {
    name: string;
    control: any;
    label: string;
    onPostComment: () => void;
    isPosting?: boolean;
    isClosable?: boolean;
    onClose?: () => void;
}

const CommentInput: React.FC<ICommentInputProps> = (props) => {
    const [comment, setComment] = React.useState("");
    const {
        name,
        control,
        label,
        onPostComment,
        isPosting = false,
        isClosable = false,
        onClose,
    } = props;

    return (
        <div className="flex w-full gap-x-3">
            {/*<div className="bg-primary-600 text-center text-secondary-500 w-[40px] h-[40px] cursor-pointer rounded-full flex items-center justify-center box-border">*/}
            {/*    {(user?.username?.[0] as string)?.toUpperCase()}*/}
            {/*</div>*/}
            <div className="w-full">
                <div>
                    <RichTextInput
                        name={name}
                        control={control}
                        label={label}
                        placeholder="Nhập bình luận của bạn"
                    />
                </div>
                <div className="flex justify-between">
                    <div></div>
                    <div className="flex items-center gap-x-3">
                        {isClosable && (
                            <button
                                className="bg-white text-primary-500 border-primary-500 border rounded-md px-3 py-1 mt-2 min-w-[80px]"
                                onClick={() => onClose?.()}
                            >
                                Đóng
                            </button>
                        )}
                        <button
                            className="bg-primary-500 text-white font-semibold rounded-md px-3 py-1 mt-2 min-w-[80px]"
                            onClick={() => onPostComment()}
                        >
                            {isPosting ? (
                                <CircularProgress sx={{ color: "white" }} size={20} />
                            ) : (
                                "Đăng"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentInput;
