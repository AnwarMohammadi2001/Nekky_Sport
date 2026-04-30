// models/index.js

import Category from "./Category.js";
import Attribute from "./Attribute.js";
import AttributeOption from "./AttributeOption.js";
import Product from "./Product.js";
import ProductAttributeValue from "./ProductAttributeValue.js";
import ProductImage from "./ProductImage.js";
import Slider from "./Slider.js";

// روابط

Category.hasMany(Attribute, { foreignKey: "categoryId" });
Attribute.belongsTo(Category, { foreignKey: "categoryId" });

Attribute.hasMany(AttributeOption, { foreignKey: "attributeId" });
AttributeOption.belongsTo(Attribute, { foreignKey: "attributeId" });

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

Product.hasMany(ProductImage, { foreignKey: "productId" });
ProductImage.belongsTo(Product, { foreignKey: "productId" });
ProductAttributeValue.belongsTo(Attribute, { foreignKey: "attributeId" });
Attribute.hasMany(ProductAttributeValue, { foreignKey: "attributeId" });

Product.hasMany(ProductAttributeValue, { foreignKey: "productId" });
ProductAttributeValue.belongsTo(Product, { foreignKey: "productId" });

export {
  Category,
  Attribute,
  AttributeOption,
  Product,
  ProductAttributeValue,
  ProductImage,
  Slider,
};
