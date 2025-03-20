
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <svg width="130" height="52" viewBox="0 0 130 52">
        <g fill="none" fillRule="evenodd">
          {/* Tree trunk */}
          <path d="M110 30L120 45H100z" fill="#a6ca45" />
          <path d="M110 35L113 45H107z" fill="#333" />
          
          {/* Main green tree */}
          <circle cx="117" cy="20" r="15" fill="#a6ca45" />
          
          {/* Second green tree */}
          <circle cx="100" cy="25" r="12" fill="#a6ca45" />
          
          {/* Text */}
          <text x="130" y="30" textAnchor="start" fill="#a6ca45" fontFamily="Arial" fontWeight="bold" fontSize="28">Forest</text>
          <text x="210" y="30" textAnchor="start" fill="#333" fontFamily="Arial" fontWeight="bold" fontSize="28">dream</text>
        </g>
      </svg>
    </div>
  );
};

export default Logo;
