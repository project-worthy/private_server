import { NavLink } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="h-20 flex gap-x-16 text-xl items-center justify-center">
      <NavLink
        to={"/deviceMap"}
        className={({ isActive }) => (isActive ? "font-bold" : "")}
      >
        디바이스 맵
      </NavLink>
      <NavLink
        to={"/"}
        className={({ isActive }) => (isActive ? "font-bold" : "")}
      >
        스케줄러
      </NavLink>
      <NavLink
        to={"/settings"}
        className={({ isActive }) => (isActive ? "font-bold" : "")}
      >
        권한설정
      </NavLink>
    </nav>
  );
}
