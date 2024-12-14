import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
} from "@mui/x-data-grid";
import MainLayout from "../../components/SIdeBar";
import {
  Button,
  Dialog,
  Pagination,
  Skeleton,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import Spinner from "../../components/Spinner";
import { apiURL } from "../../config/constanst";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ActionMenu from "../../components/ActionMenu";
import { toast } from "react-toastify";
import CustomDialog from "../../components/CustomDialog";
import ProductForm from "./ProductForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import TenantProductManagement from "./TenantProductManagement";
import StoreProductManagement from "./StoreProductManagement";

const ProductManagement = () => {
  const [viewMode, setViewMode] = React.useState<"tenant" | "store">("store");
  return (
    <>
      {viewMode == "store" ? (

        <StoreProductManagement


          onChangeViewMode={(mode) => setViewMode(mode)}
        />


      ) : (

        <TenantProductManagement
          onChangeViewMode={(mode) => setViewMode(mode)}
        />

      )}
    </>
  );
};

export default ProductManagement;
