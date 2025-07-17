import React from "react";
import { NavLink } from "react-router-dom";

function ProfileSidebar(){


return (

  <div className="profile-sidebar">
      <h2 className="sidebar-title">👤 My Profile</h2>
      <ul className="sidebar-links">
        <li>
          <NavLink to="/profile/edit" activeclassname="active">Edit Profile</NavLink>
        </li>
        <li>
          <NavLink to="/profile/bidding-history" activeclassname="active">Bidding History</NavLink>
        </li>
        <li>
          <NavLink to="/profile/won-auctions" activeclassname="active">Won Auctions</NavLink>
        </li>
        <li>
          <NavLink to="/profile/participated-auctions" activeclassname="active">Participated Auctions</NavLink>
        </li>
      </ul>
    </div>

)




}


export default ProfileSidebar;
