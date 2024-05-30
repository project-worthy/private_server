import SearchClient from "../components/SearchClient";
function Home() {
  return (
    <div className="w-lvw h-lvh ">
      <div className="w-full h-full flex justify-center fixed z-10">
        <div className="relative">
          <SearchClient className="absolute top-5 left-1/2 -translate-x-1/2 " />
        </div>
        <div>{/*devices information is going to go*/}</div>
      </div>
      <div className="dot-grid bg-[0 0 / 20px 20px] fixed w-full h-full z-0"></div>
    </div>
  );
}

export default Home;
