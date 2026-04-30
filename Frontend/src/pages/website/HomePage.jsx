import React from "react";
import HeroMain from "../../Components/Hero/HeroMain";
import MainCategorySlider from "../../Components/Categori/MainCategorySlider";
import NewestProduct from "../../Components/product/NewestProduct";
import BestSellingProduct from "../../Components/product/BestSellingProduct";
import ProductCategorySlider from "../../Components/product/ProductSectionSlider";
import Mobile_AccessSlider from "../../Components/product/Mobile_AccessSlider";
import Printer_AccessSlider from "../../Components/product/Printer_AccessSlider";

const HomePage = (props) => {
  return (
    <div className="pb-14 min-h-screen bg-gray-50">
      <HeroMain />
      <MainCategorySlider />

      <div className=" px-4 md:px-8 space-y-4 mt-8">
        <NewestProduct />

        <ProductCategorySlider
          title=" محصولات موبایل "
          categoryName="موبایل"
          bgIconColor="red"
        />
        <Mobile_AccessSlider
          title="لوازم جانبی موبایل"
          categoryName="لوازم جانبی موبایل"
          bgIconColor="red"
        />
        <ProductCategorySlider
          title=" محصولات پرینتر "
          categoryName="پرینتر"
          bgIconColor="red"
        />
        <Printer_AccessSlider
          title="لوازم جانبی پرینتر"
          categoryName="لوازم جانبی پرینتر"
          bgIconColor="red"
        />

        <ProductCategorySlider
          title="اسکاچ و سیم ظرفشویی"
          categoryName="اسکاچ و سیم ظرفشویی"
          bgIconColor="blue"
        />

        <BestSellingProduct />
      </div>
    </div>
  );
};

export default HomePage;
