<template>
  <div class="body-bg-shape" style="background-image: url(assets/images/shapes/body-bg-shape.jpg);"></div>
  <div class="page-wrapper">

    <div class="stricky-header stricked-menu main-menu">
      <div class="sticky-header__content"></div><!-- /.sticky-header__content -->
    </div>

    <section class="page-header">
      <div class="page-header__bg" style="background-image: url(assets/images/backgrounds/page-header-bg.jpg);">
      </div>
      <div class="page-header__shape-1" style="background-image: url(assets/images/shapes/page-header-shape-1.png);">
      </div>
      <div class="container">
        <div class="page-header__inner">
          <h3>Products</h3>
          <div class="thm-breadcrumb__inner">
            <ul class="thm-breadcrumb list-unstyled">
              <li><a href="index.html">Home</a></li>
              <li><span class="icon-arrow-left"></span></li>
              <li>Products</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="product">
      <div class="container">
        <div class="row">

          <div class="col-xl-9 col-lg-12">
            <div class="product__items">
              <div class="row">
                <div class="product__topbar">
  <div class="product__sidebar">
    <div class="shop-search product__sidebar-single">
      <form action="#">
        <input type="text" placeholder="Search">
        <button type="submit"><i class="fa fa-search"></i></button>
      </form>
    </div>

    <div class="shop-category product__sidebar-single">
      <h3 class="product__sidebar-title">Categories</h3>
      <ul class="list-unstyled">
        <li><a href="#">PC Repair</a></li>
        <li><a href="#">Phone Repair</a></li>
        <li><a href="#">A/C Installation</a></li>
        <li><a href="#">Electrical Wire</a></li>
        <li><a href="#">Laptop Repair</a></li>
      </ul>
    </div>
  </div>
</div>

                <div class="col-xl-12">
                  <div class="product__showing-result">
                    <div class="product__showing-text-box">
                      <p class="product__showing-text">Showing 1–12/14 of 14 results</p>
                    </div>
                    <div class="product__showing-sort">
                      <div class="select-box">
                        <select class="wide">
                          <option data-display="Sort by popular">Sort by popular</option>
                          <option value="1">Sort by popular</option>
                          <option value="2">Sort by Price</option>
                          <option value="3">Sort by Ratings</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="product__all">
                <div class="product__all-tab">
                  <div class="product__all-tab-button">
                    <ul class="tabs-button-box clearfix">
                      <li data-tab="#grid" class="tab-btn-item active-btn-item">
                        <div class="product__all-tab-button-icon one">
                          <i class="fa fa-solid fa-bars"></i>
                        </div>
                      </li>
                      <li data-tab="#list" class="tab-btn-item">
                        <div class="product__all-tab-button-icon">
                          <i class="fa fa-solid fa-list-ul"></i>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <!--Start Tabs Content Box-->
                  <div class="tabs-content-box">
                    <!--Start Tab-->
                    <div class="tab-content-box-item tab-content-box-item-active" id="grid">
                      <div class="product__all-tab-content-box-item">
                        <div class="product__all-tab-single">
                          <div class="row">

                            <!--Product All Single Start-->
                            <div class="col-xl-4 col-lg-6 col-md-6">
                              <div class="single-product-style1">
                                <div class="single-product-style1__img">
                                  <img src="/assets/images/shop/shop-product-1-2.jpg" alt="">
                                  <img src="/assets/images/shop/shop-product-1-2.jpg" alt="">

                                </div>
                                <div class="single-product-style1__content">
                                  <div class="single-product-style1__content-left">
                                    <h4>
                                      <a href="product-details.html">
                                        Pliers | Cutting, Gripping
                                      </a>
                                    </h4>
                                    <p>$50.00</p>
                                  </div>

                                  <ul>
                                    <a href="#" title="Add to cart">
                                      <i class="fa fa-cart-plus"></i>
                                    </a>
                                  </ul>

                                </div>
                              </div>
                            </div>

                            <div class="col-xl-4 col-lg-6 col-md-6">
                              <div class="single-product-style1">
                                <div class="single-product-style1__img">
                                  <img src="/assets/images/shop/shop-product-1-3.jpg" alt="">
                                  <img src="/assets/images/shop/shop-product-1-3.jpg" alt="">
                                  <ul class="single-product-style1__overlay">
                                    <li>
                                      <p>5% Off</p>
                                    </li>
                                  </ul>
                                </div>
                                <div class="single-product-style1__content">
                                  <div class="single-product-style1__content-left">
                                    <h4>
                                      <a href="product-details.html">
                                        Gear and wrench
                                      </a>
                                    </h4>
                                    <p><del>$33.00</del> $28.00</p>
                                  </div>
                                  <ul>
                                    <a href="#" title="Add to cart">
                                      <i class="fa fa-cart-plus"></i>
                                    </a>
                                  </ul>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    <!--End Tab-->
                  </div>
                  <!--End Tabs Content Box-->
                </div>
                <ul class="styled-pagination text-center clearfix list-unstyled">
                  <li class="arrow prev active">
                    <a href="#">
                      <span class="fas fa-angle-left"></span>
                    </a>
                  </li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li class="arrow next">
                    <a href="#">
                      <span class="fas fa-angle-right"></span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>


        </div>
      </div>
    </section>


  </div>
</template>
