"use client";

import React from "react";
import Logo from "@/components/atom/Logo";

interface IFooterSectionProps {}

const FooterSection: React.FC<IFooterSectionProps> = () => {
  return (
    <div className="w-full flex flex-col items-center px-3 md:px-10 bg-gray-100 py-4 text-[13px]">
      <div className="w-full flex-shrink-0 max-w-[1570px] flex flex-col md:flex-row">
        <div className="w-full md:w-1/3">
          <Logo />
          <div className="mt-3 pr-[100px]">
            <p className="flex-wrap text-gray-600">
              Sell anything, buy anything, and discover a world of endless
              possibilities. Whether youre looking to declutter your home, find
              unique treasures, or start a new business, our platform provides
              the perfect marketplace for all your needs.
            </p>
            <div className="flex gap-4 py-6 mt-2"></div>
          </div>
        </div>
        <div className="w-full mt-12 md:w-2/3 md:mt-0">
          <div className="grid w-full grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-4">
            <div className="w-full">
              <p className="text-sm font-semibold">About Us</p>
              <ul className="mt-6 space-y-1.5 sm:space-y-2 font-normal">
                <li>
                  <a
                    href=""
                    target="_blank"
                    className=" text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Company Information
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className=" text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Charity
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className=" text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Terms & Polices
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className=" text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Investor Relations
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className=" text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className=" text-gray-500 hover:underline hover:text-gray-800"
                  >
                    News & Blog
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className=" text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Explore Our Brands
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full">
              <p className="text-sm font-semibold">Work with us</p>
              <ul className="mt-6 space-y-1.5 sm:space-y-2 font-normal">
                <li>
                  <a
                    href=""
                    target="_blank"
                    className=" text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Join Now
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className=" text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Member Privileges
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className=" text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Membership Terms
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Seller Forums
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Affiliates & Creators
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full">
              <p className="text-sm font-semibold">Help</p>
              <ul className="mt-6 space-y-1.5 sm:space-y-2 font-normal">
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Get Help
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Market Floor
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Market Floor
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full">
              <p className="text-sm font-semibold">Customer Service</p>
              <ul className="mt-6 space-y-1.5 sm:space-y-2 font-normal">
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Order Status
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Return & Exchanges
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Return Policy
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Gift Cards
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    target="_blank"
                    className="text-gray-500 hover:underline hover:text-gray-800"
                  >
                    Product Recalls
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex-shrink-0 max-w-[1570px] mt-14">
        <div className="flex flex-col items-center justify-between w-full gap-6 pt-2 mt-1 font-normal gap-x-4 md:flex-row">
          <div className="flex flex-col md:flex-row">
            <p className="md:mt-0">© 2021-2024 Market Floor LLC</p>
            <ul className="flex gap-2 md:ml-10">
              <li>
                <a
                  className="text-gray-500 hover:underline hover:text-gray-800"
                  href="/policies/privacy-policy"
                >
                  Privacy Policy
                </a>
              </li>
              <span>•</span>
              <li>
                <a
                  className="text-gray-500 hover:underline hover:text-gray-800"
                  href="/policies/terms-of-service"
                >
                  Term of Service
                </a>
              </li>
              <span>•</span>
              <li>
                <a
                  className="text-gray-500 hover:underline hover:text-gray-800"
                  href="/policies/cookie-policy"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="flex gap-1 [&>img]:rounded-[4px] [&>img]:h-6 [&>img]:border">
              <img
                src="https://res.cloudinary.com/dqzslqcl5/image/upload/v1703407220/__payment-methods-svgs/xeh4dwk8mjqaehgperlz.svg"
                alt=""
                className="flex-shrink-0 h-8 w-auto"
              />
              <img
                src="https://res.cloudinary.com/dqzslqcl5/image/upload/v1703407221/__payment-methods-svgs/znx4ynge3p28clhf2reh.svg"
                alt=""
                className="flex-shrink-0 h-8 w-auto"
              />
              <img
                src="https://res.cloudinary.com/dqzslqcl5/image/upload/v1703407219/__payment-methods-svgs/iffynyy3itlamkdtecis.svg"
                alt=""
                className="flex-shrink-0 h-8 w-auto"
              />
              <img
                src="https://res.cloudinary.com/dqzslqcl5/image/upload/v1703407220/__payment-methods-svgs/wfoq5p7tbhrh9znel2gw.svg"
                alt=""
                className="flex-shrink-0 h-8 w-auto"
              />
              <img
                src="https://res.cloudinary.com/dqzslqcl5/image/upload/v1703407220/__payment-methods-svgs/ykulpvpijkq87wnconw6.svg"
                alt=""
                className="flex-shrink-0 h-8 w-auto"
              />
              <img
                src="https://res.cloudinary.com/dqzslqcl5/image/upload/v1703407221/__payment-methods-svgs/wgtvzgzdjrl5cnywyjp4.svg"
                alt=""
                className="flex-shrink-0 h-8 w-auto"
              />
              <img
                src="https://res.cloudinary.com/dqzslqcl5/image/upload/v1703407223/__payment-methods-svgs/phz8qrtpikc6ao8at4fy.svg"
                alt=""
                className="flex-shrink-0 h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
