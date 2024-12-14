"use client";
import React, { useEffect, useState } from "react";
import ProductDetailTemplate from "@/components/template/ProductDetail";
import { useParams } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/config/url";

const ProductDetail: React.FC = () => {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (id) {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const response = await axios.get(`${API_URL}/api/product-detail/getProduct/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response) {
            setProduct(response.data.data);
          } else {
            setError("Product not found");
          }
        } catch (error) {
          setError("Error fetching product");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className=" bg-white flex justify-center">
      <ProductDetailTemplate product={product} />
    </div>
  );
};

export default ProductDetail;
