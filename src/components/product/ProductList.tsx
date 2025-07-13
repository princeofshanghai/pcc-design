import React from 'react';
import type { Product } from '../../utils/types';
import ProductListItem from './ProductListItem';

interface ProductListProps {
  products: Product[];
  hideRedundantColumns?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, hideRedundantColumns }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} hideRedundantColumns={hideRedundantColumns} />
      ))}
    </div>
  );
};

export default ProductList; 