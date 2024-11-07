import React, { useEffect, useState } from 'react';
import NewArrivals from '../layout/NewArrivals';
import { ContactinfoService, PoliciesService, StoreLocationsService } from '../Api';

function Footer() {

  const [storeLocations, setStoreLocations] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await StoreLocationsService.getList();
      setStoreLocations(response.storelocations);

    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };



  const [policies, setPolicies] = useState([]);
  const fetchPolicies = async () => {
    try {
      const response = await PoliciesService.getList();
      setPolicies(response.policies);

    } catch (err) {
      console.error("Error fetching policies:", err);
    }
  };

  const [contactInfo, setContactInfo] = useState([]);
  const fetchContactInfo = async () => {
    try {
      const response = await ContactinfoService.getList();
      setContactInfo(response.contactinfo);

    } catch (err) {
      console.error("Error fetching policies:", err);
    }
  };


  useEffect(() => {

    fetchProducts();
    fetchPolicies();
    fetchContactInfo();
  }, []);





  return (
    <footer className=" bg-white-800 text-black mt-10">

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          {/* Hệ thống cửa hàng */}
          <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">HỆ THỐNG CỬA HÀNG HADES</h4>
            {storeLocations.map((location, index) => (
              <p key={index} className="text-gray-400">{location.text}</p>
            ))}
          </div>

          {/* Chính sách */}
          <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">CHÍNH SÁCH</h4>
            <ul className="text-gray-400 space-y-2">
              {policies.map((policy, index) => (
                <li key={index}>
                  {policy.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div className="w-full md:w-1/3 px-4">
            <h4 className="text-lg font-semibold mb-4">THÔNG TIN LIÊN HỆ</h4>
            {contactInfo.map((info, index) => (
              <p key={index} className="text-gray-400"><strong>{info.label}:</strong> {info.value}</p>
            ))}
            <div className="mt-4 space-x-4">
              {/* Hardcoded Social Links */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline"
              >
                Instagram
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
